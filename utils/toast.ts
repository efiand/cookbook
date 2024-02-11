import type { NinjaToasterInstance } from '@cssninja/nuxt-toaster';

interface Options {
	duration?: number;
	error?: boolean;
}

export default (content: string, {
	duration = 5000, error = false,
}: Options = {}) => {
	const $nt = useNuxtApp().$nt as NinjaToasterInstance;
	const errorClass = error ? ' toaster__toast--error' : '';

	$nt.show({
		content,
		duration,
		theme: {
			containerClass: 'toaster',
			wrapperClass: `toaster__toast${errorClass}`,
		},
	});
};
