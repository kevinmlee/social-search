import { TextEncoder, TextDecoder } from 'node:util'


// @see https://github.com/nock/nock/issues/2397
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

window.URL.createObjectURL = jest.fn()
window.matchMedia = jest.fn().mockImplementation(() => ({
  matches: false,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
}))

// prevent request logs from appearing in test output
process.env.LOG_LEVEL = 'silent'