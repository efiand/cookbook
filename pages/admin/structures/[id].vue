<template>
  <v-form
    :on-submit="submit"
    :validation-schema="schema"
    class="admin-structure"
    v-slot="{ errors }"
  >
    <form-item
      alias="structure"
      label="Название"
      name="title"
      required
      v-model="structure.title"
      v-slot="{ id, field, invalid }"
    >
      <form-input
        :field="field"
        :id="id"
        :invalid="invalid"
      />
    </form-item>
    <form-item
      alias="structure"
      label="Родительский раздел"
      name="parentId"
      v-model="structure.parentId"
      v-slot="{ id, field }"
    >
      <form-select
        :field="field"
        :id="id"
        :options="options"
      />
    </form-item>
    <ui-button
      :disabled="posting || !!Object.keys(errors).length"
      class="admin-structure__submit"
      type="submit"
    >
      {{ structure.id ? 'Сохранить' : 'Добавить' }}
    </ui-button>
  </v-form>
</template>

<script lang="ts" setup>
const appStore = useAppStore();
const route = useRoute();
const schema = toTypedSchema(schemas.title);
const togglePreloader = inject('togglePreloader') as flaggedMethod;
const structureId = +route.params.id;

// Data
const structure = ref<Structure>(getStructure());
const options = ref(appStore.structures
	.filter(({
		id, parentId,
	}) => !parentId && id !== structureId)
	.map(({
		id, title,
	}) => ({
		label: title,
		value: id,
	})));
const posting = ref(false);

// Methods
async function submit() {
	posting.value = true;
	togglePreloader(true);

	const res = await useFetch('/api/admin/structure', {
		body: {
			id: structureId,
			parentId: structure.value.parentId || null,
			title: structure.value.title,
		},
		method: 'post',
	});

	posting.value = false;
	togglePreloader(false);

	if (res.error.value) {
		toast(res.error.value.data.message, { error: true });
	} else {
		const {
			id, structures,
		} = res.data.value as {
			id: number;
			structures: Structure[];
		};

		appStore.updateStructures(structures);
		navigateTo(`/structures/${id}`, { external: true });
		toast(`Раздел успешно ${structureId ? 'обновлён' : 'добавлен'}!`);
	}
}
function getStructure() {
	const current = appStore.structures.find(({ id }) => id === structureId);

	return {
		id: current?.id || 0,
		parentId: current?.parentId || null,
		title: current?.title || '',
	};
}

definePageMeta({ validate: validateIdRoute });
</script>

<style lang="scss" scoped>
.admin-structure {
	display: grid;
	gap: 2rem;
}

.admin-structure__submit {
	@include media-md-lg {
		max-width: 25%;
	}
}
</style>
