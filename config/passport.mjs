import passport from "passport";
import LocalStrategy from "passport-local";
import pool from "../db/pool.mjs";
import bcrypt from "bcryptjs";

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const { rows } = await pool.query(`SELECT * FROM users WHERE username = $1`, [username])
            const user = rows[0];

            if (!user) {
                return done(null, false, { message: "Incorrect username or password" });
            }

            const isMatch = await (bcrypt.compare(password, user.password));

            if (!isMatch) {
                return done(null, false, { message: "Incorrect username or password" });
            }
            return done(null, user);
        } catch(err) {
            done(err);
        }
}))

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (userId, done) => {
    try {
        const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId])
        const user = rows[0];
    
        done(null, user);
    } catch(err) {
        done(err);
    }
})