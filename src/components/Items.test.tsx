import React from 'react';

import { render, waitFor, cleanup } from '@testing-library/react';

import { Items } from './Items';

import * as Schemes from '../../samples/schemes';
import { AsyncComponent } from '../../samples/content';

const log = jest.spyOn(console, 'log').mockImplementation(() => {
	// Do nothing
});
const err = jest.spyOn(console, 'error').mockImplementation(() => {
	// Do nothing
});
const scroll = jest.fn();
window.HTMLElement.prototype.scrollIntoView = scroll;

const theme = {
	padding: 10,
	schemes: [Schemes.Valid.Tailwind, Schemes.Valid.Stylesheet]
};

describe('Items', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	afterAll((done) => {
		cleanup();
		done();
	});

	it('is truthy', () => {
		expect(Items).toBeTruthy();
	});

	it('should generate the children correctly', () => {
		const component = (
			<Items theme={theme} verbose={false}>
				<div data-url='first'>
					<h3>This is the FIRST item.</h3>
				</div>
				<div data-url='second'>
					<h3>This is the SECOND item.</h3>
				</div>
			</Items>
		);
		const html = render(component);
		expect(log).not.toBeCalled();
		expect(html.container instanceof HTMLDivElement).toBe(true);
		const parent = html.container.children[0];
		expect(parent).toHaveClass('lg:flex lg:flex-row');
		expect(parent).toHaveClass('lg:max-h-screen');
		expect(parent).toHaveClass('lg:overflow-x-hidden lg:overflow-y-hidden');
		expect(parent.children.length).toBe(2);
		const section1 = parent.children[0];
		const section2 = parent.children[1];
		expect(section1.tagName.toLowerCase()).toEqual('section');
		expect(section2.tagName.toLowerCase()).toEqual('section');
		expect(section1).toHaveStyle('padding: 10px');
		expect(section2).toHaveStyle('padding: 10px');
		expect(section1).toHaveStyle('z-index: 3');
		expect(section2).toHaveStyle('z-index: 1');
		expect(section1).toHaveClass(
			'lg:[clip-path:polygon(0%_0%,0%_100%,calc(100%_-_75px)_100%,100%_0%)]'
		);
		expect(section1.children[0]).toHaveClass(
			'lg:mr-[75px] lg:overflow-y-auto'
		);
		expect(section1.children[0]).toHaveClass('max-lg:pb-[75px]');
		expect(section1.children[0]).toHaveClass(
			'max-lg:min-h-[calc(100vh+75px)]'
		);
		expect(section2.children[0]).toHaveClass('h-[75px] lg:hidden');
		const child1 = section1.children[0].children[0];
		const child2 = section2.children[1].children[0];
		expect(child1 instanceof HTMLDivElement).toBe(true);
		expect(child1.getAttribute('data-url')).toEqual('first');
		expect(child2 instanceof HTMLDivElement).toBe(true);
		expect(child2.getAttribute('data-url')).toEqual('second');
		const divider = section2.children[0];
		expect(divider instanceof HTMLDivElement).toBe(true);
		expect(divider).toHaveClass('lg:hidden');
		expect(divider).toHaveClass('h-[75px]');
	});

	it('should recognise when a specific section has been set as primary and apply the appropriate classes', () => {
		const component = (
			<Items theme={theme} primary='second' verbose>
				<div data-url='first'>
					<h3>This is the FIRST item.</h3>
				</div>
				<div data-url='second'>
					<h3>This is the SECOND item.</h3>
				</div>
			</Items>
		);
		const html = render(component);
		expect(log).toBeCalled();
		const parent = html.container.children[0];
		const primary = parent.children[1];
		expect(primary).toHaveClass(
			'lg:[clip-path:polygon(0%_0%,0%_100%,calc(100%_-_75px)_100%,100%_0%)]'
		);
		expect(primary).toHaveStyle('z-index: 3');
		const inner = primary.children[1];
		expect(inner).toHaveClass('lg:mr-[75px] lg:overflow-y-auto');
	});

	it('should recognise the active section and navigate to it', () => {
		const component = (
			<Items theme={theme} active='second' verbose={false}>
				<div data-url='first'>
					<h3>This is the FIRST item.</h3>
				</div>
				<div data-url='second'>
					<h3>This is the SECOND item.</h3>
				</div>
			</Items>
		);
		render(component);
		expect(log).not.toBeCalled();
		expect(scroll).toBeCalled();
	});

	it('should refuse to generate children without a data-url attribute', () => {
		const component = (
			<Items theme={theme} verbose={false}>
				<div>
					<h3>This is the FIRST item.</h3>
				</div>
				<div>
					<h3>This is the SECOND item.</h3>
				</div>
			</Items>
		);
		expect(() => {
			render(component);
		}).toThrow();
		expect(err).toBeCalled();
	});

	it('should refuse to generate children with duplicate data-url attributes', () => {
		const component = (
			<Items theme={theme} verbose>
				<div data-url='same'>
					<h3>This is the FIRST item.</h3>
				</div>
				<div data-url='same'>
					<h3>This is the SECOND item.</h3>
				</div>
			</Items>
		);
		expect(() => {
			render(component);
		}).toThrow();
		expect(log).not.toBeCalled();
		expect(err).toBeCalled();
	});

	it('should effectively ignore if an invalid active section has been passed in', () => {
		const component = (
			<Items theme={theme} active='third' verbose>
				<div data-url='first'>
					<h3>This is the FIRST item.</h3>
				</div>
				<div data-url='second'>
					<h3>This is the SECOND item.</h3>
				</div>
			</Items>
		);
		render(component);
		expect(log).toBeCalled();
		expect(scroll).not.toBeCalled();
	});

	it('should initially hide everything, and only display when all classes/styles are applied', async () => {
		const component = (
			<Items theme={theme} verbose={false}>
				<div data-url='first'>
					<h3>This is the FIRST item.</h3>
				</div>
				<div data-url='second'>
					<h3>This is the SECOND item.</h3>
				</div>
			</Items>
		);
		const useEffect = jest
			.spyOn(React, 'useEffect')
			.mockImplementation(() => {
				// Do nothing
			});
		const original = render(component);
		expect(log).not.toBeCalled();
		expect(useEffect).toBeCalled();
		expect(original.container.children[0]).toHaveClass('hidden');
		original.unmount();
		useEffect.mockRestore();
		const altered = render(component);
		await waitFor(() => {
			expect(altered.container.children[0]).not.toHaveClass('hidden');
		});
	});

	it('should not require a padding as mandatory in the theme', () => {
		const component = (
			<Items theme={theme} verbose>
				<div data-url='first'>
					<h3>This is the FIRST item.</h3>
				</div>
				<div data-url='second'>
					<h3>This is the SECOND item.</h3>
				</div>
			</Items>
		);
		expect(() => {
			const html = render(component);
			expect(log).toBeCalled();
			expect(html.container instanceof HTMLDivElement).toBe(true);
		}).not.toThrow();
	});

	it('should only trigger a scroll when all items are "ready" (including async updates)', () => {
		const theme = {
			schemes: [Schemes.Valid.Tailwind, Schemes.Valid.Stylesheet]
		};
		const component = (
			<Items theme={theme} active='third' verbose={false}>
				<AsyncComponent data-url='first' data-async='true' />
				<div data-url='second'>
					<h3>This is the SECOND item.</h3>
				</div>
				<div data-url='third'>
					<h3>This is the THIRD item.</h3>
				</div>
			</Items>
		);
		const html = render(component);
		expect(html.getByText('Asynchronous content')).toBeInTheDocument();
		expect(scroll).not.toBeCalled();
		waitFor(() => {
			expect(html.getByText('New content')).toBeInTheDocument();
			expect(scroll).toBeCalled();
		});
	});
});
