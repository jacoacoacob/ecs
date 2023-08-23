import { App } from "./app";

interface SystemParams<A extends App<any, any>> {
    getEntityById: A["getEntityById"];
    query: A["query"];
    queryFirst: A["queryFirst"];
    spawn: A["spawn"];
    unspawn: A["unspawn"];
    useResource: A["useResource"];
}

type System<A extends App<any, any>> = (params: SystemParams<A>) => void;

export type { System, SystemParams };
