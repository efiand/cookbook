<template>
  <h2 class="sub-heading">
    <slot />
  </h2>
</template>

<style lang="scss" scoped>
.sub-heading {
	position: relative;
	padding: 0 0 0.25rem;
	font-weight: 700;
	font-size: 1.25rem;
	font-family: $font-accent;
	color: $color-darkgray;
	border-bottom: 1px solid $color-lightgray;

	@include media-md-lg {
		padding-right: 35%;
		border: none;

		&::after {
			content: '';
			position: absolute;
			top: 100%;
			right: 0;
			left: 0;
			height: 1px;
			background-image: $gradient-line;
		}
	}
}
</style>
