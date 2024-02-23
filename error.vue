<template>
  <the-page>
    <the-error
      :message="message"
      :stack="error.stack"
    />
  </the-page>
</template>

<script lang="ts" setup>
import type { NuxtError } from 'nuxt/dist/app/composables';

const props = defineProps<{ error: NuxtError }>();

// Computed
const message = computed(() => {
	const {
		message, statusCode,
	} = props.error;

	if (message) {
		return message;
	}
	if (statusCode === constants.StatusCodes.NOT_FOUND) {
		return 'Страница не найдена';
	}

	return 'Произошла ошибка';
});
</script>
