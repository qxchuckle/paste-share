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

onBeforeMount(async () => {
  await getData();
});

const getData = async () => {
  loadingBar.start();
  await viewStore.getUsers();
  loadingBar.finish();
}

const userTypeMap = {
  admin: '管理员',
  super: '超级管理员',
  user: '普通用户',
};

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
      title: "用户名",
      key: "username",
      ellipsis: {
        tooltip: true
      },
    },
    {
      title: "类型",
      key: "type",
      ellipsis: {
        tooltip: true
      },
      render(row) {
        let type = "";
        if (row.type === userTypeMap["super"]) {
          type = "info";
        } else if (row.type === userTypeMap["admin"]) {
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
      title: "创建时间",
      key: "createTime",
      sorter: (row1, row2) => Date.parse(row1.createTime) - Date.parse(row2.createTime),
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: "最后登录时间",
      key: "lastLoginTime",
      sorter: (row1, row2) => Date.parse(row1.lastLoginTime) - Date.parse(row2.lastLoginTime),
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: "操作",
      key: "actions",
      width: 160,
      render(row) {
        const deleteAction = h(
          NPopconfirm,
          {
            positiveText: "确认",
            onPositiveClick: () => deleteUser(row),
            negativeText: null,
          },
          {
            default: () => "是否删除该用户",
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
        const setAdminAction = h(
          NPopconfirm,
          {
            positiveText: "确认",
            onPositiveClick: () => setAdmin(row),
            negativeText: null,
          },
          {
            default: () => "是否设置该用户为管理员",
            trigger: () =>
              h(NButton, {
                type: "success",
                size: "small",
                secondary: true,
              }, {
                default: () => "设置管理",
              })
          }
        );
        const removeAdminAction = h(
          NPopconfirm,
          {
            positiveText: "确认",
            onPositiveClick: () => removeAdmin(row),
            negativeText: null,
          },
          {
            default: () => "是否移除该管理员",
            trigger: () =>
              h(NButton, {
                type: "warning",
                size: "small",
                secondary: true,
              }, {
                default: () => "移除管理",
              })
          }
        );
        let assembly = [];
        if ((row.type !== userTypeMap["super"]) && ((userStore.userType === "super") || (userStore.userType === "admin" && row.type !== userTypeMap["admin"]))) {
          assembly = [
            deleteAction
          ]
        }
        if (userStore.userType === "super" && row.type !== userTypeMap["super"]) {
          if (row.type === userTypeMap["admin"]) {
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
    type: userTypeMap[item.userType] || '未知类型',
    createTime: formatDateTime(item.createTime),
    lastLoginTime: item.lastLoginTime ? formatDateTime(item.lastLoginTime) : "从未登录",
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
    message.error("删除失败");
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
    message.error("设置失败");
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
    message.error("移除失败");
  });
}


</script>

<style lang="scss" scoped></style>