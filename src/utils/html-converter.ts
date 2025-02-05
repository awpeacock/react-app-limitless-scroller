import { ColourSet, ColourScheme } from '../@types/theme';

import { ElementConverter } from './element-converter';

export class HTMLConverter {
	parent: HTMLDivElement;
	scheme: ColourScheme;

	constructor(parent: HTMLDivElement, scheme: ColourScheme) {
		this.parent = parent;
		this.scheme = scheme;
	}

	convert(): string {
		// Loop through each tag we convert, and apply the specified
		// colours to each matching child element in turn.
		const tags: Array<string> = ['h2', 'h3', 'a', 'button', 'input'];
		const counts: Array<number> = [0, 0, 0, 0];
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
				this.convertTag(tags[c], colours[c] as ColourSet, this.parent);
				if (c <= 3) {
					counts[c]++;
				} else {
					counts[c - 1]++;
				}
			}
		}
		const messages: Array<string> = [];
		for (let c = 0; c < counts.length; c++) {
			if (counts[c] > 0) {
				messages.push(
					counts[c] + ' x ' + tags[c].toUpperCase() + ' converted'
				);
			}
		}
		return messages.length > 0 ? messages.join(', ') : 'Nothing converted';
	}

	convertTag(tag: string, set: ColourSet, parent: HTMLElement): void {
		// No need for looping through all the elements, as a method is
		// supplied that does all that for us and just gives us every
		// applicable tag.
		const nodes: NodeListOf<Element> = parent.querySelectorAll(tag);
		for (let n = 0; n < nodes.length; n++) {
			// We only convert INPUT tags if they're submit or button types
			if (tag === 'input') {
				if (
					nodes[n].getAttribute('type') !== 'button' &&
					nodes[n].getAttribute('type') !== 'submit'
				) {
					continue;
				}
			}
			const converter: ElementConverter = new ElementConverter(
				nodes[n],
				set
			);
			converter.convert();
		}
	}
}
