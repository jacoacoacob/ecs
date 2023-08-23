import { animationLoop } from "./animation-loop";
import type { Component } from "./component";
import type { Entity, EntityFactoryMap, EntityMap } from "./entity";
import type { Resource, ResourceMap } from "./resource";
import type { Plugin } from "./plugin";

interface AppParams<
    AppEntity extends Entity<string, Component<string, any>>,
    AppResource extends Resource<string, any>
> {
    entities: EntityFactoryMap<AppEntity>;
    resources: ResourceMap<AppResource>;
    plugins?: Plugin<App<AppEntity, AppResource>>[];
}

class App<
    AppEntity extends Entity<string, Component<string, any>>,
    AppResource extends Resource<string, any>
> {
    private _loop = animationLoop();
    private _startupSystems: (() => void)[] = [];
    private _systems: (() => void)[] = [];
    private _entityMap = {} as EntityMap<AppEntity>;
    private _entityFactoryMap = {} as EntityFactoryMap<AppEntity>;
    private _resourceMap = {} as ResourceMap<AppResource>;

    constructor(params: AppParams<AppEntity, AppResource>) {
        const { entities, resources, plugins } = params;

        this._entityFactoryMap = entities;
        this._resourceMap = resources;
    }

}

export { App };
