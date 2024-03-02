interface RecipeImage {
	filename: string;
}
interface RawRecipe extends Omit<Recipe, 'images'> {
	images: RecipeImage[];
}

export default (recipes: RawRecipe[]) => recipes.map((recipe) => ({
	...recipe,
	images: recipe.images.map(({ filename }: RecipeImage) => filename),
}));
