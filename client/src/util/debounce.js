export const debounce = (callback, delay = 300) => {
  let timer

  const start = () => {
    clearTimeout(timer)
    // Execute immediately in test environment
    if (process.env.NODE_ENV === 'test') callback()
    else timer = setTimeout(() => callback(), delay)
  }

  const cancel = () => clearTimeout(timer)

  return {
    cancel,
    start
  }
}