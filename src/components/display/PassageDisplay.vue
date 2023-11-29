<script setup lang="ts">
import Card from 'primevue/card';
import { Passage } from '@/types/plans/passage';
import { Translation } from '@/types/bible/translation';
import { formatPassages, getPassage } from '@/logic/util/BibleUtils';
import { computed } from 'vue';

const props = defineProps<{
    passages?: Passage[],
    translation?: Translation,
}>();

const visible = computed(() => props.passages != null && props.translation != null && props.passages.length > 0);
</script>

<template>
    <Card v-if="visible">
        <template #content>
            <div class="flex flex-col gap-2">
                <div>
                    <span v-for="passage of passages">
                        {{ getPassage(translation, passage).text + ' ' }}
                    </span>
                </div>
                <div class="opacity-50">
                    {{ formatPassages(translation, passages) }}
                </div>
            </div>
        </template>
    </Card>
</template>