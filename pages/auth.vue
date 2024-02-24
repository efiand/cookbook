<template>
  <v-form
    :on-submit="onSubmit"
    :validation-schema="schema"
    class="auth"
    v-slot="{ errors }"
  >
    <form-item
      alias="auth"
      label="Логин"
      name="login"
      required
      v-model="data.login"
      v-slot="{ id, field, invalid }"
    >
      <form-input
        :field="field"
        :id="id"
        :invalid="invalid"
      />
    </form-item>
    <form-item
      alias="auth"
      label="Пароль"
      name="password"
      required
      v-model="data.password"
      v-slot="{ id, field, invalid }"
    >
      <form-input
        :field="field"
        :id="id"
        :invalid="invalid"
        type="password"
      />
    </form-item>
    <ui-button
      :disabled="posting || !!Object.keys(errors).length"
      class="auth__submit"
      type="submit"
    >
      Войти
    </ui-button>
  </v-form>
</template>

<script lang="ts" setup>
// Data
const data = ref<AuthData>({
	login: '',
	password: '',
});
const schema = toTypedSchema(schemas.auth);
const togglePreloader = inject('togglePreloader') as flaggedMethod;
const posting = ref(false);

// Methods
async function onSubmit(body: Object) {
	posting.value = true;
	togglePreloader(true);

	const res = await useFetch('/api/auth', {
		body,
		method: 'post',
	});

	posting.value = false;
	togglePreloader(false);

	if (res.error.value) {
		toast(res.error.value.data.message, { error: true });
	} else {
		toast('Успешный вход!');
		navigateTo('/', { external: true });
	}
}
</script>

<style lang="scss" scoped>
.auth {
	display: grid;
	gap: 1rem;

	@include media-md-lg {
		grid-template-columns: 1fr 1fr 150px;
	}
}

.auth__submit {
	align-self: end;
}
</style>
