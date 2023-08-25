import { createResource } from "../resource";

type MouseState = "just_pressed" | "just_released" | "released" | "pressed";

function mouseResource() {
    return createResource({
        name: "mouse",
        setup() {
            let _state: MouseState = "released";
            let _bufferState: MouseState = "released";

            const position = {
                canvasX: -1,
                canvasY: -1,
            };

            return {
                position,
                get state() {
                    return _state;
                },
                move(ev: MouseEvent) {
                    position.canvasX = ev.offsetX;
                    position.canvasY = ev.offsetY;
                },
                press(ev: MouseEvent) {
                    _bufferState = "just_pressed";
                    position.canvasX = ev.offsetX;
                    position.canvasY = ev.offsetY;
                },
                release(ev: MouseEvent) {
                    _bufferState = "just_released";
                    position.canvasX = ev.offsetX;
                    position.canvasY = ev.offsetY;
                },
                update() {
                    if (_bufferState === "just_pressed") {
                        _state = "just_pressed";
                        _bufferState = "pressed";
                    }
                    else if (_bufferState === "pressed") {
                        _state = "pressed";
                    }
                    else if (_bufferState === "just_released") {
                        _state = "just_released";
                        _bufferState = "released";
                    }
                    else if (_bufferState === "released") {
                        _state = "released";
                    }
                },
            };
        },
    });
}

type MouseResource = ReturnType<typeof mouseResource>;

export { mouseResource };
export type { MouseResource };
