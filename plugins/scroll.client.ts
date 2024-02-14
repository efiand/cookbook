export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.hook('page:finish', () => {
		document.querySelector('.page')?.scrollTo(0, 0);
	});
});
