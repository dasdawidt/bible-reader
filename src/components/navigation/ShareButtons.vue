<script setup lang="ts">
import { mdiContentCopy, mdiLinkVariant, mdiPrinter, mdiSelectionEllipseRemove, mdiShare } from '@mdi/js';
import { onKeyStroke, useClipboard, useEventListener, useShare } from '@vueuse/core';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import SvgIcon from '@/components/icons/MdiIcon.vue';

const { t } = useI18n();

const props = defineProps<{
    title?: string;
    text?: string;
    url?: string;
}>();

const visible = defineModel<boolean>('visible');
const hideUnselected = defineModel<boolean>('hideUnselected', {
    default: false,
});

const { copy: copyToClipboard } = useClipboard({ legacy: true });
const { add: pushToast } = useToast();
const { share: pushShare } = useShare();

// Share

function shareNow() {
    pushShare({
        title: props.title,
        text: props.text,
        url: props.url,
    });
}

// Copy Link

function copyLinkNow() {
    if (props.url) {
        copyToClipboard(props.url);
        pushToast({
            severity: 'success',
            summary: t('prompts.copy_url_success'),
            life: 3000,
        });
    }
}

// Copy Text

function copyNow() {
    if (props.text) {
        copyToClipboard(props.text);
        pushToast({
            severity: 'success',
            summary: t('prompts.copy_text_success'),
            life: 3000,
        });
    }
}

// Print

async function printNow() {
    hideUnselected.value = true;
    const isAndroidChrome = /Android/i.test(navigator.userAgent) && /Chrome/i.test(navigator.userAgent);
    const event = isAndroidChrome ? 'focus' : 'afterprint';
    useEventListener(event, () => (hideUnselected.value = false), { once: true });
    await nextTick();
    window.print();
}

// Keybindings

onKeyStroke(
    'Escape',
    () => {
        visible.value = false;
    },
    { passive: true },
);
onKeyStroke(
    (e) => e.ctrlKey && e.code === 'KeyC',
    () => {
        if (visible.value) {
            copyNow();
        }
    },
    { passive: true },
);
</script>

<template>
    <Transition enter-from-class="translate-y-10 opacity-0" leave-to-class="-translate-y-10 opacity-0">
        <div
            v-if="visible"
            class="flex flex-row w-fit rounded-full p-2 gap-2 shadow-md transition-all backdrop-blur-xs bg-green-500/5 border border-green-500/5"
        >
            <Button rounded text @click="shareNow">
                <template #icon>
                    <SvgIcon :icon="mdiShare" />
                </template>
            </Button>
            <Button rounded text @click="copyLinkNow">
                <template #icon>
                    <SvgIcon :icon="mdiLinkVariant" />
                </template>
            </Button>
            <Button rounded text @click="copyNow">
                <template #icon>
                    <SvgIcon :icon="mdiContentCopy" />
                </template>
            </Button>
            <Button rounded text @click="printNow">
                <template #icon>
                    <SvgIcon :icon="mdiPrinter" />
                </template>
            </Button>
            <Button severity="secondary" rounded text @click="visible = false" class="opacity-35">
                <template #icon>
                    <SvgIcon class="scale-125" :icon="mdiSelectionEllipseRemove" />
                </template>
            </Button>
        </div>
    </Transition>
</template>
