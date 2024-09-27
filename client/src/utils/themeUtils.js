export const updateThemeColor = (isDarkMode) => {
	const themeColorMeta = document.querySelector('meta[name="theme-color"]');
	if (themeColorMeta) {
		themeColorMeta.setAttribute("content", isDarkMode ? "#141414" : "#FFFFFF");
	}
};
