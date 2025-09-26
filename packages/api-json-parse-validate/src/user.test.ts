import { describe, it, expect } from 'vitest'
import { parseUser } from './user.ts'

describe('parseUser', () => {
  it('parses a valid user', () => {
    const user = {
      name: 'Alice',
      id: '00000000', // 8 digits and passes Luhn
      data: {
        age: 30,
        email: 'alice@example.com',
        country: 'USA',
      },
      roles: ['admin'],
    }

    expect(parseUser(user)).toEqual(user)
  })

  it('throws when required fields are missing with descriptive messages', () => {
    const missingName = {
      id: '00000000',
      data: { age: 20, email: 'a@b.com', country: 'USA' },
      roles: ['user'],
    }

    expect(() => parseUser(missingName)).toThrow(/Name is required\.|Validation failed:/)
  })

  it('throws when id pattern or luhn check fails', () => {
    const badId = {
      name: 'Bob',
      id: '123', // invalid pattern
      data: { age: 20, email: 'b@b.com', country: 'USA' },
      roles: ['user'],
    }

    expect(() => parseUser(badId)).toThrow(/ID must be 8 digits\.|ID must pass Luhn check\.|Validation failed:/)
  })

  it('throws when nested data fields are invalid (country/email/age)', () => {
    const badCountry = {
      name: 'Carol',
      id: '00000000',
      data: { age: 25, email: 'c@c.com', country: 'XYZ' },
      roles: ['user'],
    }

    expect(() => parseUser(badCountry)).toThrow(/Country must be a valid ISO 3166-1 code\.|Validation failed:/)

    const badEmail = { ...badCountry, data: { ...badCountry.data, country: 'USA', email: 'not-an-email' } }
    expect(() => parseUser(badEmail)).toThrow(/Email must be valid\.|Validation failed:/)

    const badAge = { ...badCountry, data: { ...badCountry.data, country: 'USA', email: 'a@b.com', age: -1 } }
    expect(() => parseUser(badAge)).toThrow(/Age must be at least 0\.|Validation failed:/)
  })

  it('throws when roles array is empty', () => {
    const noRoles = {
      name: 'Dan',
      id: '00000000',
      data: { age: 40, email: 'd@d.com', country: 'USA' },
      roles: [] as string[],
    }

    expect(() => parseUser(noRoles)).toThrow(/At least one role is required\.|Validation failed:/)
  })
})
