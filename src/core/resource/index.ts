import { canvasResource, type CanvasResource } from "./canvas";
import { keyboardResource, type KeyboardResource } from "./keyboard";
import { mouseResource, type MouseResource } from "./mouse";
import { windowResource, type WindowResource } from "./window";

type CoreResources =
    CanvasResource |
    KeyboardResource |
    MouseResource |
    WindowResource;

export {
    canvasResource,
    keyboardResource,
    mouseResource,
    windowResource,
};
export type {
    CanvasResource,
    CoreResources,
    KeyboardResource,
    MouseResource,
    WindowResource,
};
