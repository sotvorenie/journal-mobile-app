import { defineConfig } from 'vite';
import path from 'path';
import {VitePWA} from "vite-plugin-pwa";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
                groups: path.resolve(__dirname, 'groups.html'),
                journal: path.resolve(__dirname, 'journal.html'),
            },
        },
        outDir: path.resolve(__dirname, 'dist'),
    },
    assetsInclude: ['**/*.woff2'],
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: "Журнал мониторинга посещаемости",
                short_name: "Журнал",
                description: "Журнал для мониторинга посещаемости студентами аудиторных занятий",
                lang: "ru",
                start_url: "/",
                id: "https://web.жуурнал.рф/",
                scope: "https://web.жуурнал.рф/",
                icons: [
                    {
                        src: '/app-icon.png',
                        sizes: '1280x1280',
                        type: 'image/png'
                    }
                ]
            },
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: ({request}) => request.destination === 'image',
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'images',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 30
                            }
                        }
                    }
                ]
            },
            devOptions: {
                enabled: true,
            }
        })
    ]
});