export const { APP_PATH = process.cwd() } = process.env;

export const getStructures = async () => await prisma.structures.findMany({
	orderBy: [
		{ sortOrder: 'asc' },
		{ title: 'asc' },
	],
	select: {
		id: true,
		parentId: true,
		title: true,
	},
});

export const getRecipes = async () => await prisma.recipes.findMany({
	orderBy: { title: 'asc' },
	select: {
		aromachefId: true,
		id: true,
		images: {
			orderBy: { sortOrder: 'asc' },
			select: { filename: true },
		},
		structureId: true,
		title: true,
	},
});

export const getRecipesCategories = async () => await prisma.recipesCategories
	.findMany({
		select: {
			categoryId: true,
			recipeId: true,
		},
	});
