<script setup lang="ts">
import { useOnMobile } from '@/logic/util/MobileDetection';
import { Translation } from '@/types/bible/translation';
import { TranslationList } from '@/types/bible/translationList';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Listbox from 'primevue/listbox';
import { computed, ref } from 'vue';
import ScrollContainer from '../containment/ScrollContainer.vue';
import DialogSelectButton from './DialogSelectButton.vue';

const props = defineProps<{
    /**
     * A `TranslationList` which groups the translations based on their language.
     */
    translations?: TranslationList;
    /**
     * The selected `Translation`.
     */
    modelValue?: Translation;
    /**
     * Whether the element should show a loading state.
     */
    loading?: boolean;
}>();

const emits = defineEmits<{
    (event: 'update:modelValue', value: Translation): void;
}>();

const selectedTranslation = computed<Translation>({
    get: () => props.modelValue,
    set: (v) => emits('update:modelValue', v),
});

const options = new Map<string, HTMLDivElement>();
function scrollToSelection() {
    options.get(selectedTranslation.value?.id)?.parentElement?.scrollIntoView({
        block: 'center',
    });
}

const { isOnMobile } = useOnMobile();
const visible = ref(false);
</script>

<template>
    <DialogSelectButton
        @click="visible = true"
        @keyup.enter="visible = true"
        :disabled="loading === true"
        :loading="loading === true"
        v-bind="$attrs"
    >
        <div v-if="selectedTranslation" class="flex flex-row gap-2">
            <div class="flex-shrink-0 opacity-50 text-left">
                {{ selectedTranslation?.id?.toUpperCase() }}
            </div>
            <div>{{ selectedTranslation?.name }}</div>
        </div>
        <div v-else-if="loading !== true">
            {{ $t('prompts.select_translation') }}...
        </div>
        <div v-else>{{ $t('prompts.loading_translations') }}...</div>
    </DialogSelectButton>
    <Dialog
        v-model:visible="visible"
        :closable="false"
        :draggable="false"
        modal
        dismissable-mask
        :header="$t('prompts.select_translation')"
        :position="isOnMobile ? 'bottom' : 'top'"
        class="w-full max-w-container"
        @show="scrollToSelection"
    >
        <ScrollContainer class="max-h-bottom-sheet" pt:content:class="py-6">
            <Listbox
                v-model="selectedTranslation"
                :options="translations"
                optionGroupLabel="name"
                optionGroupChildren="translations"
                optionLabel="name"
                class="w-full h-min"
                pt:item-group:class="bg-transparent"
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
                        <div
                            class="w-16 flex-shrink-0 opacity-50 overflow-hidden text-ellipsis"
                        >
                            {{ option.id?.toUpperCase() }}
                        </div>
                        <div>{{ option.name }}</div>
                    </div>
                </template>
                <template #optiongroup="{ option }">
                    <div class="flex align-items-center">
                        <div>{{ $t(`locales.${option.id}`) }}</div>
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
