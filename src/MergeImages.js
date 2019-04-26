/**
 * 利用canvas合并多张图片为一张
 * @param {Object} options 
 */
function MergeImage(options){
    this.init(options)
}

MergeImage.prototype.init = function(options){
    this.options = options
    this.target = typeof options.target === 'string' ? document.querySelector(options.target) : options.target
    this.remainImgCount = options.otherImgs.length
    this.scale = 2 // 缩放倍数，防止变糊，4效果最好
    this.createCanvasByImg()
}

// 创建canvas
MergeImage.prototype.createCanvasByImg = function(){
    // 先加载图，根据图片大小来创建canvas
    this.loadImg(this.options.bgImg.url).then(this.bgImgLoadHandle.bind(this))
}

/**
 * 加载图片公用函数
 *
 * @param {String} src 图片地址
 * @param {Function=} succ 加载成功回调
 * @param {Function=} err 加载失败回调
 */
MergeImage.prototype.loadImg = function(src, succ, err){
    return new Promise((resolve, reject) => {
        let img = new Image()
        this.getBase64(src).then(base64 => {
            img.src = base64
            // img.setAttribute('crossOrigin', '*')
            // img.crossOrigin = '*' // 跨域用（并不好使，得配合加随机数）
            img.onload = e => {
                resolve(img)
            }
            img.onerror = e => {
                console.log('图片加载出错了', e.target.src)
                reject(e)
            }
        })
    })
}

// 背景图加载完成事件
MergeImage.prototype.bgImgLoadHandle = function(bgImage){
    // 创建canvas
    this.canvas = document.createElement("canvas")
    this.canvas.width = this.scale * document.documentElement.clientWidth
    this.canvas.height = bgImage.height * this.canvas.width / bgImage.width
    this.context = this.canvas.getContext("2d")
    // 向canvas画图
    this.context.drawImage(bgImage , 0 , 0 , this.canvas.width , this.canvas.height)
    this.loadOtherImg() // 加载其他图片
}

//加载其他图片
MergeImage.prototype.loadOtherImg = function(){
    this.options.otherImgs.map(item => {
        this.loadImg(item.url).then(img => {
            let width = item.width * this.canvas.width
            let height = item.height * this.canvas.width
            let x = item.x * this.canvas.width
            let y = item.y * this.canvas.width
            let radius = item.radius * this.canvas.width
            if(item.isCircle){
                // 画原图
                this.drawCircleImg(this.context, img, x, y, radius)
            }else {
                // 画方图
                this.context.drawImage(img, x, y, width , height)
            }
            this.generatorImage(function(res){
                this.options.success && this.options.success.call(this.target, res)
            })
        }, err => {
            this.generatorImage(function(res){
                this.options.error && this.options.error.call(this.target, err, res)
            })
        })
    })
}

// 生成最后的图片
MergeImage.prototype.generatorImage = function(fn){
    this.remainImgCount--
    if(!this.remainImgCount){
        let base64 = ''
        try{
            base64 = this.canvas.toDataURL("image/jpeg")
            fn && fn.call(this, base64)
        }catch(e){
            console.log(e)
        }
        this.options.finally && this.options.finally.call(this.target, base64)
    }
}

// 画圆图
MergeImage.prototype.drawCircleImg = function(ctx, img, x, y, r){
    ctx.save()
    var d = 2 * r
    var cx = x + r
    var cy = y + r
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(img, x, y, d, d)
}
MergeImage.prototype.getBase64 = function(imgUrl) {
    return new Promise((resolve, reject) => {
        if(/^http/.test(imgUrl)){
            imgUrl = imgUrl.replace('http://', 'https://') // https请求http的图会出错
            var xhr = new XMLHttpRequest();
            xhr.open("get", imgUrl, true);
            // 请求blob二进制流
            xhr.responseType = "blob";
            xhr.onload = function () {
                if (this.status == 200) {
                    //得到一个blob对象
                    var blob = this.response;
                    // 读文件流，转成base64
                    let oFileReader = new FileReader();
                    oFileReader.onloadend = function (e) {
                        let base64 = e.target.result;
                        resolve(base64)
                    };
                    oFileReader.readAsDataURL(blob);
                }
            }
            xhr.send();
        }else {
            resolve(imgUrl)
        }
    })
}

export default MergeImage