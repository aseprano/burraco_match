import { CardList } from "../value_objects/CardList";
import { Run } from "../entities/Run";
import { RunID } from "../value_objects/RunID";

export interface RunFactory {

    build(cards: CardList, id: RunID): Run;

}