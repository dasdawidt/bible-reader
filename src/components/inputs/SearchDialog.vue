<script setup lang="ts">
import { useOnMobile } from '@/logic/util/MobileDetection';
import { mdiMagnify } from '@mdi/js';
import { refDebounced, useFocus } from '@vueuse/core';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import SvgIcon from '@jamescoyle/vue-icon';
import { ref } from 'vue';

const props = defineProps();

const emits = defineEmits();

const { isOnMobile } = useOnMobile();
const visible = ref(false);
const searchBar = ref<HTMLElement>();
const { focused } = useFocus(searchBar);
const search = ref('');
const searchDebounced = refDebounced(search, 500);

function reset() {
    search.value = '';
}
</script>

<template>
    <Button
        v-bind="$attrs"
        class="whitespace-nowrap"
        :label="$t('prompts.search')"
        @click="visible = true"
        @keyup.enter="visible = true"
        severity="secondary"
        text
        :pt="{
            root: { class: 'flex flex-row gap-2.5' },
            label: { class: 'text-ellipsis overflow-hidden' },
        }"
    >
        <template #icon>
            <SvgIcon
                class="!scale-150"
                type="mdi"
                size="16"
                :path="mdiMagnify"
            />
        </template>
    </Button>
    <Dialog
        v-model:visible="visible"
        :closable="false"
        :draggable="false"
        modal
        dismissable-mask
        :position="isOnMobile ? 'bottom' : 'top'"
        class="w-full max-w-container"
        :pt="{ content: { class: 'overflow-hidden' } }"
        @show="focused = true"
        @hide="reset"
    >
        <template #header>
            <IconField iconPosition="left" class="w-full">
                <InputIcon>
                    <SvgIcon
                        class="!scale-150 mx-0.5"
                        type="mdi"
                        size="16"
                        :path="mdiMagnify"
                    />
                </InputIcon>
                <InputText
                    class="w-full"
                    v-model="search"
                    :placeholder="$t('prompts.search')"
                    ref="searchBar"
                />
            </IconField>
        </template>
        <template #default>
            {{ searchDebounced }}
        </template>
        <template #footer>
            <Button
                :label="$t('prompts.close')"
                @click="visible = false"
                severity="secondary"
                text
                class="w-full"
            />
        </template>
    </Dialog>
</template>
