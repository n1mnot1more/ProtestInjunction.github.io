import adapterStatic from "@sveltejs/adapter-static";
import { sveltePreprocess } from "svelte-preprocess";
import autoprefixer from "autoprefixer";

const dev = process.argv.includes("dev");

const preprocess = sveltePreprocess({
	postcss: {
		plugins: [autoprefixer()]
	}
});

const config = {
	compilerOptions: {
		runes: true
	},

	preprocess,

	kit: {
		adapter: adapterStatic({
			pages: "docs",
			assets: "docs",
			fallback: "index.html",
			strict: false
		}),

		paths: {
			base: dev ? "" : "/ProtestInjunction"
		}
	}
};

export default config;