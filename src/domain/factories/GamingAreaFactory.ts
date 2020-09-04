import { TeamGamingArea } from "../entities/TeamGamingArea";

export interface GamingAreaFactory {

    build(id: number): TeamGamingArea;
    
}