<template>
  <DataTable :data="data" :pagination="pagination" :columns="columns"></DataTable>
</template>

<script setup>
import { ref, inject, h, computed, onBeforeMount } from "vue"
const message = inject('message');
import { useRouter } from "vue-router"
const router = useRouter()
import useViewStore from '@/stores/ViewStore'
const viewStore = useViewStore();
import { useLoadingBar, NButton, NPopconfirm, NSpace } from 'naive-ui'
const loadingBar = useLoadingBar();
import { formatDateTime, sendRequest } from '@/utils'
import DataTable from "@/components/Admin/DataTable.vue";

onBeforeMount(async () => {
  await getData();
});

const getData = async () => {
  loadingBar.start();
  await viewStore.getShares();
  loadingBar.finish();
}

const pagination = ref({
  page: 1,
  pageSize: 20,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 40, 50, 60],
  onChange: (page) => {
    pagination.value.page = page
  },
  onUpdatePageSize: (pageSize) => {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1
  }
});

const columns = computed(() => {
  return [
    {
      title: "序号",
      key: "num",
      width: 80,
      fixed: 'left',
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
      filterOptions: viewStore.shareLanguages.map(item => ({
        label: item || "纯文本",
        value: item || "纯文本"
      })),
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
      filterOptions: viewStore.shareUsernames.map(item => ({
        label: item || "游客",
        value: item || "游客"
      })),
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
      },
      filterOptions: viewStore.sharesByMonth.map(item => ({
        label: item.month,
        value: item.month
      })),
      filter(value, row) {
        return formatDateTime(Date.parse(row.time), 'YYYY-MM') === value;
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
                secondary: true,
              }, {
                default: () => "删除",
              })
          }
        );
        const toAction = h(NButton, {
          type: "info",
          size: "small",
          secondary: true,
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
    const result = await sendRequest.post("/api/share/delete", {
      share_id: id
    });
    if (result.code === '0000') {
      // 处理结果
      message.success(result.msg);
    } else {
      message.error(result.msg);
    }
  } catch (error) {
    message.error("请求出错");
  }
  await getData();
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