import { fireEvent, waitFor, cleanup } from '@testing-library/react';

import { ColourScheme, ColourPair } from '../@types/theme';

import { HTMLConverter } from './html-converter';

import * as Schemes from '../../samples/schemes';
import * as Content from '../../samples/content';

const converters: { [key: string]: HTMLConverter } = {};

describe('HTMLConverter', () => {
	beforeEach(() => {
		Content.HTML.reset();
		expect(() => {
			converters.tailwind = new HTMLConverter(
				Content.HTML.parent,
				Schemes.Valid.Tailwind
			);
		}).not.toThrow();
		expect(() => {
			converters.stylesheet = new HTMLConverter(
				Content.HTML.parent,
				Schemes.Valid.Stylesheet
			);
		}).not.toThrow();
	});

	afterAll((done) => {
		cleanup();
		done();
	});

	it('should successfully initialise', () => {
		expect(converters.tailwind.parent).toBe(Content.HTML.parent);
		expect(converters.tailwind.scheme).toBe(Schemes.Valid.Tailwind);
		expect(converters.stylesheet.parent).toBe(Content.HTML.parent);
		expect(converters.stylesheet.scheme).toBe(Schemes.Valid.Stylesheet);
	});

	it('should successfully apply default tailwind colours to any children', () => {
		converters.tailwind.convert();

		expect(Content.HTML.h2).toHaveClass(
			Schemes.Valid.Tailwind.headingColour?.default
		);
		expect(Content.HTML.h3).toHaveClass(
			Schemes.Valid.Tailwind.subheadingColour?.default
		);
		expect(Content.HTML.p.className).toEqual('');
		expect(Content.HTML.a).toHaveClass(
			Schemes.Valid.Tailwind.linkColours?.default
		);
		expect(Content.HTML.button).toHaveClass(
			Schemes.Valid.Tailwind.buttonColours?.default
		);
		expect(Content.HTML.input).toHaveClass(
			Schemes.Valid.Tailwind.buttonColours?.default
		);
		expect(Content.HTML.input).toHaveClass(
			Schemes.Valid.Tailwind.buttonColours?.default
		);
		expect(Content.HTML.submit).toHaveClass(
			Schemes.Valid.Tailwind.buttonColours?.default
		);
		expect(Content.HTML.submit).toHaveClass(
			Schemes.Valid.Tailwind.buttonColours?.default
		);
	});

	it('should successfully apply default styles to any children', () => {
		converters.stylesheet.convert();

		expect(Content.HTML.h2).toHaveStyle(
			'color: ' + Schemes.Valid.Stylesheet.headingColour?.default
		);
		expect(Content.HTML.h3).toHaveStyle(
			'color: ' + Schemes.Valid.Stylesheet.subheadingColour?.default
		);
		expect(Content.HTML.p.getAttribute('style')).toBeNull();
		expect(Content.HTML.a).toHaveStyle(
			'color: ' + Schemes.Valid.Stylesheet.linkColours?.default
		);
		expect(Content.HTML.button).toHaveStyle(
			'color: ' +
				(Schemes.Valid.Stylesheet.buttonColours?.default as ColourPair)
					.text
		);
		expect(Content.HTML.button).toHaveStyle(
			'background-color: ' +
				(Schemes.Valid.Stylesheet.buttonColours?.default as ColourPair)
					.background
		);
		expect(Content.HTML.input.getAttribute('style')).toContain(
			(Schemes.Valid.Stylesheet.buttonColours?.default as ColourPair).text
		);
		expect(Content.HTML.input.getAttribute('style')).toContain(
			(Schemes.Valid.Stylesheet.buttonColours?.default as ColourPair)
				.background
		);
		expect(Content.HTML.submit.getAttribute('style')).toContain(
			(Schemes.Valid.Stylesheet.buttonColours?.default as ColourPair).text
		);
		expect(Content.HTML.submit.getAttribute('style')).toContain(
			(Schemes.Valid.Stylesheet.buttonColours?.default as ColourPair)
				.background
		);
	});

	it('should successfully apply hover styles to any children', async () => {
		converters.stylesheet.convert();

		fireEvent.mouseEnter(Content.HTML.a);
		await waitFor(() => {
			expect(Content.HTML.a).toHaveStyle(
				'color: ' + Schemes.Valid.Stylesheet.linkColours?.hover
			);
		});
		fireEvent.mouseEnter(Content.HTML.button);
		await waitFor(() => {
			expect(Content.HTML.button).toHaveStyle(
				'background-color: ' +
					(
						Schemes.Valid.Stylesheet.buttonColours
							?.hover as ColourPair
					).background
			);
		});
	});

	it('should successfully apply active styles to any children', async () => {
		converters.stylesheet.convert();

		fireEvent.mouseDown(Content.HTML.a);
		await waitFor(() => {
			expect(Content.HTML.a).toHaveStyle(
				'color: ' + Schemes.Valid.Stylesheet.linkColours?.active
			);
		});
		fireEvent.mouseDown(Content.HTML.button);
		await waitFor(() => {
			expect(Content.HTML.button).toHaveStyle(
				'background-color: ' +
					(
						Schemes.Valid.Stylesheet.buttonColours
							?.active as ColourPair
					).background
			);
		});
	});

	it('should successfully apply disabled styles to any children', async () => {
		converters.stylesheet.convert();

		await waitFor(() => {
			expect(Content.HTML.disabled).toHaveStyle(
				'color: ' +
					(
						Schemes.Valid.Stylesheet.buttonColours
							?.disabled as ColourPair
					).text
			);
			expect(Content.HTML.disabled).toHaveStyle(
				'background-color: ' +
					(
						Schemes.Valid.Stylesheet.buttonColours
							?.disabled as ColourPair
					).background
			);
		});
	});

	it('should successfully apply disabled styles to any children (where the style is set as just as a single colour)', async () => {
		const single = new HTMLConverter(
			Content.HTML.parent,
			Schemes.Valid.Mixture
		);
		single.convert();
		await waitFor(() => {
			expect(Content.HTML.disabled).toHaveStyle(
				'color: ' + Schemes.Valid.Mixture.buttonColours?.disabled
			);
		});

		Content.HTML.reset();
		const pair = new HTMLConverter(
			Content.HTML.parent,
			Schemes.Valid.Stylesheet
		);
		pair.convert();
		await waitFor(() => {
			expect(Content.HTML.disabled).toHaveStyle(
				'color: ' +
					Schemes.Valid.Stylesheet.buttonColours?.disabled.text
			);
			expect(Content.HTML.disabled).toHaveStyle(
				'background-color: ' +
					Schemes.Valid.Stylesheet.buttonColours?.disabled.background
			);
		});
	});

	it('should successfully add classes to any existing non-colour classes or styles on any children', () => {
		converters.tailwind.convert();

		expect(Content.HTML.h2).toHaveClass('p-2');
		expect(Content.HTML.h2).toHaveClass(
			Schemes.Valid.Tailwind.headingColour?.default
		);
		expect(Content.HTML.h3).toHaveStyle('margin: 10px');
		expect(Content.HTML.h3).toHaveClass(
			Schemes.Valid.Tailwind.subheadingColour?.default
		);
		expect(Content.HTML.button).toHaveStyle('border-radius: 5px');
		expect(Content.HTML.button).toHaveStyle('border: 1px solid red');
		expect(Content.HTML.button).toHaveClass(
			Schemes.Valid.Tailwind.buttonColours?.default
		);
	});

	it('should NOT override any existing colour classes on any children', () => {
		const schemes: Array<ColourScheme> = [
			Schemes.Valid.Tailwind,
			Schemes.Valid.Stylesheet
		];
		schemes.forEach((scheme) => {
			Content.HTML.reset();
			Content.HTML.h2.className = 'p-2 text-purple-200';
			Content.HTML.a.className = 'text-white';
			Content.HTML.button.className = 'text-transparent bg-pink-400';
			const converter1: HTMLConverter = new HTMLConverter(
				Content.HTML.parent,
				scheme
			);
			converter1.convert();

			expect(Content.HTML.h2).toHaveClass('text-purple-200');
			expect(Content.HTML.h2).not.toHaveClass(
				Schemes.Valid.Tailwind.headingColour?.default
			);
			expect(Content.HTML.a).toHaveClass('text-white');
			expect(Content.HTML.a).not.toHaveClass(
				Schemes.Valid.Tailwind.linkColours?.default
			);
			expect(Content.HTML.button).toHaveClass('text-transparent');
			expect(Content.HTML.button).toHaveClass('bg-pink-400');
			expect(Content.HTML.button).not.toHaveClass(
				Schemes.Valid.Tailwind.buttonColours?.default
			);

			Content.HTML.reset();
			Content.HTML.h2.className = 'p-2 text-current';
			Content.HTML.a.className = 'text-black';
			Content.HTML.button.className = 'text-pink-400 bg-inherit';
			const converter2: HTMLConverter = new HTMLConverter(
				Content.HTML.parent,
				scheme
			);
			converter2.convert();

			expect(Content.HTML.h2).toHaveClass('text-current');
			expect(Content.HTML.h2).not.toHaveClass(
				Schemes.Valid.Tailwind.headingColour?.default
			);
			expect(Content.HTML.a).toHaveClass('text-black');
			expect(Content.HTML.a).not.toHaveClass(
				Schemes.Valid.Tailwind.linkColours?.default
			);
			expect(Content.HTML.button).toHaveClass('text-pink-400');
			expect(Content.HTML.button).toHaveClass('bg-inherit');
			expect(Content.HTML.button).not.toHaveClass(
				Schemes.Valid.Tailwind.buttonColours?.default
			);
		});
	});

	it('should still apply colours for children with non-colour Tailwind classes prefixed with bg or text', () => {
		const schemes: Array<ColourScheme> = [
			Schemes.Valid.Tailwind,
			Schemes.Valid.Stylesheet
		];
		schemes.forEach((scheme) => {
			Content.HTML.reset();
			Content.HTML.h2.className = 'text-center';
			Content.HTML.a.className = 'text-2xl';
			Content.HTML.button.className = 'text-wrap bg-bottom';
			const converter: HTMLConverter = new HTMLConverter(
				Content.HTML.parent,
				scheme
			);
			converter.convert();

			expect(Content.HTML.h2).toHaveClass('text-center');
			expect(Content.HTML.a).toHaveClass('text-2xl');
			expect(Content.HTML.button).toHaveClass('text-wrap');
			expect(Content.HTML.button).toHaveClass('bg-bottom');
			if (scheme === Schemes.Valid.Tailwind) {
				expect(Content.HTML.h2).toHaveClass(
					Schemes.Valid.Tailwind.headingColour?.default
				);
				expect(Content.HTML.a).toHaveClass(
					Schemes.Valid.Tailwind.linkColours?.default
				);
				expect(Content.HTML.button).toHaveClass(
					Schemes.Valid.Tailwind.buttonColours?.default
				);
			} else {
				expect(Content.HTML.h2).toHaveStyle(
					'color: ' + Schemes.Valid.Stylesheet.headingColour?.default
				);
				expect(Content.HTML.a).toHaveStyle(
					'color: ' + Schemes.Valid.Stylesheet.linkColours?.default
				);
				expect(Content.HTML.button).toHaveStyle(
					'color: ' +
						(
							Schemes.Valid.Stylesheet.buttonColours
								?.default as ColourPair
						).text
				);
				expect(Content.HTML.button).toHaveStyle(
					'background-color: ' +
						(
							Schemes.Valid.Stylesheet.buttonColours
								?.default as ColourPair
						).background
				);
			}
		});
	});

	it('should successfully add styles to any existing non-colour classes or styles on any children', () => {
		converters.stylesheet.convert();

		expect(Content.HTML.h2).toHaveClass('p-2');
		expect(Content.HTML.h2).toHaveStyle(
			'color: ' + Schemes.Valid.Stylesheet.headingColour?.default
		);
		expect(Content.HTML.h3).toHaveStyle('margin: 10px');
		expect(Content.HTML.h3).toHaveStyle(
			'color: ' + Schemes.Valid.Stylesheet.subheadingColour?.default
		);
		expect(Content.HTML.button).toHaveStyle('border-radius: 5px');
		expect(Content.HTML.button).toHaveStyle('border: 1px solid red');
		expect(Content.HTML.button).toHaveStyle(
			'color: ' +
				(Schemes.Valid.Stylesheet.buttonColours?.default as ColourPair)
					.text
		);
		expect(Content.HTML.button).toHaveStyle(
			'background-color: ' +
				(Schemes.Valid.Stylesheet.buttonColours?.default as ColourPair)
					.background
		);
	});

	it('should NOT override any existing styles on any children', () => {
		const schemes: Array<ColourScheme> = [
			Schemes.Valid.Tailwind,
			Schemes.Valid.Stylesheet
		];
		schemes.forEach((scheme) => {
			Content.HTML.reset();
			Content.HTML.h3.setAttribute('style', 'color: #a00');
			Content.HTML.a.setAttribute('style', 'color: #0a0');
			Content.HTML.button.setAttribute(
				'style',
				'color: #a00; background-color: #aa0'
			);
			const converter: HTMLConverter = new HTMLConverter(
				Content.HTML.parent,
				scheme
			);
			converter.convert();

			expect(Content.HTML.h3).toHaveStyle('color: #a00');
			expect(Content.HTML.h3).not.toHaveStyle(
				'color: ' + Schemes.Valid.Stylesheet.subheadingColour?.default
			);
			expect(Content.HTML.a).toHaveStyle('color: #0a0');
			expect(Content.HTML.a).not.toHaveStyle(
				'color: ' + Schemes.Valid.Stylesheet.linkColours?.default
			);
			expect(Content.HTML.button).toHaveStyle('color: #a00');
			expect(Content.HTML.button).toHaveStyle('background-color: #aa0');
			expect(Content.HTML.button).not.toHaveStyle(
				'color: ' + Schemes.Valid.Stylesheet.buttonColours?.default.text
			);
			expect(Content.HTML.button).not.toHaveStyle(
				'color: ' +
					Schemes.Valid.Stylesheet.buttonColours?.default.background
			);
		});
	});

	it('should ignore any input tags other than button and submit types', () => {
		const schemes: Array<ColourScheme> = [
			Schemes.Valid.Tailwind,
			Schemes.Valid.Stylesheet
		];
		schemes.forEach((scheme) => {
			Content.HTML.reset();
			const converter: HTMLConverter = new HTMLConverter(
				Content.HTML.parent,
				scheme
			);
			converter.convert();

			expect(Content.HTML.password).not.toHaveStyle(
				'color: ' + Schemes.Valid.Stylesheet.buttonColours?.default.text
			);
			expect(Content.HTML.password).not.toHaveStyle(
				'color: ' +
					Schemes.Valid.Stylesheet.buttonColours?.default.background
			);
		});
	});

	it('should do nothing with an empty scheme', () => {
		expect(() => {
			const converter = new HTMLConverter(
				Content.HTML.parent,
				Schemes.Invalid.Empty
			);
			converter.convert();
		}).not.toThrow();

		expect(Content.HTML.h2).toHaveClass('p-2');
		expect(Content.HTML.h3.className).toEqual('');
		expect(Content.HTML.h3).toHaveStyle('margin: 10px');
		expect(Content.HTML.p.className).toEqual('');
		expect(Content.HTML.a.className).toEqual('');
		expect(Content.HTML.button.className).toEqual('');
		expect(Content.HTML.button).toHaveStyle('border-radius: 5px');
		expect(Content.HTML.button).toHaveStyle('border: 1px solid red');
		expect(Content.HTML.input.className).toEqual('');
		expect(Content.HTML.submit.className).toEqual('');
	});

	it('should throw an exception if you pass an invalid colour scheme', () => {
		expect(() => {
			const converter = new HTMLConverter(
				Content.HTML.parent,
				// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
				// @ts-ignore
				Schemes.Invalid.Attributes
			);
			converter.convert();
		}).toThrow();
	});

	it('should throw an exception if you pass a mixture of classes and styles', () => {
		expect(() => {
			const converter = new HTMLConverter(
				Content.HTML.parent,
				Schemes.Invalid.Mixture
			);
			converter.convert();
		}).toThrow();
	});
});
