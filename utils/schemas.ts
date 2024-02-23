import {
	number, object, string,
} from 'yup';

const id = object().shape({
	id: number()
		.integer('ID должен быть целочисленным')
		.required('ID обязателен для заполнения'),
});
const title = object().shape({
	title: string()
		.required('Название обязательно для заполнения'),
});

export default {
	auth: object({
		login: string().required('Логин обязателен для заполнения'),
		password: string().required('Пароль обязателен для заполнения'),
	}),
	entity: id.concat(title),
	id,
	title,
};
