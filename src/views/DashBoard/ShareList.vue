<template>
  <div style="padding: 0 10px">
    <n-data-table :columns="columns" :bordered="false" :single-line="false" :data="data" :pagination="pagination"
      size="small" :max-height="maxHeight" :scroll-x="1000"/>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onBeforeMount, h, computed,onBeforeUnmount } from "vue"
const axios = inject("axios");
const message = inject('message');
import { useRouter, useRoute } from "vue-router"
const router = useRouter()
const route = useRoute()
import useViewStore from '../../stores/ViewStore'
const viewStore = useViewStore();
import { useLoadingBar, NButton, NPopconfirm, NSpace } from 'naive-ui'
const loadingBar = useLoadingBar();
import { formatDateTime } from '../../utils'

onBeforeMount(async () => {
  loadingBar.start();
  await viewStore.getShares();
  loadingBar.finish();
});

const maxHeight = ref(500);

function changeTableSize() {
  const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  maxHeight.value = screenHeight - 180;
}

onMounted(() => {
  changeTableSize();
  window.addEventListener("resize", changeTableSize);
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", changeTableSize);
})

const pagination = ref({
  pageSize: 20
},);

const columns = computed(() => {
  return [
    {
      title: "序号",
      key: "num",
      width: 80,
      ellipsis: {
        tooltip: true
      },
      sorter: (row1, row2) => row1.num - row2.num,
    },
    {
      title: "ID",
      key: "id",
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: "标题",
      key: "title",
      ellipsis: {
        tooltip: true
      },
    },
    {
      title: "语言",
      key: "language",
      ellipsis: {
        tooltip: true
      },
      filterOptions: viewStore.shareLanguages.map((item) => {
        return {
          label: `${item || "纯文本"}`,
          value: `${item || "纯文本"}`
        }
      }),
      filter(value, row) {
        return row.language === value;
      }
    },
    {
      title: "内容(裁取)",
      key: "content",
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: "访问量",
      key: "visits",
      ellipsis: {
        tooltip: true
      },
      sorter: (row1, row2) => row1.visits - row2.visits,
      filterOptions: [
        {
          label: '大于100',
          value: 100
        },
        {
          label: '大于1000',
          value: 1000
        }
      ],
      filter(value, row) {
        return row.visits >= value;
      }
    },
    {
      title: "创建者",
      key: "user",
      ellipsis: {
        tooltip: true
      },
      filterOptions: viewStore.shareUsernames.map((item) => {
        return {
          label: `${item || "游客"}`,
          value: `${item || "游客"}`
        }
      }),
      filter(value, row) {
        return row.user === value;
      }
    },
    {
      title: "创建时间",
      key: "time",
      sorter: (row1, row2) => Date.parse(row1.time) - Date.parse(row2.time),
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: "操作",
      key: "actions",
      width: 135,
      render(row) {
        const deleteAction = h(
          NPopconfirm,
          {
            positiveText: "确认",
            onPositiveClick: () => deleteShare(row.id),
            negativeText: null,
          },
          {
            default: () => "是否删除该分享",
            trigger: () =>
              h(NButton, {
                type: "error",
                size: "small",
              }, {
                default: () => "删除",
              })
          }
        );
        const toAction = h(NButton, {
          type: "info",
          size: "small",
          onClick: () => toShare(row.id)
        }, {
          default: () => "查看",
        })
        const space = h(
          NSpace, {}, () => [
            deleteAction,
            toAction
          ]
        )
        return space
      }
    }
  ];
})

const data = computed(() => {
  return viewStore.shares.map((item, index) => ({
    num: index + 1,
    user: item.user.username || "游客",
    id: item.share_id,
    title: item.title || "无题",
    content: item.content,
    time: formatDateTime(item.time),
    language: item.language || "纯文本",
    visits: item.visits,
  }))
})

const deleteShare = async (id) => {
  try {
    const res = await axios.post("/api/share/delete", {
      share_id: id
    }, {
      timeout: 5000
    });
    let result = res.data;
    if (result.code === '0000') {
      // 处理结果
      message.success(result.msg);
    } else {
      message.error(result.msg);
    }
  } catch (error) {
    message.error("请求出错");
  }
  loadingBar.start();
  await viewStore.getShares();
  loadingBar.finish();
}

const toShare = (id) => {
  router.push({
    name: 'Share',
    params: {
      id
    },
  })
}


</script>

<style lang="scss" scoped></style>