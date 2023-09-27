<template>
  <n-config-provider v-if="language" :hljs="hljs" style="overflow: auto">
    <n-code :code="content" show-line-numbers :language="language" />
  </n-config-provider>
</template>

<script setup>
const props = defineProps(['language', 'content']);
const { language, content } = toRefs(props);
import hljs from 'highlight.js/lib/core';
// 代码高亮
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import cpp from 'highlight.js/lib/languages/cpp';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import markdown from 'highlight.js/lib/languages/markdown';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import typescript from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';
import yaml from 'highlight.js/lib/languages/yaml';

const languages = {
  javascript,
  json,
  cpp,
  python,
  java,
  markdown,
  go,
  rust,
  typescript,
  css,
  yaml,
};

// 循环注册语言
Object.keys(languages).forEach(language => {
  hljs.registerLanguage(language, languages[language]);
});

</script>

<style lang="scss" scoped></style>