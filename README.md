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
# ajv-demo

Minimal TypeScript monorepo demonstrating AJV-based JSON parsing and validation with custom formats and good test coverage.

This repository contains a small, practical example of how to:

- Build a reusable AJV-based parser utility that returns typed data or throws detailed validation errors.
- Author and register custom AJV formats (Luhn check, ISO country codes) in a separate plugin package.
- Consume the parser utility from an example package inside the same npm workspace.

Repository layout

- `packages/cellix-json-parse-validate-ajv` — the reusable parse+validate utility. Exports `buildParser<T>(schema)`.
- `packages/cellix-ajv-custom-formats-plugin` — registers custom formats (`luhn`, `iso-country-code`) with Ajv.
- `packages/api-json-parse-validate` — example consumer that defines a `User` schema and uses the parser.

Quickstart

Prerequisites

- Node.js 18+ and npm

Install

```bash
npm install
```

Build

Build all workspace packages (TypeScript project references may be used by packages):

```bash
npm run build
```

Build a single package (example):

```bash
npm -w ./packages/cellix-json-parse-validate-ajv run build
npm -w ./packages/api-json-parse-validate run build
```

Run tests

Run all tests for the monorepo:

```bash
npm test
```

Run a single package's tests:

```bash
npm -w ./packages/cellix-ajv-custom-formats-plugin test
npm -w ./packages/cellix-json-parse-validate-ajv test
npm -w ./packages/api-json-parse-validate test
```

What the tests cover

- The parser utility (`buildParser`) compiles provided JSON Schemas and returns a validator function that returns typed data or throws an Error containing AJV's aggregated error text.
- Custom formats (Luhn, ISO country codes) are registered and tested by comparing AJV results to the authoritative libraries (`fast-luhn`, `i18n-iso-countries`).

Usage example

The parser utility exports `buildParser<T>(schema)`. Example usage (see `packages/api-json-parse-validate/src/user.ts` for the full example):

```ts
import { buildParser } from '@cellix/json-parse-validate-ajv'

type User = {
  name: string
  id: string
  data: { age: number; email: string; country: string }
  roles: string[]
}

// assume userSchema is defined in the consumer package
const parseUser = buildParser<User>(userSchema)

try {
  const user = parseUser({ name: 'A', id: '00000000', data: { age: 30, email: 'a@b.com', country: 'USA' }, roles: ['admin'] })
  console.log('valid user', user)
} catch (err) {
  console.error('validation failed', err?.message)
}
```

Design notes

- AJV + ajv-formats + ajv-errors are used to provide expressive, localized validation and human-friendly error messages via the `errorMessage` keyword.
- `buildParser` compiles a JSON Schema and returns a function that either returns typed data or throws an `Error` with `Validation failed:` + AJV error text.
- `addCustomFormats(ajv)` registers `luhn` and `iso-country-code` formats so consumers can reference them directly in schemas.

Developer tips

- Running TypeScript builds: `npm run build` (workspace aware) or `npm -w ./packages/<pkg> run build` for a single package.
- Tests use Vitest. Extend or adjust vitest config at the package level if needed.

CI and publishing

- Add a CI workflow (GitHub Actions) to run `npm ci && npm test` on push/pull requests.
- If publishing packages to npm, build and publish `cellix-json-parse-validate-ajv` first, then the consumer package.

Contributing

PRs welcome. Ideas:
- Add a small runtime example (CLI or server) to exercise the parser.
- Add more custom formats/keywords and their tests.
- Add CI coverage reporting.

License

MIT

Maintainer: mgupta83
