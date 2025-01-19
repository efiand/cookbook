<template>
  <div>
    <links-list
      :editable="authorized"
      :items="items"
    />

    <control-panel v-if="authorized" />
  </div>
</template>

<script lang="ts" setup>
const {
	authorized, recipes, structures,
} = useAppStore();

// Computed
const items = computed((): ExtendedLink[] => structures
	?.filter(({ parentId }) => !parentId)
	.map(({
		id, title,
	}) => ({
		additionals: recipes
			.filter(({ structureId }) => structureId === id)
			.map(({
				aromachefId, id, title,
			}) => ({
				aromachefHref: getAromachefHref(aromachefId),
				href: `/recipes/${id}`,
				title,
			})),
		children: structures
			.filter(({ parentId }) => parentId === id)
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
			})),
		href: `/structures/${id}`,
		title,
	})) || []);
</script>
