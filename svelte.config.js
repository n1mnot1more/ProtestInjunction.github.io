import adapter from "@sveltejs/adapter-static";
import { sveltePreprocess } from "svelte-preprocess";
import autoprefixer from "autoprefixer";

const preprocess = sveltePreprocess({
	postcss: {
		plugins: [autoprefixer]
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
			fallback: "404.html",
			strict: false
		}),

		paths: {
			base: process.argv.includes("dev")
				? ""
				: "/ProtestInjunction"
		},

		prerender: {
			handleHttpError: "warn"
		}
	}
};

export default config;
