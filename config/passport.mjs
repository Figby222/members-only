import passport from "passport";
import LocalStrategy from "passport-local";
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