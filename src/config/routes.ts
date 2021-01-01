import { RouteDeclarations } from '@darkbyte/herr';
import { AddCardsToRunAction } from '../actions/AddCardsToRunAction';
import { CreateMatchAction } from '../actions/CreateMatchAction';
import { CreateRunAction } from '../actions/CreateRunAction';
import { TakeCardAction } from '../actions/TakeCardAction';
import { ThrowCardAction } from '../actions/ThrowCardAction';

const routes: RouteDeclarations = {
    'POST /matches':                              CreateMatchAction,
    'POST /matches/:match_id/hand':               TakeCardAction,
    'POST /matches/:match_id/discard_pile':       ThrowCardAction,
    'POST /matches/:match_id/runs':               CreateRunAction,
    'POST /matches/:match_id/runs/:run_id/cards': AddCardsToRunAction,
};

export { routes };