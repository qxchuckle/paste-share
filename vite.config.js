import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from "path"
import legacy from '@vitejs/plugin-legacy'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, "src")
      }
    ]
  },
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11'],
      modernPolyfills: true
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        'pinia',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar'
          ]
        }
      ],
    }),
    Components({
      extensions: ['vue'],
      dirs: ["src/components/"],
      resolvers: [NaiveUiResolver()]
    }),
    viteCompression({
      algorithm: 'gzip',
      threshold: 10240,
      verbose: true,
      deleteOriginFile: false
    }),
    visualizer(),
  ]
})
