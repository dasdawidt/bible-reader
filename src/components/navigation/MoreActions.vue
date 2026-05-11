<script setup lang="ts">
import { mdiDotsVertical, mdiFullscreen, mdiFullscreenExit, mdiPrinter } from '@mdi/js';
import { useFullscreen } from '@vueuse/core';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Menu from 'primevue/menu';
import type { MenuItem } from 'primevue/menuitem';
import { computed, ref } from 'vue';
import SvgIcon from '@/components/icons/MdiIcon.vue';
import { useOnMobile } from '@/logic/util/MobileDetection';
import ScrollContainer from '../containment/ScrollContainer.vue';

const { isOnMobile } = useOnMobile();
const { isSupported, isFullscreen, toggle } = useFullscreen();
const visible = ref(false);

const items = computed<MenuItem[]>(() => [
    {
        messageCode: 'prompts.print_chapter',
        icon: mdiPrinter,
        command: window.print,
    },
    {
        messageCode: isFullscreen.value ? 'prompts.fullscreen_exit' : 'prompts.fullscreen_enter',
        disabled: !isSupported.value,
        icon: isFullscreen.value ? mdiFullscreenExit : mdiFullscreen,
        command: toggle,
    },
]);

let selectedCommand: (() => void) | undefined;
function runSelectedCommand() {
    if (selectedCommand !== undefined) {
        selectedCommand();
        selectedCommand = undefined;
    }
}
function selectCommand(originalEvent: Event, item: MenuItem) {
    const command = item.command;
    if (command !== undefined) {
        selectedCommand = () => command({ originalEvent, item });
        visible.value = false;
    }
}
</script>

<template>
    <Button severity="secondary" v-bind="$attrs" rounded text @click="visible = true">
        <template #icon>
            <SvgIcon :icon="mdiDotsVertical" />
        </template>
    </Button>
    <Dialog
        @after-hide="runSelectedCommand"
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
                    <div class="p-menuitem-link flex flex-row gap-4" @click="e => selectCommand(e, item)">
                        <SvgIcon class="opacity-75" :icon="item.icon" />
                        {{ $t(item.messageCode) }}
                    </div>
                </template>
            </Menu>
        </ScrollContainer>
        <template #footer>
            <Button class="w-full" :label="$t('prompts.cancel')" @click="visible = false" severity="secondary" text />
        </template>
    </Dialog>
</template>
