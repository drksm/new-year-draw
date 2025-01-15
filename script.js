document.addEventListener('DOMContentLoaded', function() {
    // 播放背景音乐
    const bgMusic = document.getElementById('bgMusic');
    
    // 由于很多浏览器限制自动播放，我们需要用户交互后才能播放
    document.body.addEventListener('click', function() {
        bgMusic.play();
    }, { once: true });

    // 模拟加载进度
    const progressBar = document.querySelector('.progress-bar');
    let progress = 0;
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 3;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            // 加载完成后的处理
            setTimeout(() => {
                // 这里可以跳转到主页面或显示主内容
                console.log('加载完成');
            }, 500);
        }
        progressBar.style.width = progress + '%';
    }, 100);
}); 