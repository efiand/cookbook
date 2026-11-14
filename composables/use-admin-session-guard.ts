export default () => {
	const appStore = useAppStore();

	async function refreshSession() {
		await appStore.fetch();

		return appStore.authorized;
	}

	async function redirectToAuth() {
		await navigateTo('/auth');
	}

	async function ensureSession() {
		if (await refreshSession()) {
			return true;
		}

		await redirectToAuth();

		return false;
	}

	function onVisibilityChange() {
		if (document.visibilityState !== 'visible') {
			return;
		}

		void refreshSession().then((ok) => {
			if (!ok) {
				void redirectToAuth();
			}
		});
	}

	onMounted(() => {
		document.addEventListener('visibilitychange', onVisibilityChange);
	});

	onUnmounted(() => {
		document.removeEventListener('visibilitychange', onVisibilityChange);
	});

	return {
		ensureSession,
		refreshSession,
		sessionMessage: constants.SESSION_EXPIRED_MESSAGE,
	};
};
