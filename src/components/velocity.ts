import type { Component } from "../component";

type Velocity = Component<"velocity", {
    dx: number;
    dy: number;
}>;

function velocity(data?: Partial<Velocity["data"]>): Velocity {
    return {
        kind: "velocity",
        data: {
            dx: data?.dx ?? 0,
            dy: data?.dy ?? 0,
        },
    };
}

export { velocity };
export type { Velocity };
