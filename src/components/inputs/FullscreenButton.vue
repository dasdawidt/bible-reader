<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiFullscreen, mdiFullscreenExit } from '@mdi/js';
import { useFullscreen } from '@vueuse/core';
import Button from 'primevue/button';

const {
    isSupported,
    isFullscreen,
    toggle
} = useFullscreen();

</script>

<template>
    <Button severity="secondary" :disabled="!isSupported" @click="toggle" v-bind="$attrs" text>
        <template #icon>
            <SvgIcon v-show="isFullscreen" class="!scale-150" size="16" type="mdi" :path="mdiFullscreenExit" />
            <SvgIcon v-show="!isFullscreen" class="!scale-150" size="16" type="mdi" :path="mdiFullscreen" />
        </template>
    </Button>
</template>