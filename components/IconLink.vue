<template>
  <nuxt-link
    :aria-label="ariaLabels[mode]"
    :class="`icon-link icon-link--${mode}`"
    :target="target"
    :to="href"
  />
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
	href: IconLink['href'];
	mode: IconLink['mode'];
	target?: HTMLAnchorElement['target'];
}>(), { target: undefined });

// Data
const ariaLabels: Record<IconLink['mode'], string> = {
	aromachef: 'Перейти к аналогичной странице на aromachef.ru',
	auth: 'Авторизоваться',
	back: 'Назад к просмотру',
	edit: 'Редактировать',
};

// Computed
const mask = computed(() => `url("/images/sprite.min.svg#${props.mode}"`);
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
		mask-image: v-bind(mask);
	}

	&--auth {
		&:not(:hover, :focus-visible) {
			opacity: 0;
		}
	}
}
</style>
