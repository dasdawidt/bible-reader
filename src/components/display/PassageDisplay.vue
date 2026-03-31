<script setup lang="ts">
import Card from 'primevue/card';
import { computed } from 'vue';
import { formatPassages, getPassage } from '@/logic/util/BibleUtils';
import type { Translation } from '@/types/bible/translation';
import type { Passage } from '@/types/plans/passage';

const props = defineProps<{
    passages?: Passage[];
    translation?: Translation;
    placeholder?: string;
}>();

const valuesPresent = computed(() => props.passages != null && props.translation != null && props.passages.length > 0);
const visible = computed(() => props.placeholder != null || valuesPresent.value);
</script>

<template>
    <Card v-if="visible" :pt="{ content: { class: 'p-0' } }">
        <template #content>
            <div class="flex flex-col gap-2">
                <template v-if="valuesPresent">
                    <div>
                        <span v-for="passage in passages">
                            {{
                                // biome-ignore lint/style/noNonNullAssertion: ensured by valuesPresent
                                getPassage(translation!, passage!)?.text
                            }}
                        </span>
                    </div>
                    <div class="opacity-50">
                        {{
                            // biome-ignore lint/style/noNonNullAssertion: ensured by valuesPresent
                            formatPassages(translation!, passages!)
                        }}
                    </div>
                </template>
                <span v-else class="opacity-50">
                    {{ props.placeholder }}
                </span>
            </div>
        </template>
    </Card>
</template>
