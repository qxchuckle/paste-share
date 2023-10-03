<template>
  <div style="padding: 0 10px">
    <n-data-table :columns="columns" :bordered="false" :single-line="false" :data="data" :pagination="pagination"
      size="small" :max-height="maxHeight" :scroll-x="1000" />
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onBeforeMount, h, computed, onBeforeUnmount } from "vue"
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
  await viewStore.getUsers();
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
      width: 135,
      render(row) {
        const deleteAction = h(
          NPopconfirm,
          {
            positiveText: "确认",
            onPositiveClick: () => deleteUser(row.username),
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
        const space = h(
          NSpace, {}, () => [
            deleteAction
          ]
        )
        return space
      }
    }
  ];
})

const data = computed(() => {
  return viewStore.users.map((item, index) => {
    let type;
    switch (item.userType) {
      case 'admin':
        type = '管理员';
        break;
      case 'super':
        type = '超级管理员';
        break;
      case 'user':
        type = '普通用户';
        break;
    }
    return {
      num: index + 1,
      username: item.username,
      type: type,
      createTime: formatDateTime(item.createTime),
      lastLoginTime: formatDateTime(item.lastLoginTime),
    }
  })
})

const deleteUser = async (username) => {
  // try {
  //   const res = await axios.post("/api/share/delete", {
  //     share_id: id
  //   }, {
  //     timeout: 5000
  //   });
  //   let result = res.data;
  //   if (result.code === '0000') {
  //     // 处理结果
  //     message.success(result.msg);
  //   } else {
  //     message.error(result.msg);
  //   }
  // } catch (error) {
    message.info(username);
  // }
  // loadingBar.start();
  // await viewStore.getShares();
  // loadingBar.finish();
}

</script>

<style lang="scss" scoped></style>