import { animationLoop } from "./animation-loop";
import type { Component } from "./component";
import type { Entity, EntityFactoryMap, EntityMap } from "./entity";
import type { Resource, ResourceMap } from "./resource";
import type { Plugin } from "./plugin";
import { System } from "./system";

interface AppParams<
    AppEntity extends Entity<string, Component<string, any>>,
    AppResource extends Resource<string, any>
> {
    entities: (() => AppEntity)[];
    resources: (() => AppResource)[];
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

        this._entityFactoryMap = entities.reduce(
            (accum: EntityFactoryMap<AppEntity>, factory) => {
                const { kind } = factory();
                return { ...accum, [kind]: factory };
            },
            {} as EntityFactoryMap<AppEntity>
        );
        
        this._resourceMap = resources.reduce(
            (accum: ResourceMap<AppResource>, resource) => {
                const { name, data } = resource();
                return { ...accum, [name]: data };
            },
            {} as ResourceMap<AppResource>
        );

        if (plugins) {
            plugins.forEach((plugin) => {
                plugin(this);
            });
        }
    }

    spawn = <Kind extends AppEntity["kind"]>(
        kind: AppEntity["kind"],
        id?: string
    ): ReturnType<EntityFactoryMap<AppEntity>[Kind]> => {
        const entity = this._entityFactoryMap[kind](id);
        this._entityMap = entity;
        return entity;
    }

    unspawn = (entityId: string) => {
        delete (this._entityMap as any)[entityId];
    }

    getEntityById = <E extends AppEntity>(entityId: string) => {
        return (this._entityMap as any)[entityId] as E | undefined;
    }

    query = <E extends AppEntity>(selector: (entity: E) => boolean): E[] => {
        const entityIds = Object.keys(this._entityMap);
        const results: E[] = [];
        for (let i = 0; i < entityIds.length; i++) {
            if (selector((this._entityMap as any)[entityIds[i]])) {
                results.push((this._entityMap as any)[entityIds[i]]);
            }
        }
        return results;
    }

    queryFirst = <E extends AppEntity>(selector: (entity: E) => boolean): E | undefined => {
        const entityIds = Object.keys(this._entityMap);
        for (let i = 0; i < entityIds.length; i++) {
            if (selector((this._entityMap as any)[entityIds[i]])) {
                return (this._entityMap as any)[entityIds[i]]
            }
        }
    }

    useResource = <Name extends keyof typeof this._resourceMap>(name: Name) => {
        return this._resourceMap[name];
    }

    private get _systemParams() {
        return {
            spawn: this.spawn,
            unspawn: this.unspawn,
            query: this.query,
            queryFirst: this.queryFirst,
            getEntityById: this.getEntityById,
            useResource: this.useResource,
        }
    }

    addStartupSystem(system: System<this>) {
        this._startupSystems.push(() => system(this._systemParams));
    }

    addSystem(system: System<this>) {
        this._systems.push(() => system(this._systemParams));
    }

    run() {
        while (this._startupSystems.length) {
            const system = this._startupSystems.shift()!;
            system();
        }
        this._loop.run(this._systems);
    }

    stop() {
        this._loop.stop();
    }
}

export { App };
