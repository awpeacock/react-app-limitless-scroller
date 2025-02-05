export interface Theme {
	stretch?: boolean;
	padding?: number;
	schemes: Array<ColourScheme>;
}

export interface ColourScheme {
	foregroundColour: string;
	backgroundColour: string;
	backgroundImage?: Image;
	headingColour?: ColourSet;
	subheadingColour?: ColourSet;
	linkColours?: LinkColourSet;
	buttonColours?: ButtonColourSet;
}

export type Image = HTMLImageElement | string;

export interface ColourPair {
	text: string;
	background: string;
}

export interface ColourSet {
	default: ColourPair | string;
}

export interface InteractiveColourSet extends ColourSet {
	hover: ColourPair | string;
	active: ColourPair | string;
}

export interface LinkColourSet extends InteractiveColourSet {
	visited?: string;
}

export interface ButtonColourSet extends InteractiveColourSet {
	disabled: ColourPair | string;
}
