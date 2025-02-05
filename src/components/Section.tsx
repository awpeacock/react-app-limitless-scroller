import React from 'react';

import { ColourScheme } from '../@types/theme';
import { HTMLConverter } from '../utils';

export interface SectionProps {
	innerRef: Undefinable<React.MutableRefObject<HTMLDivElement>>;
	scheme: ColourScheme;
	stretch: Undefinable<boolean>;
	styles: { [key: string]: React.CSSProperties };
	priority: number;
	active: boolean;
	primary?: boolean;
	header: boolean;
	footer: boolean;
	onReady: (url: string) => void;
	verbose?: boolean;
	children: React.ReactElement;
}

export const Section: React.FC<SectionProps> = ({
	innerRef,
	scheme,
	stretch,
	styles,
	priority,
	active,
	primary,
	header,
	footer,
	onReady,
	verbose,
	children
}) => {
	const complete = React.useRef(false);

	// As well as the URL, you can pass in a title via data attributes
	// (to allow for consistent styling up)
	let title: Nullable<string> = null;
	if (children.props['data-title']) {
		title = children.props['data-title'];
	}

	// Another key data attribute that can be passed in is "async" -
	// this will tell us whether or not to flag this section as
	// ready on its initial render or wait for a further update
	let asynchronous = false;
	if (children.props['data-async']) {
		asynchronous = children.props['data-async'] === 'true';
	}

	// We allow both CSS inline styles and class names (preferably
	// Tailwind) to be passed in via the theme - all will be added
	// to these as we go
	const classNames: { [key: string]: Array<string> } = {
		section: ['relative', 'lg:h-screen', 'bg-cover'],
		inner: ['max-lg:pb-[75px]'],
		heading: ['text-4xl', 'xl:text-5xl', '2xl:text-6xl']
	};
	const css: { [key: string]: React.CSSProperties } = {
		section: { zIndex: priority, ...styles.section },
		inner: {},
		heading: {}
	};

	// Do we have a hex code or a Tailwind class name for our colours?
	if (scheme.foregroundColour.startsWith('#')) {
		css.section.color = scheme.foregroundColour;
	} else {
		classNames.section.push(scheme.foregroundColour);
	}
	if (scheme.backgroundColour.startsWith('#')) {
		css.section.backgroundColor = scheme.backgroundColour;
	} else {
		classNames.section.push(scheme.backgroundColour);
	}
	if (scheme.headingColour) {
		if ((scheme.headingColour.default as string).startsWith('#')) {
			css.heading.color = scheme.headingColour.default as string;
		} else {
			classNames.heading.push(scheme.headingColour.default as string);
		}
	}

	// For the background image - a) do we have one, b) is it an HTML image,
	// c) do we have a URL or d) do we have a Tailwind class name?
	if (scheme.backgroundImage) {
		if (scheme.backgroundImage instanceof HTMLImageElement) {
			css.section.backgroundImage =
				'url(' + (scheme.backgroundImage as HTMLImageElement).src + ')';
		} else if (
			(scheme.backgroundImage as string).includes('.') &&
			!(
				(scheme.backgroundImage as string).includes('(') ||
				(scheme.backgroundImage as string).includes('[')
			)
		) {
			css.section.backgroundImage =
				'url(' + (scheme.backgroundImage as string) + ')';
		} else {
			classNames.section.push(scheme.backgroundImage as string);
		}
	}

	// If this is the primary section then apply the correct styling for large media queries
	if (primary) {
		classNames.section.push(
			'lg:w-[40%] lg:min-w-[40%] lg:flex lg:flex-row lg:fixed lg:left-0 group first'
		);
	} else {
		classNames.section.push(
			'lg:fixed lg:left-[40%] lg:w-[calc(60%_+_75px)]'
		);
	}

	// If our section isn't active, then it won't be visible on large media queries
	classNames.section.push(active || primary ? 'lg:visible' : 'lg:hidden');
	// On the desktop site we need to add the divider for the primary element,
	// and add the appropriate classes for the other sections (including shunting
	// them left to overlap).
	if (primary) {
		classNames.section.push(
			'lg:[clip-path:polygon(0%_0%,0%_100%,calc(100%_-_75px)_100%,100%_0%)]'
		);
		classNames.inner.push(
			'lg:mr-[75px] lg:overflow-x-hidden lg:overflow-y-auto'
		);
	} else {
		classNames.section.push('lg:ml-[-75px] lg:overflow-y-auto');
		classNames.inner.push('lg:ml-[75px]');
	}
	// On mobile view, for all but the first section, push them back up 75px so
	// they overlap with the previous section for the diagonal crossover to work
	// (a 75px div will be added below to ensure the content is not hidden).
	if (header) {
		classNames.section.push('max-lg:mt-[-75px]');
	}
	// If we have a footer (i.e. this isn't the last section) then we need to clip around our section
	// to provide the divider.
	if (footer) {
		classNames.section.push(
			'max-lg:[clip-path:polygon(0%_0%,0%_100%,100%_calc(100%_-_75px),100%_0%)]'
		);
	}
	// Finally, determine whether we stretch the sections on mobile view to fill the viewport height.
	// If the user hasn't supplied, the default option is to stretch.
	if (stretch === undefined || stretch === true) {
		classNames.inner.push('max-lg:min-h-[calc(100vh+75px)]');
	}

	// This code is no longer used, as we catch everything now in useEffect() and apply the colours
	// to the generated HTML elements after they're added to the DOM.  That is only required because
	// this method of looping through the elements doesn't work for React components passed through,
	// only HTML elements - it can't convert the HTML in React components because, simply put, they
	// aren't HTML yet.  So, now it's converted post-mount - and this code becomes redundant and
	// counter-productive as the classes/styles would be added twice.
	// I'm leaving it here commented out though - a) out of stubbornness because it took me a
	// LOOOONG time to write it originally and b) it would still be preferable to convert BEFORE
	// mounting so as to avoid the useEffect in the parent having to unhide everything.
	/*
	let childArray: Array<React.ReactElement> = React.Children.toArray(
		children
	) as Array<React.ReactElement>;
	const converter: DOMConverter = new DOMConverter(
		childArray,
		scheme,
		verbose ?? false
	);
	childArray = converter.convert();
	*/

	React.useEffect(() => {
		// After the component has mounted, you can access the DOM,
		// so for React components we will now have HTML elements to
		// amend (and, as they're components on the DOM we can amend
		// them without having to return a replacement value).
		if (innerRef && innerRef.current) {
			// Some components may alter their content on useEffect() -
			// we need to create a method that is executed both on the
			// mount (for those that are static) and then after any observed
			// changes
			const convert: () => void = () => {
				verbose &&
					console.log(
						'Converting section "' +
							children.props['data-url'] +
							'"'
					);
				const renderedNode = innerRef.current;
				const converter: HTMLConverter = new HTMLConverter(
					renderedNode,
					scheme
				);
				const message = converter.convert();
				verbose && console.log(message);
			};
			convert();
			if (!asynchronous) {
				onReady(children.props['data-url']);
				complete.current = true;
			}

			const observer = new MutationObserver(() => {
				convert();
				onReady(children.props['data-url']);
				complete.current = true;
				observer.disconnect();
			});
			observer.observe(innerRef.current, {
				childList: true,
				subtree: true,
				characterData: true
			});
		}
	}, []);

	verbose &&
		console.log('Rendering section "' + children.props['data-url'] + '"');
	return (
		<section className={classNames.section.join(' ')} style={css.section}>
			{header && <div className='h-[75px] lg:hidden' />}
			<div ref={innerRef} className={classNames.inner.join(' ')}>
				{title && (
					<h2
						className={classNames.heading.join(' ')}
						style={css.heading}>
						{title}
					</h2>
				)}
				{children}
			</div>
		</section>
	);
};
