import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        username: string;
        email: string;
      };
    }
  }
}
