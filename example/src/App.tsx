import React from 'react';

import { Scroller } from 'react-app-limitless-scroller';
import * as Schemes from '../../samples/schemes';

const App = (): React.ReactElement => {
	const [firstDisabled, setFirstDisabled] = React.useState<boolean>(true);
	const [secondDisabled, setSecondDisabled] = React.useState<boolean>(true);

	return (
		<Scroller.Items
			theme={Schemes.Theme}
			primary='fourth'
			active='third'
			verbose>
			<AsyncComponent data-url='async' data-async='true' />
			<div data-url='first' data-title='Example Static Section 1'>
				<p className='mb-5'>
					Content should not fill the screen height, but the theme is
					set to "stretch" so the height of each section should fill
					the window.
				</p>
				<p className='mb-5'>
					<a href='#'>
						This link does nothing other than highlight the colour
						scheme applied.
					</a>
				</p>
				<p className='mb-5 text-center'>
					<button
						name='disabled-style-toggle'
						className='rounded p-2 w-80'
						onClick={(): void => setFirstDisabled(!firstDisabled)}>
						Toggle Below Button
					</button>
				</p>
				<p className='my-5 text-center'>
					<button
						name='disabled-style-target'
						className='rounded p-2 w-80'
						disabled={firstDisabled}>
						{firstDisabled && 'Disabled'}
						{!firstDisabled && 'Enabled'}
					</button>
				</p>
			</div>
			<div data-url='second'>
				<h2 style={{ fontSize: '2.25rem', lineHeight: '2.5rem' }}>
					Example Static Section 2
				</h2>
				<p style={{ marginTop: 5, marginBottom: 5 }}>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.{' '}
					<a href='#'>
						Duis egestas, eros eu tempor lacinia, nunc ex eleifend
						arcu, ac ultricies diam turpis eget neque.
					</a>{' '}
					Praesent volutpat justo vitae nisi consectetur, id imperdiet
					erat consectetur. Donec viverra neque eu libero mollis, et
					scelerisque erat rhoncus. Nulla velit turpis, commodo vitae
					tellus sed, accumsan lobortis mauris. Duis metus ante,
					vestibulum sollicitudin pellentesque vitae, blandit
					facilisis enim. Aliquam erat volutpat. Nulla congue mi sit
					amet est placerat, at dapibus ante ullamcorper. Proin
					laoreet posuere placerat.
				</p>
				<p style={{ marginTop: 5, marginBottom: 5 }}>
					Integer suscipit mi sed enim consequat aliquam. Praesent
					rutrum ipsum id nibh interdum, id congue nulla rutrum. Etiam
					eget fermentum nisl. Etiam varius sapien leo, et imperdiet
					arcu aliquet in. Nullam vehicula ligula quis luctus
					dignissim. Duis porttitor ultrices fermentum. Cras sed
					libero tristique, pharetra tellus nec, pulvinar turpis.
				</p>
				<p
					style={{
						marginTop: 5,
						marginBottom: 5,
						textAlign: 'center'
					}}>
					<button
						name='disabled-mixture-toggle'
						style={{
							padding: 5,
							marginRight: 10,
							border: '1px solid #fff',
							borderRadius: 5,
							width: 96
						}}
						onClick={(): void =>
							setSecondDisabled(!secondDisabled)
						}>
						Toggle
					</button>
					<button
						name='disabled-mixture-target'
						style={{
							padding: 5,
							border: '1px solid #fff',
							borderRadius: 5,
							width: 96
						}}
						disabled={secondDisabled}>
						{secondDisabled && 'Disabled'}
						{!secondDisabled && 'Enabled'}
					</button>
				</p>
			</div>
			<div data-url='third' data-title='Colour Schemes'>
				<h3 className='text-xl'>First - Tailwind</h3>
				<h3 className='mb-2'>Primary (Left-hand side on desktop)</h3>
				<p className='my-1'>
					<span className='inline-block py-1 w-[200px] h-5'>
						Default Background:
					</span>{' '}
					<span className='inline-block bg-blue-700 py-1 w-[86px] h-5' />
				</p>
				<p className='my-1'>
					<span className='inline-block py-1 w-[200px] h-5'>
						Default Foreground:
					</span>{' '}
					<span className='inline-block bg-white py-1 w-[86px] h-5' />
				</p>
				<p className='my-1'>
					<span className='inline-block py-1 w-[200px] h-5'>
						H2 Colour:
					</span>{' '}
					<span className='inline-block bg-blue-200 py-1 w-[86px] h-5' />
				</p>
				<p className='my-1'>
					<span className='inline-block py-1 w-[200px] h-5'>
						H3 Colour:
					</span>{' '}
					<span className='inline-block bg-blue-400 py-1 w-[86px] h-5' />
				</p>
				<p className='my-1'>
					<span className='inline-block py-1 w-[200px] h-5'>
						Link Colours:
					</span>{' '}
					<span className='inline-block bg-teal-100 mr-[2px] w-5 h-5' />
					<span className='inline-block bg-teal-300 mr-[2px] w-5 h-5' />
					<span className='inline-block bg-teal-500 mr-[2px] w-5 h-5' />
					<span className='inline-block bg-teal-700 mr-[2px] w-5 h-5' />
				</p>
				<p className='my-1'>
					<span className='inline-block py-1 w-[200px] h-5'>
						Button Backgrounds:
					</span>{' '}
					<span className='inline-block bg-orange-200 mr-[2px] w-5 h-5' />
					<span className='inline-block bg-orange-300 mr-[2px] w-5 h-5' />
					<span className='inline-block bg-orange-500 mr-[2px] w-5 h-5' />
					<span className='inline-block bg-slate-500 w-5 h-5' />
				</p>
				<p className='my-1'>
					<span className='inline-block py-1 w-[200px] h-5'>
						Button Foregrounds:
					</span>{' '}
					<span className='inline-block bg-orange-800 mr-[2px] w-5 h-5' />
					<span className='inline-block bg-slate-800 w-5 h-5' />
				</p>
				<h3 className='text-xl'>Second - CSS</h3>
				<h3 className='mb-2'>Active (Right-hand side on desktop)</h3>
				<p className='my-1'>
					<span className='inline-block py-1 w-[200px] h-5'>
						Default Background:
					</span>{' '}
					<span
						className='inline-block py-1 w-[86px] h-5'
						style={{ backgroundColor: '#d6180b' }}
					/>
				</p>
				<p className='my-1'>
					<span className='inline-block py-1 w-[200px] h-5'>
						Default Foreground:
					</span>{' '}
					<span
						className='inline-block py-1 w-[86px] h-5'
						style={{ backgroundColor: '#f5e942' }}
					/>
				</p>
				<p className='my-1'>
					<span className='inline-block py-1 w-[200px] h-5'>
						H2 Colour:
					</span>{' '}
					<span
						className='inline-block py-1 w-[86px] h-5'
						style={{ backgroundColor: '#bf30b1' }}
					/>
				</p>
				<p className='my-1'>
					<span className='inline-block py-1 w-[200px] h-5'>
						H3 Colour:
					</span>{' '}
					<span
						className='inline-block py-1 w-[86px] h-5'
						style={{ backgroundColor: '#f090e6' }}
					/>
				</p>
				<p className='my-1'>
					<span className='inline-block py-1 w-[200px] h-5'>
						Link Colours:
					</span>{' '}
					<span
						className='inline-block mr-[2px] w-5 h-5'
						style={{ backgroundColor: '#f0d4af' }}
					/>
					<span
						className='inline-block mr-[2px] w-5 h-5'
						style={{ backgroundColor: '#f2c68d' }}
					/>
					<span
						className='inline-block mr-[2px] w-5 h-5'
						style={{ backgroundColor: '#f0b365' }}
					/>
					<span
						className='inline-block mr-[2px] w-5 h-5'
						style={{ backgroundColor: '#f29c2c' }}
					/>
				</p>
				<p className='my-1'>
					<span className='inline-block py-1 w-[200px] h-5'>
						Button Backgrounds:
					</span>{' '}
					<span
						className='inline-block mr-[2px] w-5 h-5'
						style={{ backgroundColor: '#ede1ec' }}
					/>
					<span
						className='inline-block mr-[2px] w-5 h-5'
						style={{ backgroundColor: '#f2ceef' }}
					/>
					<span
						className='inline-block mr-[2px] w-5 h-5'
						style={{ backgroundColor: '#f0afe9' }}
					/>
					<span
						className='inline-block w-5 h-5'
						style={{ backgroundColor: '#999' }}
					/>
				</p>
				<p className='my-1'>
					<span className='inline-block py-1 w-[200px] h-5'>
						Button Foregrounds:
					</span>{' '}
					<span
						className='inline-block mr-[2px] w-5 h-5'
						style={{ backgroundColor: '#290425' }}
					/>
					<span
						className='inline-block w-5 h-5'
						style={{ backgroundColor: '#000' }}
					/>
				</p>
				<h3 className='mb-2 text-xl'>Third - Mixed</h3>
				<p className='my-1'>
					<span className='inline-block py-1 w-[200px] h-5'>
						Default Background:
					</span>{' '}
					<span className='inline-block bg-green-700 py-1 w-[86px] h-5' />
				</p>
				<p className='my-1'>
					<span className='inline-block py-1 w-[200px] h-5'>
						Default Foreground:
					</span>{' '}
					<span
						className='inline-block py-1 w-[86px] h-5'
						style={{ backgroundColor: '#ddd' }}
					/>
				</p>
				<p className='my-1'>
					<span className='inline-block py-1 w-[200px] h-5'>
						Link Colours:
					</span>{' '}
					<span className='inline-block bg-lime-300 mr-[2px] w-5 h-5' />
					<span className='inline-block bg-lime-200 mr-[2px] w-5 h-5' />
					<span className='inline-block bg-lime-400 mr-[2px] w-5 h-5' />
				</p>
				<p className='my-1'>
					<span className='inline-block py-1 w-[200px] h-5'>
						Button Foregrounds:
					</span>{' '}
					<span
						className='inline-block mr-[2px] w-5 h-5'
						style={{ backgroundColor: '#fff' }}
					/>
					<span
						className='inline-block mr-[2px] w-5 h-5'
						style={{ backgroundColor: '#fde047' }}
					/>
					<span
						className='inline-block mr-[2px] w-5 h-5'
						style={{ backgroundColor: '#fefce8' }}
					/>
					<span
						className='inline-block w-5 h-5'
						style={{ backgroundColor: '#333' }}
					/>
				</p>
			</div>
			<PrimaryComponent
				data-url='fourth'
				data-title='React Limitless Scroller'
			/>
			<StaticComponent data-url='fifth' />
		</Scroller.Items>
	);
};

const PrimaryComponent = (): React.ReactElement => {
	const [disabled, setDisabled] = React.useState<boolean>(true);
	return (
		<div>
			<h3 className='my-2 text-xl text-yellow-100'>
				Apply consistent styling to all your React components and/or
				HTML sections
			</h3>
			<p className='mb-2 text-yellow-50'>
				Setup colour schemes, set a primary and active section and let
				the <strong>Limitless Scroller</strong> do the rest. Works with
				both CSS classes and styles, hover states, active states and
				disabled states, as all evidenced by this example. If you set
				classes or styles in your actual content this will persist and
				not be overridden, such as all the content in this section which
				will retain their yellow tinge (or lime for the links/buttons).
			</p>
			<p className='mb-2'>
				<a
					href='#'
					className='text-lime-50 hover:text-lime-200 active:text-lime-400'>
					This link demonstrates explicitly set classes not being
					overridden for a link.
				</a>
			</p>
			<h3 className='my-2 text-xl text-yellow-100'>State functions</h3>
			<p className='mb-2 text-yellow-50'>
				These buttons also have explicitly set classes.
			</p>
			<p className='mb-2'>
				<button
					name='disabled-component-toggle'
					className='mr-2 p-2 w-1/3 text-lime-50 bg-lime-500'
					onClick={(): void => setDisabled(!disabled)}>
					Toggle
				</button>
				<button
					name='disabled-component-target'
					className='p-2 w-1/3 text-lime-50 bg-lime-500 disabled:text-slate-50 disabled:bg-slate-500'
					disabled={disabled}>
					{disabled && 'Disabled'}
					{!disabled && 'Enabled'}
				</button>
			</p>
		</div>
	);
};

const StaticComponent = (): React.ReactElement => {
	return (
		<div>
			<h3
				style={{
					fontSize: '1.25rem',
					color: '#0d0',
					marginBottom: '1.25rem'
				}}>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
				nulla augue, vulputate et hendrerit malesuada, faucibus quis
				purus.
			</h3>
			<p style={{ color: '#fff', marginBottom: '1.25rem' }}>
				Curabitur ac suscipit dolor. Aliquam pretium sodales lectus vel
				pellentesque. Proin egestas vitae orci quis pretium. Nullam vel
				aliquam nunc, ut hendrerit orci. Fusce vitae convallis metus.
				Sed at purus id mi congue maximus sit amet eu elit. Suspendisse
				potenti. Aliquam varius accumsan arcu, interdum ullamcorper
				lectus ultrices ut. Praesent lacinia enim at suscipit
				vestibulum. Aliquam volutpat mollis felis, id tincidunt magna
				feugiat at.
			</p>
			<p className='mb-10 text-lime-500'>
				Curabitur non elit et nulla interdum porttitor. Phasellus in
				erat eu felis efficitur pharetra ut sed massa. Quisque lacus
				diam, sagittis in tristique quis, tincidunt vel erat. Maecenas
				mattis et mauris vel bibendum. In quis nunc vel dolor
				pellentesque luctus eget eget sem. Nulla dignissim faucibus est
				ac eleifend. Pellentesque libero lacus, vehicula a magna eget,
				egestas condimentum massa. Morbi ultricies tincidunt ligula, non
				imperdiet nulla vehicula nec. Etiam sit amet nunc id diam
				maximus maximus. Nam in metus nulla. Lorem ipsum dolor sit amet,
				consectetur adipiscing elit. In mollis metus sed mauris egestas
				interdum. Interdum et malesuada fames ac ante ipsum primis in
				faucibus. Pellentesque quis nibh aliquam, sagittis sapien non,
				mollis mi. Nullam diam risus, maximus non erat et, fermentum
				varius purus.
			</p>
			<p className='mb-10'>
				Phasellus iaculis velit nec maximus tincidunt. Nulla diam
				turpis, aliquet sit amet bibendum vitae, ultrices a neque. In
				semper risus vitae leo ullamcorper laoreet. Vestibulum sed dolor
				interdum, vehicula diam at, scelerisque nunc. Etiam malesuada
				aliquam sapien in gravida. Curabitur hendrerit eu ante et
				congue. Nunc blandit a felis vel interdum. Morbi accumsan nisl
				fermentum, semper tellus vel, accumsan leo. In in neque
				vestibulum ante vehicula mollis at auctor lacus.
			</p>
			<p className='mb-10'>
				Proin hendrerit cursus ligula volutpat consectetur. Proin ut
				risus vitae nunc imperdiet efficitur quis sed ex. Praesent
				rhoncus urna nec viverra fringilla. In eget turpis vestibulum,
				fermentum eros eget, porttitor turpis. Quisque vel viverra est.
				Sed bibendum tempor urna, eget aliquam ligula ultrices sit amet.
				Mauris ac venenatis nibh, nec ullamcorper urna. Cras nisi magna,
				fringilla commodo ex nec, luctus molestie dui. In dapibus, nisi
				eu commodo ultricies, dui orci luctus libero, vitae accumsan
				lacus lorem id leo. Duis elementum sem scelerisque velit
				facilisis, id hendrerit massa posuere. Phasellus venenatis, mi
				sit amet consequat sagittis, elit urna euismod enim, ac rutrum
				nisi metus ut nisl. Donec pretium nisl a purus scelerisque, in
				finibus augue faucibus.
			</p>
			<p className='mb-10'>
				Fusce massa nibh, dignissim sed bibendum nec, mattis vitae
				sapien. Integer sem risus, venenatis quis lectus ac, posuere
				luctus tortor. Fusce vulputate nunc eget lorem molestie lacinia.
				Mauris volutpat ultrices tempor. Nulla facilisi. Praesent non
				accumsan magna. In non sem interdum, aliquam dui eget, convallis
				nisi. Ut at laoreet neque. In vitae nibh eleifend, egestas
				sapien in, molestie mauris.
			</p>
		</div>
	);
};

const AsyncComponent = (): React.ReactElement => {
	const [content, setContent] = React.useState<React.ReactElement>(
		<div>
			<p>Original content</p>
		</div>
	);

	React.useEffect(() => {
		// Delay for a couple of seconds to simulate RESTful call
		// and demonstrate correct scrolling
		setTimeout(() => {
			setContent(
				<div>
					<h3 className='mb-4 text-xl'>Revised content</h3>
					<p className='mb-4'>
						Curabitur ac suscipit dolor. Aliquam pretium sodales
						lectus vel pellentesque. Proin egestas vitae orci quis
						pretium. Nullam vel aliquam nunc, ut hendrerit orci.
						Fusce vitae convallis metus. Sed at purus id mi congue
						maximus sit amet eu elit. Suspendisse potenti. Aliquam
						varius accumsan arcu, interdum ullamcorper lectus
						ultrices ut. Praesent lacinia enim at suscipit
						vestibulum. Aliquam volutpat mollis felis, id tincidunt
						magna feugiat at.
					</p>
					<p className='mb-4'>
						Curabitur ac suscipit dolor. Aliquam pretium sodales
						lectus vel pellentesque. Proin egestas vitae orci quis
						pretium. Nullam vel aliquam nunc, ut hendrerit orci.
						Fusce vitae convallis metus. Sed at purus id mi congue
						maximus sit amet eu elit. Suspendisse potenti. Aliquam
						varius accumsan arcu, interdum ullamcorper lectus
						ultrices ut. Praesent lacinia enim at suscipit
						vestibulum. Aliquam volutpat mollis felis, id tincidunt
						magna feugiat at.
					</p>
					<p className='mb-4'>
						Curabitur ac suscipit dolor. Aliquam pretium sodales
						lectus vel pellentesque. Proin egestas vitae orci quis
						pretium. Nullam vel aliquam nunc, ut hendrerit orci.
						Fusce vitae convallis metus. Sed at purus id mi congue
						maximus sit amet eu elit. Suspendisse potenti. Aliquam
						varius accumsan arcu, interdum ullamcorper lectus
						ultrices ut. Praesent lacinia enim at suscipit
						vestibulum. Aliquam volutpat mollis felis, id tincidunt
						magna feugiat at.
					</p>
					<p className='mb-4'>
						Curabitur ac suscipit dolor. Aliquam pretium sodales
						lectus vel pellentesque. Proin egestas vitae orci quis
						pretium. Nullam vel aliquam nunc, ut hendrerit orci.
						Fusce vitae convallis metus. Sed at purus id mi congue
						maximus sit amet eu elit. Suspendisse potenti. Aliquam
						varius accumsan arcu, interdum ullamcorper lectus
						ultrices ut. Praesent lacinia enim at suscipit
						vestibulum. Aliquam volutpat mollis felis, id tincidunt
						magna feugiat at.
					</p>
					<p className='mb-4'>
						Curabitur ac suscipit dolor. Aliquam pretium sodales
						lectus vel pellentesque. Proin egestas vitae orci quis
						pretium. Nullam vel aliquam nunc, ut hendrerit orci.
						Fusce vitae convallis metus. Sed at purus id mi congue
						maximus sit amet eu elit. Suspendisse potenti. Aliquam
						varius accumsan arcu, interdum ullamcorper lectus
						ultrices ut. Praesent lacinia enim at suscipit
						vestibulum. Aliquam volutpat mollis felis, id tincidunt
						magna feugiat at.
					</p>
					<p className='mb-4'>
						Curabitur ac suscipit dolor. Aliquam pretium sodales
						lectus vel pellentesque. Proin egestas vitae orci quis
						pretium. Nullam vel aliquam nunc, ut hendrerit orci.
						Fusce vitae convallis metus. Sed at purus id mi congue
						maximus sit amet eu elit. Suspendisse potenti. Aliquam
						varius accumsan arcu, interdum ullamcorper lectus
						ultrices ut. Praesent lacinia enim at suscipit
						vestibulum. Aliquam volutpat mollis felis, id tincidunt
						magna feugiat at.
					</p>
					<p className='mb-4'>
						Curabitur ac suscipit dolor. Aliquam pretium sodales
						lectus vel pellentesque. Proin egestas vitae orci quis
						pretium. Nullam vel aliquam nunc, ut hendrerit orci.
						Fusce vitae convallis metus. Sed at purus id mi congue
						maximus sit amet eu elit. Suspendisse potenti. Aliquam
						varius accumsan arcu, interdum ullamcorper lectus
						ultrices ut. Praesent lacinia enim at suscipit
						vestibulum. Aliquam volutpat mollis felis, id tincidunt
						magna feugiat at.
					</p>
					<p className='mb-4'>
						Curabitur ac suscipit dolor. Aliquam pretium sodales
						lectus vel pellentesque. Proin egestas vitae orci quis
						pretium. Nullam vel aliquam nunc, ut hendrerit orci.
						Fusce vitae convallis metus. Sed at purus id mi congue
						maximus sit amet eu elit. Suspendisse potenti. Aliquam
						varius accumsan arcu, interdum ullamcorper lectus
						ultrices ut. Praesent lacinia enim at suscipit
						vestibulum. Aliquam volutpat mollis felis, id tincidunt
						magna feugiat at.
					</p>
				</div>
			);
		}, 1000);
	}, []);

	return <div>{content}</div>;
};

export default App;
