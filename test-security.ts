import { resolveAndValidatePath } from './server/workspace';
import path from 'path';

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    failedTests++;
  }
}

console.log('=== RUNNING SECURITY & AUTH CRITICAL LOGIC TESTS ===\n');

try {
  // Authentication Password Hashing tests removed as Firebase Auth handles this now.

  // Test 3: Path Traversal boundary checks - inside workspace
  // Mocking a user workspace environment
  const mockUserId = '9999';
  const validRelativePath = 'src/components/MyCode.ts';
  const resolvedValid = resolveAndValidatePath(mockUserId, validRelativePath);
  
  const expectedSubstring = path.join(`user_${mockUserId}`, 'src', 'components', 'MyCode.ts');
  assert(resolvedValid.includes(expectedSubstring), 'Valid path resolves correctly inside user workspace directory');

  // Test 4: Path Traversal boundary checks - malicious attempts (escaping workspace)
  const evilPath1 = '../../server.ts';
  let escaped1 = false;
  try {
    resolveAndValidatePath(mockUserId, evilPath1);
  } catch (err: any) {
    escaped1 = true;
    assert(err.message.includes('boundary'), 'Traversing upwards with relative paths throws boundary validation error');
  }
  if (!escaped1) {
    assert(false, 'Traversing upwards with relative paths should have thrown an error!');
  }

  // Test 5: Path Traversal boundary checks - absolute host paths
  const evilPath2 = '/etc/passwd';
  let escaped2 = false;
  try {
    resolveAndValidatePath(mockUserId, evilPath2);
  } catch (err: any) {
    escaped2 = true;
    assert(err.message.includes('boundary'), 'Inputting absolute system paths throws boundary validation error');
  }
  if (!escaped2) {
    assert(false, 'Inputting absolute system paths should have thrown an error!');
  }

  console.log(`\n=== TEST SUITE COMPLETED: Passed: ${passedTests}, Failed: ${failedTests} ===`);
  if (failedTests > 0) {
    process.exit(1);
  }
} catch (err: any) {
  console.error('Unhandled testing error:', err);
  process.exit(1);
}
