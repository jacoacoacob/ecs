import { App } from "../../app";
import type { SystemParams } from "../../system";
import type { CoreResources } from "../resource/index";
import { isKey } from "../resource/keyboard";

type RenderContextDimensions = () => { width: number; height: number };

function setupCoreResources(renderCtxDimensions: RenderContextDimensions) {
    return <A extends App<any, CoreResources>>(params: SystemParams<A>) => {
        const { useResource } = params;
    
        const { ctx } = useResource("canvas");
        const keyboard = useResource("keyboard");
        const mouse = useResource("mouse");
        const gameWindow = useResource("window");
    
        window.addEventListener("resize", gameWindow.handleResize);

        gameWindow.onResize(onGameWindowResize);

        onGameWindowResize();
    
        function onGameWindowResize() {
            const { width, height } = renderCtxDimensions()
            ctx.canvas.width = width;
            ctx.canvas.height = height;
        }
        
        window.addEventListener("keydown", (ev) => {
            let key = ev.key;
            if (/^\w$/.test(key)) {
                // coerce any letters (i.e. "a" or "A") to lowercase
                key = key.toLowerCase();
            }
            if (isKey(key)) {
                keyboard.press(key);
            }
        });
    
        window.addEventListener("keyup", (ev) => {
            let key = ev.key;
            if (/^\w$/.test(key)) {
                key = key.toLowerCase();
            }
            if (isKey(key)) {
                keyboard.release(key);
            }
        });

        ctx.canvas.addEventListener("mousedown", (ev) => {
            mouse.press(ev);
        });

        ctx.canvas.addEventListener("mousemove", (ev) => {
            mouse.move(ev);
        });

        ctx.canvas.addEventListener("mouseup", (ev) => {
            mouse.release(ev);
        });

        ctx.canvas.addEventListener("mouseleave", (ev) => {
            mouse.position.canvasX = -1;
            mouse.position.canvasY = -1;
        });
    };
}

export { setupCoreResources };
