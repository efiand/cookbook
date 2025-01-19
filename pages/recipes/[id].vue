<template>
  <div class="recipe">
    <template v-if="recipe.ingredients">
      <sub-heading class="recipe__title">
        Состав
      </sub-heading>
      <div
        class="content"
        v-html="recipe.ingredients"
      />
    </template>

    <template v-if="recipe.method">
      <sub-heading class="recipe__title">
        Приготовление
      </sub-heading>
      <div
        class="content"
        v-html="recipe.method"
      />
    </template>

    <template v-if="recipe.images.length">
      <sub-heading class="recipe__title">
        Картинки
      </sub-heading>
      <gallery-list
        :images="recipe.images"
        class="recipe__gallery"
      />
    </template>

    <template v-if="urls.length">
      <sub-heading class="recipe__title">
        Ссылки
      </sub-heading>
      <ul class="content">
        <li
          :key="url"
          v-for="url in urls"
        >
          <a
            :href="url"
            rel="noopener"
            target="_blank"
          >{{ url }}</a>
        </li>
      </ul>
    </template>
  </div>
</template>

<script lang="ts" setup>
const appStore = useAppStore();
const route = useRoute();
const togglePreloader = inject('togglePreloader') as flaggedMethod;

// Data
const recipeId = +route.params.id;
let recipe = appStore.recipes.find(({ id }) => id === recipeId) as Recipe || {};

// Computed
const urls = computed(() => {
	const items = listify(recipe.url || '');

	if (recipe.aromachefId) {
		items.push(getAromachefHref(recipe.aromachefId));
	}

	return items;
});

if (!recipe.ingredients && !recipe.method) {
	togglePreloader(true);
	recipe = await appStore.fillRecipe(recipeId);
	togglePreloader(false);
}

definePageMeta({ validate: validateIdRoute });
</script>

<style lang="scss" scoped>
.recipe__title {
	margin: 2.5rem 0 1rem;

	&:first-child {
		margin-top: 0.5rem;
	}
}

.recipe__gallery {
	margin: 0;
}
</style>
