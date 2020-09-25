import { Router } from "../tech/Router";

module.exports = (router: Router) => {
    router.post(
        '/matches',
        'CreateMatchAction'
    )
    .post(
        '/matches/:match_id/players/:player_id/hand',
        'TakeCardAction'
    );
}
