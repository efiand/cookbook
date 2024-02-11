<template>
  <v-form
    :on-submit="onSubmit"
    :validation-schema="schema"
    class="auth"
    v-slot="{ errors }"
  >
    <form-item
      label="Логин"
      name="login"
      required
      v-model="data.login"
      v-slot="{ id, field }"
    >
      <form-input
        :field="field"
        :id="id"
      />
    </form-item>
    <form-item
      label="Пароль"
      name="password"
      required
      v-model="data.password"
      v-slot="{ id, field }"
    >
      <form-input
        :field="field"
        :id="id"
        type="password"
      />
    </form-item>
    <ui-button
      :disabled="!!Object.keys(errors).length"
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

// Methods
async function onSubmit(body: Object) {
	const res = await useFetch('/api/auth', {
		body,
		method: 'post',
	});

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
