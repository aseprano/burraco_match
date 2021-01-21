import { Injectable } from '@darkbyte/herr';
import { TeamGamingArea } from "../entities/TeamGamingArea";

@Injectable()
export abstract class GamingAreaFactory {

    public abstract build(id: number): TeamGamingArea;
    
}