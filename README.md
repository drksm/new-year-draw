# 新年抽签

一个基于 Vue 3 + Vite 开发的新年抽签应用。

## 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 本地预览生产版本
npm run preview
```

## 部署说明

项目使用 `node-ssh` 进行自动化部署。

### 服务器环境

项目使用 Nginx 作为 Web 服务器。以下是常用的 Nginx 管理命令：

```bash
# 启动 Nginx
systemctl start nginx

# 停止 Nginx
systemctl stop nginx

# 重启 Nginx
systemctl restart nginx

# 重新加载配置
systemctl reload nginx

# 查看 Nginx 状态
systemctl status nginx

# 检查 Nginx 配置是否正确
nginx -t
```

### 阿里云服务器配置

1. 使用密码认证：
   - 修改 `deploy.js` 中的配置：
   ```javascript
   const config = {
     host: '39.106.153.222',    // 服务器公网 IP
     username: 'root',          // 用户名
     password: '你的服务器密码',  // 服务器密码
     distPath: './dist',        // 本地构建文件路径
     remotePath: '/root/dist'   // 远程部署路径
   }
   ```

2. 使用 SSH 密钥认证（推荐）：
   ```bash
   # 1. 生成 SSH 密钥对
   ssh-keygen -t rsa -b 2048

   # 2. 将公钥添加到服务器
   ssh-copy-id root@39.106.153.222
   ```
   
   然后使用密钥配置：
   ```javascript
   const config = {
     host: '39.106.153.222',
     username: 'root',
     privateKey: require('os').homedir() + '/.ssh/id_rsa',
     distPath: './dist',
     remotePath: '/root/dist'
   }
   ```

### 前置条件

1. 确保本地有 SSH 密钥（通常在 `~/.ssh/id_rsa`）或使用密码认证
2. 确保 SSH 密钥已添加到服务器的授权列表中（如果使用密钥认证）
3. 确保服务器上有正确的目录权限

### 部署命令

```bash
# 构建并部署到服务器
npm run deploy
```

该命令会：
1. 清理本地 dist 文件夹
2. 构建项目生成新的 dist 文件夹
3. 连接到远程服务器
4. 清理服务器上的旧文件
5. 上传新的构建文件

### 部署配置

部署配置在 `deploy.js` 文件中，可以根据需要修改配置参数。 