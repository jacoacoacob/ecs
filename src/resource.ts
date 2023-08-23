
interface ResourceData {
    update: () => void;
}

interface Resource<Name extends string, Data extends ResourceData> {
    name: Name;
    data: Data;
}

interface ResourceParams<Name extends string, Data extends ResourceData> {
    name: Name;
    setup: () => Data;
}

type ResourceMap<R extends Resource<string, any>> = {
    [X in R as X["name"]]: X["data"];
}

function createResource<Name extends string, Data extends ResourceData>(
    params: ResourceParams<Name, Data>
): Resource<Name, Data> {
    const { name, setup } = params;

    return { name, data: setup() };
}

export { createResource };
export type { Resource, ResourceMap };
