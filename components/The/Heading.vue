<template>
  <h1 class="heading">
    <svg
      aria-label="Лого"
      class="heading__logo"
      focusable="false"
      height="64"
      role="img"
      v-if="route.name === 'index' && !error"
      width="64"
    >
      <use href="/images/logo.svg#logo" />
    </svg>
    <span v-html="title" />
  </h1>
</template>

<script lang="ts" setup>
defineProps<{
	title: string;
}>();
const error = useError();
const route = useRoute();
</script>

<style lang="scss" scoped>
.heading {
	margin: 0;
	padding: 2rem;
	font-weight: 700;
	font-size: 2.25rem;
	font-family: $font-accent;
	text-align: center;
	color: $color-green;
	letter-spacing: -1px;
	overflow-wrap: anywhere;
	hyphens: auto;

	@include media-md-lg {
		padding: 2rem 3rem;
	}

	@include media-lg {
		padding: 3rem 5rem 2rem;
	}
}

.heading__logo {
	display: block;
	margin: 0 auto 1rem;
}
</style>
