import { Resource } from "../../Pool";
import { Connection } from "event-store-client";

export class EventStoreConnectionProxy implements Resource {
    private connection: Connection;
    private connectionIsOpen: boolean = false;
    private connectionIsOpening: boolean = true;

    constructor(options: any) {
        options = {
            ...options,
            'onConnect': () => {
                this.connectionIsOpen = true;
                this.connectionIsOpening = false;
            },
            'onClose': () => {
                this.connectionIsOpen = false;
            },
            'onError': () => {
                this.connectionIsOpen = false;
                this.connectionIsOpening = false;
                this.connection.close();
            }
        }

        this.connection = new Connection(options);
    }

    isValid(): boolean {
        return this.connectionIsOpen || this.connectionIsOpening;
    }

    getConnection(): Connection {
        return this.connection;
    }

}