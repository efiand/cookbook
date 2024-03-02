<template>
  <multi-select
    :class="{ 'select--invalid': invalid }"
    :id="id"
    :mode="multi ? 'tags' : 'single'"
    :options="options"
    :placeholder="placeholder"
    class="select"
    v-bind="field"
  />
</template>

<script lang="ts" setup>
import MultiSelect from '@vueform/multiselect';
import '@vueform/multiselect/themes/default.css';

withDefaults(defineProps<{
	disabled?: boolean;
	field?: FieldBindingObject<any> | null;
	id?: HTMLAttributes['id'];
	invalid?: boolean;
	multi?: boolean;
	options: Option[];
	placeholder?: HTMLAttributes['placeholder'];
}>(), {
	disabled: false,
	field: null,
	id: undefined,
	invalid: false,
	multi: false,
	placeholder: 'Выберите',
});
</script>

<style lang="scss" scope>
.select {
	--ms-px: 0.5rem;
	--ms-option-px: 0.5rem;
	--ms-tag-font-weight: 400;
	--ms-tag-font-size: 1rem;
	--ms-line-height: var(--line-height);
	--ms-tag-line-height: var(--line-height);
	--ms-tag-color: #{$color-text};
	--ms-placeholder-color: #{rgba($color-text, 0.3)};
	--ms-option-color-pointed: inherit;
	--ms-tag-bg: #{$color-lightergray};
	--ms-option-bg-pointed: #{$color-lightergray};
	--ms-option-bg-selected: #{$color-green};
	--ms-option-bg-selected-pointed: #{$color-green};
	--ms-bg: transparent;
	--ms-border-color: #{$color-lightgray};
	--ms-dropdown-border-color: #{$color-green};
	--ms-border-color-active: #{$color-green};
	--ms-radius: 0.125rem;
	--ms-ring-color: transparent;

	@include has-motion {
		transition: $transition-default;
		transition-property: $transitions;
	}

	&--invalid {
		--ms-border-color: #{$color-red};
		--ms-placeholder-color: #{$color-red};
	}
}
</style>
