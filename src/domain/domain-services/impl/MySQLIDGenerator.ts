import { IDGenerator } from "../IDGenerator";
import { DB } from "../../../tech/db/DB";

export class MySQLIDGenerator implements IDGenerator {

    constructor(private db: DB, private tableName: string, private columnName = 'id') {}

    generate(): Promise<number> {
        return this.db.query(`INSERT INTO ${this.tableName} (${this.columnName}) VALUES (NULL)`)
            .then(() => {
                return this.db.query('SELECT last_insert_id() AS id')
                    .then((res) => res.fields[0].id);
            });
    }
    
}