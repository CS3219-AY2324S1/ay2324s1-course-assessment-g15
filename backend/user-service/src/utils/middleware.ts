import express from 'express';
import User from '../models/user';

export const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.session.isAuth) {
        next();
    } else {
        res.status(403).json({ message: 'Unauthenticated' });
    }
}

export const requireCorrectUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = await User.findOne({ where: { username: req.params.username }});
    if (req.session.user.id === user.dataValues.id) {
        next();
    } else {
        console.log(req.session.user.username, req.params.username);
        res.status(401).json({ message: 'Unauthorized' });
    }
}

export const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.session.user.role === 'ADMIN') {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized: Not an admin' });
    }
}