import { render, screen, fireEvent } from '@testing-library/react'
import HomePage from './page'
import { mockToast } from '@/test/utils/toast-mock'

describe('HomePage', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    mockToast.toast.mockClear()
  })

  it('should not show toast during testing', () => {
    render(<HomePage />)
    
    const button = screen.getByText('Show Toast')
    fireEvent.click(button)

    // Verify toast was called but not actually shown
    expect(mockToast.toast).toHaveBeenCalledWith({
      title: "Welcome!",
      description: "This is a test notification.",
      variant: "default",
    })
  })
})