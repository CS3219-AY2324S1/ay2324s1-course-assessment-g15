import User from '../models/user';

export const initAdminProfile = async () => {
    const admin = await User.findOne({ where: { role: 'ADMIN' } });
    if (!admin) {
        await User.create({
            username: "admin",
            password: "admin",
            email: "admin@nus.com",
            role: 'ADMIN',
        })
        console.log('Admin profile not found! Created one using provided credentials in env variables.')
    } else {
        console.log('Admin profile found.')
    }
}