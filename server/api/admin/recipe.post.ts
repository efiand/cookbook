import type { MultiPartData } from 'h3';

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
			ingredients, // TODO typograf
			method, // TODO typograf
			structureId,
			title: capitalize(title), // TODO:
			// capitalize && typograph -> prepareTitle()
			url: url || null,
		};

		const deleteActions = [];
		const createActions = [];
		let newRecipe: Omit<Recipe, 'images'>;

		if (id) {
			if (recipeCategories.length) {
				deleteActions.push(
					prisma.recipesCategories
						.deleteMany({ where: { recipeId: id } }),
				);
			}
			if (files.length && recipe.images.length) {
				deleteActions.push(
					prisma.images.deleteMany({ where: { recipeId: id } }),
				);
			}
			[newRecipe] = await Promise.all([
				prisma.recipes.update({
					data,
					where: { id },
				}),
				...deleteActions,
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
			const images: string[] = [];

			files.forEach(({
				data, filename, type,
			}) => {
				if (filename) {
					console.log(type);
				} else {
					images.push(data.toString());
				}
			});
			if (images.length) {
				createActions.push(prisma.images.createMany({
					data: images
						.map((filename) => ({
							filename,
							recipeId: id,
						})),
				}));
			}
		}
		if (createActions.length) {
			await Promise.all(createActions);
		}

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
