// https://nuxt.com/docs/api/configuration/nuxt-config

const scss = { additionalData: '@use "@/assets/scss/env" as *;' };

export default defineNuxtConfig({
	devtools: { enabled: false },
	modules: [
		'@cssninja/nuxt-toaster',
		'@nuxtjs/html-validator',
		'@pinia/nuxt',
		[
			'@vee-validate/nuxt',
			{
				componentNames: {
					ErrorMessage: 'VErrorMessage',
					Field: 'VField',
					Form: 'VForm',
				},
			},
		],
	],
	postcss: {
		plugins: {
			'autoprefixer': {},
			'postcss-sort-media-queries': {},
		},
	},
	typescript: {
		shim: false,
		strict: true,
		typeCheck: true,
	},
	vite: { css: { preprocessorOptions: { scss } } },
});
