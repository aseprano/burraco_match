import { AddCardsToRunAction } from "../controllers/actions/AddCardsToRunAction";
import { CreateMatchAction } from "../controllers/actions/CreateMatchAction";
import { CreateRunAction } from "../controllers/actions/CreateRunAction";
import { TakeCardAction } from "../controllers/actions/TakeCardAction";
import { ThrowCardAction } from "../controllers/actions/ThrowCardAction";
import { ServiceContainer } from "../tech/impl/ServiceContainer";

module.exports = async (container: ServiceContainer) => {
    const matchService = await container.get('MatchService');
    const cardSerializer = await container.get('CardSerializer');

    container.declare(
        'CreateMatchAction',
        async () => new CreateMatchAction(matchService, cardSerializer)
    )
    .declare(
        'TakeCardAction',
        async () => new TakeCardAction(matchService, cardSerializer)
    )
    .declare(
        'ThrowCardAction',
        async () => new ThrowCardAction(matchService, cardSerializer)
    )
    .declare(
        'CreateRunAction',
        async () => new CreateRunAction(matchService, cardSerializer)
    )
    .declare(
        'AddCardsToRunAction',
        async () => new AddCardsToRunAction(matchService, cardSerializer)
    )
    // container.declare(
    //     'SomeController',
    //     async (container: ServiceContainer) => {
    //         return new SomeController(...);
    //     }
    // ).declare(
    //     'SomeOtherController',
    //     (container) => {
    //         return container.get('DB')
    //             .then((db) => new AccountQueryController(db));
    //     }
    // );
    
}