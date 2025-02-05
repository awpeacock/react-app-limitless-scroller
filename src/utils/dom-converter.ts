import React from 'react';

import { ColourSet, ColourScheme } from '../@types/theme';

import { ElementConverter } from './element-converter';

export class DOMConverter {
	children: Array<React.ReactElement>;
	scheme: ColourScheme;

	constructor(children: Array<React.ReactElement>, scheme: ColourScheme) {
		this.children = children;
		this.scheme = scheme;
	}

	convert(): Array<React.ReactElement> {
		// Loop through each tag we convert, and apply the specified
		// colours to each matching child element in turn.
		const tags: Array<string> = ['h2', 'h3', 'a', 'button', 'input'];
		const colours: Array<Undefinable<ColourSet>> = [
			this.scheme.headingColour,
			this.scheme.subheadingColour,
			this.scheme.linkColours,
			this.scheme.buttonColours,
			this.scheme.buttonColours
		];
		for (let c = 0; c < colours.length; c++) {
			// No point performing the conversion, if no colour set
			// has been supplied for this type.
			if (colours[c]) {
				this.children = this.convertTag(
					tags[c],
					colours[c] as ColourSet,
					this.children
				);
			}
		}
		return this.children;
	}

	convertTag(
		tag: string,
		set: ColourSet,
		parent: Array<React.ReactElement>
	): Array<React.ReactElement> {
		// Even though we already have an array of elements, we need to
		// make this conversion to avoid read-only errors.
		const children: Array<React.ReactElement> = React.Children.toArray(
			parent
		) as Array<React.ReactElement>;
		for (let e = 0; e < children.length; e++) {
			// Each element in a parent could have any number of children itself,
			// so we need to recursively loop through each of these, and apply
			// the new colours there first.
			const child: React.ReactElement = children[e];
			if (
				child.props &&
				child.props.children &&
				typeof child.props.children !== 'string'
			) {
				const c: Array<React.ReactElement> = this.convertTag(
					tag,
					set,
					children[e].props.children
				);
				if (c.length === 1) {
					children[e] = React.cloneElement(children[e], {
						children: c[0]
					});
				} else {
					children[e] = React.cloneElement(children[e], {
						children: c
					});
				}
			}
			// Once all that is done, then we actually apply the colours.
			if (children[e].type === tag) {
				let convert = true;
				// We only convert INPUT tags if they're submit or button types
				if (tag === 'input') {
					if (
						children[e].props.type !== 'button' &&
						children[e].props.type !== 'submit'
					) {
						convert = false;
					}
				}
				if (convert) {
					const converter: ElementConverter = new ElementConverter(
						children[e],
						set
					);
					children[e] = converter.convert() as React.ReactElement;
				}
			}
		}
		return children;
	}
}
