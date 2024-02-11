<template>
  <div class="control-panel">
    <sub-heading class="control-panel__title">
      Панель управления
    </sub-heading>

    <div class="control-panel__list">
      <ui-button to="/admin/recipes/add">
        Добавить рецепт
      </ui-button>
      <ui-button to="/admin/structures/add">
        Добавить раздел
      </ui-button>
      <ui-button to="/admin/dump">
        Резервное копирование
      </ui-button>
      <ui-button href="/logout">
        Выход
      </ui-button>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.control-panel__title {
	margin: 2.5rem 0 1rem;
}

.control-panel__list {
	display: grid;
	gap: 0.5rem;

	@include media-md-lg {
		grid-template-columns: repeat(2, 1fr);
	}

	@include media-lg {
		grid-template-columns: repeat(4, 1fr);
	}
}
</style>
