<script setup lang="ts">
import { useOnMobile } from '@/logic/util/MobileDetection';
import { Book } from '@/types/bible/book';
import { BookType } from '@/types/bible/bookType';
import { BookTypeOldTestament } from '@/types/bible/bookTypeOldTestament';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Listbox from 'primevue/listbox';
import { computed, ref } from 'vue';
import ScrollContainer from '../containment/ScrollContainer.vue';
import DialogSelectButton from './DialogSelectButton.vue';

const props = defineProps<{
    /**
     * A list of `Book`s from which to choose one.
     */
    books?: Book[];
    /**
     * The selected `Book`.
     */
    modelValue?: Book;
}>();

const emits = defineEmits<{
    (event: 'update:modelValue', value: Book): void;
}>();

const selectedBook = computed({
    get: () => props.modelValue,
    set: (v) => emits('update:modelValue', v),
});

const groupedBooks = computed(() =>
    props.books.reduce<
        [
            { messageCode: string; books: Book[] },
            { messageCode: string; books: Book[] },
        ]
    >(
        (obj, b) => {
            Object.keys(BookTypeOldTestament).includes(b.type)
                ? (obj[0].books = [...obj[0].books, b])
                : (obj[1].books = [...obj[1].books, b]);
            return obj;
        },
        [
            { messageCode: 'bible.old_testament', books: [] },
            { messageCode: 'bible.new_testament', books: [] },
        ]
    )
);

const options = new Map<BookType, HTMLDivElement>();
function scrollToSelection() {
    options.get(selectedBook.value?.type)?.parentElement?.scrollIntoView({
        block: 'center',
    });
}

const { isOnMobile } = useOnMobile();
const visible = ref(false);
const disabled = computed(() => props.books == null);
</script>

<template>
    <DialogSelectButton
        @click="visible = true"
        @keyup.enter="visible = true"
        :disabled="disabled"
        v-bind="$attrs"
    >
        <div v-if="selectedBook && !disabled" class="flex flex-row gap-2">
            <div class="flex-shrink-0 opacity-50 text-left">
                {{ selectedBook?.abbreviation.toUpperCase() }}
            </div>
            <div>{{ selectedBook?.name }}</div>
        </div>
        <div v-else>{{ $t('prompts.select_book') }}...</div>
    </DialogSelectButton>
    <Dialog
        v-model:visible="visible"
        :closable="false"
        :draggable="false"
        modal
        dismissable-mask
        :header="$t('prompts.select_book')"
        :position="isOnMobile ? 'bottom' : 'top'"
        class="w-full max-w-container"
        @show="scrollToSelection"
    >
        <ScrollContainer
            class="max-h-bottom-sheet mt-1"
            pt:content:class="py-6"
        >
            <Listbox
                v-model="selectedBook"
                :options="groupedBooks"
                optionLabel="name"
                option-group-children="books"
                option-group-label="name"
                class="w-full h-min"
                pt:item-group:class="bg-transparent"
                @change="visible = false"
            >
                <template #option="{ option }">
                    <div
                        class="flex align-items-center gap-2"
                        :ref="
                            (el) =>
                                options.set(option.type, el as HTMLDivElement)
                        "
                    >
                        <div
                            class="w-16 flex-shrink-0 opacity-50 overflow-hidden text-ellipsis"
                        >
                            {{ option.abbreviation?.toUpperCase() }}
                        </div>
                        <div>{{ option.name }}</div>
                    </div>
                </template>
                <template #optiongroup="{ option }">
                    <div class="flex flex-col gap-3">
                        <span>{{ $t(option.messageCode) }}</span>
                    </div>
                </template>
            </Listbox>
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
