import { Router } from "../tech/Router";

module.exports = (router: Router) => {
    router.post(
        '/path',
        'SomeControllerName', 'someActionName'
    );
}
