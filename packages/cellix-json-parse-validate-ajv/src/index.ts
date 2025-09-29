import Ajv from "ajv";
import type { JSONSchemaType, ValidateFunction } from "ajv";
import AjvErrors from "ajv-errors";
import AjvFormats from "ajv-formats";
import { addCustomFormats } from "@cellix/ajv-custom-formats-plugin";

export type { JSONSchemaType };

const ajv = new Ajv.Ajv({ allErrors: true });
AjvErrors.default(ajv);
AjvFormats.default(ajv);

// Register custom formats
addCustomFormats(ajv);


// Generic function to build a validator for any type T
export function buildParser<T>(schema: JSONSchemaType<T>) {
  const validate: ValidateFunction<T> = ajv.compile(schema);

  return (data: {[key: string]: unknown}): T => {
    if (validate(data)) {
      return data; // ✅ Now strongly typed as T
    }
    throw new Error("Validation failed: " + ajv.errorsText(validate.errors));
  };
}