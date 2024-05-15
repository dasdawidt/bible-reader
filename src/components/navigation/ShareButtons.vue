<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import {
    mdiContentCopy,
    mdiLinkVariant,
    mdiPrinter,
    mdiSelectionEllipseRemove,
    mdiShare,
} from '@mdi/js';
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
    set: (v) => emit('update:visible', v),
});

const { copy: copyToClipboard } = useClipboard({ legacy: true });
const { add: pushToast } = useToast();
const { share: pushShare } = useShare();

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
        life: 3000,
    });
}

// Copy Text

function copyNow() {
    copyToClipboard(props.text);
    pushToast({
        severity: 'success',
        summary: t('prompts.copy_text_success'),
        life: 3000,
    });
}

// Print

function printNow() {
    window.print();
}

// Keybindings

onKeyStroke('Escape', () => (visibleValue.value = false), { passive: true });
onKeyStroke(
    (e) => e.ctrlKey && e.code === 'KeyC',
    () => {
        if (visibleValue.value) {
            copyNow();
        }
    },
    { passive: true }
);
</script>

<template>
    <Transition
        enter-from-class="translate-y-10 opacity-0"
        leave-to-class="-translate-y-10 opacity-0"
    >
        <div
            v-if="visibleValue == true"
            class="flex flex-row w-fit rounded-full p-2 gap-2 shadow-md transition-all backdrop-blur-sm bg-green-500 bg-opacity-5"
        >
            <Button rounded text @click="shareNow">
                <template #icon>
                    <SvgIcon
                        class="!scale-150"
                        type="mdi"
                        size="16"
                        :path="mdiShare"
                    />
                </template>
            </Button>
            <Button rounded text @click="copyLinkNow">
                <template #icon>
                    <SvgIcon
                        class="!scale-150"
                        type="mdi"
                        size="16"
                        :path="mdiLinkVariant"
                    />
                </template>
            </Button>
            <Button rounded text @click="copyNow">
                <template #icon>
                    <SvgIcon
                        class="!scale-150"
                        type="mdi"
                        size="16"
                        :path="mdiContentCopy"
                    />
                </template>
            </Button>
            <Button rounded text @click="printNow">
                <template #icon>
                    <SvgIcon
                        class="!scale-150"
                        type="mdi"
                        size="16"
                        :path="mdiPrinter"
                    />
                </template>
            </Button>
            <Button
                severity="secondary"
                rounded
                text
                @click="visibleValue = false"
                class="opacity-35"
            >
                <template #icon>
                    <SvgIcon
                        class="!scale-[1.75]"
                        type="mdi"
                        size="16"
                        :path="mdiSelectionEllipseRemove"
                    />
                </template>
            </Button>
        </div>
    </Transition>
</template>
