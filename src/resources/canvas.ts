import { createResource } from "../resource";

function canvasResource(selector: string) {
    return () => createResource({
        name: "canvas",
        setup() {
            const canvas = document.querySelector(selector) as HTMLCanvasElement;
            const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

            return { ctx };
        },
    });
}

type CanvasResource = ReturnType<ReturnType<typeof canvasResource>>;

export { canvasResource };
export type { CanvasResource };
