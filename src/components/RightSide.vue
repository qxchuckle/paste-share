<template>
  <n-element>
    <n-popover trigger="click">
      <template #trigger>
        <n-icon size="26" class="right-side">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="14" cy="6" r="2"></circle>
              <path d="M4 6h8"></path>
              <path d="M16 6h4"></path>
              <circle cx="8" cy="12" r="2"></circle>
              <path d="M4 12h2"></path>
              <path d="M10 12h10"></path>
              <circle cx="17" cy="18" r="2"></circle>
              <path d="M4 18h11"></path>
              <path d="M19 18h1"></path>
            </g>
          </svg>
        </n-icon>
      </template>
      <n-scrollbar style="max-height: fit-content">
        <n-space vertical align="center">
          {{ t('text.autoChange') }}
          <n-switch v-model:value="autoSwitchTheme" @update:value="themeAutoSwitch" />
          <n-button @click="darkBtn">
            {{ t('btn.dark') }}
          </n-button>
          <n-button @click="lightBtn">
            {{ t('btn.light') }}
          </n-button>
          {{ t('text.i18n') }}
          <n-select v-model:value="userStore.language" :options="languageOptions" @update:value="handleUpdateLanguage"
            style="width: 90px;" />
        </n-space>
      </n-scrollbar>
    </n-popover>
  </n-element>
</template>

<script setup>
import useUserStore from '@/stores/UserStore'
const userStore = useUserStore();
import { useI18n } from 'vue-i18n'
const { locale, t } = useI18n();
import { computed } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();

const autoSwitchTheme = ref(JSON.parse(localStorage.getItem("autoSwitchTheme")) ?? true);
function themeAutoSwitch() {
  localStorage.setItem("autoSwitchTheme", autoSwitchTheme.value);
  if (autoSwitchTheme.value) {
    userStore.handleThemeByTime();
  }
}

// 切换为黑夜模式
function switchDark() {
  userStore.handleTheme("dark");
}

function switchLight() {
  userStore.handleTheme("light");
}

function darkBtn() {
  switchDark()
  localStorage.setItem("theme", "dark");
}

function lightBtn() {
  switchLight();
  localStorage.setItem("theme", "light");
}

const languageOptions = computed(() => ([
  {
    label: t('label.zh'),
    value: 'zh'
  },
  {
    label: t('label.en'),
    value: 'en'
  },
]));

function handleUpdateLanguage(value) {
  localStorage.setItem("language", value);
  locale.value = value;
  userStore.handleLanguage(value);
  if (route.meta.title) {
    document.title = `${t('projectName')}|${t(`router.${route.name}`)}`;
  } else {
    document.title = t('projectName');
  }
}

</script>

<style lang="scss" scoped>
.right-side {
  position: fixed;
  z-index: 10;
  bottom: 100px;
  right: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--popover-color);
  color: var(--text-color-2);
  transition: color .3s var(--cubic-bezier-ease-in-out), background-color .3s var(--cubic-bezier-ease-in-out), box-shadow .3s var(--cubic-bezier-ease-in-out);
  box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 8px 0px;
  cursor: pointer;
}

@media screen and (max-width:800px) {
  .right-side {
    bottom: 80px;
  }
}
</style>