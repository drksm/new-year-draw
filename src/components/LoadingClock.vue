<template>
  <div class="music-control" @click="store.toggleMusic">
    <svg 
      class="music-icon" 
      :class="{ 'playing': store.isPlaying }"
      viewBox="0 0 24 24"
      width="24" 
      height="24"
    >
      <path 
        fill="currentColor" 
        d="M12,1 C12,1 11,2 10,2.5 C9,3 8,2.8 8,2.8 C8,2.8 9,3.5 10,3.2 C11,2.9 12,2 12,1
         M12,1 C12,1 13,2 14,2.5 C15,3 16,2.8 16,2.8 C16,2.8 15,3.5 14,3.2 C13,2.9 12,2 12,1"
      />
      
      
      <path
        fill="currentColor"
        d="M12,3 C8,3 5,4.5 4.5,7 
           C4,9.5 4,14 4,16
           C4,17.5 4.5,18.5 5.5,19.2
           C6.5,20 8,20.2 12,20.2
           C16,20.2 17.5,20 18.5,19.2
           C19.5,18.5 20,17.5 20,16
           C20,14 20,9.5 19.5,7
           C19,4.5 16,3 12,3z
           M12,5 C15,5 16.5,6 17,7.5
           C17.5,9 17.5,14 17.5,16
           C17.5,17 17.2,17.8 16.5,18.2
           C15.8,18.6 14.5,18.8 12,18.8
           C9.5,18.8 8.2,18.6 7.5,18.2
           C6.8,17.8 6.5,17 6.5,16
           C6.5,14 6.5,9 7,7.5
           C7.5,6 9,5 12,5z"
      />
      
      <path
        fill="none"
        stroke="currentColor"
        stroke-width="0.5"
        opacity="0.3"
        d="M6,9 C6,9 12,10.5 18,9
           M6,11 C6,11 12,12.5 18,11
           M6,13 C6,13 12,14.5 18,13
           M6.5,15 C6.5,15 12,16.5 17.5,15"
      />
      
      <path
        fill="currentColor"
        d="M5.5,17 C5.5,17 6,18 7,18.5
           C8,19 9,19 9,19
           C9,19 10,18.8 11,18.5
           C12,18.2 12,18.2 12,18.2
           C12,18.2 12,18.2 13,18.5
           C14,18.8 15,19 15,19
           C15,19 16,19 17,18.5
           C18,18 18.5,17 18.5,17"
      />
    </svg>
  </div>
</template>

<script setup>
import { useMusicStore } from '@/stores/musicStore'

const store = useMusicStore()
</script>

<style scoped>
.music-control {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(139, 69, 19, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  backdrop-filter: blur(5px);
  border: 2px solid rgba(139, 69, 19, 0.2);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.music-icon {
  width: 36px;
  height: 36px;
  color: #8B4513;
  transition: all 0.3s ease;
  opacity: 1;
  transform-origin: top center;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2));
}

.music-icon.playing {
  animation: bell-ring 0.8s ease-in-out infinite;
  opacity: 1;
}

@keyframes bell-ring {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(6deg);
  }
  75% {
    transform: rotate(-6deg);
  }
}

.music-control:hover {
  transform: scale(1.05);
  background: rgba(139, 69, 19, 0.2);
  border-color: rgba(139, 69, 19, 0.4);
}

.music-control:hover .music-icon {
  opacity: 1;
}

.music-control:active {
  transform: scale(0.95);
}

.music-icon:not(.playing) {
  animation: none;
  opacity: 0.6;
  transform: rotate(0deg);
}
</style> 