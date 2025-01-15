<template>
  <div class="music-clock" @click="store.toggleMusic">
    <svg class="clock" viewBox="0 0 100 100">
      <g class="clock-face">
        <!-- 外圈 -->
        <circle class="clock-outline" cx="50" cy="50" r="45" />
        <!-- 中心点 -->
        <circle class="clock-center" cx="50" cy="50" r="3" />
        <!-- 时针 -->
        <line class="hour-hand" x1="50" y1="50" x2="50" y2="25" />
        <!-- 分针 -->
        <line class="minute-hand" x1="50" y1="50" x2="50" y2="20" />
      </g>
    </svg>
  </div>
</template>

<script setup>
import { useMusicStore } from '@/stores/musicStore'

const store = useMusicStore()
</script>

<style scoped>
.music-clock {
  width: 40px;
  height: 40px;
  cursor: pointer;
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.clock {
  width: 100%;
  height: 100%;
  transform-origin: center;
  transition: transform 0.3s ease;
}

.clock:hover {
  transform: scale(1.1);
}

.clock-face {
  fill: none;
  stroke: #8B4513;
}

.clock-outline {
  stroke-width: 4;
}

.clock-center {
  fill: #8B4513;
}

.hour-hand,
.minute-hand {
  stroke: #8B4513;
  stroke-width: 4;
  stroke-linecap: round;
}

.minute-hand {
  stroke-width: 3;
}
</style> 