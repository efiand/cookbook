<template>
  <component
    :class="{ 'input--invalid': invalid }"
    :id="id"
    :inputmode="inputmode"
    :invalid="invalid"
    :is="rows > 1 ? 'textarea' : 'input'"
    :rows="rows > 1 ? rows : null"
    :spellcheck="spellcheck"
    :type="rows > 1 ? null : type"
    @input="onInput"
    class="input"
    v-bind="field"
  />
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
	field?: FieldBindingObject<any> | null;
	id?: null | string;
	inputmode?: string;
	invalid?: boolean;
	rows?: number;
	spellcheck?: boolean;
	type?: string;
}>(), {
	field: null,
	id: null,
	inputmode: 'text',
	invalid: false,
	rows: 1,
	spellcheck: false,
	type: 'text',
});

// Methods
function onInput() {
	if (props.rows < 2) {
		return;
	}
}
</script>

<style lang="scss" scoped>
.input {
	box-sizing: border-box;
	padding: 0.5rem;
	overflow-y: auto;
	background-color: transparent;
	border: 1px solid $color-lightgray;
	border-radius: 0.125rem;
	outline: none;

	&:focus {
		border-color: $color-gray;
	}

	&--invalid {
		color: $color-red;
		border-color: $color-red;
	}
}
</style>
