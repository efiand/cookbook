<template>
  <div
    @paste="onPaste"
    class="form-images"
  >
    <input
      :id="id"
      @change="onChange"
      accept="image/png, image/jpeg"
      class="form-images__input visually-hidden"
      multiple
      ref="inputElement"
      type="file"
    >
    <label
      :for="id"
      aria-label="Перейти к выбору"
      class="form-images__picker"
    />
    <button
      @click="onPasteClick"
      aria-label="Вставить из буфера обмена"
      class="form-images__picker form-images__picker--paste"
      type="button"
      v-if="pasteClickSupport"
    />
    <gallery-list
      :images="modelValue"
      @delete="(i) => onDelete(i)"
      deletable
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
const pasteClickSupport = ref(false);

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
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.form-images__picker {
	position: relative;
	width: 6rem;
	height: 6rem;
	padding: 0;
	color: $color-lightgray;
	background-color: $color-lightergray;
	border: none;
	border-radius: 0.25rem;
	cursor: pointer;
	appearance: none;

	&:hover {
		color: $color-green;
	}

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

	&--paste::before {
		@include icon('paste');
	}
}

.form-images__input:focus-visible + .form-images__picker {
	outline: 2px solid;
}
</style>
