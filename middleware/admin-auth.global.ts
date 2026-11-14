export default defineNuxtRouteMiddleware(async (to) => {
	if (!to.path.startsWith('/admin')) {
		return;
	}

	const appStore = useAppStore();

	await appStore.fetch();

	if (!appStore.authorized) {
		return navigateTo('/auth');
	}
});
