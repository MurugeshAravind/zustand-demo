import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const hookDir = join(root, ".git", "hooks");

mkdirSync(hookDir, { recursive: true });

const prePushHook = `#!/bin/sh
set -e

echo ""
echo "========================================="
echo "  Pre-push Quality Gate"
echo "========================================="
echo ""

echo "[1/3] Linting..."
npm run lint
echo "  Lint passed."
echo ""

echo "[2/3] Type checking..."
npm run typecheck
echo "  Types passed."
echo ""

echo "[3/3] Running unit tests..."
npm run test
echo "  Tests passed."
echo ""

echo "========================================="
echo "  All checks passed — pushing."
echo "========================================="
echo ""
`;

const hookPath = join(hookDir, "pre-push");
writeFileSync(hookPath, prePushHook, { mode: 0o755 });
console.log("Git pre-push hook installed at .git/hooks/pre-push");
