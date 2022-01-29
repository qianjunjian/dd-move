# 运动基础库
    暂时只支持react17版本使用的轻量级运动库，支持ie11。

# 使用方法
    `   
        import { useSpring } = from "dd-move";

        const [{ position }, api] = useSpring(
            () => ({
                position: current * 100, // 初始数值
                config: { 
                    tension: 200, // 弹簧能量负荷
                    friction: 30 // 弹簧阻力
                },
                // 动画执行完后执行回调
                onRest: () => {
                }
            })
        )
    `

    `
        api.start({
            position: standardPosition,  // 运动到的数值
            immediate: true   // 是否要动画， 【true：立即，不需要动画】。
        })
    `
