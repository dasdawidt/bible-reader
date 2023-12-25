<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Listbox from "primevue/listbox";
import { Translation } from "@/types/bible/translation";
import { TranslationList } from "@/types/bible/translationList";
import { useOnMobile } from "@/logic/util/MobileDetection";
import DialogSelectButton from "./DialogSelectButton.vue";
import ScrollContainer from "../containment/ScrollContainer.vue";
import { useFocus } from "@vueuse/core";

const props = defineProps<{
    /**
     * A `TranslationList` which groups the translations based on their language.
     */
    translations?: TranslationList;
    /**
     * The selected `Translation`.
     */
    modelValue?: Translation;
}>();

const emits = defineEmits<{
    (event: 'update:modelValue', value: Translation): void
}>();

const selectedTranslation = computed<Translation>({
    get: () => props.modelValue,
    set: v => emits('update:modelValue', v),
});

const { isOnMobile } = useOnMobile();

const visible = ref(false);
</script>

<template>
    <DialogSelectButton @click="visible = true" @keyup.enter="visible = true">
        <div v-if="selectedTranslation" class="flex flex-row">
            <div class="w-12 flex-shrink-0 opacity-50 text-left">{{ selectedTranslation?.id?.toUpperCase() }}</div>
            <div>{{ selectedTranslation?.name }}</div>
        </div>
        <div v-else>
            Select Translation...
        </div>
    </DialogSelectButton>
    <Dialog v-model:visible="visible" :closable="false" :draggable="false" modal dismissable-mask
        header="Select Translation" :position="isOnMobile ? 'bottom' : 'top'" class="w-full max-w-container"
        :pt="{ content: { class: 'overflow-hidden' } }">
        <ScrollContainer class="max-h-bottom-sheet">
            <Listbox v-model="selectedTranslation" :options="translations" optionGroupLabel="name"
                optionGroupChildren="translations" optionLabel="name" class="w-full" @change="visible = false"
                filterPlaceholder="Filter..." :pt="{ itemGroup: { class: 'bg-transparent' } }">
                <template #option="slotProps">
                    <div class="flex align-items-center">
                        <div class="w-12 flex-shrink-0 opacity-50">{{ slotProps.option.id?.toUpperCase() }}</div>
                        <div>{{ slotProps.option.name }}</div>
                    </div>
                </template>
                <template #optiongroup="slotProps">
                    <div class="flex align-items-center">
                        <div>{{ slotProps.option.name }}</div>
                    </div>
                </template>
            </Listbox>
        </ScrollContainer>
        <template #footer>
            <Button label="Cancel" @click="visible = false" severity="secondary" text class="w-full" />
        </template>
    </Dialog>
</template>
