<template>
  <div class="structure">
    <links-list
      :editable="authorized"
      :items="substructures"
      v-if="substructures.length"
    />
    <links-list
      :editable="authorized"
      :items="recipesInStructure"
      v-if="recipesInStructure.length"
    />
    <p v-if="!substructures.length && !recipesInStructure.length">
      Раздел не содержит подразделов и рецептов.
    </p>
  </div>
</template>

<script lang="ts" setup>
const {
	authorized, recipes, structures,
} = useAppStore();
const route = useRoute();

// Computed
const substructures = computed((): ExtendedLink[] => structures
	.filter(({ parentId }) => parentId === +route.params.id)
	.map(({
		id, title,
	}) => ({
		children: recipes
			.filter(({ structureId }) => structureId === id)
			.map(({
				aromachefId, id, title,
			}) => ({
				aromachefHref: getAromachefHref(aromachefId),
				href: `/recipes/${id}`,
				title,
			})),
		href: `/structures/${id}`,
		title,
	})));
const recipesInStructure = computed((): ExtendedLink[] => recipes
	.filter(({ structureId }) => structureId === +route.params.id)
	.map(({
		aromachefId, id, title,
	}) => ({
		aromachefHref: getAromachefHref(aromachefId),
		href: `/recipes/${id}`,
		title,
	})));

definePageMeta({ validate: validateIdRoute });
</script>

<style lang="scss" scoped>
	.structure {
		display: grid;
		gap: 1rem;
	}
</style>
