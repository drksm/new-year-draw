const { NodeSSH } = require('node-ssh')
const path = require('path')
const fs = require('fs')

const config = {
  host: '39.106.153.222',    // 阿里云服务器公网 IP
  username: 'root',          // 用户名
  password: '@!DRK1812',     // ECS 服务器的 root 密码
  distPath: path.resolve(__dirname, './dist'),
  remotePath: '/dist',       // 修改为根目录下的 dist
  tryKeyboard: true,         // 启用键盘交互认证
  readyTimeout: 20000,       // 连接超时时间
  algorithms: {
    serverHostKey: ['ssh-rsa', 'ecdsa-sha2-nistp256', 'ssh-ed25519']
  }
}

// 清理本地 dist 文件夹
function cleanLocalDist() {
  console.log('正在清理本地 dist 文件夹...')
  if (fs.existsSync(config.distPath)) {
    fs.rmSync(config.distPath, { recursive: true, force: true })
  }
  console.log('本地 dist 文件夹清理完成')
}

async function deploy() {
  const ssh = new NodeSSH()
  
  try {
    // 先清理本地 dist
    cleanLocalDist()

    // 执行构建
    console.log('正在构建项目...')
    const buildResult = require('child_process').spawnSync('npm', ['run', 'build'], {
      stdio: 'inherit',
      shell: true
    })
    
    if (buildResult.status !== 0) {
      throw new Error('构建失败')
    }
    
    console.log('项目构建完成')

    // 连接服务器
    console.log('正在连接服务器...')
    await ssh.connect(config)
    console.log('服务器连接成功')

    // 删除远程目录下的旧文件
    console.log('正在清理远程目录...')
    await ssh.execCommand(`rm -rf ${config.remotePath}/*`)

    // 上传新的构建文件
    console.log('正在上传文件...')
    await ssh.putDirectory(config.distPath, config.remotePath, {
      recursive: true,
      concurrency: 10,
      tick: function(localPath, remotePath, error) {
        if (error) {
          console.error(`上传失败: ${localPath}`)
        } else {
          console.log(`上传成功: ${localPath}`)
        }
      }
    })

    console.log('部署完成')
  } catch (error) {
    console.error('部署失败:', error)
    process.exit(1)
  } finally {
    ssh.dispose()
  }
}

// 执行部署
deploy() 