<template>
  <v-form
    :on-submit="submit"
    :validation-schema="schema"
    class="admin-recipe"
    v-slot="{ errors }"
  >
    <form-item
      alias="recipe"
      label="Название"
      name="title"
      required
      v-model="recipe.title"
      v-slot="{ id, field, invalid }"
    >
      <form-input
        :field="field"
        :id="id"
        :invalid="invalid"
      />
    </form-item>
    <form-item
      alias="recipe"
      label="Раздел"
      name="structureId"
      required
      v-model="recipe.structureId"
      v-slot="{ id, field, invalid }"
    >
      <form-select
        :field="field"
        :id="id"
        :invalid="invalid"
        :options="getStructuresOptions()"
      />
    </form-item>
    <form-item
      alias="recipe"
      label="Категории"
      name="categories"
      v-model="recipeCategories"
      v-slot="{ id, field }"
    >
      <form-select
        :field="field"
        :id="id"
        :options="getCategoriesOptions()"
        multi
      />
    </form-item>
    <form-item-wysiwyg
      :error="errors.ingredients"
      alias="recipe"
      label="Состав"
      name="ingredients"
      required
      v-model="recipe.ingredients"
    />
    <form-item-wysiwyg
      :error="errors.method"
      alias="recipe"
      label="Приготовление"
      name="method"
      required
      v-model="recipe.method"
    />
    <form-item
      alias="recipe"
      label="Ссылки"
      name="url"
      v-model="recipe.url"
      v-slot="{ id, field }"
    >
      <form-input
        :field="field"
        :id="id"
        :rows="1"
      />
    </form-item>
    <form-item
      alias="recipe"
      label="Изображения"
      name="images"
      v-slot="{ id }"
    >
      <form-images
        :id="id"
        v-model="images"
      />
    </form-item>
    <ui-button
      :disabled="posting || !!Object.keys(errors).length"
      class="admin-recipe__submit"
      type="submit"
    >
      {{ recipe.id ? 'Сохранить' : 'Добавить' }}
    </ui-button>
  </v-form>
</template>

<script lang="ts" setup>
const appStore = useAppStore();
const route = useRoute();
const schema = toTypedSchema(schemas.recipeContent);
const togglePreloader = inject('togglePreloader') as flaggedMethod;
const recipeId = +route.params.id;

// Data
const recipe = ref<Recipe>(await getRecipe());
const images = ref<Image[]>(recipe.value.images);
const recipeCategories = ref<number[]>(appStore.recipesCategories
	.filter((item) => item.recipeId === recipeId)
	.map(({ categoryId }) => categoryId));
const posting = ref(false);

// Methods
async function submit() {
	posting.value = true;
	togglePreloader(true);

	const body = new FormData();

	body.append('data', JSON.stringify({
		recipe: {
			...recipe.value,
			id: recipeId,
		},
		recipeCategories: [...recipeCategories.value],
	}));
	images.value.forEach((image, i) => {
		body.append(`image_${i}`, image);
	});

	const res = await useFetch('/api/admin/recipe', {
		body,
		method: 'post',
	});

	posting.value = false;
	togglePreloader(false);

	if (res.error.value) {
		toast(res.error.value.data.message, { error: true });
	} else {
		const {
			id, recipes, recipesCategories,
		} = res.data.value as {
			id: number;
			recipes: Recipe[];
			recipesCategories: RecipeCategory[];
		};

		appStore.updateRecipes(recipes, recipesCategories);
		navigateTo(`/recipes/${id}`, { external: true });
		toast(`Рецепт успешно ${recipeId ? 'обновлён' : 'добавлен'}!`);
	}
}
async function getRecipe() {
	let current = appStore.recipes.find(({ id }) => id === recipeId);

	if (current && !current.ingredients && !current.method) {
		togglePreloader(true);
		current = await appStore.fillRecipe(recipeId);
		togglePreloader(false);
	}

	return {
		id: current?.id || 0,
		images: current?.images || [],
		ingredients: current?.ingredients || '',
		method: current?.method || '',
		structureId: current?.structureId || null,
		title: current?.title || '',
		url: current?.url || '',
	};
}
function addOption(options: Option[], indent = '') {
	return ({
		id, title,
	}: Entity | Structure) => {
		options.push({
			label: `${indent}${title}`,
			value: id,
		});
	};
}
function getStructuresOptions() {
	const options: Option[] = [];
	const addStructuresOption = addOption(options);

	appStore.structures
		.filter(({ parentId }) => !parentId)
		.forEach((structure) => {
			addStructuresOption(structure);
			appStore.structures
				.filter(({ parentId }) => parentId === structure.id)
				.forEach(addOption(options, '   '));
		});

	return options;
}
function getCategoriesOptions() {
	const options: Option[] = [];
	const addCategoriesOption = addOption(options);

	appStore.rawCategories
		.forEach(addCategoriesOption);

	return options;
}

definePageMeta({ validate: validateIdRoute });
</script>

<style lang="scss" scoped>
.admin-recipe {
	display: grid;
	gap: 2rem;
}

.admin-recipe__submit {
	@include media-md-lg {
		max-width: 25%;
	}
}
</style>
