<template>
  <div class="Content">
    <div class="container">
      <h1 class="Content__Title">{{ $t('ab.hello') }}</h1>
      <p>{{ $t('ab.hello') }}</p>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return { title: this.$t('ab.hello') }
  }
}
</script>