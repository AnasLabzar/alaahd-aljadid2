// src/types/express/index.d.ts

import { IUser } from '../../models/User'; // Adjust the path to your User model

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Define user property as an optional IUser type
    }
  }
}
