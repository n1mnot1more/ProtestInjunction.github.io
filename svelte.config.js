import adapter from "@sveltejs/adapter-static";
import { sveltePreprocess } from "svelte-preprocess";
import autoprefixer from "autoprefixer";

const dev = process.argv.includes("dev");

const preprocess = sveltePreprocess({
	postcss: {
		plugins: [autoprefixer()]
	}
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: true
	},

	preprocess,

	kit: {
		adapter: adapter({
			pages: "docs",
			assets: "docs",
			fallback: "index.html",
			strict: false
		}),

		paths: {
			base: dev ? "" : "/ProtestInjunction"
		},

		trailingSlash: "always",

		prerender: {
			handleHttpError: "warn"
		}
	}
};

export default config;
