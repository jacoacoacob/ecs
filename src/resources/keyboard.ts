import { createResource } from "../resource";

const KEYS = [
    " ",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "a",
    "s",
    "d",
    "w",
    "z",
    "x",
    "-",
    "=", // is also "+"
] as const;

type Key = typeof KEYS[number];

type Timestamp = number;

function isKey(data: string): data is Key {
    return KEYS.includes(data as Key);
}

function whichDirection(dirNeg: Timestamp, dirPos: Timestamp, velocity: number) {
    if (dirPos > dirNeg) {
        return velocity;
    }
    if (dirPos < dirNeg) {
        return -velocity;
    }
    return 0;
}
    
function keyboardResource() {
    return createResource({
        name: "keyboard",
        setup() {
            const _justPressed = KEYS.reduce(
                (accum: Record<Key, boolean>, key) => ({ ...accum, [key]: false }),
                {} as Record<Key, boolean>
            );
            const _pressed = KEYS.reduce(
                (accum: Record<Key, Timestamp>, key) => ({ ...accum, [key]: 0 }),
                {} as Record<Key, Timestamp>
            );
            const _justReleased = KEYS.reduce(
                (accum: Record<Key, boolean>, key) => ({ ...accum, [key]: false }),
                {} as Record<Key, boolean>
            );

            const _bufferJustPressed: Key[] = [];
            const _bufferJustReleased: Key[] = [];

            function press(key: Key) {
                if (pressed(key) === 0) {
                    _bufferJustPressed.push(key);
                }
            }

            function release(key: Key) {
                _bufferJustReleased.push(key);
            }

            function pressed(key: Key): Timestamp {
                return _pressed[key];
            }

            function justPressed(key: Key) {
                return _justPressed[key];
            }

            function justReleased(key: Key) {
                return _justReleased[key];
            }

            function update() {
                for (let i = 0; i < KEYS.length; i++) {
                    const key = KEYS[i];
                    if (_justPressed[key]) {
                        _justPressed[key] = false;
                        _pressed[key] = Date.now();
                    }
                    _justReleased[key] = false;
                }

                while (_bufferJustPressed.length) {
                    const key = _bufferJustPressed.shift() as Key;
                    _justPressed[key] = true;
                }

                while (_bufferJustReleased.length) {
                    const key = _bufferJustReleased.shift() as Key;
                    _pressed[key] = 0;
                    _justReleased[key] = true;
                }
            }

            return {
                update,
                press,
                release,
                pressed,
                justPressed,
                justReleased,
            };
        },
    });
}

type KeyboardResource = ReturnType<typeof keyboardResource>;

export { keyboardResource, isKey, whichDirection };
export type { KeyboardResource };