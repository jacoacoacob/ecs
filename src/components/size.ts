import { Component } from "../component";

type Size = Component<"size", {
    w: number;
    h: number;
}>;

function size(w?: number, h?: number): Size {
    return {
        kind: "size",
        data: {
            w: w ?? 0,
            h: h ?? 0,
        },
    };
}

export { size };
export type { Size };
