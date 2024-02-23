<template>
  <ul class="links-list">
    <li
      :class="{ 'links-list__item--editable': editable }"
      :key="href"
      class="links-list__item"
      v-for="{additionals, children, href, title}, i in items"
    >
      <spoiler-toggler
        class="links-list__toggler"
        v-if="children?.length || additionals?.length"
        v-model="closeds[i]"
      />
      <p class="links-list__group">
        <nuxt-link
          :to="href"
          class="links-list__link"
        >
          {{ title }}
        </nuxt-link>
        <icon-link
          :href="`/admin${href}`"
          class="links-list__edit-link"
          mode="edit"
          v-if="editable"
        />
      </p>
      <links-list
        :class="{ 'links-list__sublist--opened': !closeds[i] }"
        :editable="editable"
        :items="children"
        class="links-list__sublist"
        v-if="children?.length"
        v-show="!closeds[i]"
      />
      <links-list
        :class="{ 'links-list__sublist--opened': !closeds[i] }"
        :editable="editable"
        :items="additionals"
        class="links-list__sublist"
        v-if="additionals?.length"
        v-show="!closeds[i]"
      />
    </li>
  </ul>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
	editable?: boolean;
	items: ExtendedLink[];
}>(), {
	editable: false,
	items: () => [],
});

// Data
const closeds = ref(props.items.map(() => true));
</script>

<style lang="scss" scoped>
.links-list {
	display: grid;
	padding: 0;

	&:has(.links-list__sublist) {
		padding-left: 1.25rem;
	}
}

.links-list__item {
	position: relative;

	&:not(:last-child) {
		margin-bottom: 0.5rem;
	}
}

.links-list__toggler {
	position: absolute;
	top: -1px;
	right: 100%;
	margin: 0.25rem 0.5rem 0 0;
}

.links-list__link {
	@include underline-link;
}

.links-list__edit-link {
	flex-shrink: 0;
	margin-top: -3px;
	margin-left: 6px;
	visibility: hidden;
}

.links-list__group {
	display: flex;
	align-items: flex-start;
	width: fit-content;
	margin: 0;

	&:hover,
	&:focus-within {
		.links-list__edit-link {
			@include media-lg {
				visibility: visible;
			}
		}
	}
}

.links-list__sublist {
	display: none;
	margin: 0.5rem 0 0.5rem 1.25rem;

	:deep(.links-list__item--editable) {
		margin-left: 0;
	}

	& + & {
		margin-top: 1rem;
	}

	&--opened {
		display: block;
	}
}

.links-list:not(.links-list__sublist):has(.links-list__toggler) {
	> .links-list__item {
		+ .links-list__item {
			margin-top: 0.5rem;
		}

		> .links-list__group {
			font-weight: 700;
			color: $color-darkgray;
			text-transform: uppercase;
		}
	}
}
</style>
