<script setup lang="ts">
import { ref, computed } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Listbox from "primevue/listbox";
import { Book } from "@/types/bible/book";
import { useOnMobile } from "@/logic/util/MobileDetection";
import DialogueSelectButton from "./DialogueSelectButton.vue";

const props = defineProps<{
    /**
     * A list of `Book`s from which to choose one.
     */
    books?: Book[],
    /**
     * The selected `Book`.
     */
    modelValue?: Book
}>();

const emits = defineEmits<{
    (event: 'update:modelValue', value: Book): void
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
        <div v-if="selectedBook && !disabled" class="flex align-items-center">
            <div class="w-12 flex-shrink-0 opacity-50 text-left">{{ selectedBook?.abbreviation.toUpperCase() }}</div>
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
                <div class="flex align-items-center">
                    <div class="w-12 flex-shrink-0 opacity-50">{{ slotProps.option.abbreviation?.toUpperCase() }}</div>
                    <div>{{ slotProps.option.name }}</div>
                </div>
            </template>
        </Listbox>
        <template #footer>
            <Button label="Cancel" @click="visible = false" severity="secondary" text class="w-full" />
        </template>
    </Dialog>
</template>
