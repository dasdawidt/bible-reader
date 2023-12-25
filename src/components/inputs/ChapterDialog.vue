<script setup lang="ts">
import { ref, computed } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Listbox from "primevue/listbox";
import { useOnMobile } from "@/logic/util/MobileDetection";
import DialogSelectButton from "./DialogSelectButton.vue";
import { Chapter } from "@/types/bible/chapter";
import ScrollContainer from "../containment/ScrollContainer.vue";

const props = defineProps<{
    /**
     * A list of `Chapters`s from which to choose one.
     */
    chapters?: Chapter[],
    /**
     * The selected `Chapter`.
     */
    modelValue?: Chapter,
    /**
     * The name of the currently selected `Book`.
     */
    bookName?: string
}>();

const emits = defineEmits<{
    (event: 'update:modelValue', value: Chapter): void
}>();

const selectedChapter = computed({
    get: () => props.modelValue,
    set: v => emits('update:modelValue', v)
});

const { isOnMobile } = useOnMobile();
const visible = ref(false);
const disabled = computed(() => props.chapters == null);
</script>

<template>
    <DialogSelectButton @click="visible = true" @keyup.enter="visible = true" :disabled="disabled">
        <div v-if="selectedChapter && !disabled" class="flex align-items-center">
            <div>{{ bookName ?? 'Chapter' }} {{ selectedChapter?.number }}</div>
        </div>
        <div v-else>
            Select Chapter...
        </div>
    </DialogSelectButton>
    <Dialog v-model:visible="visible" :closable="false" :draggable="false" modal dismissable-mask header="Select Chapter"
        :position="isOnMobile ? 'bottom' : 'top'" class="w-full max-w-container"
        :pt="{ content: { class: 'overflow-hidden' } }">
        <ScrollContainer class="max-h-bottom-sheet">
            <Listbox v-model="selectedChapter" :options="chapters" class="w-full" @change="visible = false"
                filterPlaceholder="Filter...">
                <template #option="slotProps">
                    <div class="flex align-items-center">
                        <div>{{ bookName ?? 'Chapter' }} {{ slotProps.option.number }}</div>
                    </div>
                </template>
            </Listbox>
        </ScrollContainer>
        <template #footer>
            <Button label="Cancel" @click="visible = false" severity="secondary" text class="w-full" />
        </template>
    </Dialog>
</template>
