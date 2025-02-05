import React from 'react';

import { waitFor } from '@testing-library/react';

import { ColourScheme, ColourPair, ButtonColourSet } from '../@types/theme';

import { ElementConverter } from './element-converter';

import * as Schemes from '../../samples/schemes';
import * as Content from '../../samples/content';

describe('ElementConverter', () => {
	it('should successfully initialise for valid parameters passed in', () => {
		expect(() => {
			const converter = new ElementConverter(
				Content.HTML.h2,
				Schemes.Valid.Tailwind.headingColour
			);
			expect(converter).not.toBeNull();
		}).not.toThrow();
		expect(() => {
			const converter = new ElementConverter(
				Content.HTML.button,
				Schemes.Valid.Stylesheet.buttonColours
			);
			expect(converter).not.toBeNull();
		}).not.toThrow();

		expect(() => {
			const converter = new ElementConverter(
				<h3>Subheading Element</h3>,
				Schemes.Valid.Tailwind.subheadingColour
			);
			expect(converter).not.toBeNull();
		}).not.toThrow();
		expect(() => {
			const converter = new ElementConverter(
				<a href='#'>Link Element</a>,
				Schemes.Valid.Stylesheet.linkColours
			);
			expect(converter).not.toBeNull();
		}).not.toThrow();
	});

	it('should fail on initialisation if parameters do not match', () => {
		expect(() => {
			const converter = new ElementConverter(
				Content.HTML.h2,
				Schemes.Valid.Tailwind.buttonColours
			);
			expect(converter).toBeNull();
		}).toThrow();
		expect(() => {
			const converter = new ElementConverter(
				Content.HTML.button,
				Schemes.Valid.Stylesheet.headingColour
			);
			expect(converter).toBeNull();
		}).toThrow();

		expect(() => {
			const converter = new ElementConverter(
				<h3>Subheading Element</h3>,
				Schemes.Valid.Tailwind.linkColours
			);
			expect(converter).not.toBeNull();
		}).toThrow();
		expect(() => {
			const converter = new ElementConverter(
				<a href='#'>Link Element</a>,
				Schemes.Valid.Stylesheet.buttonColours
			);
			expect(converter).not.toBeNull();
		}).toThrow();
	});

	it('should successfully update colours on buttons when they become disabled/enabled', async () => {
		const schemes: Array<ColourScheme> = [
			Schemes.Valid.Stylesheet,
			Schemes.Valid.Mixture
		];
		for (let s = 0; s < schemes.length; s++) {
			const scheme = schemes[s];
			Content.HTML.reset();
			const converter = new ElementConverter(
				Content.HTML.button,
				scheme.buttonColours as ButtonColourSet
			);
			expect(converter).not.toBeNull();
			converter.convert();

			Content.HTML.button.disabled = true;
			await waitFor(() => {
				if (typeof scheme.buttonColours?.disabled === 'string') {
					expect(Content.HTML.button).toHaveStyle(
						'color: ' + scheme.buttonColours?.disabled
					);
				} else {
					expect(Content.HTML.button).toHaveStyle(
						'color: ' +
							(scheme.buttonColours?.disabled as ColourPair).text
					);
					expect(Content.HTML.button).toHaveStyle(
						'background-color: ' +
							(scheme.buttonColours?.disabled as ColourPair)
								.background
					);
				}
			});
			Content.HTML.button.disabled = false;
			await waitFor(() => {
				if (typeof scheme.buttonColours?.default === 'string') {
					expect(Content.HTML.button).toHaveStyle(
						'color: ' + scheme.buttonColours?.default
					);
				} else {
					expect(Content.HTML.button).toHaveStyle(
						'color: ' +
							(scheme.buttonColours?.default as ColourPair).text
					);
					expect(Content.HTML.button).toHaveStyle(
						'background-color: ' +
							(scheme.buttonColours?.default as ColourPair)
								.background
					);
				}
			});
		}
	});

	it('should fail on initialisation if an invalid element is passed in', () => {
		const h4: HTMLHeadingElement = document.createElement('h4');
		expect(() => {
			const converter = new ElementConverter(
				h4,
				Schemes.Valid.Tailwind.subheadingColour
			);
			expect(converter).toBeNull();
		}).toThrow();
		const input: HTMLInputElement = document.createElement('input');
		input.type = 'password';
		expect(() => {
			const converter = new ElementConverter(
				input,
				Schemes.Valid.Stylesheet.buttonColours
			);
			expect(converter).toBeNull();
		}).toThrow();

		expect(() => {
			const converter = new ElementConverter(
				<h4>Sub-subheading Element</h4>,
				Schemes.Valid.Tailwind.subheadingColour
			);
			expect(converter).toBeNull();
		}).toThrow();
		expect(() => {
			const converter = new ElementConverter(
				<input type='password' />,
				Schemes.Valid.Stylesheet.buttonColours
			);
			expect(converter).toBeNull();
		}).toThrow();
	});
});
