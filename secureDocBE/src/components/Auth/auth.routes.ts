import { Router, Request, Response } from 'express';
import { AuthService } from './auth.service';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const user = await AuthService.register(req.body.email, req.body.password);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const token = await AuthService.login(req.body.email, req.body.password);
    res.json({ token });
  } catch {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

export default router;
