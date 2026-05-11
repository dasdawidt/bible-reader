<script setup lang="ts">
import { mdiCheckDecagram } from '@mdi/js';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Listbox from 'primevue/listbox';
import { ref } from 'vue';
import { useOnMobile } from '@/logic/util/MobileDetection';
import type { Translation } from '@/types/bible/translation';
import type { TranslationList } from '@/types/bible/translationList';
import ScrollContainer from '../containment/ScrollContainer.vue';
import MdiIconInline from '../icons/MdiIconInline.vue';
import DialogSelectButton from './DialogSelectButton.vue';

const HIGHLIGHTED_TRANSLATION_IDS = ['LUT', 'KJV'];

const props = defineProps<{
    /**
     * A `TranslationList` which groups the translations based on their language.
     */
    translations?: TranslationList;
    /**
     * Whether the element should show a loading state.
     */
    loading?: boolean;
}>();

const translation = defineModel<Translation>();

const options = new Map<string, HTMLDivElement>();
function scrollToSelection() {
    if (translation.value) {
        options.get(translation.value.id)?.parentElement?.scrollIntoView({
            block: 'center',
        });
    }
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
        <div v-if="translation" class="flex flex-row gap-2">
            <div class="shrink-0 opacity-40 text-left font-medium">
                {{ translation?.id?.toUpperCase() }}
            </div>
            <div>{{ translation?.name }}</div>
        </div>
        <div v-else-if="loading !== true">{{ $t('prompts.select_translation') }}...</div>
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
                v-model="translation"
                :options="translations"
                optionGroupLabel="name"
                optionGroupChildren="translations"
                optionLabel="name"
                class="w-full h-min"
                pt:item-group:class="bg-transparent"
                @change="visible = false"
            >
                <template #option="{ option }">
                    <div class="flex items-center" :ref="(el) => options.set(option.number, el as HTMLDivElement)">
                        <span class="w-16 shrink-0 opacity-40 overflow-hidden text-ellipsis font-medium">
                            {{ option.id?.toUpperCase() }}
                        </span>
                        <span class="grow">{{ option.name }}</span>
                        <MdiIconInline
                            v-if="HIGHLIGHTED_TRANSLATION_IDS.includes(option.id)"
                            class="*:opacity-40"
                            :icon="mdiCheckDecagram"
                        />
                    </div>
                </template>
                <template #optiongroup="{ option }">
                    <div class="flex items-center">
                        <div>{{ $t(`locales.${option.id}`) }}</div>
                    </div>
                </template>
            </Listbox>
        </ScrollContainer>
        <template #footer>
            <Button :label="$t('prompts.cancel')" @click="visible = false" severity="secondary" text class="w-full" />
        </template>
    </Dialog>
</template>
