<script setup lang="ts">
import { useOnMobile } from "@/logic/util/MobileDetection";
import { useFocus } from "@vueuse/core";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from "primevue/inputtext";
import { ref } from "vue";

const props = defineProps();

const emits = defineEmits();

const { isOnMobile } = useOnMobile();
const visible = ref(false);
const searchBar = ref<HTMLElement>();
const { focused } = useFocus(searchBar);
const search = ref('');
</script>

<template>
    <Button icon="mdi-magnify" icon-class="mdi scale-150" :label="$t('prompts.search')" severity="secondary" text
        @click="visible = true" @keyup.enter="visible = true" v-bind="$attrs" />
    <Dialog v-model:visible="visible" :closable="false" :draggable="false" modal dismissable-mask
        :position="isOnMobile ? 'bottom' : 'top'" class="w-full max-w-container"
        :pt="{ content: { class: 'overflow-hidden' } }" @show="focused = true">
        <template #header>
            <IconField iconPosition="left" class="w-full">
                <InputIcon>
                    <i class="mdi mdi-magnify scale-150 px-1" />
                </InputIcon>
                <InputText class="w-full" v-model="search" :placeholder="$t('prompts.search')" ref="searchBar" />
            </IconField>
        </template>
        <template #default>
            {{ search }}
        </template>
        <template #footer>
            <Button :label="$t('prompts.close')" @click="visible = false" severity="secondary" text class="w-full" />
        </template>
    </Dialog>
</template>
