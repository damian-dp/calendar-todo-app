export const updateFavicon = (isDarkMode) => {
	const timestamp = new Date().getTime(); // Add a timestamp to force reload
	const faviconElements = document.querySelectorAll('link[rel*="icon"]');
	faviconElements.forEach(favicon => {
		const size = favicon.getAttribute('sizes');
		if (size === '32x32') {
			favicon.href = isDarkMode ? `/favicon-dark-32x32.png?v=${timestamp}` : `/favicon-light-32x32.png?v=${timestamp}`;
		} else if (size === '16x16') {
			favicon.href = isDarkMode ? `/favicon-dark-16x16.png?v=${timestamp}` : `/favicon-light-16x16.png?v=${timestamp}`;
		} else {
			favicon.href = isDarkMode ? `/favicon-dark.png?v=${timestamp}` : `/favicon-light.png?v=${timestamp}`;
		}
	});

	const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
	if (appleTouchIcon) {
		appleTouchIcon.href = isDarkMode ? `/apple-touch-icon-dark.png?v=${timestamp}` : `/apple-touch-icon-light.png?v=${timestamp}`;
	}

	const maskIcon = document.querySelector('link[rel="mask-icon"]');
	if (maskIcon) {
		maskIcon.href = isDarkMode ? `/safari-pinned-tab-dark.svg?v=${timestamp}` : `/safari-pinned-tab-light.svg?v=${timestamp}`;
	}
};
