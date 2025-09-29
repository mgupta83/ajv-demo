import { luhnFormat } from "./formats/is-luhn.ts";
import { isoCountryCodeFormat } from "./formats/iso-country-code.ts";

import { Ajv } from "ajv";
import type { Plugin } from "ajv";

/**
 * Registers all custom formats with AJV
 */
export const addCustomFormats: Plugin<never> = (ajv: Ajv) => {
  ajv.addFormat("iso-country-code", isoCountryCodeFormat);
  ajv.addFormat("luhn", luhnFormat);
  return ajv;
};