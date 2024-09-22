import pg from "pg";
import "dotenv/config";
const { Client } = pg;

const SQL = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR ( 255 ) UNIQUE NOT NULL,
    first_name VARCHAR ( 255 ) NOT NULL,
    last_name VARCHAR ( 255 ) NOT NULL,
    passwordHash TEXT,
    salt TEXT,
    membership_status BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR ( 255 ) NOT NULL,
    text TEXT,
    timestamp DATE,
    creator_id INTEGER CONSTRAINT 
        creator_id_foreign_key 
        REFERENCES users (id)
        ON DELETE CASCADE
        NOT NULL
);
`

async function main() {
    console.log("seeding....");
    
    const client = new Client({
        connectionString: process.argv[2],
    })

    await client.connect();
    await client.query(SQL);
    await client.end();
    
    console.log("done");
}


main();