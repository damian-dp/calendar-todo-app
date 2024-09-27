import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 5500,
		// Remove the proxy configuration as it's not needed for production
	},
	// Add this section for proper routing
	resolve: {
		alias: {
			'@': '/src',
		},
	},
});
