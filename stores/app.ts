export const useAppStore = defineStore('appStore', () => {
	// С сервера
	const authorized: Ref<boolean> = ref(false);
	const rawCategories: Ref<Entity[]> = ref([]);
	const recipes: Ref<Recipe[]> = ref([]);
	const recipesCategories: Ref<RecipeCategory[]> = ref([]);
	const structures: Ref<Structure[]> = ref([]);

	// Мзменяемые по типам страниц
	const breadcrumbs: Ref<Entity[] | null> = ref(null);
	const categories: Ref<Entity[] | null> = ref(null);
	const editLink: Ref<IconLink | null> = ref(null);
	const heading: Ref<string> = ref(constants.PROJECT);
	const image: Ref<string> = ref(constants.IMAGE);
	const title: Ref<string> = ref(constants.PROJECT);

	const updateMethods: { [method: string]: (id: number) => void } = {
		auth() {
			setDefaultPageData();
			heading.value = 'Вход для администрирования';
			title.value = getTitle('Вход');
		},
		categories(categoryId: number) {
			const category = rawCategories.value
				.find(({ id }) => id === categoryId);

			if (!category) {
				throw createNotFoundError(
					`Категория с номером ${categoryId} не найдена.`,
				);
			}

			breadcrumbs.value = [];
			categories.value = rawCategories.value;
			editLink.value = authorized.value
				? {
					href: '/admin/categories',
					mode: 'edit',
				}
				: null;
			heading.value = category.title;
			image.value = getRecipeImage(recipes.value
				.find(({
					id, images,
				}) => recipesCategories.value
					.find((recipeCategory) => recipeCategory.recipeId === id
					&& recipeCategory.categoryId === categoryId)
					&& images.length)) || constants.IMAGE;
			title.value = getTitle(category.title);
		},
		error(statusCode) {
			const error = `Ошибка ${statusCode}`;

			setDefaultPageData();
			heading.value = error;
			title.value = getTitle(error);
		},
		index() {
			setDefaultPageData();
			categories.value = rawCategories.value;
			heading.value = constants.PROJECT;
			title.value = constants.PROJECT;
		},
		recipes(recipeId: number) {
			const recipe = getRecipe(recipeId);

			if (!recipe?.structureId) {
				throw createNotFoundError(
					`Рецепт с номером ${recipeId} не найден.`,
				);
			}

			const structure = getStructure(recipe.structureId) as Structure;

			if (structure.parentId === null) {
				breadcrumbs.value = [];
			} else {
				breadcrumbs.value = [getParent(structure.parentId)];
			}
			breadcrumbs.value.push(structure);

			const actualCategories = rawCategories.value.filter(({ id }) => {
				return recipesCategories.value.find((recipeCategory) => {
					return recipeCategory.categoryId === id
						&& recipeCategory.recipeId === recipeId;
				});
			});

			categories.value = actualCategories.length
				? actualCategories
				: null;
			editLink.value = authorized.value
				? {
					href: `/admin/recipes/${recipeId}`,
					mode: 'edit',
				}
				: null;
			heading.value = recipe.title;
			image.value = getRecipeImage(recipe) || constants.IMAGE;
			title.value = getTitle(recipe.title);
		},
		structures(structureId: number) {
			const structure = getStructure(structureId);

			if (!structure) {
				throw createNotFoundError(
					`Раздел с номером ${structureId} не найден.`,
				);
			}

			let tempImage = getStuctureImage(structure);

			if (structure.parentId === null) {
				const children = getChildren(structure.id);

				if (!tempImage) {
					const targetStructure = children.find(getStuctureImage);

					if (targetStructure) {
						tempImage = getStuctureImage(targetStructure);
					}
				}

				breadcrumbs.value = [];
			} else {
				breadcrumbs.value = [getParent(structure.parentId)];
			}
			breadcrumbs.value.push(structure);

			categories.value = null;
			editLink.value = authorized.value
				? {
					href: `/admin/structures/${structureId}`,
					mode: 'edit',
				}
				: null;
			heading.value = structure.title;
			image.value = tempImage || constants.IMAGE;
			title.value = getTitle(structure.title);
		},
	};

	// Methods
	async function fetch() {
		const fetchData = () => {
			return $fetch('/api', { headers: useRequestHeaders(['cookie']) });
		};
		const data: AppData = (await useAsyncData('app', fetchData))
			.data.value || {} as AppData;

		authorized.value = data.authorized;
		rawCategories.value = data.categories;
		recipes.value = data.recipes;
		recipesCategories.value = data.recipesCategories;
		structures.value = data.structures;
	}
	async function fillRecipe(recipeId: number) {
		const url = `/api/recipes/${recipeId}`;
		const res = await useAsyncData('recipe', () => $fetch(url));
		const data: RecipeContent = res.data.value || {} as RecipeContent;
		const i = recipes.value.findIndex(({ id }) => recipeId === id);

		Object.assign(recipes.value[i], data);

		return recipes.value[i];
	}
	function updatePage(path: string) {
		const error = useError();
		const [
			, name,
			id = -1,
		] = path.split('/');

		if (error.value || !updateMethods[name || 'index']) {
			const { statusCode = 404 } = error.value as AppError || {};

			return updateMethods.error(statusCode);
		}

		updateMethods[name || 'index'](+id);
	}
	function getChildren(id: number) {
		return structures.value.filter(({ parentId }) => parentId === id);
	}
	function getParent(parentId: number) {
		return structures.value.find(({ id }) => parentId === id) as Structure;
	}
	function getRecipe(recipeId: number) {
		return recipes.value.find(({ id }) => recipeId === id);
	}
	function getRecipes(id: number) {
		return recipes.value.filter(({ structureId }) => structureId === id);
	}
	function getStructure(structureId: number) {
		return structures.value.find(({ id }) => id === structureId);
	}
	function getStuctureImage({ id }: Structure) {
		return getRecipeImage(getRecipes(id)
			.find(({ images }) => images.length));
	}
	function getRecipeImage(recipe?: Recipe) {
		if (!recipe?.images.length) {
			return null;
		}

		return `recipes/${recipe.images[0].filename}`;
	}
	function setDefaultPageData() {
		breadcrumbs.value = [];
		categories.value = null;
		editLink.value = null;
		image.value = constants.IMAGE;
	}

	return {
		authorized,
		breadcrumbs,
		categories,
		editLink,
		fetch,
		fillRecipe,
		heading,
		image,
		recipes,
		recipesCategories,
		structures,
		title,
		updatePage,
	};
});
