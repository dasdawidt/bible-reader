<script setup lang="ts">
import { onKeyStroke, useClipboard, useShare } from '@vueuse/core';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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

const { copy: copyToClipboard } = useClipboard({ legacy: true });
const { add: pushToast } = useToast();
const { share: pushShare } = useShare();
onKeyStroke('Escape', () => visibleValue.value = false, { passive: true });



// Share

function shareNow() {
    share: pushShare({
        title: props.title,
        text: props.text,
        url: props.url,
    });
}



// Copy Link

function copyLinkNow() {
    copyToClipboard(props.url);
    pushToast({
        severity: 'success',
        summary: t('prompts.copy_url_success'),
        life: 3000
    });
}



// Copy Text

function copyNow() {
    copyToClipboard(props.text);
    pushToast({
        severity: 'success',
        summary: t('prompts.copy_text_success'),
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
                flex flex-row w-fit rounded-full p-2 gap-2 shadow-md transition-all backdrop-blur-sm
                bg-green-500 bg-opacity-5
            ">
            <Button icon="mdi mdi-share text-2xl leading-none" rounded text @click="shareNow" />
            <Button icon="mdi mdi-link-variant text-2xl leading-none" rounded text @click="copyLinkNow" />
            <Button icon="mdi mdi-content-copy text-2xl leading-none" rounded text @click="copyNow" />
            <Button icon="mdi mdi-printer text-2xl leading-none" rounded text @click="printNow" />
            <Button icon="mdi mdi-selection-ellipse-remove text-3xl leading-none" severity="secondary" rounded text
                @click="visibleValue = false" class="opacity-35" />
        </div>
    </Transition>
</template>