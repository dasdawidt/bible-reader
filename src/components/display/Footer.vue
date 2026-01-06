<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const createdByHtml = computed(() =>
    t('legal.created_by', {
        creator: /* html */ `
        <a href=" https://www.dasdawidt.com" style="color: var(--text-color)"
           class="underline underline-offset-4 hover:opacity-50 transition-opacity ease-in-out"
        >David Maier</a>`,
    }),
);
</script>

<template>
    <div
        class="flex flex-row flex-wrap mx-auto justify-center items-center w-full opacity-25 gap-1 py-2 text-xs text-center"
        style="color: var(--text-color)"
    >
        <span v-html="createdByHtml"></span>
        <span>
            {{ $t('legal.cookie_policy') }}
            <a
                href="https://www.dasdawidt.com/imprint"
                style="color: var(--text-color)"
                target="_blank"
                class="underline underline-offset-4 hover:opacity-50 transition-opacity ease-in-out"
            >
                {{ $t('legal.imprint') }} </a
            >.
        </span>
    </div>
</template>
