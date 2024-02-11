export default defineEventHandler(async (event): Promise<AppData> => {
	const { authorized } = event.context;

	const [
		categories,
		recipes,
		recipesCategories,
		structures,
	] = await Promise.all([
		prisma.categories.findMany({
			orderBy: { title: 'asc' },
			select: {
				id: true,
				title: true,
			},
		}),
		prisma.recipes.findMany({
			orderBy: { title: 'asc' },
			select: {
				id: true,
				images: {
					orderBy: { sortOrder: 'asc' },
					select: {
						filename: true,
						sortOrder: true,
					},
				},
				structureId: true,
				title: true,
			},
		}),
		prisma.recipesCategories.findMany({
			select: {
				categoryId: true,
				recipeId: true,
			},
		}),
		prisma.structures.findMany({
			orderBy: [
				{ sortOrder: 'asc' },
				{ title: 'asc' },
			],
			select: {
				id: true,
				parentId: true,
				title: true,
			},
		}),
	]);

	return {
		authorized,
		categories,
		recipes,
		recipesCategories,
		structures,
	};
});
