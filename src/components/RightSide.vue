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
      <n-scrollbar style="max-height: 200px">
        <n-space vertical align="center">
          自动切换
          <n-switch v-model:value="autoSwitchTheme" @update:value="themeSwitch" />
          <n-button @click="darkBtn">
            深色
          </n-button>
          <n-button @click="lightBtn">
            浅色
          </n-button>
        </n-space>
      </n-scrollbar>
    </n-popover>
  </n-element>
</template>

<script setup>
import { onMounted } from "vue";
// 主题色控制
import { darkTheme } from "naive-ui";
const theme = ref(null);
const emit = defineEmits(['emit']);

const autoSwitchTheme = ref(JSON.parse(localStorage.getItem("autoSwitchTheme")) ?? true);
function themeSwitch() {
  localStorage.setItem("autoSwitchTheme", autoSwitchTheme.value);
}

// 切换为黑夜模式
function switchDark() {
  theme.value = darkTheme;
  emit('emit', theme.value);
}

onMounted(() => {
  const currentHour = new Date().getHours();
  // 检查当前小时是否在晚上6点到第二天6点之间
  if ((!autoSwitchTheme.value && localStorage.getItem("theme") === "dark") || (autoSwitchTheme.value && (currentHour >= 18 || currentHour < 6))) {
    switchDark();
  }
})

function darkBtn() {
  switchDark()
  localStorage.setItem("theme", "dark");
}

function lightBtn() {
  theme.value = null;
  localStorage.setItem("theme", "light");
  emit('emit', theme.value);
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