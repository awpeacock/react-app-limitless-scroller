import React, { MutableRefObject } from 'react';

import { Theme, ColourScheme } from '../@types/theme';
import { useScreenSize } from '../hooks';

import { Section, SectionProps } from './Section';

interface ItemsProps {
	theme: Theme;
	primary?: Nullable<string>;
	active?: Nullable<string>;
	verbose?: boolean;
	children: Array<React.ReactElement<SectionProps>>;
}

export const Items: React.FC<ItemsProps> = ({
	theme,
	primary,
	active,
	verbose,
	children
}) => {
	const container: React.MutableRefObject<HTMLDivElement> =
		React.useRef<HTMLDivElement>(
			null
		) as React.MutableRefObject<HTMLDivElement>;

	const screenSize: ScreenSize = useScreenSize();
	const schemeCount: number = theme.schemes.length;
	const sectionCount: number = React.Children.count(children);
	const names: Array<string> = [];
	for (let s = 0; s < sectionCount; s++) {
		names[s] = (children[s] as React.ReactElement).props[
			'data-url'
		] as string;
	}

	// Variables to keep track of whether all the content has rendered
	const loaded = React.useRef(0);
	const [ready, setReady] = React.useState<boolean>(false);

	// The theme can contain a padding value to pass through to each section
	const styles: { [key: string]: React.CSSProperties } = {};
	if (theme.padding) {
		styles.section = { padding: theme.padding + 'px' };
	}

	// We need to determine which of the sections passed in is the "primary"
	// (the section that will appear on the left hand side in desktop view) -
	// this can be chosen by passing the prop "primary" to the scroller with
	// the URL of the primary section.  If this prop is not set, it will be
	// the first section in the array (that is not explicitly set as the active).
	if (primary === null || primary === undefined) {
		let name: string = names[0];
		if (active !== null && active !== undefined) {
			if (active === name) {
				name = names[1];
			}
		}
		primary = name;
	}
	// We also need to know the "active" section - the section that will appear
	// on the right hand side in desktop view, or scrolled to in mobile view.
	// If the prop is not set, it should be the first section in the array in mobile
	// view or the second section in the array in desktop view.
	if (active === null || active === undefined) {
		let name: string = names[0];
		if (screenSize.width >= 1024) {
			if (primary === name) {
				name = names[1];
			}
		}
		active = name;
	}

	// We need to keep tabs on all the refs for each section, so we
	// can scroll to the active section if necessary.
	// Also, in case anybody passes in elements with the same data-url, this
	// will cause the converter to potentially get confused over the elements,
	// so we will add a counter to ensure each one is individual and the converter
	// recognises them correctly.
	const refs: Map<string, React.MutableRefObject<HTMLDivElement>> = new Map();
	for (let s = 0; s < children.length; s++) {
		const element: React.ReactElement = children[s] as React.ReactElement;
		const url: string = element.props['data-url'];
		if (!url) {
			throw Error(
				'Each child of a Scroller must have a data-url property'
			);
		}
		if (refs.has(url)) {
			throw Error(
				'Each child of a Scroller must have a unique data-url property - "' +
					url +
					'" has already been used'
			);
		}
		const ref: React.MutableRefObject<HTMLDivElement> =
			React.useRef<HTMLDivElement>(
				null
			) as React.MutableRefObject<HTMLDivElement>;
		refs.set(url, ref);
	}

	// Colour alternates between each section, and any number of colour schemes
	// can be passed into a theme.  This will determine which colour should be
	// presented for each position in the scroller.  For larger screen sizes,
	// the only colour schemes being used will be the first two (first for
	// the primary section, second for all others).
	const getColourScheme = (position: number): ColourScheme => {
		let s: number = position % schemeCount;
		const url: string = (children[position] as React.ReactElement).props[
			'data-url'
		] as string;
		if (screenSize.width >= 1024) {
			s = primary === url ? 0 : 1;
		}
		return theme.schemes[s];
	};

	// As some children may have an async method to load content, we track that
	// in the Section component - we cannot mark the Scroller as ready until
	// all the children are marked as ready; this helps ensure that any scrolling
	// goes to the correct please after all content is loaded and helps to prevent
	// any flashing as the class names/styles are applied.
	const handleChildReady: (url: string) => void = (url: string) => {
		verbose && console.log('Section "' + url + '" is ready');
		loaded.current++;
		if (loaded.current === sectionCount) {
			setReady(true);
		}
	};

	// Once all the children have finished any actions on mount and the colour
	// schems have been applied, then we reveal the Scroller, and then scroll
	// to the active section, if applicable.
	React.useEffect(() => {
		if (ready) {
			if (container && container.current) {
				verbose &&
					console.log('All content loaded - revealing scroller');
				const element = container.current;
				if (element.classList.contains('hidden')) {
					element.classList.remove('hidden');
				}
			}
			if (active && screenSize.width < 1024) {
				if (active === names[0]) {
					verbose &&
						console.log(
							'Active section "' +
								active +
								'" is first section - no need to scroll'
						);
					active = null;
					return;
				}
				if (
					refs.get(active) !== null &&
					refs.get(active) !== undefined
				) {
					const ref: MutableRefObject<HTMLElement> = refs.get(
						active
					) as MutableRefObject<HTMLElement>;
					if (ref.current) {
						verbose &&
							console.log(
								'Scrolling to section - "' + active + '"'
							);
						ref.current.scrollIntoView({
							behavior: 'smooth'
						});
					}
				}
			} else {
				active = null;
			}
		}
	}, [ready]);

	return (
		<div
			ref={container}
			className='hidden lg:flex lg:flex-row lg:max-h-screen lg:overflow-x-hidden lg:overflow-y-hidden'
			style={styles.default}>
			{children.map((child, s) => {
				const url: string = (children[s] as React.ReactElement).props[
					'data-url'
				] as string;
				let priority: number = children.length - s;
				if (screenSize.width >= 1024 && primary === url) {
					priority = children.length + 1;
				}
				return (
					<Section
						key={s}
						innerRef={refs.get(url)}
						scheme={getColourScheme(s)}
						stretch={theme.stretch}
						styles={styles}
						priority={priority}
						active={active === url}
						primary={primary === url}
						header={s > 0}
						footer={s < children.length - 1}
						onReady={handleChildReady}
						verbose={verbose}>
						{child}
					</Section>
				);
			})}
		</div>
	);
};
