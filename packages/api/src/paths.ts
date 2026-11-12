import path from 'path';

// This file runs from packages/api/src (tsx, jest) or bundled in packages/api/dist (production):
// both are at the same depth, so the repository root is the same. Use it instead of __dirname,
// which points to dist/ for every file of the bundle.
export const REPO_ROOT = path.resolve(__dirname, '../../..');
