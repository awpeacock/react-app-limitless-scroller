import { fireEvent, waitFor, renderHook } from '@testing-library/react';

import useScreenSize from './useScreenSize';

global.fetch = jest.fn();

describe('useScreenSize', () => {
	it('should return the initial values for width and height', () => {
		const { result } = renderHook(() => useScreenSize());
		const { width, height } = result.current;

		expect(width).toBe(window.innerWidth);
		expect(height).toBe(window.innerHeight);
	});

	it('should return the correct values when the window is resized', async () => {
		const { result } = renderHook(() => useScreenSize());
		const dimensions = result.current;
		const startWidth = dimensions.width.valueOf();
		const startHeight = dimensions.height.valueOf();

		window.innerWidth += 50;
		window.innerHeight -= 50;
		fireEvent(window, new Event('resize'));

		const newWidth = dimensions.width.valueOf();
		const newHeight = dimensions.height.valueOf();

		waitFor(() => {
			expect(startWidth).not.toBe(window.innerWidth);
			expect(startHeight).not.toBe(window.innerHeight);
			expect(newWidth).toBe(window.innerWidth);
			expect(newHeight).toBe(window.innerHeight);
			expect(newWidth).toBe(startWidth + 50);
			expect(newHeight).toBe(startHeight - 50);
		});
	});
});
