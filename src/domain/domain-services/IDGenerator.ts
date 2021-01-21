import { Injectable } from '@darkbyte/herr';

@Injectable()
export abstract class IDGenerator {

    public abstract generate(): Promise<number>;

}
