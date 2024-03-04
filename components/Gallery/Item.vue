<template>
  <li class="gallery-item">
    <button
      @click="isOpen = true"
      class="gallery-item__preview-control"
      type="button"
    >
      <img
        :alt="alt"
        :src="src"
        class="gallery-item__preview"
        loading="lazy"
      >
      <span
        class="gallery-item__new"
        v-if="src.startsWith('blob:')"
      >Новое</span>
    </button>
    <button
      @click="emit('delete')"
      aria-label="Удалить"
      class="gallery-item__delete"
      type="button"
      v-if="deletable"
    />
    <ui-modal
      @close="isOpen = false"
      v-if="isOpen"
      v-model="isOpen"
    >
      <img
        :alt="alt"
        :src="src"
        class="gallery-item__image"
      >
    </ui-modal>
  </li>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
	alt?: string;
	deletable?: boolean;
	src: string;
}>(), {
	alt: '',
	deletable: false,
});
const emit = defineEmits(['delete']);

const isOpen = ref(false);
</script>

<style lang="scss" scoped>
.gallery-item {
	position: relative;
}

.gallery-item__delete {
	position: absolute;
	top: 0.25rem;
	right: 0.25rem;
	width: 1.5rem;
	height: 1.5rem;
	padding: 0;
	background-color: $color-gray;
	border-radius: 50%;
	opacity: 0.9;
	transition: background-color $transition-default;

	&::before,
	&::after {
		content: '';
		position: absolute;
		inset: 0;
		width: 0.75rem;
		height: 0.125rem;
		margin: auto;
		background-color: $color-white;
	}

	&::before {
		transform: rotate(45deg);
	}

	&::after {
		transform: rotate(-45deg);
	}

	&:hover,
	&:focus {
		background-color: $color-green;
	}
}

.gallery-item__image {
	display: block;
	object-fit: cover;
	border-radius: 1rem;
}

.gallery-item__preview-control {
	position: relative;
	display: block;
	width: 6rem;
	height: 6rem;
	background-color: $color-lightgray;
	border-radius: 0.25rem;
}

.gallery-item__preview {
	display: block;
	object-fit: cover;
	width: 6rem;
	height: 6rem;
	color: transparent;
	border-radius: 0.25rem;
}

.gallery-item__new {
	position: absolute;
	right: 0;
	bottom: 0;
	left: 0;
	padding: 0.25rem;
	font-size: 0.5rem;
	color: $color-white;
	text-transform: uppercase;
	background-color: rgba($color-green, 0.75);
	border-radius: 0 0 0.25rem 0.25rem;
}
</style>
