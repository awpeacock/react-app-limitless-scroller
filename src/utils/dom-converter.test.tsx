import React from 'react';

import { fireEvent, waitFor, render, cleanup } from '@testing-library/react';

import {
	ColourSet,
	LinkColourSet,
	ButtonColourSet,
	ColourPair
} from '../@types/theme';

import { DOMConverter } from './dom-converter';

import * as Schemes from '../../samples/schemes';
import * as Content from '../../samples/content';

const converters: { [key: string]: DOMConverter } = {};

describe('DOMConverter', () => {
	beforeEach(() => {
		expect(() => {
			converters.tailwind = new DOMConverter(
				[Content.ReactElements.Plain],
				Schemes.Valid.Tailwind
			);
		}).not.toThrow();
		expect(() => {
			converters.stylesheet = new DOMConverter(
				[Content.ReactElements.Plain],
				Schemes.Valid.Stylesheet
			);
		}).not.toThrow();
	});

	afterAll((done) => {
		cleanup();
		done();
	});

	it('should successfully initialise', () => {
		expect(converters.tailwind.children).toEqual([
			Content.ReactElements.Plain
		]);
		expect(converters.tailwind.scheme).toBe(Schemes.Valid.Tailwind);
		expect(converters.stylesheet.children).toEqual([
			Content.ReactElements.Plain
		]);
		expect(converters.stylesheet.scheme).toBe(Schemes.Valid.Stylesheet);
	});

	it('should successfully apply default tailwind colours to any children', () => {
		converters.tailwind.convert();

		const test = (element: React.ReactElement): void => {
			if (element.type === 'h2') {
				expect(element.props.className).toContain(
					(Schemes.Valid.Tailwind.headingColour as ColourSet).default
				);
			}
			if (element.type === 'h3') {
				expect(element.props.className).toContain(
					(Schemes.Valid.Tailwind.subheadingColour as ColourSet)
						.default
				);
			}
			if (element.type === 'a') {
				const set: LinkColourSet = Schemes.Valid.Tailwind
					.linkColours as LinkColourSet;
				expect(element.props.className).toContain(set.default);
				expect(element.props.className).toContain(set.hover);
				expect(element.props.className).toContain(set.active);
				expect(element.props.className).toContain(set.visited);
			}
			if (
				element.type === 'button' ||
				element.type === 'submit' ||
				(element.type === 'input' &&
					(element.props.type === 'button' ||
						element.props.type === 'submit'))
			) {
				const set: ButtonColourSet = Schemes.Valid.Tailwind
					.buttonColours as ButtonColourSet;
				expect(element.props.className).toContain(set.default);
				expect(element.props.className).toContain(set.hover);
				expect(element.props.className).toContain(set.active);
				expect(element.props.className).toContain(set.disabled);
			}
		};
		const validate = (
			subject: React.ReactElement | Array<React.ReactElement>
		): void => {
			if (Array.isArray(subject)) {
				subject.forEach((element) => {
					test(element);
					if (element.props && element.props.children) {
						validate(element.props.children);
					}
				});
			} else {
				test(subject);
				if (subject.props && subject.props.children) {
					validate(subject.props.children);
				}
			}
		};

		const children: Array<React.ReactElement> = React.Children.toArray(
			converters.tailwind.children
		) as Array<React.ReactElement>;
		validate(children);
	});

	it('should successfully apply stylesheet colours to any children', async () => {
		converters.stylesheet.convert();

		const test = async (element: React.ReactElement): Promise<void> => {
			if (element.type === 'h2') {
				expect(element.props.style).toEqual({
					color: (Schemes.Valid.Stylesheet.headingColour as ColourSet)
						.default
				});
			}
			if (element.type === 'h3') {
				expect(element.props.style).toEqual(
					expect.objectContaining({
						color: (
							Schemes.Valid.Stylesheet
								.subheadingColour as ColourSet
						).default
					})
				);
			}
			if (element.type === 'a') {
				const set: LinkColourSet = Schemes.Valid.Stylesheet
					.linkColours as LinkColourSet;
				expect(element.props.style).toEqual({
					color: set.default
				});
				const { getByRole } = render(element);
				expect(getByRole('link')).toBeInTheDocument();
				const a = getByRole('link');
				fireEvent.mouseEnter(a);
				await waitFor(() => {
					expect(a).toHaveStyle('color: ' + set.hover);
				});
				fireEvent.mouseDown(a);
				await waitFor(() => {
					expect(a).toHaveStyle('color: ' + set.active);
				});
			}
			if (element.type === 'button') {
				const set: ButtonColourSet = Schemes.Valid.Stylesheet
					.buttonColours as ButtonColourSet;
				expect(element.props.style).toEqual({
					color: (set.default as ColourPair).text,
					backgroundColor: (set.default as ColourPair).background
				});
				const { getByRole } = render(element);
				expect(getByRole('button')).toBeInTheDocument();
				const button = getByRole('button');
				fireEvent.mouseEnter(button);
				await waitFor(() => {
					expect(button).toHaveStyle(
						'color: ' + (set.hover as ColourPair).text
					);
					expect(button).toHaveStyle(
						'background-color: ' +
							(set.hover as ColourPair).background
					);
				});
				fireEvent.mouseDown(button);
				await waitFor(() => {
					expect(button).toHaveStyle(
						'color: ' + (set.active as ColourPair).text
					);
					expect(button).toHaveStyle(
						'background-color: ' +
							(set.active as ColourPair).background
					);
				});
				button.setAttribute('disabled', 'disabled');
				await waitFor(() => {
					expect(button).toHaveStyle(
						'color: ' + (set.disabled as ColourPair).text
					);
					expect(button).toHaveStyle(
						'background-color: ' +
							(set.disabled as ColourPair).background
					);
				});
			}
		};
		const validate = (
			subject: React.ReactElement | Array<React.ReactElement>
		): void => {
			if (Array.isArray(subject)) {
				subject.forEach((element) => {
					test(element);
					if (element.props && element.props.children) {
						validate(element.props.children);
					}
				});
			} else {
				test(subject);
				if (subject.props && subject.props.children) {
					validate(subject.props.children);
				}
			}
		};

		const children: Array<React.ReactElement> = React.Children.toArray(
			converters.stylesheet.children
		) as Array<React.ReactElement>;
		validate(children);
	});

	it('should successfully add classes to any existing non-colour classes or styles on any children', () => {
		converters.tailwind.convert();

		const children: Array<React.ReactElement> = React.Children.toArray(
			converters.tailwind.children
		) as Array<React.ReactElement>;
		const h2: React.ReactElement = children[0].props.children[0];
		expect(h2.props.className).toContain('p-2');
		expect(h2.props.className).toContain(
			Schemes.Valid.Tailwind.headingColour?.default
		);
		const h3: React.ReactElement = children[0].props.children[1];
		expect(h3.props.style).toEqual(
			expect.objectContaining({
				padding: 10
			})
		);
		expect(h3.props.className).toContain(
			Schemes.Valid.Tailwind.subheadingColour?.default
		);
	});

	it('should NOT override any existing colour classes on any children', () => {
		const converters: Array<DOMConverter> = [
			new DOMConverter(
				[Object.create(Content.ReactElements.ExistingClasses)],
				Schemes.Valid.Tailwind
			),
			new DOMConverter(
				[Object.create(Content.ReactElements.ExistingClasses)],
				Schemes.Valid.Stylesheet
			)
		];
		converters.forEach((converter) => {
			converter.convert();

			const children: Array<React.ReactElement> = React.Children.toArray(
				converter.children
			) as Array<React.ReactElement>;
			const h2: React.ReactElement = children[0].props.children[0];
			expect(h2.props.className).toContain('text-purple-200');
			expect(h2.props.className).not.toContain(
				Schemes.Valid.Tailwind.headingColour?.default
			);
			expect(h2.props.style).not.toEqual(
				expect.objectContaining({
					color: Schemes.Valid.Stylesheet.headingColour?.default
				})
			);
			const a: React.ReactElement =
				children[0].props.children[2].props.children;
			expect(a.props.className).toContain('text-purple-400');
			expect(a.props.style).not.toEqual(
				expect.objectContaining({
					color: converter.scheme.linkColours?.default
				})
			);
			const button: React.ReactElement =
				children[0].props.children[3].props.children;
			expect(button.props.className).toContain('text-purple-600');
			expect(button.props.className).toContain('bg-pink-400');
			expect(button.props.style).not.toEqual(
				expect.objectContaining({
					color: (
						converter.scheme.buttonColours?.default as ColourPair
					).text
				})
			);
			expect(button.props.style).not.toEqual(
				expect.objectContaining({
					color: (
						converter.scheme.buttonColours?.default as ColourPair
					).background
				})
			);
		});
	});

	it('should successfully add styles to any existing non-colour classes or styles on any children', () => {
		converters.stylesheet.convert();

		const children: Array<React.ReactElement> = React.Children.toArray(
			converters.stylesheet.children
		) as Array<React.ReactElement>;
		const h2: React.ReactElement = children[0].props.children[0];
		expect(h2.props.className).toContain('p-2');
		expect(h2.props.style).toEqual(
			expect.objectContaining({
				color: (Schemes.Valid.Stylesheet.headingColour as ColourSet)
					.default
			})
		);
		const h3: React.ReactElement = children[0].props.children[1];
		expect(h3.props.style).toEqual(
			expect.objectContaining({
				padding: 10
			})
		);
		expect(h3.props.style).toEqual(
			expect.objectContaining({
				color: (Schemes.Valid.Stylesheet.subheadingColour as ColourSet)
					.default
			})
		);
	});

	it('should NOT override any existing colour styles on any children', () => {
		const converters: Array<DOMConverter> = [
			new DOMConverter(
				[Object.create(Content.ReactElements.ExistingStyles)],
				Schemes.Valid.Tailwind
			),
			new DOMConverter(
				[Object.create(Content.ReactElements.ExistingStyles)],
				Schemes.Valid.Stylesheet
			)
		];
		converters.forEach((converter) => {
			converter.convert();

			const children: Array<React.ReactElement> = React.Children.toArray(
				converter.children
			) as Array<React.ReactElement>;
			const h3: React.ReactElement = children[0].props.children[1];
			expect(h3.props.style).toEqual(
				expect.objectContaining({
					color: '#a00'
				})
			);
			expect(h3.props.className).not.toContain(
				Schemes.Valid.Tailwind.subheadingColour?.default
			);
			expect(h3.props.style).not.toEqual(
				expect.objectContaining({
					color: Schemes.Valid.Stylesheet.subheadingColour?.default
				})
			);
			const a: React.ReactElement =
				children[0].props.children[2].props.children;
			expect(a.props.style).toEqual(
				expect.objectContaining({
					color: '#0a0'
				})
			);
			expect(a.props.style).not.toEqual(
				expect.objectContaining({
					color: converter.scheme.linkColours?.default
				})
			);
			const button: React.ReactElement =
				children[0].props.children[3].props.children;
			expect(button.props.style).toEqual(
				expect.objectContaining({
					color: '#00a'
				})
			);
			expect(button.props.style).toEqual(
				expect.objectContaining({
					backgroundColor: '#a0a'
				})
			);
			expect(button.props.style).not.toEqual(
				expect.objectContaining({
					color: (
						converter.scheme.buttonColours?.default as ColourPair
					).text
				})
			);
			expect(button.props.style).not.toEqual(
				expect.objectContaining({
					color: (
						converter.scheme.buttonColours?.default as ColourPair
					).background
				})
			);
		});
	});

	it('should ignore any input tags other than button and submit types', () => {
		const converters: Array<DOMConverter> = [
			new DOMConverter(
				[Object.create(Content.ReactElements.Plain)],
				Schemes.Valid.Tailwind
			),
			new DOMConverter(
				[Object.create(Content.ReactElements.Plain)],
				Schemes.Valid.Stylesheet
			)
		];
		converters.forEach((converter) => {
			converter.convert();

			const children: Array<React.ReactElement> = React.Children.toArray(
				converter.children
			) as Array<React.ReactElement>;
			const password: React.ReactElement =
				children[0].props.children[6].props.children;
			expect(password.props.style).not.toEqual(
				expect.objectContaining({
					color: (
						converter.scheme.buttonColours?.default as ColourPair
					).text
				})
			);
			expect(password.props.style).not.toEqual(
				expect.objectContaining({
					color: (
						converter.scheme.buttonColours?.default as ColourPair
					).background
				})
			);
		});
	});

	it('should do nothing with an empty scheme', () => {
		expect(() => {
			const converter = new DOMConverter(
				[Object.create(Content.ReactElements.Plain)],
				Schemes.Invalid.Empty
			);
			converter.convert();
			expect(converter.children).toMatchObject([
				Content.ReactElements.Plain
			]);
		}).not.toThrow();
	});

	it('should throw an exception if you pass an invalid colour scheme', () => {
		expect(() => {
			const converter = new DOMConverter(
				[Object.create(Content.ReactElements.Plain)],
				// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
				// @ts-ignore
				Schemes.Invalid.Attributes
			);
			converter.convert();
		}).toThrow();
	});

	it('should throw an exception if you pass a mixture of classes and styles', () => {
		expect(() => {
			const converter = new DOMConverter(
				[Object.create(Content.ReactElements.Plain)],
				Schemes.Invalid.Mixture
			);
			converter.convert();
		}).toThrow();
	});
});
