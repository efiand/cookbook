<template>
  <div class="form-inages">
    <input
      :id="id"
      @change="onChange"
      accept="image/png, image/jpeg"
      class="visually-hidden"
      multiple
      ref="inputElement"
      tabindex="-1"
      type="file"
    >
    <button
      @click="() => inputElement?.click()"
      aria-label="Перейти к выбору"
      class="form-inages__input"
      type="button"
    />
    <gallery-list
      :images="modelValue"
      no-grid
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
	id?: string;
	modelValue: Image[];
}>();
const emit = defineEmits(['update:modelValue']);

const FILE_TYPES = [
	'jpg',
	'jpeg',
	'png',
];

// Data
const inputElement = ref<HTMLInputElement | null>(null);

// Method
async function onChange() {
	const files: Image[] = [...props.modelValue];

	[...inputElement.value?.files || []].forEach((file) => {
		const name = file.name.toLowerCase();
		const matches = FILE_TYPES.some((it) => name.endsWith(it));

		if (!matches) {
			toast(`${name} имеет неподходящий формат`, { error: true });

			return;
		}
		files.push(file);
	});

	emit('update:modelValue', files);
}
</script>

<style lang="scss" scoped>
.form-inages {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.form-inages__input {
	position: relative;
	width: 6rem;
	height: 6rem;
	padding: 0;
	color: $color-lightgray;
	background-color: $color-lightergray;
	border: none;
	border-radius: 0.25rem;
	appearance: none;

	&:hover {
		color: $color-green;
	}

	&::before,
	&::after {
		content: '';
		position: absolute;
		inset: 0;
		width: 3.5rem;
		height: 0.5rem;
		margin: auto;
		background-color: currentColor;
		border-radius: inherit;
	}

	&::after {
		transform: rotate(90deg);
	}
}
</style>
