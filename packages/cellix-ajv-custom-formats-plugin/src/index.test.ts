import Ajv from 'ajv'
import { describe, it, expect } from 'vitest'
import countries from 'i18n-iso-countries'
import luhn from 'fast-luhn'
import { addCustomFormats } from './index.ts'

// ensure english locale is available for countries
countries.registerLocale(require('i18n-iso-countries/langs/en.json'))

describe('addCustomFormats', () => {
  it('registers luhn and iso-country-code formats with AJV', () => {
    const ajv = new Ajv.Ajv()
    addCustomFormats(ajv)

    const luhnSchema = { type: 'string', format: 'luhn' }
    const luhnValidate = ajv.compile(luhnSchema)

  const [s0, s1, s2] = ['79927398713', '49927398716', '12345678']
  expect(luhnValidate(s0)).toBe(luhn(s0))
  expect(luhnValidate(s1)).toBe(luhn(s1))
  expect(luhnValidate(s2)).toBe(luhn(s2))

    const countrySchema = { type: 'string', format: 'iso-country-code' }
    const countryValidate = ajv.compile(countrySchema)

    const good = ['US', 'USA', '840']
    for (const g of good) {
      expect(countryValidate(g)).toBe(countries.isValid(g))
    }

    // invalid
    expect(countryValidate('XYZ')).toBe(false)
  })
})
