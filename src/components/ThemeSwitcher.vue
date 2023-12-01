<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { changeTheme } from '@/logic/util/Theme';
import InputSwitch from 'primevue/inputswitch';

const darkModeValue = ref(true);
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
        ? changeTheme('light', 'dark', 'theme-link')
        : changeTheme('dark', 'light', 'theme-link');
}

onBeforeMount(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        darkMode.value = true;
    } else {
        darkMode.value = false;
    }
});

</script>

<template>
    <InputSwitch v-model="darkMode" v-if="false" />
</template>
