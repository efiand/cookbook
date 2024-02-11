<template>
  <p class="preloader">
    <span class="visually-hidden">Загрузка данных…</span>
  </p>
</template>

<style lang="scss" scoped>
.preloader {
	position: fixed;
	inset: 0;
	background-color: rgba($color-lightergray, 0.5);

	&::before {
		content: '';
		position: fixed;
		top: 0;
		right: 100%;
		left: 0;
		height: 0.125rem;
		background-color: $color-green;
		animation: to-right 0.5s ease-in forwards;
	}
}
</style>
