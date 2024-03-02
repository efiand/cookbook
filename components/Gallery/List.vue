<template>
  <ul
    :class="{ 'gallery-list--grid': !noGrid }"
    class="gallery-list"
  >
    <gallery-item
      :alt="`Изображение ${i + 1}`"
      :key="i"
      :src="getSrc(image)"
      v-for="(image, i) in images"
    />
  </ul>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
	images: Image[];
	noGrid?: boolean;
}>(), { noGrid: false });

const OWN_PATTERN = /^\d+\..{3,4}$/u;

// Methods
function getSrc(image: Image) {
	if (typeof image === 'string') {
		if (OWN_PATTERN.test(image)) {
			return `/images/recipes/${image}`;
		}

		return image;
	}

	return URL.createObjectURL(image);
}
</script>

<style lang="scss" scoped>
.gallery-list {
	display: contents;

	&--grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
}
</style>
