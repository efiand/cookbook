<template>
  <div class="error">
    <p>
      {{ message }}
    </p>
    <p>
      <a href="mailto:efiand@ya.ru">Связаться с разработчиком</a>.
    </p>
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
	message: string;
}>(), { message: 'Произошла ошибка' });
</script>

<style lang="scss" scoped>
.error {
	display: grid;
	gap: 0.5rem;
}
</style>
