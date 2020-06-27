import { ServiceContainer } from "../tech/impl/ServiceContainer";

module.exports = (container: ServiceContainer) => {
    
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