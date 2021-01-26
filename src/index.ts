import config from './config/config';
import { Microservice } from "@darkbyte/herr";

function getVersion(): string {
    const pjson = require('../package.json');
    return `${pjson.name} v${pjson.version}`;
}

console.log(`Starting ${getVersion()}`);

const ms = new Microservice(config);

ms.run()
    .then(() => console.info('Goodbye!'));
