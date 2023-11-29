<script setup lang="ts">
import { computed, ref } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Listbox from "primevue/listbox";
import Avatar from "primevue/avatar";
import Divider from "primevue/divider";
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import { Passage } from "@/types/plans/passage";
import { BookType } from "@/types/bible/bookType";
import { Translation } from "@/types/bible/translation";
import { useOnMobile } from "@/logic/util/MobileDetection";
import { formatPassages, getBook, toPassageVerseList } from "@/logic/util/BibleUtils";
import DialogueSelectButton from "./DialogueSelectButton.vue";

const props = defineProps<{
    /**
     * The `Translation` to be used for the `Passage`.
     */
    translation?: Translation,
    /**
     * The selected `Passage`s.
     */
    modelValue?: Passage[],
    /**
     * The `BookType` of the `Book` from which to select `Passage`s.
     */
    book?: BookType,
}>();

const chapters = computed(() => toPassageVerseList(props.translation, props.book));

const emits = defineEmits<{
    (event: 'update:modelValue', value: Passage[]): void
}>();

const selectedPassages = computed<Passage[]>({
    get: () => props.modelValue,
    set: v => emits('update:modelValue', v.map(v2 => ({
        translationId: props.translation?.id,
        bookType: props.book,
        ...v2
    }))),
});
const pendingSelectedPassages = ref<Passage[]>([]);

const { isOnMobile } = useOnMobile();
const visible = ref(false);
const disabled = computed(() => props.translation == null || props.book == null);

function open() {
    pendingSelectedPassages.value = selectedPassages.value;
    visible.value = true;
}

function abort() {
    pendingSelectedPassages.value = [];
    visible.value = false;
}

function confirm() {
    selectedPassages.value = pendingSelectedPassages.value;
    pendingSelectedPassages.value = [];
    visible.value = false;
}

</script>

<template>
    <DialogueSelectButton @click="open" :disabled="disabled">
        <div v-if="selectedPassages?.length > 0 && !disabled" class="flex align-items-center">
            {{ formatPassages(translation, selectedPassages) }}
        </div>
        <div v-else>
            Select Verses...
        </div>
    </DialogueSelectButton>
    <Dialog v-if="!disabled" v-model:visible="visible" :closable="false" :draggable="false"
        :position="isOnMobile ? 'bottom' : 'top'" dismissable-mask modal class="w-full max-w-container">
        <template #header>
            <div class="flex flex-col w-full gap-4 -mb-5">
                <span class="text-xl font-bold">
                    Select Verses
                </span>
                <Accordion v-if="chapters">
                    <AccordionTab header="Chapters" :disabled="!chapters">
                        <div id="verse-dialogue-index" class="flex gap-2 flex-wrap justify-start items-start">
                            <a v-for="chapter of chapters" :href="`#verse-dialogue-chapter-${chapter?.chapter}`">
                                <Avatar :label="`${chapter?.chapter}`" class="p-button p-button-outlined" />
                            </a>
                        </div>
                    </AccordionTab>
                </Accordion>
            </div>
        </template>
        <Listbox v-model="pendingSelectedPassages" :options="chapters" option-group-label="chapter"
            option-group-children="passages" class="w-full" multiple :meta-key-selection="false"
            :pt="{ itemGroup: { class: 'bg-transparent' } }">
            <template #optiongroup="slotProps">
                <Divider :id="`verse-dialogue-chapter-${slotProps.option?.chapter}`">
                    <span class="text-xl font-bold">{{ getBook(translation, book).name }} {{ slotProps.option?.chapter
                    }}</span>
                </Divider>
            </template>
            <template #option="slotProps">
                <div class="flex align-items-center">
                    <div class="w-8 flex-shrink-0 opacity-50">{{ slotProps.option?.verse }}</div>
                    <div>{{ slotProps.option?.text }}</div>
                </div>
            </template>
        </Listbox>
        <template #footer>
            <div class="flex align-items-center gap-2 mt-4">
                <Button label="Cancel" @click="abort" severity="secondary" text class="w-full" />
                <Button label="Ok" @click="confirm" severity="primary" text class="w-full"
                    :disabled="pendingSelectedPassages === selectedPassages" />
            </div>
        </template>
    </Dialog>
</template>
