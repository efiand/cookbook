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
			heading.value = 'Вход для администри&shy;рования';
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

			setDefaultPageData(category.title);
			categories.value = rawCategories.value;
			image.value = getRecipeImage(recipes.value
				.find(({
					id, images,
				}) => recipesCategories.value
					.find((recipeCategory) => recipeCategory.recipeId === id
					&& recipeCategory.categoryId === categoryId)
					&& images.length)) || constants.IMAGE;
		},
		categoriesAdmin() {
			setDefaultPageData('Редактирование категорий');
		},
		index() {
			setDefaultPageData(constants.PROJECT);
			categories.value = rawCategories.value;
		},
		recipes(recipeId: number) {
			const recipe = getRecipe(recipeId);

			if (!recipe?.structureId) {
				return;
			}

			setDefaultPageData(recipe.title);
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
			image.value = getRecipeImage(recipe) || constants.IMAGE;
		},
		recipesAdmin(recipeId: number) {
			if (recipeId) {
				getRecipe(recipeId); // Проверка наличия
			}

			setDefaultPageData(getAdminHeading('рецепта', recipeId));
			editLink.value = recipeId
				? {
					href: `/recipes/${recipeId}`,
					mode: 'back',
				}
				: null;
		},
		structures(structureId: number) {
			const structure = getStructure(structureId);
			let tempImage = getStuctureImage(structure);

			setDefaultPageData(structure.title);
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

			editLink.value = authorized.value
				? {
					href: `/admin/structures/${structureId}`,
					mode: 'edit',
				}
				: null;
			image.value = tempImage || constants.IMAGE;
		},
		structuresAdmin(structureId: number) {
			if (structureId) {
				getStructure(structureId); // Проверка наличия
			}

			setDefaultPageData(getAdminHeading('раздела', structureId));
			editLink.value = structureId
				? {
					href: `/structures/${structureId}`,
					mode: 'back',
				}
				: null;
		},
	};

	// Methods
	async function fetch() {
		const fetchData = () => {
			return $fetch('/api', { headers: useRequestHeaders(['cookie']) });
		};
		const data = (await useAsyncData('app', fetchData))
			.data.value as AppData;

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
	function getAdminHeading(text: string, id: number) {
		return `${id ? 'Редактирование' : 'Добавление'} ${text}`;
	}
	function getChildren(id: number) {
		return structures.value.filter(({ parentId }) => parentId === id);
	}
	function getParent(parentId: number) {
		return structures.value.find(({ id }) => parentId === id) as Structure;
	}
	function getRecipe(recipeId: number) {
		const recipe = recipes.value.find(({ id }) => recipeId === id);

		if (!recipe?.structureId) {
			throw createNotFoundError(
				`Рецепт с номером ${recipeId} не найден.`,
			);
		}

		return recipe;
	}
	function getRecipeImage(recipe?: Recipe) {
		if (!recipe?.images.length) {
			return null;
		}

		return `recipes/${recipe.images[0].filename}`;
	}
	function getRecipes(id: number) {
		return recipes.value.filter(({ structureId }) => structureId === id);
	}
	function getStructure(structureId: number) {
		const structure = structures.value.find(({ id }) => id === structureId);

		if (!structure) {
			throw createNotFoundError(
				`Раздел с номером ${structureId} не найден.`,
			);
		}

		return structure;
	}
	function getStuctureImage({ id }: Structure) {
		return getRecipeImage(getRecipes(id)
			.find(({ images }) => images.length));
	}
	function setDefaultPageData(heading?: string) {
		breadcrumbs.value = [];
		categories.value = null;
		editLink.value = null;
		image.value = constants.IMAGE;
		if (heading) {
			setHeadings(heading);
		}
	}
	function setHeadings(text: string) {
		heading.value = text;
		title.value = getTitle(text);
	}
	function updateCategory(category: Entity) {
		const existedCategory = rawCategories.value
			.find(({ id }) => id === category.id);

		if (existedCategory) {
			existedCategory.title = category.title;
		} else {
			rawCategories.value.push(category);
			rawCategories.value.sort(sortByTitle);
		}
	}
	function updatePage(path: string) {
		const isAdmin = path.startsWith('/admin');
		const error = useError();
		const [
			, name,
			id = -1,
		] = path.replace(/^\/admin/, '').split('/');

		if (error.value || !updateMethods[name || 'index']) {
			const { statusCode = 404 } = error.value as AppError || {};

			return setDefaultPageData(`Ошибка ${statusCode}`);
		}

		updateMethods[`${name || 'index'}${isAdmin ? 'Admin' : ''}`](+id);
	}
	function updateStructures(newStructures: Structure[]) {
		structures.value = newStructures;
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
		rawCategories,
		recipes,
		recipesCategories,
		structures,
		title,
		updateCategory,
		updatePage,
		updateStructures,
	};
});
