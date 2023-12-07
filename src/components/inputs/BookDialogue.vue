<script setup lang="ts">
import { ref, computed } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Listbox from "primevue/listbox";
import { useOnMobile } from "@/logic/util/MobileDetection";
import DialogueSelectButton from "./DialogueSelectButton.vue";
import { BookInfo } from "@/types/bible/bookInfo";

const props = defineProps<{
    /**
     * A list of `Book`s from which to choose one.
     */
    books?: BookInfo[],
    /**
     * The selected `Book`.
     */
    modelValue?: BookInfo
}>();

const emits = defineEmits<{
    (event: 'update:modelValue', value: BookInfo): void
}>();

const selectedBook = computed({
    get: () => props.modelValue,
    set: v => emits('update:modelValue', v)
});

const { isOnMobile } = useOnMobile();
const visible = ref(false);
const disabled = computed(() => props.books == null);
</script>

<template>
    <DialogueSelectButton @click="visible = true" :disabled="disabled">
        <div v-if="selectedBook && !disabled" class="flex align-items-center gap-2">
            <div class="flex-shrink-0 opacity-50 text-left">{{ selectedBook?.abbreviation.toUpperCase() }}</div>
            <div>{{ selectedBook?.name }}</div>
        </div>
        <div v-else>
            Select Book...
        </div>
    </DialogueSelectButton>
    <Dialog v-model:visible="visible" :closable="false" :draggable="false" modal header="Select Book"
        :position="isOnMobile ? 'bottom' : 'top'" dismissableMask class="w-full max-w-container">
        <Listbox v-model="selectedBook" :options="books" optionLabel="name" class="w-full" @change="visible = false"
            filterPlaceholder="Filter...">
            <template #option="slotProps">
                <div class="flex align-items-center gap-2">
                    <div class="w-12 flex-shrink-0 opacity-50 overflow-hidden text-ellipsis">{{
                        slotProps.option.abbreviation?.toUpperCase() }}</div>
                    <div>{{ slotProps.option.name }}</div>
                </div>
            </template>
        </Listbox>
        <template #footer>
            <Button label="Cancel" @click="visible = false" severity="secondary" text class="w-full" />
        </template>
    </Dialog>
</template>
