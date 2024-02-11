import {
	object, string,
} from 'yup';

export default {
	auth: object({
		login: string().required(),
		password: string().required(),
	}),
};
