import { Event } from '@prisma/client';
import { Router } from 'express';

import { internalServerError } from '../errors';
import { EventService } from '../services/event.service';

export function eventRoutes(eventService: EventService): Router {
  const router = Router();

  router.get('/events', async (req, res) => {
    let events: Event[];

    try {
      events = await eventService.getAll();
    } catch (err) {
      console.error(err);
      return internalServerError(res);
    }

    res.json(events);
  });

  return router;
}
