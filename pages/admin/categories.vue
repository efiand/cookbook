<template>
  <div class="admin-categories">
    <v-form
      :key="model.id"
      :on-submit="() => submit(model)"
      :validation-schema="schema"
      class="admin-categories__form"
      v-for="model in models"
      v-slot="{ errors }"
    >
      <form-item
        :alias="`category_${model.id}`"
        hide-label
        label="Категория"
        name="title"
        required
        v-model="model.title"
        v-slot="{ id, field }"
      >
        <form-input
          :field="field"
          :id="id"
        />
      </form-item>
      <ui-button
        :disabled="model.posting || !!Object.keys(errors).length"
        class="admin-categories__submit"
        type="submit"
      >
        {{ model.id ? 'Сохранить' : 'Добавить' }}
      </ui-button>
    </v-form>
  </div>
</template>

<script lang="ts" setup>
interface Model extends Entity {
	posting: boolean;
}

const appStore = useAppStore();
const schema = toTypedSchema(schemas.title);

// Data
const models = ref<Model[]>([
	{
		id: 0,
		title: '',
	},
	...cloneDeep(appStore.rawCategories as Entity[]),
].map((category: Entity) => ({
	...category,
	posting: false,
})));

// Methods
async function submit(model: Model) {
	model.posting = true;

	const {
		id, title,
	} = model;
	const res = await useFetch('/api/admin/category', {
		body: {
			id,
			title,
		},
		method: 'post',
	});

	if (res.error.value) {
		toast(res.error.value.data.message, { error: true });
	} else {
		const newData = res.data.value as Entity;

		appStore.updateCategory(newData);
		if (!id) {
			model.title = '';
			models.value.push({
				...newData,
				posting: false,
			});
		} else {
			model.title = newData.title; // Преобразования на сервере
		}
		models.value.sort(sortByTitle);
		toast(`Категория успешно ${id ? 'обновлена' : 'добавлена'}!`);
	}
	model.posting = false;
}
</script>

<style lang="scss" scoped>
.admin-categories {
	display: grid;
	gap: 2rem;
}

.admin-categories__form {
	display: grid;
	gap: 1rem;

	@include media-md-lg {
		grid-template-columns: 1fr 150px;
	}
}

.admin-categories__submit {
	align-self: end;
}
</style>
