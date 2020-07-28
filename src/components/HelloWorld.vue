<template>
  <div class="hello container">
    <h1>{{ msg }}</h1>
    <p>
      此操作会一键将本地当前目录下的所有git项目中的地址：
      <br />
      {{this.from}}迁移至{{this.to}}
    </p>

    <section class="transform-type mt-4">
      <div class="transform-item">
        <b-button variant="outline-primary" disabled block>{{this.from}}</b-button>
      </div>

      <b-button variant="light" class="ml-2 mr-2" @click="switchDirec">
        <b-icon icon="arrow-left-right"></b-icon>
      </b-button>

      <div class="transform-item">
        <b-button variant="outline-primary" disabled block>{{this.to}}</b-button>
      </div>
    </section>

    <section class="content">
      <div v-if="!isResult">
        <b-button variant="warning" size="lg" @click="selectDist">
          <span class="text-down">选择Git项目</span>
          <b-icon icon="arrow-right" class="ml-1"></b-icon>
        </b-button>
      </div>

      <div v-if="isResult">
        <div v-if="transformList.length">
          <b-table hover borderless small :fields="fields" :items="transformList"></b-table>
        </div>

        <div class="mt-5rem">
          <h4
            v-if="successLength"
            class="text-success font-weight-bolder"
          >超级棒！您成功迁移了{{successLength}}个项目至{{this.to.indexOf('gitee')>-1?'gitee':'github'}}</h4>
          <h4
            v-if="!successLength"
            class="text-danger font-weight-bolder"
          >Ohh～ 没有找到，再检查一下文件夹是否是对的git仓库</h4>
          <b-button variant="warning" size="sm" @click="reset" class="mt-2">
            <b-icon icon="arrow-clockwise" class="mr-1"></b-icon>再来一次
          </b-button>
        </div>
      </div>
    </section>

    <section class="mt-4">
      <div class="row">
        <div
          class="col-lg-6 offset-lg-3 col-md-8 offset-md-2"
          style="border-top: 1px solid rgba(220, 218, 218, 0.6);"
        >
          <h3>Q & A</h3>
        </div>

        <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2 mt-4">
          <ul class="text-left">
            <li>
              <Strong>Q: 如何批量转化？</Strong>
            </li>
            <li>A: 请点击“选择Git项目”按钮，并选择一个包含所有项目的父文件夹，它会查找并转化当前文件夹以及下面所有子文件夹。</li>
          </ul>
          <ul class="text-left">
            <li>
              <Strong>Q: 如何回退，我不想转化了？</Strong>
            </li>
            <li>A: 上面蓝色框框起来是从两个地址互相转，如果你不想转化或者误点，可以点击中间那个“小图标”，可以倒过来，再转一次。</li>
          </ul>
          <ul class="text-left">
            <li>
              <Strong>Q: 会不会破坏其他git项目？</Strong>
            </li>
            <li>A: 不会，这个转化原理是识别本地.git文件中的github.com并替换成gitee（码云），当你的git配置中没有，就不会替换。</li>
          </ul>
        </div>
      </div>
    </section>

    <footer>
      <span class="text-center">Product by Elliotts Su</span>
    </footer>
  </div>
</template>

<script>
import Util from "./util";

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data: function() {
    return {
      from: "github.com",
      to: "gitee.com",
      transformList: [],
      successLength: 0,
      fields: [
        {
          key: "project",
          label: "项目",
          class: 'text-left'
        },
        {
          key: "available",
          label: "状态",
          formatter: value => {
            return value ? "成功" : "失败";
          }
        }
      ],
      isResult: false
    };
  },

  methods: {
    selectDist: function() {
      const { remote } = window.require("electron");
      const fs = window.require("fs");

      remote.dialog
        .showOpenDialog({
          properties: ["openDirectory", "multiSelections"]
        })
        .then(data => {
          const totalPaths = Util.transform(
            fs,
            data.filePaths,
            this.from,
            this.to
          );
          this.isResult = true;
          this.transformList = totalPaths;

          this.successLength = totalPaths.filter(e => e.available).length;
        });
    },
    reset: function() {
      this.isResult = false;
      this.transformList = [];
      this.successLength = 0;
    },
    switchDirec: function() {
      this.reset();
      const from = this.from;
      const to = this.to;

      this.from = to;
      this.to = from;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  /* display: inline-block; */
  margin: 0 10px;
}
a {
  color: #42b983;
}

.mt-5rem {
  margin-top: 5rem;
}

.content {
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 64px 0;
}

.btn-light:focus,
.btn-light:hover {
  box-shadow: none !important;
  background-color: transparent !important;
  border-color: transparent !important;
}

.btn-light {
  background-color: transparent;
  border-color: transparent;
}
.transform-type {
}
.transform-item {
  /* width: 200px; */
  display: inline-block;
}

.text-down {
  position: relative;
  top: 2px;
}

footer {
  font-size: 12px;
  margin-top: 2rem;
  padding: 16px 0;
  color: gray;
}
</style>
