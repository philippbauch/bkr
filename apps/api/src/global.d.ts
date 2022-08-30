import { JwtPayload } from '@bkr/types';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
