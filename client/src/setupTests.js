// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

import { TextEncoder, TextDecoder } from 'node:util'

import fetch from 'node-fetch'

// @see https://github.com/nock/nock/issues/2397
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.fetch = fetch
global.__incrementalCache = {
  requestHeaders: {
    'user-agent': ''
  }
}

window.URL.createObjectURL = jest.fn()
window.matchMedia = jest.fn().mockImplementation(() => ({
  matches: false,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
}))

// Mock the @urql/next/rsc module
jest.mock('@urql/next/rsc', () => {
  const originalModule = jest.requireActual('@urql/next/rsc')

  const mockCreateClient = jest.fn(() => ({
    query: jest.fn(() => Promise.resolve({}))
  }))

  return {
    ...originalModule,
    registerUrql: jest.fn(() => ({ getClient: mockCreateClient })),
    createClient: mockCreateClient
  }
})

// prevent request logs from appearing in test output
process.env.LOG_LEVEL = 'silent'