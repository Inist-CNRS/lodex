// Compiles the API (and the public-app/frontend-common sources it imports for SSR)
// into dist/index.js, so production runs plain node instead of transpiling with tsx on startup.
import { build } from 'esbuild';
import { existsSync, readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { isBuiltin } from 'node:module';
import path from 'node:path';

const outdir = path.resolve(import.meta.dirname, 'dist');
const relativeToOutdir = (dir) => path.relative(outdir, dir);

// Templates, themes and front builds are resolved from __dirname:
// it must keep pointing to the directory of the source file, not to dist/.
const keepSourceDirname = {
    name: 'keep-source-dirname',
    setup(builder) {
        builder.onLoad({ filter: /\.tsx?$/ }, async (args) => {
            const contents = await readFile(args.path, 'utf8');
            if (!contents.includes('__dirname')) {
                return undefined;
            }
            const sourceDir = JSON.stringify(
                relativeToOutdir(path.dirname(args.path)),
            );
            return {
                contents: contents.replaceAll(
                    /\b__dirname\b/g,
                    `require('node:path').resolve(__dirname, ${sourceDir})`,
                ),
                loader: path.extname(args.path).slice(1),
            };
        });
    },
};

const isLoadedAsEsm = (file) => {
    if (file.endsWith('.mjs')) {
        return true;
    }
    if (!file.endsWith('.js')) {
        return false;
    }
    for (let dir = path.dirname(file); dir !== path.dirname(dir); ) {
        const packageJson = path.join(dir, 'package.json');
        if (existsSync(packageJson)) {
            return (
                JSON.parse(readFileSync(packageJson, 'utf8')).type === 'module'
            );
        }
        dir = path.dirname(dir);
    }
    return false;
};

// require() of an ES module returns its namespace: expose it like a transpiled module
const ESM_INTEROP = `const esmInterop = (m) => m && m[Symbol.toStringTag] === 'Module' ? { __esModule: true, ...m } : m;`;
const SKIP = Symbol('skip');
const REPO_PACKAGES_DIR = path.resolve(import.meta.dirname, '..') + path.sep;

// Dependencies are not bundled. They are required from the directory of the importing file,
// like tsx does, since some packages only exist in a nested node_modules (e.g. frontend-common).
// @lodex/* packages are TypeScript sources: they are bundled.
const requireFromImporter = {
    name: 'require-from-importer',
    setup(builder) {
        builder.onResolve({ filter: /^[^./]/ }, async (args) => {
            if (
                args.pluginData === SKIP ||
                args.kind === 'entry-point' ||
                args.path.startsWith('@lodex/')
            ) {
                return undefined;
            }
            if (isBuiltin(args.path)) {
                return { path: args.path, external: true };
            }
            const options = { resolveDir: args.resolveDir, pluginData: SKIP };
            const required = await builder.resolve(args.path, {
                ...options,
                kind: 'require-call',
            });
            // In-repo packages (@ezs/lodex, @ezs/transformers...) need transpilation, like @lodex/*
            if (
                !required.errors.length &&
                required.path.startsWith(REPO_PACKAGES_DIR) &&
                !required.path.includes(`${path.sep}node_modules${path.sep}`)
            ) {
                return undefined;
            }
            // Some packages (e.g. @ezs/core) declare "type": "module" but point their
            // "require" export to CommonJS files: node can only load their ESM entry.
            if (!required.errors.length && isLoadedAsEsm(required.path)) {
                const imported = await builder.resolve(args.path, {
                    ...options,
                    kind: 'import-statement',
                });
                return {
                    // suffix: the shim is CommonJS even when the target file is .mjs
                    path: `${imported.path}|cjs-shim`,
                    namespace: 'require-esm',
                };
            }
            return {
                path: `${args.resolveDir}|${args.path}`,
                namespace: 'require-from-importer',
            };
        });
        builder.onLoad(
            { filter: /.*/, namespace: 'require-from-importer' },
            ({ path: key }) => {
                const [importerDir, specifier] = key.split('|');
                const fromFile = JSON.stringify(
                    path.join(relativeToOutdir(importerDir), 'index.js'),
                );
                return {
                    contents: `${ESM_INTEROP}\nmodule.exports = esmInterop(require('node:module').createRequire(require('node:path').resolve(__dirname, ${fromFile}))(${JSON.stringify(specifier)}));`,
                    loader: 'js',
                };
            },
        );
        builder.onLoad(
            { filter: /.*/, namespace: 'require-esm' },
            ({ path: key }) => ({
                contents: `${ESM_INTEROP}\nmodule.exports = esmInterop(require(require('node:path').resolve(__dirname, ${JSON.stringify(relativeToOutdir(key.split('|')[0]))})));`,
                loader: 'js',
            }),
        );
    },
};

await build({
    entryPoints: [path.resolve(import.meta.dirname, 'src/index.ts')],
    outdir,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'node24',
    jsx: 'automatic',
    sourcemap: true,
    // styles and images are irrelevant server side
    loader: { '.css': 'empty', '.svg': 'dataurl' },
    logLevel: 'warning',
    plugins: [keepSourceDirname, requireFromImporter],
});
