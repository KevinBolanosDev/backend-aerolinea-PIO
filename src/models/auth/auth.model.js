import { db } from '../../database/db.js';

const createUser = async ({email, password, role}) => {
    const query = {
        text: `
        INSERT INTO admin.users (email, password, role) 
        VALUES ($1, $2, $3) 
        RETURNING *
        `,
        values: [email, password, role]
    };

    const { rows } = await db.query(query);
    return rows[0];
}

const showUser = async (req, res) => {
    const result = await db.query('SELECT * FROM admin.users');
    res.json(result.rows);
}

const findOneByEmail = async (email) => {
    const query = {
        text:`
        SELECT * FROM admin.users 
        WHERE email = $1
        `,
        values: [email]
    }
    const {rows} = await db.query(query);
    return rows[0];
}

const findById = async (id) => {
    const query = {
        text: `
        SELECT * FROM admin.users 
        WHERE id = $1
        `,
        values: [id]
    }
    const {rows} = await db.query(query);
    return rows[0];
}

export const UserModel = {
    createUser,
    showUser,
    findOneByEmail,
    findById
}