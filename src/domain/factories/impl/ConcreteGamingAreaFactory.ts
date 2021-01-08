import { GamingAreaFactory } from "../GamingAreaFactory";
import { RunFactory } from "../RunFactory";
import { CardSerializer } from "../../domain-services/CardSerializer";
import { TeamGamingArea } from "../../entities/TeamGamingArea";
import { ConcreteTeamGamingArea } from "../../entities/impl/ConcreteTeamGamingArea";
import { Injectable } from '@darkbyte/herr';

@Injectable()
export class ConcreteGamingAreaFactory extends GamingAreaFactory {

    constructor(
        private readonly runFactory: RunFactory,
        private readonly cardSerializer: CardSerializer
    ) {
        super();
    }

    public build(id: number): TeamGamingArea {
        return new ConcreteTeamGamingArea(id, this.runFactory, this.cardSerializer);
    }
}