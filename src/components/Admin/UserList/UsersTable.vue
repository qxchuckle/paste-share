<template>
  <DataTable :data="data" :pagination="pagination" :columns="columns"></DataTable>
</template>

<script setup>
import { ref, inject, h, computed, onBeforeMount } from "vue"
const message = inject('message');
import useViewStore from '@/stores/ViewStore'
const viewStore = useViewStore();
import useUserStore from "@/stores/UserStore";
const userStore = useUserStore();
import { useLoadingBar, NButton, NPopconfirm, NSpace, NTag } from 'naive-ui'
const loadingBar = useLoadingBar();
import { formatDateTime, sendRequest } from '@/utils'
import DataTable from "@/components/Admin/DataTable.vue";
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

onBeforeMount(async () => {
  await getData();
});

const getData = async () => {
  loadingBar.start();
  await viewStore.getUsers();
  loadingBar.finish();
}

const userTypeMap = computed(() => ({
  admin: t('type.admin'),
  super: t('type.super'),
  user: t('type.user'),
}));

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
      title: t('title.username'),
      key: "username",
      ellipsis: {
        tooltip: true
      },
    },
    {
      title: t('title.type'),
      key: "type",
      ellipsis: {
        tooltip: true
      },
      render(row) {
        let type = "";
        if (row.type === userTypeMap.value["super"]) {
          type = "info";
        } else if (row.type === userTypeMap.value["admin"]) {
          type = "success";
        }
        return h(
          NTag,
          {
            style: {
              marginRight: "6px"
            },
            type
          },
          {
            default: () => row.type
          }
        );
      },
      filterOptions: viewStore.userTypes.map((item) => {
        return {
          label: `${item}`,
          value: `${item}`
        }
      }),
      filter(value, row) {
        return row.type === value;
      }
    },
    {
      title: t('title.creationTime'),
      key: "createTime",
      sorter: (row1, row2) => Date.parse(row1.createTime) - Date.parse(row2.createTime),
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: t('title.lastLoginTime'),
      key: "lastLoginTime",
      sorter: (row1, row2) => Date.parse(row1.lastLoginTime) - Date.parse(row2.lastLoginTime),
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: t('title.action'),
      key: "actions",
      width: userStore.language === "zh" ? 155 : 210,
      render(row) {
        const deleteAction = h(
          NPopconfirm,
          {
            onPositiveClick: () => deleteUser(row),
          },
          {
            default: () => t('text.deleteUserOrNot'),
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
        const setAdminAction = h(
          NPopconfirm,
          {
            onPositiveClick: () => setAdmin(row),
          },
          {
            default: () => t('text.setAdminOrNot'),
            trigger: () =>
              h(NButton, {
                type: "success",
                size: "small",
                secondary: true,
              }, {
                default: () => t("btn.setAdmin"),
              })
          }
        );
        const removeAdminAction = h(
          NPopconfirm,
          {
            onPositiveClick: () => removeAdmin(row),
          },
          {
            default: () => t('text.removeAdminOrNot'),
            trigger: () =>
              h(NButton, {
                type: "warning",
                size: "small",
                secondary: true,
              }, {
                default: () => t('btn.removeAdmin'),
              })
          }
        );
        let assembly = [];
        if ((row.type !== userTypeMap.value["super"]) && ((userStore.userType === "super") || (userStore.userType === "admin" && row.type !== userTypeMap.value["admin"]))) {
          assembly = [
            deleteAction
          ]
        }
        if (userStore.userType === "super" && row.type !== userTypeMap.value["super"]) {
          if (row.type === userTypeMap.value["admin"]) {
            assembly.push(removeAdminAction)
          } else {
            assembly.push(setAdminAction)
          }
        }
        const space = h(
          NSpace, {}, () => assembly
        )
        return space
      }
    }
  ];
})

const data = computed(() => {
  const userTypePriority = {
    super: 2,
    admin: 1,
  };
  return viewStore.users.sort((a, b) => {
    const priorityA = userTypePriority[a.userType] || 0;
    const priorityB = userTypePriority[b.userType] || 0;
    return priorityB - priorityA;
  }).map((item, index) => ({
    num: index + 1,
    username: item.username,
    type: userTypeMap.value[item.userType] || t('text.unknownType'),
    createTime: formatDateTime(item.createTime),
    lastLoginTime: item.lastLoginTime ? formatDateTime(item.lastLoginTime) : t('text.neverLoggedIn'),
  }));
});

const deleteUser = (user) => {
  sendRequest.post("/api/user/delete", {
    username: user.username
  }).then((result) => {
    if (result.code === '0000') {
      // 处理结果
      message.success(result.msg);
      getData();
    } else {
      message.error(result.msg);
    }
  }).catch((err) => {
    message.error(t('message.error.delete'));
  });
}

const setAdmin = (user) => {
  sendRequest.post("/api/user/setAdmin", {
    username: user.username
  }).then((result) => {
    if (result.code === '0000') {
      // 处理结果
      message.success(result.msg);
      getData();
    } else {
      message.error(result.msg);
    }
  }).catch((err) => {
    message.error(t('message.error.set'));
  });
}

const removeAdmin = (user) => {
  sendRequest.post("/api/user/removeAdmin", {
    username: user.username
  }).then((result) => {
    if (result.code === '0000') {
      // 处理结果
      message.success(result.msg);
      getData();
    } else {
      message.error(result.msg);
    }
  }).catch((err) => {
    message.error(t('message.error.remove'));
  });
}


</script>

<style lang="scss" scoped></style>