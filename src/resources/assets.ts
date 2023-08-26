import { createResource } from "../resource";

function assetsResource(assetsRoot: string) {
    return () => createResource({
        name: "assets",
        setup() {
            const images: Record<string, HTMLImageElement> = {};

            function loadImage(path: string, name: string): Promise<void> {
                return new Promise((resolve) => {
                    const image = new Image();
                    image.src = assetsRoot + path;
                    image.onload = () => {
                        images[name] = image;
                        resolve();
                    };
                });
            }

            function useImage(name: string) {
                return images[name];
            }

            return {
                loadImage,
                useImage,
            };
        },
    });
}

type AssetsResource = ReturnType<ReturnType<typeof assetsResource>>;

export { assetsResource };
export type { AssetsResource };
