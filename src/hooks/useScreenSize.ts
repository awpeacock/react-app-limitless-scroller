import React from 'react';

const useScreenSize = (): ScreenSize => {
	const [screenSize, setScreenSize] = React.useState<ScreenSize>({
		width: window.innerWidth,
		height: window.innerHeight
	});

	React.useEffect(() => {
		const handleResize = (): void => {
			setScreenSize({
				width: window.innerWidth,
				height: window.innerHeight
			});
		};

		window.addEventListener('resize', handleResize);

		// Clean up the event listener when the component unmounts
		return (): void => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return screenSize;
};

export default useScreenSize;
