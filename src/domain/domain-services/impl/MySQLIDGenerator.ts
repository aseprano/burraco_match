import { Connection } from '@darkbyte/herr';
import { IDGenerator } from "../IDGenerator";

export class MySQLIDGenerator implements IDGenerator {

    public constructor(
        private readonly connection: Connection,
        private readonly tableName: string,
        private readonly columnName = 'id'
    ) {}

    public async generate(): Promise<number> {
        return this.connection
            .query(`INSERT INTO ${this.tableName} (${this.columnName}) VALUES (NULL)`)
            .then(() => this.connection.query('SELECT last_insert_id() AS id'))
            .then((resultset) => resultset.fields[0].id);
    }
    
}