import type { JSONSchemaType } from "@cellix/json-parse-validate-ajv";
import { buildParser } from "@cellix/json-parse-validate-ajv";

interface User {
    name: string;
    id: string;
    data: {
        age: number;
        email: string;
        country: string;
    };
    roles: Array<string>;
};

const userSchema: JSONSchemaType<User> = {
    type: "object",
    properties: {
        name: { type: "string", errorMessage: "Name must be a string." },
        id: { type: "string", pattern: "/^\\d{8}$/", format: "luhn", errorMessage: { pattern: "ID must be 8 digits.", format: "ID must pass Luhn check." } },
        data: {
            type: "object",
            properties: {
                age: { type: "integer", minimum: 0, errorMessage: { type: "Age must be an integer.", minimum: "Age must be at least 0." } },
                email: { type: "string", format: "email", errorMessage: { format: "Email must be valid." } },
                country: { type: "string", pattern: "/^[A-Z]{3}$/",  format: "iso-country-code", errorMessage: { pattern: "Country must be a 3 character code.", format: "Country must be a valid ISO 3166-1 code." } }
            },
            required: ["age", "email", "country"],
            additionalProperties: false,
            errorMessage: {
                required: {
                    age: "Age is required.",
                    email: "Email is required.",
                    country: "Country is required."
                },
                additionalProperties: "No additional properties allowed in path: data."
            }
        },
        roles: {
            type: "array",
            items: { type: "string", errorMessage: "Each role must be a string." },
            minItems: 1,
            errorMessage: {
                minItems: "At least one role is required."
            }
        }
    },
    required: ["name", "id", "data", "roles"],
    additionalProperties: false,
    errorMessage: {
        required: {
            name: "Name is required.",
            id: "ID is required.",
            data: "Data is required.",
            roles: "Roles are required."
        },
        additionalProperties: "No additional properties allowed in path: root."
    }
};

// Create a parser for User
export const parseUser = buildParser<User>(userSchema);