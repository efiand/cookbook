<template>
  <div class="password-input">
    <form-input
      :field="field"
      :id="id"
      :invalid="invalid"
      :type="show ? 'text' : 'password'"
      class="password-input__input"
    />
    <button
      :aria-label="`${show ? 'Скрыть' : 'Показать'} пароль`"
      :class="{ 'password-input__toggler--show': show }"
      @click="show = !show"
      class="password-input__toggler"
      type="button"
    />
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
	field?: FieldBindingObject<any> | null;
	id?: null | string;
	invalid?: boolean;
}>(), {
	field: null,
	id: null,
	invalid: false,
});

// Data
const show = ref(false);
</script>

<style lang="scss" scoped>
.password-input {
	position: relative;
}

.password-input__input {
	--right-space: 2.75rem;
}

.password-input__toggler {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	display: flex;
	width: 2.5rem;
	color: $color-green;

	&::before {
		content: '';
		width: 24px;
		height: 24px;
		margin: auto;
		background-color: currentColor;

		@include icon('eye-slash');
	}

	&--show::before {
		@include icon('eye');
	}

	&:focus-visible {
		outline: 2px solid $color-green;
		outline-offset: -2px;
	}

	@include hover-active {
		color: $color-darkgray;
	}
}
</style>
