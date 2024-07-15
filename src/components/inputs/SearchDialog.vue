<script setup lang="ts">
import { useIndexList } from '@/logic/indexes';
import { useOnMobile } from '@/logic/util/MobileDetection';
import { IndexedVerse } from '@/types/index/indexedVerse';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiMagnify } from '@mdi/js';
import { refDebounced, useFocus } from '@vueuse/core';
import Fuse, { FuseResult } from 'fuse.js';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import IconField from 'primevue/iconfield';
import InputGroup from 'primevue/inputgroup';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps();

const emits = defineEmits();

const { isOnMobile } = useOnMobile();
const visible = ref(false);
const searchBar = ref<HTMLElement>();
const { focused } = useFocus(searchBar);
const search = ref('');
const searchDebounced = refDebounced(search, 500);

function reset() {
    search.value = '';
}

const { loading, indexList } = useIndexList();
const results = ref<FuseResult<IndexedVerse>[]>([]);
const selectedTranslationId = ref<string>();
let stopHandle;
watch(loading, async (to, from) => {
    watch(selectedTranslationId, async (v) => {
        if (stopHandle != null) stopHandle();
        const fuse = new Fuse(
            indexList.value.find(
                (t) => t[0].translation.id === selectedTranslationId.value
            ),
            {
                keys: ['verse.text'],
            }
        );
        stopHandle = watch(
            () => searchDebounced.value,
            async (v) => (results.value = fuse.search(v, { limit: 5 }))
        );
    });
});

const router = useRouter();
async function goToVerse(verse: IndexedVerse) {
    await router.push({
        name: 'reader',
        query: {
            t: verse.translation.id.toLowerCase(),
            b: verse.book.type.toLowerCase(),
            c: verse.chapter.number,
            v: verse.verse.number,
        },
    });
    visible.value = false;
}
</script>

<template>
    <Button
        v-bind="$attrs"
        class="whitespace-nowrap"
        :label="$t('prompts.search')"
        @click="visible = true"
        @keyup.enter="visible = true"
        severity="secondary"
        :loading
        text
        :pt="{
            root: { class: 'flex flex-row gap-2.5' },
            label: { class: 'text-ellipsis overflow-hidden' },
        }"
    >
        <template #icon>
            <SvgIcon
                class="!scale-150"
                type="mdi"
                size="16"
                :path="mdiMagnify"
            />
        </template>
    </Button>
    <Dialog
        v-model:visible="visible"
        :closable="false"
        :draggable="false"
        modal
        dismissable-mask
        :position="isOnMobile ? 'bottom' : 'top'"
        class="w-full max-w-container"
        :pt="{ content: { class: 'overflow-hidden' } }"
        @show="focused = true"
        @hide="reset"
    >
        <template #header>
            <InputGroup>
                <IconField iconPosition="left" class="w-full">
                    <InputIcon>
                        <SvgIcon
                            class="!scale-150 mx-0.5"
                            type="mdi"
                            size="16"
                            :path="mdiMagnify"
                        />
                    </InputIcon>
                    <InputText
                        class="w-full rounded-r-none"
                        v-model="search"
                        :placeholder="$t('prompts.search')"
                        ref="searchBar"
                    />
                </IconField>
                <Dropdown
                    class="w-1/2"
                    :options="indexList"
                    v-model="selectedTranslationId"
                    option-value="0.translation.id"
                    option-label="0.translation.name"
                />
            </InputGroup>
        </template>
        <template #default>
            <div class="flex flex-col items-stretch gap-2">
                <Button
                    v-for="(result, i) of results"
                    :key="i"
                    severity="contrast"
                    text
                    pt:root:class="flex flex-col items-start text-left"
                    @click="goToVerse(result.item)"
                >
                    <span class="font-semibold">
                        {{ result.item.verse.text }}
                    </span>
                    <span class="opacity-50">
                        {{ result.item.book.abbreviation }}
                        {{ result.item.chapter.number }}:{{
                            result.item.verse.number
                        }}
                    </span>
                </Button>
            </div>
        </template>
        <template #footer>
            <Button
                :label="$t('prompts.close')"
                @click="visible = false"
                severity="secondary"
                text
                class="w-full"
            />
        </template>
    </Dialog>
</template>
