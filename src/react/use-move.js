import { useMemo, useState, useLayoutEffect } from "react";
import Move from "../core/move";

export const useSpring = (effect) => {

    const [ position, setPosition] = useState({
        position: 0,
        status: 0 // 0: 动画结束，1：动画进行中
    });

    const api = useMemo(() => {
        // 初始化时获取配置
        const options = effect();
        // 设置初始状态
        if (options.position !== 0) {
            setPosition({
                position: options.position,
                status: 0 // 0: 动画结束，1：动画进行中
            })
        }
        return new Move({
            ...options,
            valueChange: (data) => {
                setPosition(data);
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useLayoutEffect(() => {
        if (position.status === 0) {
            // 动画结束回调
            const options = effect();
            options.onRest && options.onRest();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position.status])

    return [position, api];
}
