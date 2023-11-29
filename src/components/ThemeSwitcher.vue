<script setup lang="ts">
import { computed, ref } from 'vue';
import InputSwitch from 'primevue/inputswitch';
import { usePrimeVue } from 'primevue/config';

const primeVue = usePrimeVue();
const darkModeValue = ref(false);
const darkMode = computed({
    get: () => darkModeValue.value,
    set: newValue => {
        darkModeValue.value = newValue;
        updateDarkTheme();
    }
});

document.addEventListener('keyup', e => {
    if (e.altKey && e.key == 't') {
        e.preventDefault();
        darkMode.value = !darkMode.value;
    }
});

function updateDarkTheme() {
    darkMode.value
        ? primeVue.changeTheme('light', 'dark', 'theme-link')
        : primeVue.changeTheme('dark', 'light', 'theme-link');
}

</script>

<template>
    <InputSwitch v-model="darkMode" v-if="false" />
</template>
