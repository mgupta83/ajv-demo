import type { FormatDefinition } from "ajv";
import luhn from "fast-luhn";

export const luhnFormat: FormatDefinition<string>  = {
  type: "string",
  validate: (data: string) => {
    if (typeof data !== "string") {return false};
    return luhn(data);
  },
};

