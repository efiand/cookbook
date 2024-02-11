<template>
  <li class="gallery-item">
    <button
      @click="isOpen = true"
      type="button"
    >
      <img
        :alt="alt"
        :src="src"
        class="gallery-item__preview"
        loading="lazy"
      >
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
.gallery-item {
	width: 6rem;
	height: 6rem;
	background-color: $color-lightgray;
	border-radius: 0.25rem;
}

.gallery-item__image {
	display: block;
	object-fit: cover;
	border-radius: 1rem;
}

.gallery-item__preview {
	display: block;
	object-fit: cover;
	width: 6rem;
	height: 6rem;
	color: transparent;
	border-radius: 0.25rem;
}
</style>
