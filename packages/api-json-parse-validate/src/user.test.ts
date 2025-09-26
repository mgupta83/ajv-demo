import { describe, it, expect } from 'vitest'
import { parseUser } from './user.js'

describe('parseUser', () => {
  it('parses a valid user', () => {
    const obj = {
      name: 'Alice',
      id: 'user-1',
      data: { age: 30, email: 'alice@example.com', country: 'USA' },
      roles: ['admin']
    }

    const result = parseUser(obj)
    expect(result).toBeDefined()
    expect(result.name).toBe('Alice')
    expect(result.data.email).toBe('alice@example.com')
  })

  it('throws when required top-level fields are missing', () => {
    const obj = {}
    expect(() => parseUser(obj as any)).toThrow(/Name is required/)
    expect(() => parseUser(obj as any)).toThrow(/ID is required/)
    expect(() => parseUser(obj as any)).toThrow(/Data is required/)
    expect(() => parseUser(obj as any)).toThrow(/Roles are required/)
  })

  it('throws when additional top-level properties are present', () => {
    const obj = {
      name: 'Bob',
      id: 'user-2',
      data: { age: 20, email: 'b@example.com', country: 'UK' },
      roles: ['user'],
      extra: 'not-allowed'
    }
    expect(() => parseUser(obj as any)).toThrow(/No additional properties allowed in path: root/)
  })

  it('throws for nested data validation errors', () => {
    const obj = {
      name: 'C',
      id: 'user-3',
      data: { email: 'invalid-email', country: 123 },
      roles: ['user']
    }

    expect(() => parseUser(obj as any)).toThrow(/Age is required/)
    expect(() => parseUser(obj as any)).toThrow(/Email must be valid/)
    expect(() => parseUser(obj as any)).toThrow(/Country must be a string/)
  })

  it('validates roles array constraints and items type', () => {
    const missingRoles = { name: 'D', id: 'user-4', data: { age: 10, email: 'd@e.com', country: 'CA' } }
    expect(() => parseUser(missingRoles as any)).toThrow(/Roles are required/)

    const emptyRoles = { name: 'D', id: 'user-4', data: { age: 10, email: 'd@e.com', country: 'CA' }, roles: [] }
    expect(() => parseUser(emptyRoles as any)).toThrow(/At least one role is required/)

    const badRoleItems = { name: 'D', id: 'user-4', data: { age: 10, email: 'd@e.com', country: 'CA' }, roles: [123] }
    expect(() => parseUser(badRoleItems as any)).toThrow(/Each role must be a string/)
  })

  it('throws when additional properties are present inside data', () => {
    const obj = {
      name: 'E',
      id: 'user-5',
      data: { age: 5, email: 'e@e.com', country: 'NZ', extra: true },
      roles: ['user']
    }
    expect(() => parseUser(obj as any)).toThrow(/No additional properties allowed in path: data/)
  })
})
