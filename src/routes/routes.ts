import { Router } from "../tech/Router";

module.exports = (router: Router) => {
    router.post(
        '/matches',
        'CreateMatchAction'
    )
    .post(
        '/matches/:match_id/hand',
        'TakeCardAction'
    )
    .post(
        '/matches/:match_id/discard_pile',
        'ThrowCardAction'
    )
    .post(
        '/matches/:match_id/runs',
        'CreateRunAction'
    )
    .post(
        '/matches/:match_id/runs/:run_id/cards',
        'AddCardsToRunAction'
    )
}
