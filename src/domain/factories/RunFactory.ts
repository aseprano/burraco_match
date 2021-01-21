import { CardList } from "../value_objects/CardList";
import { Run } from "../entities/Run";
import { RunID } from "../value_objects/RunID";
import { Injectable } from '@darkbyte/herr';

@Injectable()
export abstract class RunFactory {

    public abstract build(cards: CardList, id: RunID): Run;

}