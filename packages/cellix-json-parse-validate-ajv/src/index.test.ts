import { describe, it, expect } from 'vitest'
import { buildParser } from './index.js'

type Sample = {
  email: string
  count: number
}

const schema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', errorMessage: { format: 'Invalid email' } },
    count: { type: 'integer', minimum: 0, errorMessage: { minimum: 'Count must be >= 0' } }
  },
  required: ['email', 'count'],
  additionalProperties: false,
  errorMessage: {
    required: { email: 'Email required', count: 'Count required' },
    additionalProperties: 'No extra props allowed'
  }
} as const

describe('buildParser', () => {
  const parse = buildParser<Sample>(schema as any)

  it('returns typed value for valid input', () => {
    const input = { email: 'a@b.com', count: 2 }
    const out = parse(input)
    expect(out.email).toBe('a@b.com')
    expect(out.count).toBe(2)
  })

  it('throws on missing required properties with schema message', () => {
    expect(() => parse({} as any)).toThrow(/Email required/)
    expect(() => parse({ email: 'a@b.com' } as any)).toThrow(/Count required/)
  })

  it('throws on invalid email format with ajv-formats message', () => {
    expect(() => parse({ email: 'not-an-email', count: 1 } as any)).toThrow(/Invalid email/)
  })

  it('throws on negative count honoring minimum errorMessage', () => {
    expect(() => parse({ email: 'x@y.com', count: -5 } as any)).toThrow(/Count must be >= 0/)
  })

  it('throws on additional properties with the configured message', () => {
    expect(() => parse({ email: 'a@b.com', count: 1, extra: true } as any)).toThrow(/No extra props allowed/)
  })
})
