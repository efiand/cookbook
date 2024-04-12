<template>
  <vue-draggable
    :animation="150"
    :disabled="!sortable || items.length < 2"
    class="gallery-list"
    v-model="items"
  >
    <gallery-item
      :alt="`Изображение ${i + 1}`"
      :deletable="deletable"
      :key="i"
      :sortable="sortable && items.length > 1"
      :src="getSrc(image)"
      @delete="onDelete(i)"
      v-for="(image, i) in items"
    />
  </vue-draggable>
</template>

<script lang="ts" setup>
import { VueDraggable } from 'vue-draggable-plus';

const props = withDefaults(defineProps<{
	deletable?: boolean;
	images: Image[];
	sortable?: boolean;
}>(), {
	deletable: false,
	sortable: false,
});
const emit = defineEmits([
	'delete',
	'update',
]);

const OWN_PATTERN = /^\d+\..{3,4}$/u;

// Computed
const items = computed({
	get() {
		return cloneDeep(props.images);
	},
	set(files) {
		emit('update', files);
	},
});

// Methods
function onDelete(i: number) {
	if (props.deletable) {
		emit('delete', i);
	}
}
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
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}
</style>
