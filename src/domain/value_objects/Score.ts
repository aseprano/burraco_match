export interface Score {
    readonly closing: number;
    readonly pot: number;
    readonly hand: number;
    readonly runs: number; // negative number
    readonly buracos: number;
    readonly total: number; // closing + pot + runs + buracos + hand
}
