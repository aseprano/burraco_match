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
            .beginTransaction()
            .then((transaction) => {
                return transaction.query(`INSERT INTO ${this.tableName} (${this.columnName}) VALUES (NULL)`)
                    .then(() => transaction.query('SELECT last_insert_id() AS id'))
                    .then((resultset) => {
                        transaction.commit();
                        return resultset.fields[0].id;
                    });
            });
    }
    
}