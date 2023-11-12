import { DataSource } from "typeorm";

// Temporario. Posteriormente passaremos a utilizar @nestjs/config (dotenv)
export const databaseProviders = [
  {
    provide: "MYSQL_CONNECTION",
    useFactory: async () => {
      const dataSource = new DataSource({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "pdsi1234",
        database: "school",
        entities: ["@app/**/*.entity{.ts,.js}"],
        synchronize: true,
      });
      return dataSource.initialize();
    },
  },
];
