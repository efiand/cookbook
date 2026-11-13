import type { MultiPartData } from 'h3';

import {
	unlink, writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const WEBP_OPTIONS = {
	chromaSubsampling: '4:2:0',
	effort: 4,
	quality: 75,
} as const;

sharp.cache(false);
sharp.concurrency(1);

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
			aromachefId, id, ingredients, method, structureId, title, url,
		} = recipe;
		const data = {
			aromachefId: aromachefId || null,
			ingredients: typografy(ingredients),
			method: typografy(method),
			structureId,
			title: typografy(title),
			url: url || null,
		};

		const createActions = [];
		const addedImages: string[] = [];
		let newRecipe: Omit<Recipe, 'images'>;

		if (id) {
			newRecipe = await prisma.recipes.update({
				data,
				where: { id },
			});
			await Promise.all([
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
					const name = `${Date.now() + i}.webp`;
					const {
						height = 0, width = 0,
					} = await sharp(data).metadata();
					const ratio = width / height;
					let targetWidth = width;
					let targetHeight = height;

					if (width > 800) {
						targetWidth = 800;
						targetHeight = 800 / ratio;
					}
					if (targetHeight > 600) {
						targetHeight = 600;
						targetWidth = 600 * ratio;
					}

					let pipeline = sharp(data);

					if (targetWidth !== width || targetHeight !== height) {
						pipeline = pipeline.resize(
							Math.round(targetWidth),
							Math.round(targetHeight),
						);
					}

					const output = await pipeline.webp(WEBP_OPTIONS).toBuffer();

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
				addedImages.push(imagename);
			});

			createActions
				.push(prisma.images.createMany({ data: images }));
			await Promise.all(promises);
		}

		const deletePromises = recipe.images.map(async (imagename: string) => {
			if (!addedImages.includes(imagename)) {
				try {
					await unlink(path.resolve(imagesDir, imagename));
				} catch (error) {
					// Do nothing
				}
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
