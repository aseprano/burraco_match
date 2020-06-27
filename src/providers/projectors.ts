import { ServiceContainer } from "../tech/impl/ServiceContainer";
import { Projector } from "../tech/projections/Projector";

module.exports = async (serviceContainer: ServiceContainer): Promise<Projector[]> => {
    return [
        // new SomeProjector(),
        // new SomeOtherProjector(),
    ];
}
