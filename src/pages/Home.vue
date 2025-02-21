<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <h1>{{ testVal }}</h1>
</template>

<script setup>
  import { httpGet, httpPost, httpPut, httpDelete } from '@/axios'
import { onMounted, ref } from 'vue';
  // Lifecycle
  onMounted(() => {
    test();
  })

  // ref
  const testVal = ref('home');

  // method
  const test = async () => {

    await httpPost("/api/sample", {
      title: "title",
      content: "content",
    });

    let data = await httpGet("/api/sample");
    testVal.value = data;
    // console.log("dataList", data);

    await httpPut(`/api/sample/${data[0].id}`, {
      title: "title1",
      content: "content1",
    });

    data = await httpGet("/api/sample");
    data = await httpGet(`/api/sample/${data[0].id}`);
    // console.log("data", data);
    testVal.value = data;

    await httpDelete(`/api/sample/${data.id}`);
  }
</script>
