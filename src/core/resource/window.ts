import { createResource } from "../../resource";

type ResizeListener = (ev: UIEvent) => void;

function windowResource() {
    return createResource({
        name: "window",
        setup() {
            const _resizeListeners: ResizeListener[] = [];

            return {
                handleResize(ev: UIEvent) {
                    for (let i = 0; i < _resizeListeners.length; i++) {
                        _resizeListeners[i](ev);
                    }
                },
                onResize(listener: ResizeListener) {
                    if (!_resizeListeners.includes(listener)) {
                        _resizeListeners.push(listener);
                    }
                },
                offResize(listner: ResizeListener) {
                    const listenerIndex = _resizeListeners.indexOf(listner);
                    if (listenerIndex > -1) {
                        _resizeListeners.splice(listenerIndex, 1);
                    }
                },
            }
        }
    })
}

type WindowResource = ReturnType<typeof windowResource>;

export { windowResource };
export type { WindowResource };
