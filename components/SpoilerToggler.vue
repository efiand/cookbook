<template>
  <button
    :class="{ 'spoiler-toggler--closed': modelValue }"
    @click.prevent="$emit('update:modelValue', !modelValue)"
    class="spoiler-toggler"
    type="button"
  >
    <span class="visually-hidden">Переключить режим показа.</span>
  </button>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
	modelValue?: boolean;
}>(), { modelValue: true });
defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped>
.spoiler-toggler {
	position: relative;
	display: block;
	width: 0.75rem;
	height: 0.75rem;
	padding: 0;
	color: $color-green;
	background-color: transparent;
	cursor: pointer;

	&::before,
	&::after {
		position: absolute;
		top: 50%;
		left: 50%;
		background-color: currentColor;
		transform: translate(-50%, -50%);
	}

	&::before {
		content: '';
		width: 100%;
		height: 2px;
	}

	&::after {
		width: 2px;
		height: 100%;
	}

	&:hover {
		color: $color-darkgray;
	}

	&--closed {
		&::after {
			content: '';
		}
	}
}
</style>
