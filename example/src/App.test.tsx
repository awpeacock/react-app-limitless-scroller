import React from 'react';

import { render, cleanup, act, waitFor, screen } from '@testing-library/react';

import App from './App';
import * as Schemes from '../../samples/schemes';

const log = jest.spyOn(console, 'log').mockImplementation(() => {
	// Do nothing
});
const scroll = jest.fn();
window.HTMLElement.prototype.scrollIntoView = scroll;

describe('Example app', () => {
	afterAll((done) => {
		cleanup();
		done();
	});

	it('renders without crashing', (done) => {
		expect(() => {
			render(<App />);
		}).not.toThrow();
		done();
	});

	it('correctly updates disabled buttons', async () => {
		const widths = [768, 1024];
		for (let w = 0; w < widths.length; w++) {
			const width = widths[w];
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: width
			});
			act(() => {
				window.dispatchEvent(new Event('resize'));
			});
			expect(window.innerWidth).toBe(width);

			const html = render(<App />);
			expect(html).not.toBeNull();
			expect(log).toBeCalled();
			const buttons = html.container.getElementsByTagName('button');
			const toggle1 = buttons.namedItem('disabled-style-toggle');
			const target1 = buttons.namedItem('disabled-style-target');
			expect(toggle1).not.toBeNull();
			expect(target1).not.toBeNull();
			expect(target1).toHaveAttribute('disabled');
			if (width === 768) {
				expect(target1).toHaveStyle(
					'color: ' +
						Schemes.Valid.Stylesheet.buttonColours.disabled.text
				);
				expect(target1).toHaveStyle(
					'background-color: ' +
						Schemes.Valid.Stylesheet.buttonColours.disabled
							.background
				);
				act(() => {
					if (toggle1 != null) {
						toggle1.click();
					}
				});
				await waitFor(() => {
					expect(target1).not.toHaveAttribute('disabled');
					expect(target1).toHaveStyle(
						'color: ' +
							Schemes.Valid.Stylesheet.buttonColours.default.text
					);
					expect(target1).toHaveStyle(
						'background-color: ' +
							Schemes.Valid.Stylesheet.buttonColours.default
								.background
					);
				});
			}
			const toggle2 = buttons.namedItem('disabled-mixture-toggle');
			const target2 = buttons.namedItem('disabled-mixture-target');
			expect(toggle2).not.toBeNull();
			expect(target2).not.toBeNull();
			expect(target2).toHaveAttribute('disabled');
			if (width === 768) {
				expect(target2).toHaveStyle(
					'color: ' + Schemes.Valid.Mixture.buttonColours.disabled
				);
				act(() => {
					if (toggle2 != null) {
						toggle2.click();
					}
				});
				await waitFor(() => {
					expect(target2).not.toHaveAttribute('disabled');
					expect(target2).toHaveStyle(
						'color: ' + Schemes.Valid.Mixture.buttonColours.default
					);
				});
			}
			const toggle3 = buttons.namedItem('disabled-component-toggle');
			const target3 = buttons.namedItem('disabled-component-target');
			expect(toggle3).not.toBeNull();
			expect(target3).not.toBeNull();
			expect(target3).toHaveAttribute('disabled');
			expect(target3).toHaveClass('disabled:text-slate-50');
			expect(target3).toHaveClass('disabled:bg-slate-500');
			act(() => {
				if (toggle3 != null) {
					toggle3.click();
				}
			});
			await waitFor(() => {
				expect(target3).not.toHaveAttribute('disabled');
				expect(target3).toHaveClass('text-lime-50');
				expect(target3).toHaveClass('bg-lime-500');
			});
		}
	});

	it('correctly applies colours to updated content', async () => {
		const width = 768;
		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			configurable: true,
			value: width
		});
		act(() => {
			window.dispatchEvent(new Event('resize'));
		});
		expect(window.innerWidth).toBe(width);

		jest.useFakeTimers();
		const html = render(<App />);
		expect(html).not.toBeNull();
		expect(log).toBeCalled();

		const scroller = html.container.children[0];
		const section = scroller.children[0];
		const content = section.children[0].children[0];
		const original = content.children[0].children[0];
		expect(original.tagName).toEqual('P');
		expect(original.textContent).toEqual('Original content');

		act(() => {
			jest.advanceTimersByTime(1000);
		});
		jest.useRealTimers();
		await waitFor(() =>
			expect(screen.getByText('Revised content')).toBeInTheDocument()
		);
		await waitFor(() => expect(scroller).not.toHaveClass('hidden'));

		const revised = content.children[0].children[0];
		expect(revised.tagName).toEqual('H3');
		expect(revised.textContent).toEqual('Revised content');
		expect(revised).toHaveClass('text-blue-400');
	});
});
