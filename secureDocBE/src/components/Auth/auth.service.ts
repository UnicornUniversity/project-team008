import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../User/user.model';
dotenv.config();

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS!);
const PEPPER = process.env.PEPPER!;

export class AuthService {
  static async register(email: string, password: string) {
    const hash = await bcrypt.hash(password + PEPPER, SALT_ROUNDS);
    const user = await User.create({ email, password: hash });
    return { id: user.id, email: user.email, role: user.role, created_at: user.createdAt, updated_at: user.updatedAt };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(password + PEPPER, user.password);
    if (!valid) throw new Error('Invalid credentials');
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
    return token;
  }
}
