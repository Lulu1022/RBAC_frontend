<script setup>
import Menu from './components/Menu.vue';
import Header from './components/Header.vue'
import { RouterView } from 'vue-router';

</script>
<template>
    <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <Menu></Menu>
      </el-aside>
      <el-container>
        <el-header>
          <Header></Header>
        </el-header>
        <el-main>
          <RouterView></RouterView>
        </el-main>
      </el-container>
    </el-container>
    </div>
  </template>

<style scoped>
.el-header{
  position: relative;
  top:20px;
}

.common-layout{
  width: 98vw;
  height: 100vh;
}

  </style>


