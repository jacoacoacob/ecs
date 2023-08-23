
function animationLoop() {
    let _handle: number;

    function run(systems: (() => void)[]) {
        for (let i = 0; i < systems.length; i++) {
            systems[i]();
        }
        _handle = window.requestAnimationFrame(() => run(systems));
    }

    function stop() {
        window.cancelAnimationFrame(_handle);
    }
    
    return { run, stop };
}

export { animationLoop };