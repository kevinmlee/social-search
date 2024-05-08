import debounce from './debounce'

describe('debounce function', () => {
  let callback
  let debouncedFunction
  jest.useFakeTimers()

  beforeEach(() => {
    process.env.NODE_ENV = 'dev'
    callback = jest.fn()
    debouncedFunction = debounce(callback, 300)
  })

  afterEach(() => {
    process.env.NODE_ENV = 'test'
    jest.clearAllTimers()
  })

  test('it should debounce the function call', () => {
    debouncedFunction.start()
    debouncedFunction.start()
    debouncedFunction.start()

    expect(callback).not.toHaveBeenCalled()

    jest.advanceTimersByTime(300)

    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('it should cancel the debounce', () => {
    debouncedFunction.start()

    expect(callback).not.toHaveBeenCalled()

    debouncedFunction.cancel()

    jest.advanceTimersByTime(300)

    expect(callback).not.toHaveBeenCalled()
  })

  test('it should debounce multiple function calls', () => {
    debouncedFunction.start()
    debouncedFunction.start()
    debouncedFunction.start()

    expect(callback).not.toHaveBeenCalled()

    jest.advanceTimersByTime(150)

    debouncedFunction.start()
    debouncedFunction.start()
    debouncedFunction.start()

    jest.advanceTimersByTime(150)

    expect(callback).not.toHaveBeenCalled()

    jest.advanceTimersByTime(150)

    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('it should execute callback immediately in test environment', () => {
    process.env.NODE_ENV = 'test'

    debouncedFunction.start()

    expect(callback).toHaveBeenCalled()
    expect(callback).toHaveBeenCalledTimes(1)
  })
})