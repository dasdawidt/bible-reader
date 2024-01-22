<script setup lang="ts">
import { useSettings } from '@/plugins/SettingsPlugin';
import InputSwitch from 'primevue/inputswitch';
import { computed, ref } from 'vue';
const { persistenceEnabled } = useSettings();
const value = computed({
    get: () => persistenceEnabled.value,
    set: v => persistenceEnabled.value = v
});
</script>

<template>
    <InputSwitch v-model="value" binary />
    {{ value }}
</template>