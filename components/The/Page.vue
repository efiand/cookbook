<template>
  <div
    :inert="inert"
    class="page"
  >
    <div class="page__body">
      <header>
        <the-heading :title="appStore.heading" />
        <nav-list
          :items="appStore.breadcrumbs"
          v-if="appStore.breadcrumbs"
        />
      </header>
      <main class="page__main">
        <slot />
      </main>
      <footer>
        <nav-list
          :items="appStore.categories"
          type="categories"
          v-if="appStore.categories"
        />
        <p class="page__copyright">
          Разработано <a href="https://efiand.vercel.app/">efiand</a>
        </p>
      </footer>
    </div>
  </div>

  <client-only>
    <teleport to="body">
      <the-preloader v-if="loading" />
      <the-snowfall class="page__snowfall" />
    </teleport>
  </client-only>
</template>

<script lang="ts" setup>
import type { ReactiveHead } from '@unhead/vue';

const appStore = useAppStore();
const getAbsoluteUrl = useAbsoluteUrl();
const route = useRoute();
const inert = ref(true);
const loading = ref(false);

// Computed
const background = computed(() => `url("/images/${appStore.image}"`);
const url = computed(() => getAbsoluteUrl(route.path));

togglePreloader(true);
await appStore.fetch();
appStore.updatePage(route.path);
togglePreloader(false);

useHead(() => {
	const head = cloneDeep(constants.head);

	head.link.push(
		{
			href: url.value,
			rel: 'canonical',
		},
	);

	return head as ReactiveHead<{}>;
});
useSeoMeta({
	ogDeterminer: 'the',
	ogLocale: 'ru_RU',
	ogSiteName: constants.PROJECT,
	ogTitle: () => appStore.title as string,
	ogType: 'website',
	ogUrl: () => url.value,
	title: () => appStore.title as string,
});

watch(() => route.path, appStore.updatePage);

// Methods
function togglePage(lock: boolean) {
	inert.value = lock;
}
function togglePreloader(load: boolean) {
	loading.value = load;
	togglePage(load);
}

provide('togglePage', togglePage);
provide('togglePreloader', togglePreloader);
</script>

<style lang="scss">
@use '@/assets/scss/base';
</style>

<style lang="scss" scoped>
.page {
	box-sizing: border-box;
	height: 100vh;

	// Чтобы содержимое не скакало влево-вправо при быстрой смене страниц:
	overflow-y: scroll;

	@include has-motion {
		scroll-behavior: smooth;
	}

	@include media-lg {
		padding: 1rem 0;

		&::before {
			content: '';
			position: fixed;
			inset: 0;
			z-index: -1;
			background-image: v-bind(background);
			background-size: cover;
			filter: blur(20px);
		}
	}
}

.page__body {
	display: grid;
	grid-template-columns: 100%;
	grid-template-rows: min-content 1fr min-content;
	max-width: 1120px;
	min-height: 100vh;
	margin: 0 auto;
	background-color: $color-white;

	@include media-lg {
		min-height: calc(100vh - 2rem);
		border-radius: 0.25rem;
		box-shadow: $shadow;
	}
}

.page__main {
	padding: 2rem;

	@include media-md-lg {
		padding: 3rem;
	}

	@include media-lg {
		padding: 3rem 5rem 5rem;
	}
}

.page__copyright {
	padding: 1rem 2rem;
	font-size: 0.75rem;
	text-align: center;
	color: $color-gray;

	@include media-md-lg {
		padding-bottom: 2rem;
	}
}

.page__snowfall {
	position: fixed;
	inset: 0;
	z-index: -1;
}
</style>
