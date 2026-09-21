export class AuthenticationError extends Error {
  readonly code = "UNAUTHENTICATED";
  constructor() {
    super("Your session has expired. Please sign in again.");
    this.name = "AuthenticationError";
  }
}
interface Identity {
  uid: string;
  getIdToken(): Promise<string>;
}
interface Boundary {
  ready(): Promise<void>;
  current(): Identity | null;
  invalidate(): Promise<void>;
  fetch: typeof fetch;
}
/** Requests are same-origin API paths only. No stored tokens and no automatic replay of writes. */
export function createAuthenticatedFetch(boundary: Boundary) {
  const pending = new Set<AbortController>();
  let generation = 0;
  const cancel = () => {
    generation++;
    for (const request of pending) request.abort();
    pending.clear();
  };
  const request = async (path: string, options: RequestInit = {}) => {
    if (!path.startsWith("/api/") || /[\\#]/.test(path))
      throw new Error("Expected a same-origin API path.");
    const epoch = generation;
    await boundary.ready();
    if (epoch !== generation) throw new AuthenticationError();
    const user = boundary.current();
    if (!user) throw new AuthenticationError();
    const controller = new AbortController();
    pending.add(controller);
    try {
      let token: string;
      try {
        token = await user.getIdToken();
      } catch (error) {
        if (
          (error as { code?: string })?.code === "auth/network-request-failed"
        ) {
          throw new Error(
            "Unable to connect. Check your connection and try again.",
          );
        }
        if (epoch === generation && boundary.current()?.uid === user.uid) {
          cancel();
          await boundary.invalidate();
        }
        throw new AuthenticationError();
      }
      if (epoch !== generation || boundary.current()?.uid !== user.uid)
        throw new AuthenticationError();
      const headers = new Headers(options.headers);
      headers.set("Authorization", "Bearer " + token);
      const signal = options.signal
        ? AbortSignal.any([options.signal, controller.signal])
        : controller.signal;
      const response = await boundary.fetch(path, {
        ...options,
        headers,
        signal,
        redirect: "error",
        credentials: "same-origin",
      });
      if (epoch !== generation || boundary.current()?.uid !== user.uid)
        throw new AuthenticationError();
      if (response.status === 401) {
        cancel();
        await boundary.invalidate();
        throw new AuthenticationError();
      }
      return response;
    } finally {
      pending.delete(controller);
    }
  };
  return { request, cancel };
}
