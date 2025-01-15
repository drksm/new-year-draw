<template>
  <canvas 
    ref="canvasRef" 
    class="burn-canvas"
    :width="width"
    :height="height"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  active: Boolean,
  width: {
    type: Number,
    default: 400
  },
  height: {
    type: Number,
    default: 600
  }
})

const emit = defineEmits(['burn-complete', 'burn-progress'])
const canvasRef = ref(null)
let animationFrame = null
let particles = []
let burnProgress = 0
let ctx = null

onMounted(() => {
  ctx = canvasRef.value.getContext('2d')
})

class Particle {
  constructor(x, y, ctx) {
    this.x = x
    this.y = y
    this.ctx = ctx
    this.size = Math.random() * 4 + 2
    this.speedX = Math.random() * 8 - 4
    this.speedY = Math.random() * -15 - 8
    this.color = `hsl(${Math.random() * 30 + 15}, 100%, ${Math.random() * 40 + 50}%)`
    this.life = 1
    this.decay = Math.random() * 0.03 + 0.02
    this.angle = Math.random() * Math.PI * 2
    this.angularSpeed = (Math.random() - 0.5) * 0.2
  }

  update() {
    this.x += this.speedX + Math.sin(this.angle) * 2
    this.y += this.speedY
    this.speedY += 0.1 + Math.random() * 0.2
    this.angle += this.angularSpeed
    this.life -= this.decay
  }

  draw() {
    this.ctx.fillStyle = this.color
    this.ctx.globalAlpha = this.life
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    this.ctx.fill()
  }
}

const startBurning = () => {
  console.log('2.8 startBurning')
  if (!ctx) return
  
  burnProgress = 0
  particles = []
  let lastTime = 0
  let burnOffset = new Array(10).fill(0)

  const animate = (timestamp) => {
    const deltaTime = timestamp - lastTime
    lastTime = timestamp
    
    ctx.clearRect(0, 0, props.width, props.height)
    
    const baseY = burnProgress * props.height
    
    burnOffset = burnOffset.map(v => {
      return Math.max(-20, Math.min(20, v + (Math.random() - 0.5) * 4))
    })

    if (burnProgress < 1) {
      for (let i = 0; i < burnOffset.length; i++) {
        const x = (props.width * i) / (burnOffset.length - 1)
        const y = baseY + burnOffset[i]
        
        if (Math.random() < 0.7) {
          particles.push(new Particle(x, y, ctx))
        }
      }
      
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * props.width
        const y = baseY + (Math.random() * 40 - 20)
        particles.push(new Particle(x, y, ctx))
      }

      burnProgress += 0.0012 * (deltaTime / 16)
      emit('burn-progress', burnProgress)
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update()
      particles[i].draw()
      if (particles[i].life <= 0) {
        particles.splice(i, 1)
      }
    }

    ctx.beginPath()
    ctx.moveTo(0, 0)
    
    let prevX, prevY
    for (let i = 0; i < burnOffset.length; i++) {
      const x = (props.width * i) / (burnOffset.length - 1)
      const y = baseY + burnOffset[i]
      if (i === 0) {
        ctx.moveTo(x, y)
        prevX = x
        prevY = y
      } else {
        const xc = (x + prevX) / 2
        const yc = (y + prevY) / 2
        ctx.quadraticCurveTo(prevX, prevY, xc, yc)
        prevX = x
        prevY = y
      }
    }
    
    ctx.lineTo(props.width, 0)
    ctx.lineTo(0, 0)
    
    const gradient = ctx.createLinearGradient(0, baseY - 20, 0, baseY + 20)
    gradient.addColorStop(0, 'rgba(255, 50, 0, 0.4)')
    gradient.addColorStop(0.5, 'rgba(255, 140, 0, 0.8)')
    gradient.addColorStop(1, 'rgba(255, 140, 0, 0)')
    
    ctx.fillStyle = gradient
    ctx.fill()

    if (burnProgress >= 1 && particles.length === 0) {
      cancelAnimationFrame(animationFrame)
      emit('burn-complete')
      return
    }

    animationFrame = requestAnimationFrame(animate)
  }

  animate(performance.now())
}

// 监听 active 属性变化
watch(() => props.active, (newVal) => {
  console.log('2.5 BurnEffect watch active:', newVal)
  if (newVal) {
    // 清除之前的动画
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }
    // 重置状态并开始新的动画
    burnProgress = 0
    particles = []
    startBurning()
  }
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<style scoped>
.burn-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style> 