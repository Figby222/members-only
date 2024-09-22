import pool from "./pool.mjs";
async function findUserByUsername(username) {
    const { rows } = await pool.query(`
        SELECT * FROM users WHERE username = $1
    `, [username]);
    const user = rows[0];

    return user;
}
export default { findUserByUsername }