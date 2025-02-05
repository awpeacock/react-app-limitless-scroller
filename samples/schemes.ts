const img = new Image();
img.src =
	'https://images.ctfassets.net/5u9bdkiurmat/3Vnk71ZvCa76dhxjgXmbzZ/fecfe34713fb6cbe4108d298d20c5f17/blue-background.jpg';

export const Valid = {
	Tailwind: {
		foregroundColour: 'text-white',
		backgroundColour: 'bg-blue-700',
		backgroundImage: img,
		headingColour: {
			default: 'text-blue-200'
		},
		subheadingColour: {
			default: 'text-blue-400'
		},
		linkColours: {
			default: 'text-teal-100',
			hover: 'hover:text-teal-300',
			active: 'active:text-teal-500',
			visited: 'visited:text-teal-700'
		},
		buttonColours: {
			default: 'bg-orange-200 text-orange-800',
			hover: 'hover:bg-orange-300 hover:text-orange-800',
			active: 'active:bg-orange-500 active:text-orange-800',
			disabled: 'disabled:bg-slate-500 disabled:text-slate-800'
		}
	},

	Stylesheet: {
		foregroundColour: '#f5e942',
		backgroundColour: '#d6180b',
		backgroundImage:
			'https://images.ctfassets.net/5u9bdkiurmat/2ezjR1lzJSRIwRLdMBcPue/b744a44a9017704b7cf8467dcea99d72/red-background.jpg',
		headingColour: {
			default: '#bf30b1'
		},
		subheadingColour: {
			default: '#f090e6'
		},
		linkColours: {
			default: '#f0d4af',
			hover: '#f2c68d',
			active: '#f0b365',
			visited: '#f29c2c'
		},
		buttonColours: {
			default: {
				background: '#ede1ec',
				text: '#290425'
			},
			hover: {
				background: '#f2ceef',
				text: '#290425'
			},
			active: {
				background: '#f0afe9',
				text: '#290425'
			},
			disabled: {
				background: '#999',
				text: '#000'
			}
		}
	},

	Mixture: {
		foregroundColour: '#ddd',
		backgroundColour: 'bg-green-700',
		linkColours: {
			default: {
				background: 'bg-lime-950',
				text: 'text-lime-300'
			},
			hover: 'hover:text-lime-200',
			active: 'active:text-lime-400'
		},
		buttonColours: {
			default: '#fff',
			hover: '#fde047',
			active: '#fefce8',
			disabled: '#333'
		}
	}
};

export const Invalid = {
	Empty: {
		foregroundColour: 'foreground',
		backgroundColour: 'background'
	},

	Mixture: {
		foregroundColour: 'text-red-100',
		backgroundColour: 'bg-white',
		buttonColours: {
			default: {
				background: 'bg-red-100',
				text: '#290425'
			},
			hover: {
				background: '#f2ceef',
				text: 'text-white-100'
			},
			active: {
				background: 'bg-red-50',
				text: '#290425'
			},
			disabled: {
				background: '#999',
				text: 'text-grey-50'
			}
		}
	},

	Attributes: {
		foregroundColour: 'text-red-100',
		backgroundColour: 'bg-white',
		buttonColours: {
			default: 'text-red-50',
			hover: 'text-red-100',
			active: 'text-red-20'
		}
	}
};

export const Theme = {
	padding: 20,
	schemes: [Valid.Tailwind, Valid.Stylesheet, Valid.Mixture]
};
