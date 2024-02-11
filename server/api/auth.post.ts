import { compare } from 'bcrypt-ts';
import jwt from 'jsonwebtoken';

const {
	AUTH_HASH, AUTH_LOGIN, SECRET_INGREDIENT,
} = process.env;
const maxAge = 86400;
const hash = AUTH_HASH?.replaceAll('_', '$') || '';

export default defineEventHandler(async (event) => {
	try {
		const {
			login, password,
		} = await schemas.auth.validate(await readBody(event));

		if (login !== AUTH_LOGIN) {
			throw new Error('Неверный логин!');
		}

		const compared = await compare(password, hash);

		if (!compared) {
			throw new Error('Неверный пароль!');
		}

		const authToken = jwt.sign(
			{ authedUser: AUTH_LOGIN },
			SECRET_INGREDIENT as string,
			{ expiresIn: '24h' },
		);

		setCookie(event, 'authToken', authToken, {
			httpOnly: true,
			maxAge,
			sameSite: 'strict',
		});
	} catch (error) {
		throw makeError(error as Error);
	}
});
