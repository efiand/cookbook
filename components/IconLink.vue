<template>
  <nuxt-link
    :aria-label="type === 'auth' ? 'Авторизоваться' : 'Редактировать'"
    :class="{ 'icon-link--auth': type === 'auth' }"
    :to="`/${type}${href}`"
    class="icon-link"
  />
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
	href?: string;
	type: 'admin' | 'auth';
}>(), {
	href: '',
	type: 'admin',
});
</script>

<style lang="scss" scoped>
.icon-link {
	display: flex;
	width: 24px;
	height: 24px;
	text-decoration: none;

	&::before {
		content: '';
		width: 100%;
		height: 100%;
		background-color: currentColor;
		mask-image: url('/images/sprite.svg#edit');
	}

	&--auth {
		&:not(:hover, :focus-visible) {
			opacity: 0;
		}

		&::before {
			mask-image: url('/images/sprite.svg#sign-in');
		}
	}
}
</style>
