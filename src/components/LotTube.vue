<template>
  <div class="lot-container">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  isShaking: Boolean
})

const canvasRef = ref(null)
let scene, camera, renderer, tube
let animationFrameId = null
let initialRotation = 0

// 创建木质纹理
const createWoodTexture = () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = 1024  // 增加纹理分辨率
  canvas.height = 1024

  // 基础颜色
  ctx.fillStyle = '#8B0000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 添加木纹
  for (let i = 0; i < 100; i++) {  // 增加木纹数量
    ctx.beginPath()
    ctx.strokeStyle = `rgba(80, 0, 0, ${Math.random() * 0.2})`
    ctx.lineWidth = Math.random() * 3 + 1
    
    const y = Math.random() * canvas.height
    ctx.moveTo(0, y)
    
    let x = 0
    while (x < canvas.width) {
      x += Math.random() * 20
      const newY = y + (Math.random() - 0.5) * 20
      ctx.lineTo(x, newY)
    }
    ctx.stroke()
  }

  // 添加更多细节
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const radius = Math.random() * 2 + 1
    ctx.beginPath()
    ctx.fillStyle = `rgba(60, 0, 0, ${Math.random() * 0.3})`
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 1)
  texture.anisotropy = 16  // 增加各向异性过滤
  return texture
}

// 创建单个签子的几何体 - 调整签子尺寸
const createLotGeometry = () => {
  const shape = new THREE.Shape()
  // 创建更小的五边形横截面
  shape.moveTo(-0.03, 0)      // 左下
  shape.lineTo(-0.02, 0.08)   // 左上
  shape.lineTo(0, 0.1)        // 顶点
  shape.lineTo(0.02, 0.08)    // 右上
  shape.lineTo(0.03, 0)       // 右下
  shape.lineTo(-0.03, 0)      // 闭合

  const extrudeSettings = {
    depth: 6.8,              // 签子长度略小于筒内高度
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 3
  }

  return new THREE.ExtrudeGeometry(shape, extrudeSettings)
}

// 创建签筒
const createTube = () => {
  const woodTexture = createWoodTexture()
  
  // 创建空心圆柱体组
  const tubeGroup = new THREE.Group()
  
  // 外筒
  const outerGeometry = new THREE.CylinderGeometry(2, 2, 6, 128)
  const outerMaterial = new THREE.MeshPhongMaterial({
    map: woodTexture,
    bumpMap: woodTexture,
    bumpScale: 0.1,
    shininess: 30,
    specular: 0x333333,
    side: THREE.DoubleSide
  })
  const outerTube = new THREE.Mesh(outerGeometry, outerMaterial)
  
  // 内筒
  const innerGeometry = new THREE.CylinderGeometry(1.8, 1.8, 6.2, 128)
  const innerMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    side: THREE.BackSide
  })
  const innerTube = new THREE.Mesh(innerGeometry, innerMaterial)
  
  tubeGroup.add(outerTube)
  tubeGroup.add(innerTube)
  
  // 添加筒口装饰
  const rimGeometry = new THREE.TorusGeometry(2.1, 0.2, 32, 128)
  const rimMaterial = new THREE.MeshPhongMaterial({
    color: 0x8B0000,
    shininess: 50,
    specular: 0x666666
  })
  
  const topRim = new THREE.Mesh(rimGeometry, rimMaterial)
  topRim.position.y = 3
  topRim.rotation.x = Math.PI / 2
  
  const bottomRim = topRim.clone()
  bottomRim.position.y = -3
  
  tubeGroup.add(topRim)
  tubeGroup.add(bottomRim)

  tube = tubeGroup
  scene.add(tube)
}

// 初始化场景
const init = () => {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xFFE4B5)

  camera = new THREE.PerspectiveCamera(
    75,
    canvasRef.value.clientWidth / canvasRef.value.clientHeight,
    0.1,
    1000
  )
  
  // 调整相机位置，使其从上方俯视
  camera.position.set(0, 12, 8)  // 改变相机位置
  camera.lookAt(0, 0, 0)        // 看向原点

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  })
  
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(canvasRef.value.clientWidth, canvasRef.value.clientHeight, false)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  // 增强光照效果
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 8, 5)  // 调整主光源位置
  directionalLight.castShadow = true
  scene.add(directionalLight)

  // 调整点光源位置
  const pointLight = new THREE.PointLight(0xffccaa, 0.8)
  pointLight.position.set(-5, 5, 2)
  scene.add(pointLight)

  createTube()
}

// 动画循环
const animate = () => {
  animationFrameId = requestAnimationFrame(animate)

  if (props.isShaking) {
    // 摇晃动画
    const shakeAmount = 0.2
    tube.rotation.z = initialRotation + Math.sin(Date.now() * 0.02) * shakeAmount
  } else {
    // 平滑回到初始位置
    tube.rotation.z *= 0.95
  }

  renderer.render(scene, camera)
}

// 处理窗口大小变化
const handleResize = () => {
  if (!canvasRef.value) return
  
  const width = canvasRef.value.clientWidth
  const height = canvasRef.value.clientHeight
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  
  renderer.setSize(width, height, false)
  renderer.setPixelRatio(window.devicePixelRatio)
}

onMounted(() => {
  init()
  animate()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.lot-container {
  width: 100%;
  height: 600px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

canvas {
  width: 100% !important;
  height: 100% !important;
  max-width: 800px;
}
</style> 