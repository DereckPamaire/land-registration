import { Request, Response } from 'express';


const registerUser = (req: Request, res: Response) => res.send('Hello world\n');

export {
    registerUser
}