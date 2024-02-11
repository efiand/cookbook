export default defineEventHandler(async (event): Promise<RecipeContent> => {
	const id = +(getRouterParam(event, 'id') || 0);
	const recipeContent = await prisma.recipes
		.findUnique({
			select: {
				id: true,
				ingredients: true,
				method: true,
				url: true,
			},
			where: { id },
		});

	return recipeContent || {};
});
