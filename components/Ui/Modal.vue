<template>
  <teleport to="body">
    <div
      :class="{ 'modal--closing': closing }"
      @click.self="onClose"
      class="modal"
      role="dialog"
      v-if="modelValue"
    >
      <div class="modal__inner">
        <slot />
      </div>
      <button
        @click="onClose"
        aria-label="Закрыть окно"
        class="modal__close"
        type="button"
      />
    </div>
  </teleport>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
	modelValue: boolean;
}>(), { modelValue: false });
const emit = defineEmits(['update:modelValue']);
const togglePage = inject('togglePage') as flaggedMethod;

// Data
const closing = ref(false);

// Methods
async function onClose() {
	closing.value = true;
	await wait(600);
	closing.value = false;
	emit('update:modelValue');
}
function onKeyClose(event: KeyboardEvent) {
	if (event.key.startsWith('Esc')) {
		event.preventDefault();
		onClose();
	}
}

onMounted(() => {
	document.documentElement.addEventListener('keydown', onKeyClose);
	togglePage(true);
});
onBeforeUnmount(() => {
	document.documentElement.removeEventListener('keydown', onKeyClose);
	togglePage(false);
});
</script>

<style lang="scss" scoped>
.modal {
	position: fixed;
	inset: 0;
	z-index: 1;
	display: flex;
	overflow-y: scroll;
	background-color: rgba(0, 0, 0, 0.87);

	@include has-motion {
		animation: fade-in 0.6s ease-out;

		&--closing {
			animation: fade-out 0.6s ease-in forwards;
		}
	}

	@include media-md-lg {
		padding: 2.25rem;
	}
}

.modal__inner {
	margin: auto;
}

.modal__close {
	position: absolute;
	top: 1rem;
	right: 1rem;
	width: 3rem;
	height: 3rem;
	padding: 0.5rem;
	background-color: $color-lightgray;
	border-radius: 50%;

	&::before,
	&::after {
		content: '';
		position: absolute;
		top: 1.375rem;
		right: 0.5rem;
		left: 0.5rem;
		height: 0.25rem;
		background-color: $color-darkgray;
		transition: inherit;
	}

	&::before {
		transform: rotate(45deg);
	}

	&::after {
		transform: rotate(-45deg);
	}

	&:hover,
	&:focus {
		&::before,
		&::after {
			background-color: $color-green;
		}
	}
}
</style>
