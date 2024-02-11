import type { RouteLocationNormalized } from '#vue-router';

export default (route: RouteLocationNormalized) => /^\d+$/
	.test(route.params.id.toString());
