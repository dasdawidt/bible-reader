<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import {
    mdiDotsVertical,
    mdiDotsVerticalCircle,
    mdiDotsVerticalCircleOutline,
    mdiFullscreen,
    mdiFullscreenExit,
    mdiPrinter,
} from '@mdi/js';
import { useFullscreen } from '@vueuse/core';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Menu from 'primevue/menu';
import { MenuItem } from 'primevue/menuitem';
import { computed, ref } from 'vue';
import { useOnMobile } from '@/logic/util/MobileDetection';
import ScrollContainer from '../containment/ScrollContainer.vue';

const { isOnMobile } = useOnMobile();
const { isSupported, isFullscreen, toggle } = useFullscreen();
const visible = ref(false);

const items = computed<MenuItem[]>(() => [
    {
        messageCode: 'prompts.print_chapter',
        icon: mdiPrinter,
        command: () => window.print(),
    },
    {
        messageCode: isFullscreen.value ? 'prompts.fullscreen_exit' : 'prompts.fullscreen_enter',
        disabled: !isSupported.value,
        icon: isFullscreen.value ? mdiFullscreenExit : mdiFullscreen,
        command: toggle,
    },
]);

const selectedCommand = ref<() => unknown>();
function runCommand(command: (...args: unknown[]) => unknown = () => {}) {
    selectedCommand.value = () => {
        command();
        selectedCommand.value = () => {};
    };
    visible.value = false;
}
</script>

<template>
    <Button
        severity="secondary"
        v-bind="$attrs"
        rounded
        text
        @click="visible = true"
    >
        <template #icon>
            <SvgIcon
                class="!scale-150"
                size="16"
                type="mdi"
                :path="mdiDotsVertical"
            />
        </template>
    </Button>
    <Dialog
        @after-hide="selectedCommand"
        v-model:visible="visible"
        :closable="false"
        :draggable="false"
        modal
        dismissable-mask
        :header="$t('prompts.more_actions')"
        :position="isOnMobile ? 'bottom' : 'top'"
        class="w-full max-w-container"
        pt:content:class="overflow-hidden"
    >
        <ScrollContainer class="max-h-bottom-sheet">
            <Menu :model="items" pt:root:class="bg-transparent">
                <template #item="{ item }">
                    <div
                        class="p-menuitem-link flex flex-row gap-4"
                        @click="runCommand(item.command)"
                    >
                        <SvgIcon
                            class="!scale-150 opacity-75"
                            size="16"
                            type="mdi"
                            :path="item.icon"
                        />
                        {{ $t(item.messageCode) }}
                    </div>
                </template>
            </Menu>
        </ScrollContainer>
        <template #footer>
            <Button
                :label="$t('prompts.cancel')"
                @click="visible = false"
                severity="secondary"
                text
                class="w-full"
            />
        </template>
    </Dialog>
</template>
