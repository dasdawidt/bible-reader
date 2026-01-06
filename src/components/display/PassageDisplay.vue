<script setup lang="ts">
import Card from 'primevue/card';
import { computed } from 'vue';
import { formatPassages, getPassage } from '@/logic/util/BibleUtils';
import { Translation } from '@/types/bible/translation';
import { Passage } from '@/types/plans/passage';

const props = defineProps<{
    passages?: Passage[];
    translation?: Translation;
    placeholder?: string;
}>();

const visible = computed(() => props.placeholder != null || valuesPresent.value);
const valuesPresent = computed(() => props.passages != null && props.translation != null && props.passages.length > 0);
</script>

<template>
    <Card v-if="visible" :pt="{ content: { class: 'p-0' } }">
        <template #content>
            <div class="flex flex-col gap-2">
                <template v-if="valuesPresent">
                    <div>
                        <span v-for="passage of passages">
                            {{ getPassage(translation, passage).text + ' ' }}
                        </span>
                    </div>
                    <div class="opacity-50">
                        {{ formatPassages(translation, passages) }}
                    </div>
                </template>
                <span v-else class="opacity-50">
                    {{ props.placeholder }}
                </span>
            </div>
        </template>
    </Card>
</template>
