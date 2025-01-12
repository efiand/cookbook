import {
	array, number, object, string,
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
const recipeContent = object({
	aromachefId: number()
		.transform((value, orig) => orig === '' ? undefined : value)
		.nullable()
		.positive('ID рецепта должен быть положительным')
		.integer('ID рецепта должен быть целочисленным'),
	ingredients: string()
		.required('Состав обязателен для заполнения'),
	method: string()
		.required('Приготовление обязательно для заполнения'),
	structureId: number()
		.required('Раздел должен быть указан')
		.integer('ID раздела должен быть целочисленным'),
	url: string().default(''),
}).concat(title);
const entity = id.concat(title);

export default {
	auth: object({
		login: string().required('Логин обязателен для заполнения'),
		password: string().required('Пароль обязателен для заполнения'),
	}),
	entity,
	id,
	recipe: object({
		recipe: recipeContent.concat(id)
			.concat(object({
				images: array()
					.of(string().required())
					.required(),
			})),
		recipeCategories: array()
			.of(number().required('Только числовые значения'))
			.required(),
	}),
	recipeContent,
	structure: entity.concat(parentId),
	title,
};
