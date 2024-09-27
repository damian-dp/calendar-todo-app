export const updateFavicon = (isDarkMode) => {
	const favicon = document.getElementById("favicon");
	if (favicon) {
		favicon.href = isDarkMode ? "/favicon-dark.png" : "/favicon-light.png";
	}
};
