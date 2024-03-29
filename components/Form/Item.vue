<template>
  <v-field
    :name="name"
    :validate-on-input="true"
    as="div"
    class="form-item"
    v-model="modelValue"
    v-slot="{ field, errors }"
  >
    <label
      :class="{ 'visually-hidden': hideLabel }"
      :for="id"
      class="form-item__label"
    >{{ label }} <required-sign v-if="required" /></label>
    <slot
      :errors="errors"
      :field="field"
      :id="id"
      :invalid="!!errors.length"
    />
    <v-error-message
      :name="name"
      class="form-item__error"
      v-if="!hideErrors"
    />
  </v-field>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
	alias?: string;
	hideErrors?: boolean;
	hideLabel?: boolean;
	label: string;
	name: string;
	required?: boolean;
}>(), {
	alias: nanoid(),
	hideErrors: false,
	hideLabel: false,
	required: false,
});

// Data
const id = ref(`${props.alias}_${props.name}`);
const modelValue = defineModel<null | number | number[] | string | string[]>();
</script>

<style lang="scss" scoped>
.form-item {
	position: relative;
	display: grid;
	gap: 0.25rem;
}

.form-item__label {
	font-size: 0.85rem;
	color: $color-darkgray;
}

.form-item__error {
	position: absolute;
	top: 100%;
	margin-top: 0.25rem;
	font-size: 0.85rem;
	color: $color-red;
}

:deep(input, textarea) {
	width: 100%;
}
</style>
