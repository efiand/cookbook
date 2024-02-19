<template>
  <nuxt-link
    :class="{ 'button--secondary': secondary }"
    :to="to"
    class="button button--link"
    v-if="to"
  >
    <slot />
  </nuxt-link>
  <a
    :class="{ 'button--secondary': secondary }"
    :href="href"
    :rel="rel"
    :target="target"
    class="button button--link"
    v-else-if="href"
  >
    <slot />
  </a>
  <button
    :class="{ 'button--secondary': secondary }"
    :disabled="disabled"
    :type="type"
    @click="$emit('click', $event)"
    class="button button--control"
    v-else
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
	disabled?: boolean;
	href?: string;
	rel?: string;
	secondary?: boolean;
	target?: string;
	to?: string;
	type?: 'button' | 'reset' | 'submit';
}>(), {
	disabled: false,
	href: undefined,
	rel: undefined,
	secondary: false,
	target: undefined,
	to: undefined,
	type: 'button',
});
defineEmits(['click']);
</script>

<style lang="scss" scoped>
	.button {
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		padding: 0.5rem 1.5rem;
		text-align: center;
		color: $color-white;
		text-decoration: none;
		background-color: $color-green;
		border: 1px solid transparent;
		border-radius: 0.25rem;
		outline-offset: 2px;
		user-select: none;

		&--secondary {
			background-color: $color-blacky;
		}

		&:disabled {
			background-color: $color-darkgray;
		}

		&:focus-visible {
			outline: 2px solid $color-green;
		}

		&--link[href],
		&--control:not(:disabled) {
			@include hover-active {
				background-color: $color-darkgray;
				opacity: 1;
			}
		}
	}
</style>
