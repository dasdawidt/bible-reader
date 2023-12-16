<script setup lang="ts">
import { gloProvider } from '@/logic/translations/gloTranslation';
import { BookTypeOldTestament } from '@/types/bible/bookTypeOldTestament';
import { Passage } from '@/types/plans/passage';
import { ref } from 'vue';
import Card from 'primevue/card';
import { getPassage } from '@/logic/util/BibleUtils';
import { useQuery } from '@tanstack/vue-query';
import { Verse } from '@/types/bible/verse';


const passages = ref<Passage[]>([
    {
        translationId: 'glo',
        bookType: BookTypeOldTestament.GENESIS,
        chapter: 1,
        verse: 1
    }
]);

const translationProvider = ref(gloProvider);

const { data, isLoading } = useQuery<Verse[]>({
    queryKey: ['passage', passages],
    queryFn: async () => {
        return await Promise.all(passages.value.map(p => translationProvider.value?.getVerse(p.bookType, p.chapter, p.verse)));
    }
})

</script>

<template>
    <Card>
        <template #content>
            <span v-for="verse of data">
                {{ verse.text }}
            </span>
        </template>
    </Card>
</template>