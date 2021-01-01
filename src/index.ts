import { AppConfig, Application } from "@darkbyte/herr";
import config from './config/config';

const app = new Application(config as AppConfig);

app.run()
    .then(() => console.info('Goodbye!'));
