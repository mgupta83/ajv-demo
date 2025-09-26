# ajv-demo

Opinionated minimal monorepo demo showing how to parse and validate JSON with AJV in a TypeScript workspace.

This repository demonstrates a small, production-like setup where a reusable validation helper package (built on AJV, ajv-formats and ajv-errors) is authored and consumed by a separate package inside the same npm workspace.

Why this repo
- Keep validation logic reusable and testable.
- Show how to compose AJV with TypeScript project references and workspace packages.
- Provide small, focused tests that validate behavior and error messages.

Contents
- `packages/cellix-json-parse-validate-ajv` — the reusable parse+validate utility. Exports `buildParser<T>(schema)` which returns a function that accepts data and either returns a typed T or throws a Validation Error containing AJV error messages.
- `packages/api-json-parse-validate` — an example consumer demonstrating a `User` schema and how to use the utility's parser.

Quickstart

Prerequisites
- Node.js 18+ (works with Node 18+ and npm workspaces)

Install

```bash
npm install
```

Build

Build all workspace packages (TypeScript project references are used by each package):

```bash
npm run build
```

Build a single package (example):

```bash
npm -w @cellix/json-parse-validate-ajv run build
npm -w @demo/api-json-parse-validate run build
```

Run tests

Each package exposes `test` scripts using Vitest. Run all package tests from the repo root:

```bash
npm run test
```

Or run a single package's tests:

```bash
npm -w @cellix/json-parse-validate-ajv test
npm -w @demo/api-json-parse-validate test
```

The repository includes example unit tests that assert:
- The utility correctly returns typed data for valid input.
- Validation failures throw an Error that contains the configured AJV error messages (including custom messages provided via `errorMessage`, ajv-formats messages, and additionalProperties messages).

Usage example

The utility exports `buildParser<T>(schema)`.

Example using the `User` schema in `packages/api-json-parse-validate/src/user.ts`:

```ts
import { buildParser } from '@cellix/json-parse-validate-ajv'

type User = {
	name: string
	id: string
	data: { age: number; email: string; country: string }
	roles: string[]
}

const parseUser = buildParser<User>(userSchema)

// parseUser returns the typed User on success or throws an Error on failure
try {
	const user = parseUser({ name: 'A', id: '1', data: { age: 30, email: 'a@b.com', country: 'US' }, roles: ['admin'] })
	console.log('valid user', user)
} catch (err) {
	console.error('validation failed', err?.message)
}
```

Notes & design choices

- AJV: We use `ajv`, `ajv-formats` (for format validation like `email`) and `ajv-errors` to support human-friendly error messages via the `errorMessage` keyword.
- API: `buildParser` compiles the provided JSON Schema and returns a function which accepts `unknown` data. On success it returns the data typed as `T`. On failure it throws an `Error` whose message starts with `Validation failed:` followed by AJV's aggregated error text.
- Peer dependency: In this demo the consumer package lists the utility as a `peerDependency` to show how it would behave when published as a library. In this workspace the packages are linked automatically by npm workspaces during `npm install`.

Developer tips

- TypeScript: each package uses `tsc --build` and may contain project references if you expand the repo. Keep `types` and `main` fields in packages pointing to `dist/` outputs.
- Tests: vitest is used for fast unit tests and coverage. The base vitest config is `vitest.base.config.ts` at the repo root and packages extend it.

Publishing

If you want to publish the packages to npm:

1. Update `package.json` fields (`name`, `version`, `repository`, `author`, etc.).
2. Decide whether to keep the consumer package's dependency on the utility as `peerDependency` (recommended for libraries) or a normal `dependency` (for applications).
3. Build and publish the utility first, then the consumer.

Contributing

PRs welcome. Suggested small improvements:
- Add a minimal runtime example (CLI or tiny Express server) demonstrating runtime validation.
- Add type-level tests or API docs.
- Add GitHub Actions workflow to run tests on push.

License

MIT

Contact

Maintainer: CellixJS / mgupta83
