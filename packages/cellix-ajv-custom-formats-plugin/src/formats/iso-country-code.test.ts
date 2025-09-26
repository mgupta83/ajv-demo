import Ajv from 'ajv'
import { describe, it, expect } from 'vitest'
import countries from 'i18n-iso-countries'
import { isoCountryCodeFormat } from './iso-country-code.ts'

// ensure english locale is available for tests
countries.registerLocale(require('i18n-iso-countries/langs/en.json'))

describe('isoCountryCodeFormat', () => {
  it('validates strings using i18n-iso-countries when registered with AJV', () => {
    const ajv = new Ajv.Ajv()
    ajv.addFormat('iso-country-code', isoCountryCodeFormat as any)

    const schema = { type: 'string', format: 'iso-country-code' }
    const validate = ajv.compile(schema)

    const samples = ['USA', 'US', '840', 'CAN', 'GB']
    for (const s of samples) {
      expect(validate(s)).toBe(countries.isValid(s))
    }

    // invalid and non-string should fail
    expect(validate('XYZ')).toBe(false)
    expect(validate(999)).toBe(false)
  })
})
