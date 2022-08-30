import * as express from 'express';
import * as jwt from 'jsonwebtoken';

import { Role } from '@bkr/types';

import { config } from '../config';
import { unauthorized } from '../errors';

export function hasRole(...roles: string[]) {
  return function (req: express.Request, res: express.Response, next: express.NextFunction): void {
    const authorization = req.headers['authorization'];

    if (typeof authorization !== 'string') {
      return unauthorized(res);
    }

    const token = authorization.replace('Bearer ', '');
    let payload: string | jwt.JwtPayload;

    try {
      payload = jwt.verify(token, config.SECRET);
    } catch (err) {
      console.error(err);
      return unauthorized(res);
    }

    if (typeof payload === 'string') {
      return unauthorized(res);
    }

    const sub = parseInt(payload.sub ?? '');
    const username = payload.username;
    const role = payload.role;

    if (isNaN(sub)) {
      return unauthorized(res);
    }

    if (typeof role !== 'string') {
      return unauthorized(res);
    }

    if (role !== Role.ADMIN && role !== Role.STATION) {
      return unauthorized(res);
    }

    if (!roles.includes(role)) {
      return unauthorized(res);
    }

    req.user = {
      sub,
      username,
      role,
    };

    return next();
  };
}
