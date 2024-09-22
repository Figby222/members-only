import express from "express";
const app = express();
import indexRouter from "./routers/indexRouter.mjs";
import "dotenv/config";
import path from "node:path";
import session from "./config/expressSession.mjs";
import passport from "./config/passport.mjs";

const __dirname = import.meta.dirname;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session);
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);


app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
})