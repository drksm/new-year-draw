<template>
  <LotPaper 
    :is-burning="shouldBurn"
    @burn-complete="$emit('burn-complete')"
  >
    <slot></slot>
  </LotPaper>
</template>

<script setup>
import LotPaper from './LotPaper.vue'

defineProps({
  shouldBurn: Boolean
})

defineEmits(['burn-complete'])
</script> 