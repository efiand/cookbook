<template>
  <div>
    <links-list
      :editable="authorized"
      :items="recipesInCategory"
      v-if="recipesInCategory.length"
    />
    <p v-else>
      Категория не содержит рецептов.
    </p>
  </div>
</template>

<script lang="ts" setup>
const {
	authorized, recipes, recipesCategories,
} = useAppStore();
const route = useRoute();

// Computed
const recipesInCategory = computed((): ExtendedLink[] => recipes
	.filter(({ id }) => recipesCategories
		.find(({
			categoryId, recipeId,
		}) => recipeId === id && categoryId === +route.params.id))
	.map(({
		aromachefId, id, title,
	}) => ({
		aromachefHref: getAromachefHref(aromachefId),
		href: `/recipes/${id}`,
		title,
	})));

definePageMeta({ validate: validateIdRoute });
</script>
