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

// prevent request logs from appearing in test output
process.env.LOG_LEVEL = 'silent'