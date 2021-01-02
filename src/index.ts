import { Microservice } from "@darkbyte/herr";
import config from './config/config';

const ms = new Microservice(config);

ms.useMiddleware((req, res, next) => {
    next();
});

ms.run()
    .then(() => console.info('Goodbye!'));
