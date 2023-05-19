<template>
  <div class="svg">
    <!-- <svg  
      :width="width"
      :height="height"  
      stroke="currentColor" 
      fill="none" 
      stroke-width="1.5" 
      viewBox="0 0 24 24" 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      class="h-6 w-6" 
      height="1em" 
      width="1em" 
      xmlns="http://www.w3.org/2000/svg">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg> -->
    <svg t="1684490288848" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2408" width="30" height="30"><path d="M651.296021 545.977859c63.557548-42.814108 105.358583-115.235534 105.358583-197.532889 0-133.333728-110.364597-241.9761-245.813498-241.9761-135.451972 0-244.160859 108.642372-244.160859 240.322437 0 82.297354 41.821501 154.739247 105.35756 197.530842-143.80522 55.979966-244.135276 191.069687-244.135276 350.748433l0 0 68.561515 0 0 0c0-158.026106 122.06815-288.197818 277.581016-306.303174 1.674129 0 43.476187-3.284813 78.595033 0l3.350304 0 0 0C708.17445 610.18009 825.215096 738.574319 825.215096 894.946762l0 0 70.239737 0 0 0C893.779681 736.921679 793.447579 600.303138 651.296021 545.977859L651.296021 545.977859zM510.841106 527.85613c-102.008278 0-183.930079-80.644715-183.930079-181.063799 0-100.419084 81.921801-181.062775 183.930079-181.062775 102.007255 0 183.929056 80.643692 183.929056 181.062775C694.770162 447.211415 612.848361 527.85613 510.841106 527.85613L510.841106 527.85613zM510.841106 527.85613" p-id="2409" fill="#000"></path></svg>
  </div>
</template>

<script setup>
const props = defineProps({
  width: { type: Number , default: 30 }, 
  height: { type: Number , default: 30 }, 
})
</script>

<style lang="less" scoped>
.svg {
  // background-color: rgb(84, 54, 218);
  color: #fff;
  // padding: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}
// .w-6 {
//   width: 1.9rem;
// }
// .h-6 {
//   height: 1.8rem;
// }
</style>


