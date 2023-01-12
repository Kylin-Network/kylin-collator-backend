import dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

const env = 'development';

const ret = dotenv.config({
    path: `./env/${env}.env`,
});
if (ret.error) {
    throw ret.error;
}

function getConfig() {
    return {
        type: process.env.TYPEORM_CONNECTION,
        host: process.env.TYPEORM_HOST,
        port: process.env.TYPEORM_PORT,
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        database: process.env.TYPEORM_DATABASE,
        synchronize: process.env.TYPEORM_SYNCHRONIZE,
        migrations: [__dirname + '/src/migration/**/*.{ts,js}'],
        entities: [__dirname + '/src/entities/**/*.{ts,js}'],
    } as DataSourceOptions;
}

const datasource = new DataSource(getConfig());
datasource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    });
export default datasource;
