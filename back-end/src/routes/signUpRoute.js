import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {getDbConnection} from '../db'

export const signUpRoute = {
    path: '/api/signUp',
    method: 'post',
    handler: async (req, res) => {
        const {email, password} = req.body;

        const db = getDbConnection('react-auth-db');
        const user = await db.collection('users').findOne({email});

        if (user) {
            res.sendStatus(409);
        }

        //encrypting the passoword before storing in db
        const passwordHash = await bcrypt.hash(password, 10);

        const startingInfo = {
            hairColor: '',
            favoriteFood: '',
            bio: '',
        };

        const result = await db.collection('users').insertOne({
            email,
            passwordHash,
            info: startingInfo,
            isVerified: false,
        });

        const { insertedId } = result;

    }
};