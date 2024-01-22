import { computed } from 'vue';

/**
 * Utility to check whether the app is running inside an iframe or not.
 * @returns a `ComputedRef` to a boolean whether inside iframe.
 * @see https://stackoverflow.com/a/326076/11793652
 */
export function useInsideIframe() {
    const isInsideIframe = computed(() => window.self !== window.top);
    return {
        isOnMobile: isInsideIframe,
    };
}
