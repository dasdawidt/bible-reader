<script setup lang="ts">
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Listbox from 'primevue/listbox';
import { computed, ref } from 'vue';
import { useOnMobile } from '@/logic/util/MobileDetection';
import { Chapter } from '@/types/bible/chapter';
import ScrollContainer from '../containment/ScrollContainer.vue';
import DialogSelectButton from './DialogSelectButton.vue';

const props = defineProps<{
    /**
     * A list of `Chapters`s from which to choose one.
     */
    chapters?: Chapter[];
    /**
     * The selected `Chapter`.
     */
    modelValue?: Chapter;
    /**
     * The name of the currently selected `Book`.
     */
    bookName?: string;
}>();

const emits = defineEmits<(event: 'update:modelValue', value: Chapter) => void>();

const selectedChapter = computed({
    get: () => props.modelValue,
    set: (v) => emits('update:modelValue', v),
});

const options = new Map<number, HTMLDivElement>();
function scrollToSelection() {
    options.get(selectedChapter.value?.number)?.parentElement?.scrollIntoView({
        block: 'center',
    });
}

const { isOnMobile } = useOnMobile();
const visible = ref(false);
const disabled = computed(() => props.chapters == null);
</script>

<template>
    <DialogSelectButton
        @click="visible = true"
        @keyup.enter="visible = true"
        :disabled="disabled"
        v-bind="$attrs"
    >
        <div
            v-if="selectedChapter && !disabled"
            class="flex align-items-center"
        >
            <div>
                {{ bookName ?? $t('bible.chapter') }}
                {{ selectedChapter?.number }}
            </div>
        </div>
        <div v-else>{{ $t('prompts.select_chapter') }}...</div>
    </DialogSelectButton>
    <Dialog
        v-model:visible="visible"
        :closable="false"
        :draggable="false"
        modal
        dismissable-mask
        :header="$t('prompts.select_chapter')"
        :position="isOnMobile ? 'bottom' : 'top'"
        class="w-full max-w-container"
        @show="scrollToSelection"
    >
        <ScrollContainer class="max-h-bottom-sheet" pt:content:class="py-6">
            <Listbox
                v-model="selectedChapter"
                :options="chapters"
                class="w-full"
                @change="visible = false"
            >
                <template #option="{ option }">
                    <div
                        class="flex align-items-center"
                        :ref="
                            (el) =>
                                options.set(option.number, el as HTMLDivElement)
                        "
                    >
                        <div>
                            {{ bookName ?? $t('prompts.select_chapter') }}
                            {{ option.number }}
                        </div>
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
