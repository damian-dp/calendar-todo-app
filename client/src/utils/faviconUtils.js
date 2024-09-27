export const updateFavicon = (isDarkMode) => {
	const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2);
	const faviconElements = document.querySelectorAll('link[rel*="icon"]');
	faviconElements.forEach(favicon => {
		const size = favicon.getAttribute('sizes');
		if (size === '32x32') {
			favicon.href = isDarkMode ? `/favicon-dark-32x32.png?v=${uniqueId}` : `/favicon-light-32x32.png?v=${uniqueId}`;
		} else if (size === '16x16') {
			favicon.href = isDarkMode ? `/favicon-dark-16x16.png?v=${uniqueId}` : `/favicon-light-16x16.png?v=${uniqueId}`;
		} else {
			favicon.href = isDarkMode ? `/favicon-dark.png?v=${uniqueId}` : `/favicon-light.png?v=${uniqueId}`;
		}
	});

	const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
	if (appleTouchIcon) {
		appleTouchIcon.href = isDarkMode ? `/apple-touch-icon-dark.png?v=${uniqueId}` : `/apple-touch-icon-light.png?v=${uniqueId}`;
	}

	const maskIcon = document.querySelector('link[rel="mask-icon"]');
	if (maskIcon) {
		maskIcon.href = isDarkMode ? `/safari-pinned-tab-dark.svg?v=${uniqueId}` : `/safari-pinned-tab-light.svg?v=${uniqueId}`;
	}
};
