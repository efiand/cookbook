import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
	const authToken = getCookie(event, 'authToken');

	event.context.authorized = false;

	if (authToken) {
		const claims = jwt
			.verify(authToken, process.env.SECRET_INGREDIENT || '');

		if (claims) {
			event.context.authorized = true;
		}
	}

	if (!event.context.authorized && event.path.includes('/admin/')) {
		sendRedirect(event, '/auth', StatusCodes.MOVED_TEMPORARILY);
	}
});
