import { CreateMatchAction } from "../controllers/actions/CreateMatchAction";
import { TakeCardAction } from "../controllers/actions/TakeCardAction";
import { ServiceContainer } from "../tech/impl/ServiceContainer";

module.exports = (container: ServiceContainer) => {
    container.declare(
        'CreateMatchAction',
        async (container: ServiceContainer) => {
            const matchService = await container.get('MatchService');
            const cardSerializer = await container.get('CardSerializer');

            return new CreateMatchAction(
                matchService,
                cardSerializer
            );
        }
    )
    .declare(
        'TakeCardAction',
        async (container: ServiceContainer) => {
            const matchService = await container.get('MatchService');
            const cardSerializer = await container.get('CardSerializer');

            return new TakeCardAction(
                matchService,
                cardSerializer
            );
        }
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