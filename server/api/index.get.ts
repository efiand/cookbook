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
		getRecipes(),
		getRecipesCategories(),
		getStructures(),
	]);

	return {
		authorized,
		categories,
		recipes: mapRecipes(recipes),
		recipesCategories,
		structures,
	};
});
