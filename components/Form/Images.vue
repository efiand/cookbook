<template>
  <div
    @paste="onPaste"
    class="form-images"
  >
    <div class="form-images__controls">
      <input
        :id="id"
        @change="onChange"
        accept="image/png, image/jpeg"
        class="visually-hidden"
        multiple
        ref="inputElement"
        type="file"
      >
      <label
        :for="id"
        aria-label="Выбрать файл"
        class="form-images__control form-images__control--pick"
      />
      <button
        @click="onPasteClick"
        aria-label="Вставить из буфера обмена"
        class="form-images__control form-images__control--paste"
        type="button"
        v-if="pasteClickSupport"
      />
      <button
        :class="{ 'form-images__control--active': sortable }"
        @click="onSortableClick"
        aria-label="Режим сортировки"
        class="form-images__control form-images__control--sort"
        type="button"
        v-if="modelValue.length > 1"
      />
      <button
        :class="{ 'form-images__control--active': deletable }"
        @click="onDeletableClick"
        aria-label="Режим удаления"
        class="form-images__control form-images__control--delete"
        type="button"
        v-if="modelValue.length"
      />
    </div>
    <gallery-list
      :deletable="deletable"
      :images="modelValue"
      :sortable="sortable"
      @delete="onDelete($event)"
      @update="emit('update:modelValue', $event)"
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
const pasteClickSupport = ref(false);
const deletable = ref(false);
const sortable = ref(false);

// Method
function processFiles(newFiles?: File[]) {
	if (!newFiles?.length) {
		return;
	}

	const files: Image[] = [...props.modelValue];

	for (const file of newFiles) {
		const name = file.name.toLowerCase();
		const matches = FILE_TYPES.some((it) => name.endsWith(it));

		if (matches) {
			files.push(file);
		} else {
			toast(`${name} имеет неподходящий формат`, { error: true });
		}
	}

	emit('update:modelValue', files);
}
function onChange() {
	processFiles([...inputElement.value?.files || []]);
}
async function onPasteClick() {
	const clipboardContents = await navigator.clipboard.read();
	const files: File[] = [];

	for (const item of clipboardContents) {
		await addFileFromClipboard(item, files, 'image/jpeg', 'jpg');
		await addFileFromClipboard(item, files, 'image/png', 'png');
	}
	processFiles(files);
}
function onSortableClick() {
	sortable.value = !sortable.value;
	deletable.value = false;
}
function onDeletableClick() {
	deletable.value = !deletable.value;
	sortable.value = false;
}
function onPaste(event: ClipboardEvent) {
	processFiles([...event.clipboardData?.files || []]);
}
function onDelete(i: number) {
	const files: Image[] = [...props.modelValue];

	files.splice(i, 1);
	emit('update:modelValue', files);
}
async function addFileFromClipboard(
	item: ClipboardItem,
	files: File[],
	type: string,
	ext: string,
) {
	if (item.types.includes(type)) {
		const blob = await item.getType(type);
		const lastModified = new Date().valueOf();
		const fileName = `${lastModified}.${ext}`;

		files.push(new File([blob], fileName, { lastModified }));
	}
}

onMounted(() => {
	pasteClickSupport.value = Boolean(navigator?.clipboard.read);
});
</script>

<style lang="scss" scoped>
.form-images {
	display: grid;
	gap: 1rem;
}

.form-images__controls {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.form-images__control {
	position: relative;
	flex-shrink: 0;
	width: 4rem;
	height: 4rem;
	padding: 0;
	color: $color-lightgray;
	background-color: $color-lightergray;
	border: none;
	border-radius: 0.25rem;
	cursor: pointer;
	appearance: none;

	&::before {
		content: '';
		position: absolute;
		inset: 0;
		width: 24px;
		height: 24px;
		margin: auto;
		background-color: currentColor;

		@include icon('plus');
	}

	&::after {
		content: attr(aria-label);
		position: absolute;
		top: 100%;
		left: 0;
		z-index: 1;
		padding: 0.125rem 0.5rem;
		font-size: 0.75rem;
		white-space: nowrap;
		border: 1px solid;
		border-radius: 0.25rem;
		visibility: hidden;
		opacity: 0;
		transition: $transition-default;
		transition-property: opacity, visibility;
	}

	&::after,
	&--active,
	&:hover {
		color: $color-green;
		background-color: $color-lightergreen;
	}

	&:hover,
	&:focus-visible {
		&::after {
			visibility: visible;
			opacity: 1;
		}
	}

	&--paste::before {
		@include icon('paste');
	}

	&--sort::before {
		@include icon('sort');
	}

	&--delete::before {
		@include icon('close');
	}

	input:focus-visible + &--pick {
		outline: 2px solid;
	}
}
</style>
