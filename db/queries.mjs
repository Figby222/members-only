import pool from "./pool.mjs";
async function findUserByUsername(username) {
    const { rows } = await pool.query(`
        SELECT * FROM users WHERE username = $1
    `, [username]);
    const user = rows[0];

    return user;
}

async function insertUser(user) {
    await pool.query(`
        INSERT INTO users (username, first_name, last_name, password)
        VALUES (
            $1, $2, $3, $4
        )
    `, [user.username, user.first_name, user.last_name, user.password])
}

async function setMember(userId) {
    await pool.query(`
        UPDATE users SET membership_status = true WHERE users.id = $1`, [userId]);
}
export default { findUserByUsername, insertUser, setMember }