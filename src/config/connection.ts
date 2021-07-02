import { Connection, createConnection } from "typeorm";

let connection: Connection | null = null;

const main = async () => {
  connection = await createConnection()
    .then(async (connect) => {
      // await connect.runMigrations();

      console.log(`Connected to DB sucessfully ${connect.name}`);

      return connect;
    })
    .catch((err) => {
      console.log(`Error Occured in connecting to the DB ${err}`);
      return null;
    });
  return connection;
};

main();

export default connection;
