<script setup lang="ts">
import InputSwitch from 'primevue/inputswitch';
import { ref } from 'vue';
import { usePrimeVue } from 'primevue/config';

const primeVue = usePrimeVue();
const darkMode = ref(false);

function toggleDarkMode() {
    if (!darkMode.value) {
        primeVue.changeTheme('light', 'dark', 'theme-link');
    } else {
        primeVue.changeTheme('dark', 'light', 'theme-link');
    }
    darkMode.value = !darkMode.value;
}

document.addEventListener('keyup', e => {
    if (e.altKey && e.key == 't') {
        e.preventDefault();
        toggleDarkMode();
    }
})

</script>

<template>
    <InputSwitch v-model="darkMode" @change="toggleDarkMode" />
</template>
