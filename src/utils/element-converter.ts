import React from 'react';

import {
	ColourPair,
	ColourSet,
	InteractiveColourSet,
	LinkColourSet,
	ButtonColourSet
} from '../@types/theme';

enum PropertyType {
	Default = 'Default',
	Hover = 'Hover',
	Active = 'Active',
	Disabled = 'Disabled',
	Visited = 'Visited'
}

export class ElementConverter {
	element: React.ReactElement | Element;
	set: ColourSet;
	isHTML: boolean;

	classes: Array<string>;
	styles: React.CSSProperties;
	css: string;
	actions: Map<string, (e: MouseEvent) => void>;

	existing: Map<string, string>;

	constructor(element: React.ReactElement | Element, set: ColourSet) {
		this.element = element;
		this.set = set;

		this.classes = [];
		this.styles = {};
		this.css = '';
		this.actions = new Map<string, (e: MouseEvent) => void>();

		this.existing = new Map<string, string>();

		this.isHTML = this.element instanceof Element;
		this.validate();

		// There's some initial setup to do to check for existing styles/classes
		// which trumps anything we want to pass in.
		if (this.isHTML) {
			const element: Element = this.element as Element;
			this.css = element.getAttribute('style') ?? '';
			if (this.css !== '' && !this.css.endsWith(';')) {
				this.css += ';';
			}
			const styles: Array<string> = this.css.split(';');
			styles.forEach((style: Undefinable<string>) => {
				if (style) {
					const [key, value] = style.split(':');
					// Convert the CSS format styles to JS format.
					let prop = '';
					for (let c = 0; c < key.length; c++) {
						if (key[c] === '-') {
							prop += key[++c].toUpperCase();
						} else {
							prop += key[c];
						}
					}
					this.existing.set(prop.trim(), value.trim());
				}
			});
		} else {
			const element: React.ReactElement = this
				.element as React.ReactElement;
			if (element.props.style) {
				const style: React.CSSProperties = element.props.style;
				Object.keys(style).map((key: keyof React.CSSProperties) => {
					const value = style[key];
					this.existing.set(key, value as string);
				});
			}
		}
	}

	validate(): void {
		// Determine what kind of colour set we've been passed,
		// so we can confirm that the correct data has been sent
		// to match to the element being converted.
		let valid = false;
		const type: string = this.isHTML
			? (this.element as Element).tagName
			: ((this.element as React.ReactElement).type as string);
		switch (type.toLowerCase()) {
			case 'h2':
			case 'h3': {
				valid = !('hover' in this.set) && !('active' in this.set);
				break;
			}
			case 'a': {
				valid = 'hover' in this.set && !('disabled' in this.set);
				break;
			}
			case 'button': {
				valid = 'disabled' in this.set;
				break;
			}
			case 'input': {
				const inputType: string = this.isHTML
					? (this.element as Element).getAttribute('type')
					: (this.element as React.ReactElement).props.type;
				if (inputType !== 'button' && inputType !== 'submit') {
					throw new Error(
						'Attempt to convert <INPUT> tag with wrong "type" - ' +
							inputType
					);
				}
				valid = 'disabled' in this.set;
				break;
			}
		}
		if (!valid) {
			const tag = '<' + type + '>';
			throw new Error(
				'Attempt either to convert invalid element or element with invalid ColourSet (' +
					tag +
					')'
			);
		}
	}

	convert(): React.ReactElement | void {
		this.setColours(this.element, PropertyType.Default, this.set.default);
		if ('hover' in this.set) {
			const set: InteractiveColourSet = this.set as InteractiveColourSet;
			this.setColours(this.element, PropertyType.Hover, set.hover);
		}
		if ('active' in this.set) {
			const set: InteractiveColourSet = this.set as InteractiveColourSet;
			this.setColours(this.element, PropertyType.Active, set.active);
		}
		if ('visited' in this.set) {
			const set: LinkColourSet = this.set as LinkColourSet;
			const visited: string = set.visited as string;
			this.setColours(this.element, PropertyType.Visited, visited);
		}
		if ('disabled' in this.set) {
			const set: ButtonColourSet = this.set as ButtonColourSet;
			this.setColours(this.element, PropertyType.Disabled, set.disabled);
			// Detect when the button changes disabled state
			if (this.isHTML) {
				const observer = new MutationObserver((mutations) => {
					mutations.forEach((mutation) => {
						if (mutation.attributeName === 'disabled') {
							const element: HTMLElement =
								mutation.target as HTMLElement;
							let colours: ColourPair | string;
							if (element.getAttribute('disabled') !== null) {
								colours = set.disabled;
							} else {
								colours = set.default;
							}
							if (typeof colours === 'string') {
								element.style.color = colours;
							} else {
								const pair: ColourPair = colours;
								element.style.backgroundColor = pair.background;
								element.style.color = pair.text;
							}
						}
					});
				});
				observer.observe(this.element as Element, { attributes: true });
			}
		}

		if (this.isHTML) {
			const element: Element = this.element as Element;
			const css: Array<[string, string]> = Object.entries(this.styles);
			for (const [key, value] of css) {
				// Convert the generated JS format styles and add to the existing CSS
				let prop = '';
				key.split('').forEach((lt) => {
					if (lt.toUpperCase() === lt) {
						prop += '-' + lt.toLowerCase();
					} else {
						prop += lt;
					}
				});
				this.css += prop + ':' + value + ';';
			}
			element.setAttribute('style', this.css);
			element.className += ' ' + this.classes.join(' ');
			element.addEventListener(
				'mouseenter',
				this.actions.get('enter') as EventListener
			);
			element.addEventListener(
				'mouseleave',
				this.actions.get('leave') as EventListener
			);
			element.addEventListener(
				'mousedown',
				this.actions.get('down') as EventListener
			);
			element.addEventListener(
				'mouseup',
				this.actions.get('up') as EventListener
			);
		} else {
			const element: React.ReactElement = this
				.element as React.ReactElement;
			if (element.props.className) {
				this.classes.push(element.props.className);
			}
			return React.cloneElement(element, {
				style: {
					...element.props.style,
					...this.styles
				},
				className: this.classes.join(' '),
				onMouseEnter: this.actions.get('enter'),
				onMouseLeave: this.actions.get('leave'),
				onMouseDown: this.actions.get('down'),
				onMouseUp: this.actions.get('up')
			});
		}
	}

	setColours(
		element: React.ReactElement | Element,
		type: PropertyType,
		property: ColourPair | string
	): void {
		let disabled = false;
		let hasForeground = false;
		let hasBackground = false;
		if (this.isHTML) {
			const html: HTMLElement = element as HTMLElement;
			if (element instanceof HTMLButtonElement) {
				disabled = (element as HTMLButtonElement).disabled;
			}
			hasForeground = this.hasExisting(html, 'foreground');
			hasBackground = this.hasExisting(html, 'background');
		} else {
			const react: React.ReactElement = element as React.ReactElement;
			disabled = react.props.disabled;
			hasForeground = this.hasExisting(react, 'foreground');
			hasBackground = this.hasExisting(react, 'foreground');
		}
		// Do not override a color class or style that has already been set
		if (!hasForeground && !hasBackground) {
			if (typeof property === 'string') {
				if (property.startsWith('#')) {
					switch (type) {
						case PropertyType.Default: {
							this.styles.color = property;
							this.actions.set(
								'leave',
								this.createMouseEvent(property)
							);
							this.actions.set(
								'up',
								this.createMouseEvent(property)
							);
							break;
						}
						case PropertyType.Disabled: {
							if (disabled) {
								this.styles.color = property;
							}
							break;
						}
						case PropertyType.Hover: {
							this.actions.set(
								'enter',
								this.createMouseEvent(property)
							);
							this.actions.set(
								'up',
								this.createMouseEvent(property)
							);
							break;
						}
						case PropertyType.Active: {
							this.actions.set(
								'down',
								this.createMouseEvent(property)
							);
							break;
						}
					}
				} else {
					this.classes.push(property);
				}
			} else {
				const pair: ColourPair = property as ColourPair;
				if (
					(pair.background.startsWith('#') &&
						!pair.text.startsWith('#')) ||
					(!pair.background.startsWith('#') &&
						pair.text.startsWith('#'))
				) {
					throw new Error(
						'Mix of hex colour values and classes is not permitted'
					);
				}
				if (pair.background.startsWith('#')) {
					switch (type) {
						case PropertyType.Default: {
							// Do not override a color style that has already been set
							if (!this.existing.has('backgroundColor')) {
								this.styles.backgroundColor = pair.background;
							}
							if (!this.existing.has('color')) {
								this.styles.color = pair.text;
							}
							this.actions.set(
								'leave',
								this.createMouseEvent(pair)
							);
							this.actions.set('up', this.createMouseEvent(pair));
							break;
						}
						case PropertyType.Disabled: {
							if (disabled) {
								this.styles.backgroundColor = pair.background;
								this.styles.color = pair.text;
							}
							break;
						}
						case PropertyType.Hover: {
							this.actions.set(
								'enter',
								this.createMouseEvent(pair)
							);
							this.actions.set('up', this.createMouseEvent(pair));
							break;
						}
						case PropertyType.Active: {
							this.actions.set(
								'down',
								this.createMouseEvent(pair)
							);
							break;
						}
					}
				} else {
					this.classes.push(pair.background);
					this.classes.push(pair.text);
				}
			}
		}
	}

	createMouseEvent(value: ColourPair | string): (e: MouseEvent) => void {
		return (e: MouseEvent): void => {
			const el: HTMLElement = e.target as HTMLElement;
			if (
				el.getAttribute('disabled') === undefined ||
				el.getAttribute('disabled') === null
			) {
				if (typeof value === 'string') {
					el.style.color = value;
				} else {
					const pair: ColourPair = value;
					el.style.backgroundColor = pair.background;
					el.style.color = pair.text;
				}
			}
		};
	}

	hasExisting(
		element: HTMLElement | React.ReactElement,
		type: 'foreground' | 'background'
	): boolean {
		const clazz: string | undefined =
			element instanceof HTMLElement
				? element.className
				: element.props.className;
		switch (type) {
			case 'foreground': {
				if (this.existing.has('color')) {
					return true;
				}
				if (clazz !== undefined) {
					if (
						clazz.includes('text-inherit') ||
						clazz.includes('text-current') ||
						clazz.includes('text-transparent') ||
						clazz.includes('text-black') ||
						clazz.includes('text-white')
					) {
						return true;
					}
					const regex = new RegExp('text-[a-z]*-[0-9]{2,3}');
					if (regex.test(clazz)) {
						return true;
					}
				}
				break;
			}
			case 'background': {
				if (this.existing.has('backgroundColor')) {
					return true;
				}
				if (clazz !== undefined) {
					if (
						clazz.includes('bg-inherit') ||
						clazz.includes('bg-current') ||
						clazz.includes('bg-transparent') ||
						clazz.includes('bg-black') ||
						clazz.includes('bg-white')
					) {
						return true;
					}
					const regex = new RegExp('bg-[a-z]*-[0-9]{2,3}');
					if (regex.test(clazz)) {
						return true;
					}
				}
				break;
			}
		}
		return false;
	}
}
