import expressSession from "express-session";
import pool from "../db/pool.mjs";
import pgSessionInit from "connect-pg-simple";
const pgSession = pgSessionInit(expressSession);
import "dotenv/config";

const ONE_DAY = 24 * 60 * 60 * 1000;
const session = expressSession({
    store: new pgSession({
        pool: pool,
        tableName: "user_sessions"
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUnintialized: false,
    cookie: { maxAge: ONE_DAY }
});

export default session;