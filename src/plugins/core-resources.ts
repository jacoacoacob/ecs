
import { App } from "../app";

import { canvasResource, type CanvasResource } from "../resources/canvas";
import { keyboardResource, isKey, type KeyboardResource } from "../resources/keyboard";
import { mouseResource, type MouseResource } from "../resources/mouse";
import { windowResource, type WindowResource } from "../resources/window";

type CoreResources =
    CanvasResource |
    KeyboardResource |
    MouseResource |
    WindowResource;

type RenderingContext = () => {
    width: number;
    height: number;
    selector: string;
};

function coreResources(renderingContext: RenderingContext) {
    return (app: App<any, CoreResources>) => {
        const { selector } = renderingContext();

        app.addResource(canvasResource(selector));
        app.addResource(keyboardResource);
        app.addResource(mouseResource);
        app.addResource(windowResource);

        app.addStartupSystem(({ useResource }) => {
            const { ctx } = useResource("canvas");
            const keyboard = useResource("keyboard");
            const mouse = useResource("mouse");
            const gameWindow = useResource("window");
        
            window.addEventListener("resize", gameWindow.handleResize);
    
            gameWindow.onResize(onGameWindowResize);
    
            onGameWindowResize();
        
            function onGameWindowResize() {
                const { width, height } = renderingContext()
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
    
            ctx.canvas.addEventListener("mouseleave", () => {
                mouse.position.canvasX = -1;
                mouse.position.canvasY = -1;
            });
        });
    };
}

export { coreResources };
export type { CoreResources };
