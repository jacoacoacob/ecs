const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randId(len: number = 6) {
    let rv = "";
    for (let i = 0; i < len; i++) {
        rv += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    return rv;
}

export { randId };
