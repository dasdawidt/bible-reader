<script setup lang="ts">
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Listbox from "primevue/listbox";
import Divider from "primevue/divider";
import DialogueSelectButton from "./DialogueSelectButton.vue";
import { ref, computed } from "vue";
import { Book } from "@/types/bible/book";
import { useOnMobile } from "@/logic/util/MobileDetection";
import { BookTypeOldTestament } from "@/types/bible/bookTypeOldTestament";

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

const groupedBooks = computed(() => props.books.reduce<[{ name: string, books: Book[] }, { name: string, books: Book[] }]>(
    (obj, b) => {
        Object.keys(BookTypeOldTestament).includes(b.type.toString())
            ? obj[0].books = [...obj[0].books, b]
            : obj[1].books = [...obj[1].books, b];
        return obj;
    },
    [{ name: 'Old Testament', books: [] }, { name: 'New Testament', books: [] }]
));

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
        :position="isOnMobile ? 'bottom' : 'top'" dismissableMask class="w-full max-w-container"
        :class="[!isOnMobile || 'max-h-bottom-sheet']">
        <Listbox v-model="selectedBook" :options="groupedBooks" optionLabel="name" option-group-children="books"
            option-group-label="name" class="w-full" @change="visible = false" filterPlaceholder="Filter..."
            :pt="{ itemGroup: { class: 'bg-transparent' } }">
            <template #option="slotProps">
                <div class="flex align-items-center gap-2">
                    <div class="w-12 flex-shrink-0 opacity-50 overflow-hidden text-ellipsis">{{
                        slotProps.option.abbreviation?.toUpperCase() }}</div>
                    <div>{{ slotProps.option.name }}</div>
                </div>
            </template>
            <template #optiongroup="slotProps">
                <div class="flex flex-col gap-3">
                    <span>{{ slotProps.option.name }}</span>
                </div>
            </template>
        </Listbox>
        <template #footer>
            <Button label="Cancel" @click="visible = false" severity="secondary" text class="w-full" />
        </template>
    </Dialog>
</template>
