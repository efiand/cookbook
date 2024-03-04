<template>
  <div
    class="wysiwyg"
    v-if="(typeof modelValue !== 'undefined')"
  >
    <form-item
      :alias="alias"
      :hide-label="hideLabel"
      :label="label"
      :name="name"
      :required="required"
      hide-errors
      v-model="model"
      v-slot="{ id, field }"
    >
      <form-input
        :field="field"
        :id="id"
        @focus="focusToArea"
        class="visually-hidden"
      />
    </form-item>
    <div
      :class="{ 'wysiwyg__editor--invalid': error }"
      class="wysiwyg__editor"
    >
      <div
        class="content"
        ref="editorElement"
      />
    </div>
    <p
      class="wysiwyg__error"
      v-if="error"
    >
      {{ error }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';

const props = withDefaults(defineProps<{
	alias?: string;
	error?: string;
	hideLabel?: boolean;
	label: string;
	modelValue: string | undefined;
	name: string;
	required?: boolean;
	spellcheck?: boolean;
}>(), {
	alias: nanoid(),
	error: '',
	hideLabel: false,
	required: false,
	spellcheck: false,
});
const emit = defineEmits(['update:modelValue']);

const options = {
	modules: {
		toolbar: [
			[
				'bold',
				'italic',
			],
			[
				{ list: 'ordered' },
				{ list: 'bullet' },
			],
			['clean'],
		],
	},
	theme: 'snow',
};

// Data
const editorElement = ref<HTMLDivElement | null>(null);
const areaElement = ref<HTMLDivElement | null>(null);

// Computed
const model = computed({
	get() {
		return props.modelValue || '';
	},
	set(value) {
		let html = value;

		if (html === '<p><br></p>') {
			html = '';
		}
		emit('update:modelValue', html);
	},
});

// Methods
function focusToArea() {
	areaElement.value?.focus();
}

onMounted(async () => {
	if (!editorElement.value) {
		return;
	}

	const Quill = (await import('quill')).default;
	const quill = new Quill(editorElement.value, options);

	areaElement.value = editorElement.value.querySelector('.ql-editor');
	if (areaElement.value) {
		areaElement.value.spellcheck = props.spellcheck;
	}
	quill.clipboard.dangerouslyPasteHTML(model.value);

	quill.on('text-change', () => {
		model.value = areaElement.value?.innerHTML || '';
	});
});
</script>

<style lang="scss" scoped>
.wysiwyg {
	position: relative;
}

.wysiwyg__editor {
	--color: inherit;
	--border-color: #{$color-lightgray};

	position: relative;

	&--invalid {
		--color: #{$color-red};
		--border-color: #{$color-red};
	}

	&:focus-within {
		--border-color: #{$color-green};
	}

	:deep(.ql-toolbar) {
		position: sticky;
		top: -1rem;
		z-index: 1;
		padding: 0.5rem 0;
		background-color: $color-white;
		border: none;
		border-bottom: 1px solid var(--border-color);

		.ql-active,
		button:hover {
			color: $color-green;

			.ql-stroke {
				stroke: currentColor;
			}
		}
	}

	:deep(.ql-container) {
		display: contents;
		overflow-y: auto;
		font: inherit;

		.ql-editor {
			height: auto;
			padding: 0.5rem;
			color: var(--color);
			border: 1px solid var(--border-color);
			border-top: none;
			border-radius: 0 0 0.125rem 0.125rem;
		}
	}
}

.wysiwyg__error {
	position: absolute;
	top: 100%;
	margin-top: 0.25rem;
	font-size: 0.85rem;
	color: $color-red;
}
</style>
