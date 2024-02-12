<script setup lang="ts">
import { useOnMobile } from "@/logic/util/MobileDetection";
import { Book } from "@/types/bible/book";
import { BookTypeOldTestament } from "@/types/bible/bookTypeOldTestament";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Listbox from "primevue/listbox";
import { computed, ref } from "vue";
import ScrollContainer from "../containment/ScrollContainer.vue";
import DialogSelectButton from "./DialogSelectButton.vue";

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

const groupedBooks = computed(() => props.books.reduce<[{ messageCode: string, books: Book[] }, { messageCode: string, books: Book[] }]>(
    (obj, b) => {
        Object.keys(BookTypeOldTestament).includes(b.type)
            ? obj[0].books = [...obj[0].books, b]
            : obj[1].books = [...obj[1].books, b];
        return obj;
    },
    [{ messageCode: 'bible.old_testament', books: [] }, { messageCode: 'bible.new_testament', books: [] }]
));

const { isOnMobile } = useOnMobile();
const visible = ref(false);
const disabled = computed(() => props.books == null);
</script>

<template>
    <DialogSelectButton @click="visible = true" @keyup.enter="visible = true" :disabled="disabled" v-bind="$attrs">
        <div v-if="selectedBook && !disabled" class="flex align-items-center gap-2">
            <div class="flex-shrink-0 opacity-50 text-left">{{ selectedBook?.abbreviation.toUpperCase() }}</div>
            <div>{{ selectedBook?.name }}</div>
        </div>
        <div v-else>
            {{ $t('prompts.select_book') }}...
        </div>
    </DialogSelectButton>
    <Dialog v-model:visible="visible" :closable="false" :draggable="false" modal dismissable-mask
        :header="$t('prompts.select_book')" :position="isOnMobile ? 'bottom' : 'top'" class="w-full max-w-container"
        :pt="{ content: { class: 'overflow-hidden' } }">
        <ScrollContainer class="max-h-bottom-sheet">
            <Listbox v-model="selectedBook" :options="groupedBooks" optionLabel="name" option-group-children="books"
                option-group-label="name" class="w-full h-min" @change="visible = false"
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
                        <span>{{ $t(slotProps.option.messageCode) }}</span>
                    </div>
                </template>
            </Listbox>
        </ScrollContainer>
        <template #footer>
            <Button :label="$t('prompts.cancel')" @click="visible = false" severity="secondary" text class="w-full" />
        </template>
    </Dialog>
</template>
