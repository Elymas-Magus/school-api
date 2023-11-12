import { databases } from './databases';

export default () => ({
    port: parseInt(process.env.DB_PORT, 10) || 3000,
    database: {
        ...databases[process.env.DB_CONNECTION],
    }
});