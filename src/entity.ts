import type { Component } from "./component";

interface Entity<Kind extends string, Comp extends Component<string, any>> {
    kind: Kind;
    id: string;
    components: {
        [C in Comp as C["kind"]]: C["data"];
    };
}

interface EntityOptions<Kind extends string, Comp extends Component<string, any>> {
    kind: Kind;
    id: string;
    components: Comp[];
}

type EntityMap<E extends Entity<string, Component<string, any>>> = {
    [X in E as X["id"]]: X;
}

type EntityFactoryMap<E extends Entity<string, Component<string, any>>> = {
    [X in E as X["kind"]]: (id?: string) => E;
}

function createEntity<Kind extends string, Comp extends Component<string, any>>({
    kind,
    id,
    components
}: EntityOptions<Kind, Comp>): Entity<Kind, Comp> {
    return {
        kind,
        id,
        components: components.reduce(
            (accum: Entity<Kind, Comp>["components"], { kind, data }) => ({
                ...accum,
                [kind]: data
            }),
            {} as Entity<Kind, Comp>["components"]
        ),
    };
}

export { createEntity };
export type { Entity, EntityMap, EntityFactoryMap };