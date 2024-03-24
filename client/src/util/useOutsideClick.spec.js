import { act, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import useOutsideClick from './useOutsideClick'

describe('useOutsideClick', () => {
  const handler = jest.fn()

  const TestComponent = () => {
    const ref = useOutsideClick(handler)

    return (
      <div className='test'>
        <span className='clickable' ref={ref}>Inside Component</span>
      </div>
    )
  }

  it('should not call the handler when clicking inside the component', async () => {
    const { container, unmount } = render(<TestComponent />)

    expect(container.querySelector('.test')).not.toBeNull()

    // Simulate a click inside the element
    await act(() => userEvent.click(container.querySelector('.clickable')))

    expect(handler).not.toHaveBeenCalled()
    unmount()
  })

  it('should call the handler when clicking outside the element', async () => {
    const { container, unmount } = render(<TestComponent />)
    const outsideElement = container.querySelector('.test')

    expect(outsideElement).not.toBeNull()

    // Simulate a click outside the element
    await act(() => userEvent.click(outsideElement))

    expect(handler).toHaveBeenCalled()
    unmount()
  })
})