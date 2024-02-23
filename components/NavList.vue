<template>
  <div class="nav-list">
    <icon-link
      :href="authorized ? '/admin/categories' : '/auth'"
      :mode="authorized ? 'edit' : 'auth'"
      class="nav-list__icon-link"
      v-if="type === 'categories'"
    />

    <ul
      :class="{ 'nav-list__items--categories': type === 'categories' }"
      class="nav-list__items"
    >
      <li
        :class="{ 'nav-list__item--categories': type === 'categories' }"
        :key="href"
        class="nav-list__item"
        v-for="{ href, title } in links"
      >
        <nuxt-link
          :aria-current="href === route.path && !error ? 'page' : null"
          :class="{ 'nav-list__link--current': href === route.path && !error }"
          :external="!!error"
          :to="href"
          @click="onClick"
          class="nav-list__link"
        >
          {{ title }}
        </nuxt-link>
      </li>
    </ul>

    <icon-link
      v-if="type !== 'categories' && editLink"
      v-bind="editLink"
      class="nav-list__icon-link"
    />
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
	items?: Entity[];
	type?: navType;
}>(), {
	items: () => [],
	type: 'breadcrumbs',
});
const error = useError();
const route = useRoute();
const {
	authorized, editLink = null,
} = toRefs(useAppStore());

// Computed
const links = computed((): Link[] => {
	const items = [];

	if (props.type === 'breadcrumbs') {
		items.push({
			href: '/',
			title: 'Содержание',
		});
	}
	props.items.forEach(({
		id, title,
	}) => items.push({
		href: `/${props.type === 'breadcrumbs'
			? 'structures'
			: 'categories'}/${id}`,
		title,
	}));

	return items;
});

// Methods
function onClick() {
	if (props.type === 'breadcrumbs' && links.value.length === 1) {
		clearError({ redirect: '/' });
	}
}
</script>

<style lang="scss">
.nav-list {
	display: flex;
	justify-content: space-between;
	gap: 1.5rem;
	align-items: flex-start;
	padding: 0.75rem 1.5rem;
	color: $color-white;
	background-image: $gradient-blacky;
	box-shadow: $shadow-small;

	@include media-lg {
		margin: 0 -0.5rem;
		border-radius: 0.375rem;
	}
}

.nav-list__items {
	display: flex;
	flex-wrap: wrap;
	font-size: 0.875rem;
	line-height: 1.75rem;

	&--categories {
		justify-content: flex-end;
	}
}

.nav-list__item {
	& + &::before {
		content: '>';
		padding: 0 0.5rem;
		color: $color-gray;
	}

	&--categories {
		&::before,
		& + &::before {
			content: '•';
			padding: 0 0.5rem 0 1rem;
			color: $color-lightgray;
		}
	}
}

.nav-list__link {
	text-decoration: none;

	&--current {
		cursor: default;
		opacity: 0.6;
	}
}

.nav-list__icon-link {
	flex-shrink: 0;
	margin-top: 3px;
}
</style>
