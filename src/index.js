import { useMemo, use } from "react";
import Move from "./core/move";

export const useSpring = (effect, deps) => {
    const api = useMemo(() => {
        return new Move();
    }, [])

    return [api]
}