<template>
  <div class="error">
    <p>
      {{ message }}
    </p>
    <p>
      <a href="mailto:efiand@ya.ru">Связаться с разработчиком</a>.
    </p>
    <dev-only>
      <div
        class="error__stack"
        v-html="stack"
        v-if="stack"
      />
    </dev-only>
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
	message: string;
	stack?: string;
}>(), {
	message: 'Произошла ошибка',
	stack: '',
});
</script>

<style lang="scss" scoped>
.error {
	display: grid;
	gap: 0.5rem;
}

.error__stack {
	margin-top: 2rem;
	overflow: auto;
	background-color: $color-lightergray;

	:deep(pre) {
		margin: 1.5rem;
	}
}
</style>
