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

async function getMessages() {
    const { rows } = await pool.query(`
        SELECT messages.id, title, text, to_char(timestamp, 'DD Mon YYYY, HH12:MI:SS AM') as timestamp, 
        creator_id, first_name, last_name, membership_status FROM messages
        JOIN users ON messages.creator_id = users.id
        ORDER BY timestamp
    `);

    return rows;
}

async function setAdmin(userId) {
    await pool.query(`
        UPDATE users SET isAdmin = true WHERE users.id = $1`, [userId])
}

export default { findUserByUsername, insertUser, setMember, insertMessage, getMessages, setAdmin }