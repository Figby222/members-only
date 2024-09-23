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

async function insertMessage(message) {
    const { rows } = await pool.query(`
        INSERT INTO messages (title, text, timestamp, creator_id)
        VALUES (
            $1, $2, $3, $4
        )
        RETURNING *
    `, [message.title, message.text, message.timestamp, message.creator_id]);
    return rows;
};

export default { findUserByUsername, insertUser, setMember, insertMessage }