import type { JSONSchemaType } from "@cellix/json-parse-validate-ajv";
import { buildParser } from "@cellix/json-parse-validate-ajv";

interface User {
  name: string
  id: string
  data: {
    age: number
    email: string
    country: string
  }
  roles: Array<string>
}

// 1) Platform-independent JSON Schema
// This schema intentionally avoids AJV-specific keywords such as `format` and `errorMessage`.
// Instead, any format requirements are recorded in the `description` field so other platforms
// (for example, Java-based consumers) can be aware of validation expectations.
export const userSchemaPlatform = {
  type: "object",
  properties: {
    name: { type: "string", description: "Name as a string." },
    id: {
      type: "string",
      pattern: "^\\d{8}$",
      description: "ID must be 8 digits. (Also: should pass Luhn checksum)",
    },
    data: {
      type: "object",
      properties: {
        age: { type: "integer", minimum: 0, description: "Age as a non-negative integer." },
        email: { type: "string", description: "Email address (RFC compliant)." },
        country: {
          type: "string",
          pattern: "^[A-Z]{3}$",
          description: "3-letter country code (ISO 3166-1 alpha-3). Clients may also accept alpha-2 or numeric codes.",
        },
      },
      required: ["age", "email", "country"],
      additionalProperties: false,
    },
    roles: { type: "array", items: { type: "string" }, minItems: 1 },
  },
  required: ["name", "id", "data", "roles"],
  additionalProperties: false,
} as const

// 2) AJV-enabled schema (platform-specific) that reuses the platform schema and
// adds `format` and `errorMessage` fields so it can be compiled and used with
// AJV-based implementation.
// We shallow-copy from the platform schema and then augment the parts that
// require AJV-specific keywords.
const platform: any = userSchemaPlatform

export const userSchema: JSONSchemaType<User> = {
  ...platform,
  properties: {
    name: { type: "string", errorMessage: "Name must be a string." },
    id: {
      type: "string",
      pattern: "^\\d{8}$",
      format: "luhn",
      errorMessage: { pattern: "ID must be 8 digits.", format: "ID must pass Luhn check." },
    },
    data: {
      type: "object",
      properties: {
        age: {
          type: "integer",
          minimum: 0,
          errorMessage: { type: "Age must be an integer.", minimum: "Age must be at least 0." },
        },
        email: { type: "string", format: "email", errorMessage: { format: "Email must be valid." } },
        country: {
          type: "string",
          pattern: "^[A-Z]{3}$",
          format: "iso-country-code",
          errorMessage: { pattern: "Country must be a 3 character code.", format: "Country must be a valid ISO 3166-1 code." },
        },
      },
      required: ["age", "email", "country"],
      additionalProperties: false,
      errorMessage: {
        required: {
          age: "Age is required.",
          email: "Email is required.",
          country: "Country is required.",
        },
        additionalProperties: "No additional properties allowed in path: data.",
      },
    },
    roles: {
      type: "array",
      items: { type: "string", errorMessage: "Each role must be a string." },
      minItems: 1,
      errorMessage: { minItems: "At least one role is required." },
    },
  },
  required: ["name", "id", "data", "roles"],
  additionalProperties: false,
  errorMessage: {
    required: {
      name: "Name is required.",
      id: "ID is required.",
      data: "Data is required.",
      roles: "Roles are required.",
    },
    additionalProperties: "No additional properties allowed in path: root.",
  },
}

// Create a parser for User using the AJV-enabled schema
export const parseUser = buildParser<User>(userSchema)