import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useYourHook } from './your-hook';

describe('useYourHook', () => {
  it('should work correctly', () => {
    const { result } = renderHook(() => useYourHook());
    
    act(() => {
      // Your test code here
    });
    
    expect(result.current).toBe(expectedValue);
  });
});