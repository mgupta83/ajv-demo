import { describe, it, expect } from 'vitest'
import { buildParser } from './index.ts'
import type { JSONSchemaType } from 'ajv'

// Define minimal types for tests
type LuhnObj = { id: string }
type IsoCountryObj = { country: string }

describe('buildParser', () => {
  it('parses valid objects with luhn format (registered by addCustomFormats)', () => {
    const schema = {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'luhn' },
      },
      required: ['id'],
      additionalProperties: false,
    } as const

    const parse = buildParser<LuhnObj>(schema as JSONSchemaType<LuhnObj>)

    const input = { id: '79927398713' }
    const out = parse(input)
    expect(out).toEqual(input)
  })

  it('throws with a Validation failed message for invalid luhn', () => {
    const schema = {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'luhn' },
      },
      required: ['id'],
      additionalProperties: false,
    } as const

    const parse = buildParser<LuhnObj>(schema as JSONSchemaType<LuhnObj>)

    expect(() => parse({ id: '12345678' })).toThrow(/Validation failed:/)
  })

  it('supports iso-country-code format via addCustomFormats', () => {
    const schema = {
      type: 'object',
      properties: {
        country: { type: 'string', format: 'iso-country-code' },
      },
      required: ['country'],
      additionalProperties: false,
    } as const

    const parse = buildParser<IsoCountryObj>(schema as JSONSchemaType<IsoCountryObj>)

    const ok = { country: 'US' }
    expect(parse(ok)).toEqual(ok)
    expect(() => parse({ country: 'XYZ' })).toThrow(/Validation failed:/)
  })
})
