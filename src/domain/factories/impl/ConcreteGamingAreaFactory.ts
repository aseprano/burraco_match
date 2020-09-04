import { GamingAreaFactory } from "../GamingAreaFactory";
import { RunFactory } from "../RunFactory";
import { CardSerializer } from "../../domain-services/CardSerializer";
import { TeamGamingArea } from "../../entities/TeamGamingArea";
import { ConcreteTeamGamingArea } from "../../entities/impl/ConcreteTeamGamingArea";

export class ConcreteGamingAreaFactory implements GamingAreaFactory {

    constructor(private runFactory: RunFactory, private cardSerializer: CardSerializer) {}

    public build(id: number): TeamGamingArea {
        return new ConcreteTeamGamingArea(id, this.runFactory, this.cardSerializer);
    }
}