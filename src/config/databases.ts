export const databases = {
    mysql: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT, 10) || 3306,
        database: process.env.DB_DATABASE || 'forge',
        username: process.env.DB_USERNAME || 'forge',
        password: process.env.DB_PASSWORD || '',
        driver: "mysql",
        charset: "utf8mb4",
        collation: "utf8mb4_unicode_ci",
        prefix: "",
        prefix_indexes: true,
        strict: true,
        engine: null
    },
    pgsql: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        database: process.env.DB_DATABASE || 'forge',
        username: process.env.DB_USERNAME || 'forge',
        password: process.env.DB_PASSWORD || '',
        driver: "pgsql",
        charset: "utf8",
        prefix: "",
        prefix_indexes: true,
        strict: true,
        engine: null
    }
}