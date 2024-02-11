<template>
  <ul class="gallery-list">
    <gallery-item
      :alt="`Изображение ${i + 1}`"
      :key="filename"
      :src="getSrc(filename)"
      v-for="({ filename }, i) in images"
    />
  </ul>
</template>

<script lang="ts" setup>
defineProps<{
	images: Image[];
}>();

const OWN_PATTERN = /^\d+\..{3,4}$/u;

// Methods
function getSrc(name: string) {
	return OWN_PATTERN.test(name) ? `/images/recipes/${name}` : name;
}
</script>

<style lang="scss" scoped>
.gallery-list {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}
</style>
