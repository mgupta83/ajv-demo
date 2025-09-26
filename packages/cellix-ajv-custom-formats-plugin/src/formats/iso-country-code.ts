import type { FormatDefinition } from "ajv";
import countries from "i18n-iso-countries";

// register English locale
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

export const isoCountryCodeFormat: FormatDefinition<string>  = {
  type: "string",
  validate: (data: string) => {
    if (typeof data !== "string") {return false};
    return countries.isValid(data);
  },
};
