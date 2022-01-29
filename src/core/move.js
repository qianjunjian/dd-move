let nativeRaf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function() {}

let now = typeof performance != "undefined" ? function() { 
    return performance.now() 
} : Date.now;  

class Move {
    tension = 200; // 弹簧能量负荷
    friction = 30; // 弹簧阻力
    position = 0;
    // 最后速度
    lastVelocity;
    // 初始速度
    v0 = 0;
    // 初始值
    from = 0;
    // 目标值
    to = 0;
    // 是否执行完成
    finished = false;
    // 动画执行时间
    ts = -1;
    // 动画开始时间
    startTime = undefined;

    constructor(options) {
        // 初始化配置
        options = options || {};
        this.position = options.position || 0;
        this.from = options.position || 0;
        this.v0 = options.velocity || 0;
        //  弹簧能量负荷
        this.tension = options.config && options.config.tension;
        // 弹簧阻力
        this.friction = options.config && options.config.friction;
        // 回调
        this.valueChange = options.valueChange;
    }

    loop = () => {
        if (this.ts >= 0) {
            var prevTs = this.ts;
            this.ts = now();
            var timeout = this.isTimeout(this.ts)
            if (timeout) {
                // 超时
                console.log("time out!")
                this._stop();
            } else {
                this.run(prevTs ? Math.min(64, this.ts - prevTs) : 16.667)
                this.animateId = nativeRaf(this.loop)
            }
        }
    }

    // 超时时间1秒钟
    isTimeout = time => {
        return time - this.startTime > 1000;
    }

    start = (data) => {
        if (data.immediate) {
            this.to = data.position;
            this.position = data.position;
            this.from = data.position;
            this._onChange(data.position, 0);
        } else {
            // 空闲
            if (this.ts < 0) {
                this.ts = 0;
                this.to = data.position;
                this.startTime = now();
                // 清除缓存得最后速度
                this.lastVelocity = null
                this.loop();
            }
        }
    }

    run = dt => {
        var velocity = this.lastVelocity == null ? this.v0 : this.lastVelocity;
        // 精度
        var precision = this.from == this.to ? 0.005 : Math.min(1, Math.abs(this.to - this.from) * 0.001);
        var restVelocity = precision / 10;
        var isMoving;
        //  步长
        var step = 1;
        var numSteps = Math.ceil(dt / step)
        for (var n = 0; n < numSteps; ++n) {
            isMoving = Math.abs(velocity) > restVelocity

            if (!isMoving) {
                this.finished = Math.abs(this.to - this.position) <= precision
                if (this.finished) {
                    break;
                }
            }

            var springForce = -this.tension * 0.000001 * (this.position - this.to)
            var dampingForce = -this.friction * 0.001 * velocity
            var acceleration = springForce + dampingForce

            velocity = velocity + acceleration * step
            this.position = this.position + velocity * step
        }

        this.lastVelocity = velocity
        
        if (this.finished) {
            this._stop()
        } else {
            this._onChange(this.position)
        }
    }

    _stop = () => {
        this.position = this.to;
        this.from = this.to;
        this.ts = -1;
        this._onChange(this.to, 0)
    }

    _onChange = (value, status = 1) => {
        this.valueChange && this.valueChange({
            position: value, 
            status
        });
    }
}

export default Move