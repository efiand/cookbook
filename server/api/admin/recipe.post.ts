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

async function unlinkRecipeImage(imagename: string) {
	try {
		await unlink(path.resolve(imagesDir, imagename));
	} catch {
		// Do nothing
	}
}

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

		const addedImages: string[] = [];
		const newImageFiles: string[] = [];
		const pendingImages: {
			filename: string;
			sortOrder: null | number;
		}[] = [];

		if (files.length) {
			const imagePromises = files.map(async ({
				data: fileData, filename,
			}, i) => {
				let imagename = '';

				if (filename) {
					const name = `${Date.now() + i}.webp`;
					const {
						height = 0, width = 0,
					} = await sharp(fileData).metadata();
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

					let pipeline = sharp(fileData);

					if (targetWidth !== width || targetHeight !== height) {
						pipeline = pipeline.resize(
							Math.round(targetWidth),
							Math.round(targetHeight),
						);
					}

					const output = await pipeline.webp(WEBP_OPTIONS).toBuffer();

					await writeFile(path.resolve(imagesDir, name), output);
					imagename = name;
					newImageFiles.push(name);
				} else {
					imagename = fileData.toString();
				}

				pendingImages.push({
					filename: imagename,
					sortOrder: i,
				});
				addedImages.push(imagename);
			});

			await Promise.all(imagePromises);
		}

		let newRecipe: Omit<Recipe, 'images'>;

		try {
			newRecipe = await prisma.$transaction(async (tx) => {
				let savedRecipe: Omit<Recipe, 'images'>;

				if (id) {
					savedRecipe = await tx.recipes.update({
						data,
						where: { id },
					});
					await Promise.all([
						tx.images.deleteMany({ where: { recipeId: id } }),
						tx.recipesCategories
							.deleteMany({ where: { recipeId: id } }),
					]);
				} else {
					savedRecipe = await tx.recipes.create({ data });
				}

				if (recipeCategories.length) {
					await tx.recipesCategories.createMany({
						data: recipeCategories.map((categoryId) => ({
							categoryId,
							recipeId: savedRecipe.id,
						})),
					});
				}

				if (pendingImages.length) {
					await tx.images.createMany({
						data: pendingImages.map((image) => ({
							filename: image.filename,
							recipeId: savedRecipe.id,
							sortOrder: image.sortOrder,
						})),
					});
				}

				return savedRecipe;
			});
		} catch (error) {
			await Promise.all(newImageFiles.map(unlinkRecipeImage));
			throw error;
		}

		const deletePromises = recipe.images
			.filter((imagename) => !addedImages.includes(imagename))
			.map(unlinkRecipeImage);

		await Promise.all(deletePromises);

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
