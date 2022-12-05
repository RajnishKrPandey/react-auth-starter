import { Jwt } from "jsonwebtoken";
import { ObjectID } from 'mongodb';
import { getDbConnection } from "../db";

export const updateUserInfoRoute =  {
    path: '/api/users/:userId',
    method: 'put',
    handler: async (req, res) => {
        const { authorization } = req.headers;
        const { userId } = req.params;

        const updates = ({
            favoriteFood,
            hairColor,
            bio,
        }) =>  ({
            favoriteFood,
            hairColor,
            bio,
        })(req.body);

        if (!authorization) {
            return res.status(401).json({message: 'No authorization header sent'});
        }
        //Bearer lkj;jkkl.kfjlak.lkjlfkaj
        const token = authorization.split(' ')[1];
        Jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) return res.status(401).json({ message: 'Unable to verify token'});

            const { id } = decoded;

            if (id !== userId) res.status(403).json({message: 'Not allowed to update user\'s data'});

            const db = getDbConnection('react-auth-db');
            const result = await db.collection('users').findOneAndUpdate(
                {_id: ObjectID(id)},
                {$set: {info: updates}},
                {returnOriginal: false},
            );
                const { email, isVerified, info } = result.value;

                jwt.sign( { id, email, isVerified,info }, process.env.JWT_SECRET,{ expiredIn: '[2d'}, (err, token) => {
                    if (err) {
                        return res.status(200).json(err);
                    }
                    res.status(200).json({ token });
                } );
        })

    }
}