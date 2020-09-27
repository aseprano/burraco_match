import { StdCardSerializer } from "../domain/domain-services/impl/StdCardSerializer";
import { StringCardSerializer } from "../domain/domain-services/impl/StringCardSerializer";
import { MatchesProjector } from "../projectors/MatchesProjector";
import { ServiceContainer } from "../tech/impl/ServiceContainer";
import { Projector } from "../tech/projections/Projector";

module.exports = async (serviceContainer: ServiceContainer): Promise<Projector[]> => {
    const eventCardSerializer = new StdCardSerializer();
    const dbCardSerializer = new StringCardSerializer();

    return [
        new MatchesProjector(eventCardSerializer, dbCardSerializer),
        // new SomeProjector(),
        // new SomeOtherProjector(),
    ];
}
