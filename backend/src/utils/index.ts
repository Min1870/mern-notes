import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  _id: string;
  fullName: string;
  email: string;
  // Include other fields if needed
}

interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export const authenticateToken: RequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err, decodedToken) => {
      if (err) {
        res.sendStatus(401);
        return;
      }

      const { user } = decodedToken as { user: UserPayload };

      req.user = user;

      next();
    }
  );
};
