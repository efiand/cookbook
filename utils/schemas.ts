import {
	number, object, string,
} from 'yup';

const id = object({
	id: number()
		.integer('ID должен быть целочисленным')
		.required('ID обязателен для заполнения'),
});
const title = object({
	title: string()
		.required('Название обязательно для заполнения'),
});
const parentId = object({
	parentId: number()
		.nullable()
		.integer('ID родительской записи должен быть целочисленным'),
});
const entity = id.concat(title);

export default {
	auth: object({
		login: string().required('Логин обязателен для заполнения'),
		password: string().required('Пароль обязателен для заполнения'),
	}),
	entity,
	id,
	structure: entity.concat(parentId),
	title,
};
