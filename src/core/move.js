class Move {
    nativeRaf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function() {}
    now = typeof performance != 'undefined' ? function() {return performance.now()} : Date.now;

    tension = 200; // 弹簧能量负荷
    friction = 30; // 弹簧阻力
    position = 0;
    // 最后速度
    lastVelocity;
    // 初始速度
    v0 = 0;

    from = 0; // 初始值
    to = 0;  // 目标值

    finished = false; // 是否执行完成
    ts = -1;
    startTime = undefined;

    constructor(porps) {
        this.position = porps.position || 0;
        this.from = porps.from || 0;
        this.v0 = porps.velocity || 0;
    }

    loop = () => {
        if (this.ts >= 0) {
            console.log(">>>>>>>")
            var prevTs = this.ts;
            this.ts = this.now();
            var timeout = this.isTimeout(this.ts)
            if (timeout) {
                // 超时
                console.log("time out!")
                this._stop();
            } else {
                this.run(prevTs ? Math.min(64, this.ts - prevTs) : 16.667)
                window.requestAnimationFrame(this.loop)
            }
        }
    }

    // 超时时间1秒钟
    isTimeout = time => {
        return time - this.startTime > 1000;
    }

    start = (data) => {
        this.to = data.to;
        if (data.immediate) {
            
        } else {
            // 空闲
            if (this.ts < 0) {
                this.ts = 0;
                this.startTime = this.now();
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
        console.log(">>>>>>>>>>>>>", this.position)
        this.ts = -1;
    }

    _onChange = (value) => {
        console.log(">>>>>>>>>>>>>", value)
    }
}

export default Move