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
import useUserStore from "@/stores/UserStore";
const userStore = useUserStore();
import { NButton, NPopconfirm, NSpace } from 'naive-ui'
const loadingBar = inject('loadingBar');
import { formatDateTime, sendRequest } from '@/utils'
import DataTable from "@/components/Admin/DataTable.vue";
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

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
      title: t('title.serialNumber'),
      key: "num",
      width: 80,
      fixed: 'left',
      ellipsis: {
        tooltip: true
      },
      sorter: (row1, row2) => row1.num - row2.num,
    },
    {
      title: t('title.id'),
      key: "id",
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: t('title.title'),
      key: "title",
      ellipsis: {
        tooltip: true
      },
    },
    {
      title: t('title.language'),
      key: "language",
      ellipsis: {
        tooltip: true
      },
      filterOptions: viewStore.shareLanguages.map(item => ({
        label: item || t('label.text'),
        value: item || t('label.text')
      })),
      filter(value, row) {
        return row.language === value;
      }
    },
    {
      title: t('title.partialContent'),
      key: "content",
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: t('title.visits'),
      key: "visits",
      ellipsis: {
        tooltip: true
      },
      sorter: (row1, row2) => row1.visits - row2.visits,
      filterOptions: [
        {
          label: `${t('label.greaterThan')}100`,
          value: 100
        },
        {
          label: `${t('label.greaterThan')}1000`,
          value: 1000
        }
      ],
      filter(value, row) {
        return row.visits >= value;
      }
    },
    {
      title: t('title.creator'),
      key: "user",
      ellipsis: {
        tooltip: true
      },
      filterOptions: viewStore.shareUsernames.map(item => ({
        label: item || t('type.tourist'),
        value: item || t('type.tourist')
      })),
      filter(value, row) {
        return row.user === value;
      }
    },
    {
      title: t('title.creationTime'),
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
      title: t('title.action'),
      key: "actions",
      width: userStore.language === "zh" ? 130 : 145,
      render(row) {
        const deleteAction = h(
          NPopconfirm,
          {
            onPositiveClick: () => deleteShare(row.id),
          },
          {
            default: () => t('text.deleteShareOrNot'),
            trigger: () =>
              h(NButton, {
                type: "error",
                size: "small",
                secondary: true,
              }, {
                default: () => t('btn.delete'),
              })
          }
        );
        const toAction = h(NButton, {
          type: "info",
          size: "small",
          secondary: true,
          onClick: () => toShare(row.id)
        }, {
          default: () => t('btn.toShare'),
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
    user: item.user.username || t('type.tourist'),
    id: item.share_id,
    title: item.title || t('title.none'),
    content: item.content,
    time: formatDateTime(item.time),
    language: item.language || t('label.text'),
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
    message.error(t('message.error.requestError'));
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