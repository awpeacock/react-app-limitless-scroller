import React from 'react';

import { render, cleanup, waitFor } from '@testing-library/react';

import { ColourSet } from '../@types/theme';

import { Section } from './Section';

import * as Schemes from '../../samples/schemes';

const log = jest.spyOn(console, 'log').mockImplementation(() => {
	// Do nothing
});
const scroll = jest.fn();
window.HTMLElement.prototype.scrollIntoView = scroll;
const ready = jest.fn();

describe('Section', () => {
	afterAll((done) => {
		cleanup();
		done();
	});

	it('is truthy', () => {
		expect(Section).toBeTruthy();
	});

	it('should generate with the correct colour scheme class names for a primary section', () => {
		const ref: React.MutableRefObject<HTMLDivElement> =
			React.createRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
		const component = (
			<Section
				innerRef={ref}
				scheme={Schemes.Valid.Tailwind}
				stretch
				styles={{}}
				priority={1}
				active
				primary
				header
				footer
				onReady={ready}
				verbose={false}>
				<p data-title='This is my title'>Section content</p>
			</Section>
		);
		const html = render(component);
		expect(ready).toBeCalled();
		expect(log).not.toBeCalled();
		const section = html.container.children[0];
		expect(section).toHaveStyle(
			'background-image: url(' +
				(Schemes.Valid.Tailwind.backgroundImage as HTMLImageElement)
					.src +
				')'
		);
		expect(section).toHaveClass(Schemes.Valid.Tailwind.backgroundColour);
		expect(section).toHaveClass(Schemes.Valid.Tailwind.foregroundColour);
		const inner = section.children[1];
		// Classes injected for any section
		expect(section).toHaveClass('relative');
		expect(section).toHaveClass('lg:h-screen');
		expect(section).toHaveClass('bg-cover');
		// Classes injected for primary section
		expect(section).toHaveClass('lg:visible');
		expect(section).toHaveClass('lg:w-[40%] lg:min-w-[40%]');
		expect(section).toHaveClass('lg:flex lg:flex-row');
		expect(section).toHaveClass('lg:fixed');
		expect(section).toHaveClass('lg:left-0');
		expect(section).toHaveClass('group first');
		expect(section).toHaveClass(
			'lg:[clip-path:polygon(0%_0%,0%_100%,calc(100%_-_75px)_100%,100%_0%)]'
		);
		expect(inner).toHaveClass('max-lg:pb-[75px] lg:mr-[75px]');
		expect(inner).toHaveClass('lg:overflow-x-hidden lg:overflow-y-auto');
		expect(inner).toHaveClass('max-lg:min-h-[calc(100vh+75px)]');
		// Test title successfully created
		const title = inner.children[0];
		expect(title.tagName.toLowerCase()).toEqual('h2');
		expect(title).toHaveClass('text-4xl xl:text-5xl 2xl:text-6xl');
		expect(title).toHaveClass(
			(Schemes.Valid.Tailwind.headingColour as ColourSet)
				.default as string
		);
		expect(title.textContent).toEqual('This is my title');
		// Test content successfully manipulated (no title);
		const content = inner.children[1];
		expect(content.tagName.toLowerCase()).toEqual('p');
		expect(content.textContent).toEqual('Section content');
		// Test header and footer generated
		const header = section.children[0];
		expect(header.tagName.toLowerCase()).toEqual('div');
		expect(header).toHaveClass('h-[75px]');
		expect(header).toHaveClass('lg:hidden');
		expect(section).toHaveClass('max-lg:mt-[-75px]');
		expect(section).toHaveClass(
			'max-lg:[clip-path:polygon(0%_0%,0%_100%,100%_calc(100%_-_75px),100%_0%)]'
		);
		// Test content stretched accordingly
		expect(inner).toHaveClass('max-lg:min-h-[calc(100vh+75px)]');
		// Test z-index correctly generated
		expect(section).toHaveStyle('z-index: 1');
	});

	it('should generate with the correct colour scheme class names for a non-primary section', () => {
		const ref: React.MutableRefObject<HTMLDivElement> =
			React.createRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
		const component = (
			<Section
				innerRef={ref}
				scheme={Schemes.Valid.Tailwind}
				stretch={false}
				styles={{}}
				priority={2}
				active={false}
				primary={false}
				header={false}
				footer={false}
				onReady={ready}
				verbose>
				<p>Section content</p>
			</Section>
		);
		const html = render(component);
		expect(ready).toBeCalled();
		expect(log).toBeCalled();
		const section = html.container.children[0];
		const inner = section.children[0];
		const content = inner.children[0];
		// Classes injected for non-primary section
		expect(section).toHaveClass('lg:hidden');
		expect(section).toHaveClass('lg:fixed');
		expect(section).toHaveClass('lg:h-screen');
		expect(section).toHaveClass('lg:w-[calc(60%_+_75px)]');
		expect(section).toHaveClass('lg:overflow-y-auto');
		expect(section).toHaveClass('lg:left-[40%]');
		expect(section).toHaveClass('lg:ml-[-75px]');
		expect(section).toHaveClass('bg-cover');
		expect(inner).toHaveClass('lg:ml-[75px]');
		// Test content successfully manipulated (no title);
		expect(content.tagName.toLowerCase()).toEqual('p');
		expect(content.textContent).toEqual('Section content');
		// Test header and footer NOT generated
		expect(content).not.toHaveClass('lg:hidden');
		expect(content).not.toHaveClass('h-[75px]');
		expect(content).not.toHaveClass('max-lg:mt-[-75px]');
		expect(section).not.toHaveClass(
			'max-lg:[clip-path:polygon(0%_0%,0%_100%,100%_calc(100%_-_75px),100%_0%)]'
		);
		// Test content NOT stretched accordingly
		expect(inner).not.toHaveClass('max-lg:min-h-[calc(100vh+75px)]');
		// Test z-index correctly generated
		expect(section).toHaveStyle('z-index: 2');
	});

	it('should generate with the correct colour scheme class names for a non-primary section', () => {
		const ref: React.MutableRefObject<HTMLDivElement> =
			React.createRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
		const component = (
			<Section
				innerRef={ref}
				scheme={Schemes.Valid.Tailwind}
				stretch={false}
				styles={{}}
				priority={3}
				active={false}
				primary={false}
				header={false}
				footer={false}
				onReady={ready}
				verbose={false}>
				<p>Section content</p>
			</Section>
		);
		const html = render(component);
		expect(ready).toBeCalled();
		expect(log).not.toBeCalled();
		const section = html.container.children[0];
		const inner = section.children[0];
		const content = inner.children[0];
		// Classes injected for non-primary section
		expect(section).toHaveClass('lg:hidden');
		expect(section).toHaveClass('lg:fixed');
		expect(section).toHaveClass('lg:h-screen');
		expect(section).toHaveClass('lg:w-[calc(60%_+_75px)]');
		expect(section).toHaveClass('lg:overflow-y-auto');
		expect(section).toHaveClass('lg:left-[40%]');
		expect(section).toHaveClass('lg:ml-[-75px]');
		expect(section).toHaveClass('bg-cover');
		expect(inner).toHaveClass('lg:ml-[75px]');
		// Test content successfully manipulated (no title);
		expect(content.tagName.toLowerCase()).toEqual('p');
		expect(content.textContent).toEqual('Section content');
		// Test header and footer NOT generated
		expect(content).not.toHaveClass('lg:hidden');
		expect(content).not.toHaveClass('h-[75px]');
		expect(content).not.toHaveClass('max-lg:mt-[-75px]');
		expect(section).not.toHaveClass(
			'max-lg:[clip-path:polygon(0%_0%,0%_100%,100%_calc(100%_-_75px),100%_0%)]'
		);
		// Test content NOT stretched accordingly
		expect(inner).not.toHaveClass('max-lg:min-h-[calc(100vh+75px)]');
		// Test z-index correctly generated
		expect(section).toHaveStyle('z-index: 3');
	});

	it('should generate with a CSS class for the image representation', () => {
		const clone = Object.create(Schemes.Valid.Stylesheet);
		clone.backgroundImage = 'imageClazz';
		const ref: React.MutableRefObject<HTMLDivElement> =
			React.createRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
		const component = (
			<Section
				innerRef={ref}
				scheme={clone}
				stretch={false}
				styles={{}}
				priority={4}
				active={false}
				primary={false}
				header={false}
				footer={false}
				onReady={ready}
				verbose>
				<p>Section content</p>
			</Section>
		);
		const html = render(component);
		expect(ready).toBeCalled();
		expect(log).toBeCalled();
		const section = html.container.children[0];
		expect(section).toHaveClass(clone.backgroundImage);
		expect(window.getComputedStyle(section).backgroundImage).toEqual('');
		// Test z-index correctly generated
		expect(section).toHaveStyle('z-index: 4');
	});

	it('should generate with the correct CSS styles passed in', () => {
		const ref: React.MutableRefObject<HTMLDivElement> =
			React.createRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
		const component = (
			<Section
				innerRef={ref}
				scheme={Schemes.Valid.Stylesheet}
				stretch={false}
				styles={{}}
				priority={5}
				active={false}
				primary={false}
				header={false}
				footer={false}
				onReady={ready}
				verbose={false}>
				<p data-title='This is my title'>Section content</p>
			</Section>
		);
		const html = render(component);
		expect(ready).toBeCalled();
		expect(log).not.toBeCalled();
		const section = html.container.children[0];
		expect(section).toHaveStyle(
			'background-image: url(' +
				Schemes.Valid.Stylesheet.backgroundImage +
				')'
		);
		expect(section).toHaveStyle(
			'background-color: ' + Schemes.Valid.Stylesheet.backgroundColour
		);
		expect(section).toHaveStyle(
			'color: ' + Schemes.Valid.Stylesheet.foregroundColour
		);
		// Test title successfully created
		const inner = section.children[0];
		const title = inner.children[0];
		expect(title.tagName.toLowerCase()).toEqual('h2');
		expect(title).toHaveStyle(
			'color: ' +
				(Schemes.Valid.Stylesheet.headingColour as ColourSet).default
		);
		// Test z-index correctly generated
		expect(section).toHaveStyle('z-index: 5');
	});

	it('should mark as "ready" immediately for a component where data-async is false', () => {
		const ref: React.MutableRefObject<HTMLDivElement> =
			React.createRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
		const component = (
			<Section
				innerRef={ref}
				scheme={Schemes.Valid.Stylesheet}
				stretch={false}
				styles={{}}
				priority={5}
				active={false}
				primary={false}
				header={false}
				footer={false}
				onReady={ready}
				verbose={false}>
				<p data-title='This is my title' data-async='false'>
					Section content
				</p>
			</Section>
		);
		render(component);
		expect(ready).toBeCalled();
	});

	it('should only mark as "ready" when an asynchronous content load has been completed', () => {
		const ref: React.MutableRefObject<HTMLDivElement> =
			React.createRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
		const Asynchronous = (): React.ReactNode => {
			const [content, setContent] = React.useState(
				'Asynchronous content'
			);
			React.useEffect(() => {
				setContent('New content');
			});
			return (
				<Section
					innerRef={ref}
					scheme={Schemes.Valid.Stylesheet}
					stretch={false}
					styles={{}}
					priority={5}
					active={false}
					primary={false}
					header={false}
					footer={false}
					onReady={ready}
					verbose={false}>
					<p data-title='This is my title' data-async='true'>
						{content}
					</p>
				</Section>
			);
		};
		render(<Asynchronous />);
		expect(ready).not.toBeCalled();
		waitFor(() => {
			expect(ready).toBeCalled();
		});
	});
});
