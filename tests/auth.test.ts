import assert from "node:assert/strict";
import { test } from "node:test";
import express from "express";
import type { AddressInfo } from "node:net";
import {
  createRequireAuth,
  RateLimiter,
  type AuthenticatedRequest,
} from "../server/auth";
import { apiAuthentication, securityHeaders } from "../server/security";
import { getUserWorkspace, resolveAndValidatePath } from "../server/workspace";
import {
  AuthenticationError,
  createAuthenticatedFetch,
} from "../src/services/authenticatedFetch";
import { authErrorMessage } from "../src/services/authErrors";

async function fixture(run: (base: string) => Promise<void>) {
  const app = express();
  const verify = async (token: string) => {
    if (!["user-A", "user-B", "User-A"].includes(token))
      throw new Error("Internal provider failure must stay private");
    return { uid: token, email: token + "@example.test" };
  };
  app.use(securityHeaders);
  app.use("/api", apiAuthentication(createRequireAuth(verify)));
  app.get("/api/users/me", (req: AuthenticatedRequest, res) =>
    res.json(req.user),
  );
  app.get("/api/files", (req: AuthenticatedRequest, res) =>
    res.json({ path: getUserWorkspace(req.user!.id) }),
  );
  const limiter = new RateLimiter({ limit: 2, windowMs: 60_000 });
  app.post("/api/ai/chat", limiter.middleware(), (_req, res) =>
    res.json({ ok: true }),
  );
  app.get("/api/auth/github/callback", (_req, res) => res.send("callback"));
  app.get("/", (_req, res) => res.send("public"));
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  try {
    await run("http://127.0.0.1:" + (server.address() as AddressInfo).port);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) =>
      server.close((e) => (e ? reject(e) : resolve())),
    );
  }
}
test("API rejects missing, malformed, invalid, expired and revoked credentials", () =>
  fixture(async (base) => {
    for (const value of [
      undefined,
      "Basic user-A",
      "Bearer",
      "Bearer user-A extra",
      "Bearer invalid",
      "Bearer expired",
      "Bearer revoked",
    ]) {
      const res = await fetch(base + "/api/users/me", {
        headers: value ? { Authorization: value } : {},
      });
      assert.equal(res.status, 401);
      assert.equal((await res.json()).code, "UNAUTHENTICATED");
    }
  }));
test("valid token attaches verified UID, and private route families reject unauthenticated access", () =>
  fixture(async (base) => {
    const res = await fetch(base + "/api/users/me", {
      headers: { Authorization: "Bearer user-A" },
    });
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), {
      id: "user-A",
      email: "user-A@example.test",
    });
    for (const url of [
      "files",
      "sync/chat",
      "analytics",
      "users/me",
      "ai/review",
      "repositories",
      "scans",
      "findings/x",
      "fixes/x",
      "devops/pipelines/trigger",
      "github/repos",
      "auth/github/url",
    ]) {
      assert.equal((await fetch(base + "/api/" + url)).status, 401, url);
    }
    assert.equal((await fetch(base + "/")).status, 200);
    assert.equal((await fetch(base + "/api/auth/github/callback")).status, 200);
    assert.equal(
      (await fetch(base + "/api/auth/github/callback", { method: "POST" }))
        .status,
      401,
    );
    assert.equal(res.headers.get("cache-control"), "no-store");
    assert.equal(res.headers.get("x-content-type-options"), "nosniff");
  }));
test("verified users have distinct workspaces, including case-sensitive UIDs on Windows", () =>
  fixture(async (base) => {
    const paths = [];
    for (const token of ["user-A", "user-B", "User-A"]) {
      const response = await fetch(base + "/api/files", {
        headers: { Authorization: "Bearer " + token },
      });
      assert.equal(response.status, 200);
      paths.push((await response.json()).path);
    }
    assert.equal(new Set(paths.map((x) => x.toLowerCase())).size, 3);
    assert.throws(
      () => resolveAndValidatePath("user-A", "../../server.ts"),
      /boundary/,
    );
    assert.notEqual(
      getUserWorkspace("../../escape"),
      getUserWorkspace("user-A"),
    );
  }));
test("rate limiting blocks excess requests per verified user", () =>
  fixture(async (base) => {
    const call = (uid: string) =>
      fetch(base + "/api/ai/chat", {
        method: "POST",
        headers: { Authorization: "Bearer " + uid },
      });
    assert.equal((await call("user-A")).status, 200);
    assert.equal((await call("user-A")).status, 200);
    const blocked = await call("user-A");
    assert.equal(blocked.status, 429);
    assert.equal(blocked.headers.get("retry-after"), "60");
    assert.equal((await call("user-B")).status, 200);
  }));
test("rate limiting resets after its window", () => {
  let time = 0,
    allowed = 0,
    blocked = 0;
  const middleware = new RateLimiter(
    { limit: 1, windowMs: 1000 },
    () => time,
  ).middleware();
  const req = { user: { id: "a" } } as AuthenticatedRequest;
  const res = {
    set() {
      return this;
    },
    status() {
      blocked++;
      return this;
    },
    json() {
      return this;
    },
  } as any;
  middleware(req, res, () => allowed++);
  middleware(req, res, () => allowed++);
  time = 1001;
  middleware(req, res, () => allowed++);
  assert.equal(allowed, 2);
  assert.equal(blocked, 1);
});
test("API helper obtains tokens per request and overrides caller Authorization", async () => {
  let calls = 0;
  const client = createAuthenticatedFetch({
    ready: async () => {},
    current: () => ({ uid: "a", getIdToken: async () => String(++calls) }),
    invalidate: async () => {},
    fetch: async (_path, init) => {
      assert.equal(
        new Headers(init?.headers).get("authorization"),
        "Bearer " + calls,
      );
      return new Response("{}");
    },
  });
  await client.request("/api/files", {
    headers: { Authorization: "Bearer stale" },
  });
  await client.request("/api/files");
  assert.equal(calls, 2);
  await assert.rejects(
    client.request("https://example.com/api/files"),
    /same-origin/,
  );
});
test("401 invalidates session exactly once with no request replay", async () => {
  let requests = 0,
    invalidations = 0;
  const client = createAuthenticatedFetch({
    ready: async () => {},
    current: () => ({ uid: "a", getIdToken: async () => "test" }),
    invalidate: async () => {
      invalidations++;
    },
    fetch: async () => {
      requests++;
      return new Response("{}", { status: 401 });
    },
  });
  await assert.rejects(client.request("/api/files"), AuthenticationError);
  assert.equal(requests, 1);
  assert.equal(invalidations, 1);
});
test("logout while obtaining a token prevents a request from being sent", async () => {
  let finish!: (s: string) => void,
    requests = 0;
  const waiting = new Promise<string>((resolve) => {
    finish = resolve;
  });
  const client = createAuthenticatedFetch({
    ready: async () => {},
    current: () => ({ uid: "a", getIdToken: () => waiting }),
    invalidate: async () => {},
    fetch: async () => {
      requests++;
      return new Response("{}");
    },
  });
  const request = client.request("/api/files");
  await Promise.resolve();
  client.cancel();
  finish("test");
  await assert.rejects(request, AuthenticationError);
  assert.equal(requests, 0);
});
test("signed-out requests do not reach the backend; provider errors are friendly", async () => {
  const client = createAuthenticatedFetch({
    ready: async () => {},
    current: () => null,
    invalidate: async () => {},
    fetch: async () => {
      throw new Error("Must not run");
    },
  });
  await assert.rejects(client.request("/api/files"), AuthenticationError);
  for (const code of [
    "auth/invalid-credential",
    "auth/popup-closed-by-user",
    "auth/network-request-failed",
    "auth/operation-not-allowed",
  ])
    assert.doesNotMatch(authErrorMessage({ code }), /FirebaseError|auth\//);
});
