import type { MultiPartData } from 'h3';

import { Image } from 'imagescript';
import {
	unlink, writeFile,
} from 'node:fs/promises';
import path from 'node:path';

const imagesDir = path.resolve(APP_PATH, 'public/images/recipes');

export default defineEventHandler(async (event) => {
	try {
		const [
			rawRecipe,
			...files
		] = await readMultipartFormData(event) as MultiPartData[];

		const {
			recipe, recipeCategories,
		} = await schemas.recipe
			.validate(JSON.parse(rawRecipe.data.toString()));
		const {
			id, ingredients, method, structureId, title, url,
		} = recipe;
		const data = {
			ingredients: typografy(ingredients),
			method: typografy(method),
			structureId,
			title: typografy(title),
			url: url || null,
		};

		const createActions = [];
		const images: string[] = [];
		let newRecipe: Omit<Recipe, 'images'>;

		if (id) {
			[newRecipe] = await Promise.all([
				prisma.recipes.update({
					data,
					where: { id },
				}),
				prisma.images.deleteMany({ where: { recipeId: id } }),
				prisma.recipesCategories
					.deleteMany({ where: { recipeId: id } }),
			]);
		} else {
			newRecipe = await prisma.recipes.create({ data });
		}

		if (recipeCategories.length) {
			createActions.push(prisma.recipesCategories.createMany({
				data: recipeCategories.map((categoryId) => ({
					categoryId,
					recipeId: newRecipe.id,
				})),
			}));
		}

		if (files.length) {
			const images: {
				filename: string;
				recipeId: number;
				sortOrder: null | number;
			}[] = [];
			const promises = files.map(async ({
				data, filename,
			}, i) => {
				let imagename = '';

				if (filename) {
					const name = `${Date.now()}.webp`;
					const image = await Image.decode(data);
					const {
						height, width,
					} = image;
					const ratio = width / height;

					if (width > 800) {
						image.resize(800, 800 / ratio);
					}
					if (height > 600) {
						image.resize(600 * ratio, 600);
					}
					const output = await image.encodeWEBP(80);

					await writeFile(path.resolve(imagesDir, name), output);
					imagename = name;
				} else {
					imagename = data.toString();
				}

				images.push({
					filename: imagename,
					recipeId: newRecipe.id,
					sortOrder: i,
				});
			});

			createActions
				.push(prisma.images.createMany({ data: images }));
			await Promise.all(promises);
		}

		const deletePromises = recipe.images.map(async (imagename: string) => {
			if (!images.includes(imagename)) {
				await unlink(path.resolve(imagesDir, imagename));
			}
		});

		await Promise.all([
			...deletePromises,
			...createActions,
		]);

		const [
			recipes,
			recipesCategories,
		] = await Promise.all([
			getRecipes(),
			getRecipesCategories(),
		]);

		return {
			id: newRecipe.id,
			recipes: mapRecipes(recipes),
			recipesCategories,
		};
	} catch (error) {
		throw makeError(error as Error);
	}
});
