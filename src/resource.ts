
interface Resource<Name extends string, Data> {
    name: Name;
    data: Data;
}

interface ResourceParams<Name extends string, Data> {
    name: Name;
    setup: () => Data;
}

type ResourceMap<R extends Resource<string, any>> = {
    [X in R as X["name"]]: X["data"];
}

type ResourceFactory<
    Name extends string,
    Data
> = () => Resource<Name, Data>;

function createResource<Name extends string, Data>(
    params: ResourceParams<Name, Data>
): Resource<Name, Data> {
    const { name, setup } = params;

    const data = setup();

    return { name, data: setup() };
}

export { createResource };
export type { Resource, ResourceMap, ResourceFactory };
