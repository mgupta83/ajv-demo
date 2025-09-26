import Ajv from 'ajv'
import { describe, it, expect } from 'vitest'
import luhn from 'fast-luhn'
import { luhnFormat } from './is-luhn.ts'

describe('luhnFormat', () => {
  it('validates strings using fast-luhn when registered with AJV', () => {
    const ajv = new Ajv.Ajv()
    ajv.addFormat('luhn', luhnFormat)

    const schema = { type: 'string', format: 'luhn' }
    const validate = ajv.compile(schema)

    const samples = ['79927398713', '79927398', '49927398716', '12345678', '00000000']
    for (const s of samples) {
      expect(validate(s)).toBe(luhn(s))
    }

    // non-string should fail
    expect(validate(12345678)).toBe(false)
  })
})
