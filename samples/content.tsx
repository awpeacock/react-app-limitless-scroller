import React from 'react';

export const AsyncComponent = (): React.ReactElement => {
	const [content, setContent] = React.useState('Asynchronous content');
	React.useEffect(() => {
		// Delay by a second to give our tests a chance to test BEFORE it completes
		setTimeout(() => {
			setContent('New content');
		}, 1000);
	});
	return (
		<p data-title='This is my title' data-async='true'>
			{content}
		</p>
	);
};

export const ReactElements: { [key: string]: React.ReactElement } = {
	Plain: (
		<div>
			<h2 className='p-2'>This is the H2</h2>
			<h3 style={{ padding: 10 }}>This is the H3</h3>
			<p>
				<a href='#'>This is the A</a>
			</p>
			<p>
				<button>This is the BUTTON</button>
			</p>
			<p>
				<input type='button'>This is the INPUT</input>
			</p>
			<p>
				<input type='submit'>This is the SUBMIT</input>
			</p>
			<p>
				<input type='password' />
			</p>
		</div>
	),
	ExistingClasses: (
		<div>
			<h2 className='p-2 text-purple-200'>This is the H2</h2>
			<h3 style={{ padding: 10 }}>This is my H3 with a style set</h3>
			<p>
				<a href='#' className='text-purple-400'>
					This is the A
				</a>
			</p>
			<p>
				<button className='text-purple-600 bg-pink-400'>
					This is the BUTTON
				</button>
			</p>
		</div>
	),
	ExistingStyles: (
		<div>
			<h2 className='p-2'>This is the H2</h2>
			<h3 style={{ padding: 10, color: '#a00' }}>
				This is my H3 with a style set
			</h3>
			<p>
				<a href='#' style={{ color: '#0a0' }}>
					This is the A
				</a>
			</p>
			<p>
				<button style={{ color: '#00a', backgroundColor: '#a0a' }}>
					This is the BUTTON
				</button>
			</p>
		</div>
	)
};

export const HTML: {
	reset: Function;
	parent: HTMLDivElement;
	h2: HTMLHeadingElement;
	h3: HTMLHeadingElement;
	p: HTMLParagraphElement;
	a: HTMLAnchorElement;
	button: HTMLButtonElement;
	disabled: HTMLButtonElement;
	input: HTMLInputElement;
	submit: HTMLInputElement;
	password: HTMLInputElement;
} = {
	parent: document.createElement('div'),
	h2: document.createElement('h2'),
	h3: document.createElement('h3'),
	p: document.createElement('p'),
	a: document.createElement('a'),
	button: document.createElement('button'),
	disabled: document.createElement('button'),
	input: document.createElement('input'),
	submit: document.createElement('input'),
	password: document.createElement('input'),
	reset: () => {
		HTML.parent = document.createElement('div');
		HTML.h2 = document.createElement('h2');
		HTML.h2.className = 'p-2';
		HTML.h3 = document.createElement('h3');
		HTML.h3.setAttribute('style', 'margin: 10px');
		HTML.p = document.createElement('p');
		HTML.a = document.createElement('a');
		HTML.button = document.createElement('button');
		HTML.button.setAttribute(
			'style',
			'border-radius: 5px; border: 1px solid red'
		);
		HTML.disabled = document.createElement('button');
		HTML.input = document.createElement('input');
		HTML.submit = document.createElement('input');
		HTML.password = document.createElement('input');

		HTML.parent.appendChild(HTML.h2);
		HTML.h2.innerHTML = 'This is the H2';

		HTML.parent.appendChild(HTML.h3);
		HTML.h3.innerHTML = 'This is the H3';

		HTML.parent.appendChild(HTML.p);
		HTML.p.appendChild(HTML.a);
		HTML.a.href = 'test';
		HTML.a.innerHTML = 'This is the A';
		HTML.p.appendChild(HTML.button);
		HTML.button.innerHTML = 'This is the BUTTON';
		HTML.p.appendChild(HTML.disabled);
		HTML.disabled.setAttribute('disabled', 'disabled');
		HTML.disabled.innerHTML = 'This is the DISABLED BUTTON';
		HTML.p.appendChild(HTML.input);
		(HTML.input as HTMLInputElement).type = 'button';
		(HTML.input as HTMLInputElement).value = 'This is the INPUT';
		HTML.p.appendChild(HTML.submit);
		(HTML.submit as HTMLInputElement).type = 'submit';
		(HTML.submit as HTMLInputElement).value = 'This is the SUBMIT';
		HTML.p.appendChild(HTML.password);
		(HTML.password as HTMLInputElement).type = 'password';
		(HTML.password as HTMLInputElement).value = 'This is the PASSWORD';
	}
};
