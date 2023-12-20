<script setup lang="ts">
import { computed } from 'vue';
import { onKeyStroke, useClipboard, useShare } from '@vueuse/core';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';

const props = defineProps<{
    title?: string;
    text?: string;
    url?: string;
    visible?: boolean;
}>();

const emit = defineEmits<{
    (event: 'update:visible', v: boolean): void;
}>();

const visibleValue = computed({
    get: () => props.visible,
    set: v => emit('update:visible', v),
});

const { add: pushToast } = useToast();

onKeyStroke('Escape', () => visibleValue.value = false, { passive: true });

// Share

const { share } = useShare();

function shareNow() {
    share({
        title: props.title,
        text: props.text,
        url: props.url,
    });
}



// Clipboard

const { copy } = useClipboard({ legacy: true });

function copyNow() {
    copy(props.text);
    pushToast({
        severity: 'success',
        summary: 'Text copied!',
        life: 3000
    });
}



// Print

function printNow() {
    window.print();
}

</script>

<template>
    <Transition enter-from-class="translate-y-10 opacity-0" leave-to-class="-translate-y-10 opacity-0">
        <div v-if="visibleValue == true" class="
                flex flex-row w-fit rounded-full p-2 gap-2 shadow-lg transition-all backdrop-blur
                border border-solid border-green-500 border-opacity-10 bg-green-500 bg-opacity-5
            ">
            <Button icon="mdi mdi-share text-2xl leading-none" rounded text @click="shareNow" />
            <Button icon="mdi mdi-content-copy text-2xl leading-none" rounded text @click="copyNow" />
            <Button icon="mdi mdi-printer text-2xl leading-none" rounded text @click="printNow" />
            <Button icon="mdi mdi-selection-ellipse-remove text-3xl leading-none" severity="secondary" rounded text
                @click="visibleValue = false" />
        </div>
    </Transition>
</template>