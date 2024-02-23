import type { RouteLocationNormalized } from '#vue-router';

export default (route: RouteLocationNormalized) => !!schemas.id
	.validateSync({ id: route.params.id.toString() });
