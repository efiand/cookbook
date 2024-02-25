<template>
  <component
    :class="{ 'input--invalid': invalid }"
    :id="id"
    :inputmode="inputmode"
    :is="rows > 1 ? 'textarea' : 'input'"
    :rows="rows > 1 ? rows : null"
    :spellcheck="rows > 1 ? spellcheck : null"
    :type="rows > 1 ? null : type"
    class="input"
    v-bind="field"
  />
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
	field?: FieldBindingObject<any> | null;
	id?: HTMLAttributes['id'];
	inputmode?: HTMLAttributes['inputmode'];
	invalid?: boolean;
	placeholder?: HTMLAttributes['placeholder'];
	rows?: number;
	spellcheck?: boolean;
	type?: HTMLAttributes['type'];
}>(), {
	field: null,
	id: undefined,
	inputmode: undefined,
	invalid: false,
	placeholder: undefined,
	rows: 1,
	spellcheck: false,
	type: 'text',
});
</script>

<style lang="scss" scoped>
.input {
	box-sizing: border-box;
	padding: 0.5rem var(--right-space, 0.5rem) 0.5rem 0.5rem;
	overflow-y: auto;
	background-color: transparent;
	border: 1px solid $color-lightgray;
	border-radius: 0.125rem;
	outline: none;

	&:focus {
		border-color: $color-green;
	}

	&--invalid {
		color: $color-red;
		border-color: $color-red;
	}
}
</style>
