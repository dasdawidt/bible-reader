// biome-ignore-all lint/correctness/noUnusedVariables: IDE support

interface ViteTypeOptions {
    strictImportMetaEnv: true;
}

interface ImportMetaEnv {
    readonly BUILD_DATE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
