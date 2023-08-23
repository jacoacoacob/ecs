import { App } from "./app";

interface SystemParams<A extends App<any, any>> {
    
}

type System<A extends App<any, any>> = (params: SystemParams<A>) => void;

export type { System, SystemParams };
