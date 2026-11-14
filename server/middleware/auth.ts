import constants from '@/utils/constants';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
	const authToken = getCookie(event, 'authToken');

	event.context.authorized = false;

	if (authToken) {
		try {
			const claims = jwt.verify(
				authToken,
				process.env.SECRET_INGREDIENT || '',
			);

			if (claims) {
				event.context.authorized = true;
			}
		} catch {
			// Протухший/битый токен — остаёмся guest (authorized уже false).
		}
	}

	if (event.context.authorized) {
		return;
	}

	if (event.path.startsWith('/api/admin')) {
		throw createError({
			message: constants.SESSION_EXPIRED_MESSAGE,
			statusCode: StatusCodes.UNAUTHORIZED,
		});
	}

	if (event.path.startsWith('/admin')) {
		sendRedirect(event, '/auth', StatusCodes.MOVED_TEMPORARILY);
	}
});
