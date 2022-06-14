<template>
  <footer id="app-footer" class="footer ">
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-6">{{ new Date().getFullYear() }} © Visipoint.</div>
            <div class="col-sm-6">
                <div class="text-sm-right d-none d-sm-block"></div>
            </div>
        </div>
    </div>
</footer>
<!-- end footer -->
</template>
<style scoped>
  #app-footer{
    z-index:800;
  }
</style>
