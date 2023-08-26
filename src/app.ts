import { animationLoop } from "./animation-loop";
import type { Component } from "./component";
import type { Entity, EntityFactoryMap, EntityMap } from "./entity";
import type { Resource, ResourceMap } from "./resource";
import type { Plugin } from "./plugin";
import { System } from "./system";

class App<
    AppEntity extends Entity<string, Component<string, any>>,
    AppResource extends Resource<string, any>
> {
    private _loop = animationLoop();
    private _plugins: Plugin<this>[] = [];
    private _startupSystems: (() => Promise<void>)[] = [];
    private _systems: (() => void)[] = [];
    private _entityMap = {} as EntityMap<AppEntity>;
    private _entityFactoryMap = {} as EntityFactoryMap<AppEntity>;
    private _resourceMap = {} as ResourceMap<AppResource>;

    private _isInitialized = false;

    private async _init() {
        if (!this._isInitialized) {
            this._plugins.forEach((plugin) => {
                plugin(this);
            });
            this._isInitialized = true;
        }
        while (this._startupSystems.length) {
            const system = this._startupSystems.shift()!;
            await system();
        }
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

    addStartupSystem(system: System<this>) {
        this._startupSystems.push(async () => system(this._systemParams));
    }

    addSystem(system: System<this>) {
        this._systems.push(() => system(this._systemParams));
    }

    addResource(factory: () => AppResource) {
        const { name, data } = factory();
        this._resourceMap[name as AppResource["name"]] = data;
    }

    addEntityFactory(factory: () => AppEntity) {
        const { kind } = factory();
        (this._entityFactoryMap as any)[kind] = factory;
    }

    use(plugin: Plugin<this>) {
        this._plugins.push(plugin);
    }

    async run() {
        await this._init();

        const resourceMapKeys = Object.keys(this._resourceMap);

        this._loop.run([
            ...this._systems,
            () => {
                for (let i = 0; i < resourceMapKeys.length; i++) {
                    const resource = (this._resourceMap as any)[resourceMapKeys[i]];
                    if (typeof resource.update === "function") {
                        resource.update();
                    }
                }
            },
        ]);
    }

    stop() {
        this._loop.stop();
    }
}

export { App };
