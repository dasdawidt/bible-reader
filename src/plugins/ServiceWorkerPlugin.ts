import { Plugin } from 'vue';

type ServiceWorkerPluginOptions = {
    filename: string;
    scope: string;
    type?: WorkerType;
    cacheName?: string;
};

/**
 * Plugin that installs a simple service worker to chache static files.
 * Based on an answer by Jahongir on Stack Overflow.
 * @see https://stackoverflow.com/a/55543550/11793652
 */
const ServiceWorkerPlugin: Plugin<ServiceWorkerPluginOptions> = {
    install(_app, options) {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register(options.filename, {
                    scope: options.scope,
                    type: options.type,
                })
                .then((registration) => {
                    registration.active.postMessage({
                        type: 'CACHE_NAME',
                        payload: options.cacheName ?? 'cache',
                    });

                    const data = {
                        type: 'CACHE_URLS',
                        payload: [
                            location.href,
                            ...performance
                                .getEntriesByType('resource')
                                .map((r) => r.name),
                        ],
                    };
                    registration.active.postMessage(data);
                })
                .catch((err) =>
                    console.log('Failed to register service worker:', err)
                );
        }
    },
};
export default ServiceWorkerPlugin;
