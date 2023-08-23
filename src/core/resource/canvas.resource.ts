import { createResource } from "../../resource";

function canvasResource() {
    return createResource({
        name: "canvas",
        setup() {
            const canvas = document.querySelector("canvas") as HTMLCanvasElement;

            return {
                ctx: canvas.getContext("2d") as CanvasRenderingContext2D,
                update() {},
            };
        },
    });
}

type CanvasResource = ReturnType<typeof canvasResource>;

export { canvasResource };
export type { CanvasResource };
