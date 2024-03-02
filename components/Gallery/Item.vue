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
	src: string;
}>(), { alt: '' });

const isOpen = ref(false);
</script>

<style lang="scss" scoped>
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
