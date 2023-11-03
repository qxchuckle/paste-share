<template>
  <div id="about" :class="userStore.theme">
    <div class="introduce">
      <h1>Hello,</h1>
      <h1>I'm
        <span class="name">{{ info.name + "." }}</span>
      </h1>
      <p class="jobs">
        <span v-for="(item, index) in info.jobs">
          <span v-if="index"> / </span>
          {{ item }}
        </span>
      </p>
    </div>
    <div class="btn-box">
      <button v-for="item in info.button" :class="item.type" @click="item.fun()">{{ item.name }}</button>
    </div>
    <div class="footer">
      <span>© 2023 - 2023</span>
      <span>{{ " " + info.name + ". " }}</span>
      <span>All rights reserved.</span>
    </div>
  </div>
</template>

<script setup>
import useUserStore from '@/stores/UserStore';
const userStore = useUserStore();

const info = ref({
  name: "Chuckle",
  jobs: ["University Student", "Front-end Developer", "Blogger"],
  button: [
    {
      type: "blue",
      name: "Blog",
      fun() {
        window.open("https://www.qcqx.cn/", "_blank");
      }
    },
    {
      type: "white",
      name: "GitHub",
      fun() {
        window.open("https://github.com/qxchuckle", "_blank");
      }
    },
  ]
})

</script>

<style lang="scss" scoped>
#about {
  font-family: 'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif;
  margin: auto;
  top: 0;
  bottom: 0;
  position: absolute;
  height: max-content;
  padding: 5px 10px 10px;
  transition: color 0.3s;
  color: #242424;

  .introduce {
    h1 {
      font-size: 40px;
      line-height: 40px;
      margin: 6px 0;

      .name {
        color: rgb(49, 106, 183);
      }
    }

    .jobs {
      font-size: 20px;
      line-height: 20px;
      margin: 20px 0;

      span {
        font-size: 20px;
        line-height: 20px;
      }
    }
  }

  .btn-box {
    display: flex;
    column-gap: 15px;

    button {
      font-size: 14px;
      line-height: 20px;
      padding: 5px 12px;
      min-width: 96px;
      outline-style: none;
      margin: 0px;
      overflow: hidden;
      border-radius: 4px;
      font-weight: 600;
      transition: all 0.3s;
      cursor: pointer;
      border: 1px solid #d1d1d1;
      font-family: 'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif;
    }

    .blue {
      background-color: #0f6cbd;
      color: #fff;
      border: 1px solid transparent;

      &:hover {
        background-color: #115ea3;
      }
    }

    .white {
      background-color: #fff;
      color: #242424;

      &:hover {
        background-color: #f5f5f5;
        border-color: #c7c7c7;
      }
    }
  }

  .footer {
    margin-top: 15px;
    line-height: 20px;
    font-size: 14px
  }
}

#about.light {
  color: #242424;

  .introduce>h1>.name {
    color: rgb(49, 106, 183);
  }
}

#about.dark {
  color: #fff;

  .introduce>h1>.name {
    color: rgb(95 161 247);
  }
}
</style>