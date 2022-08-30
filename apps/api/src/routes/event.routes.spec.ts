import * as express from 'express';
import * as request from 'supertest';

import { MockType } from '../mock-type';
import { EventService } from '../services/event.service';
import { mockEventService } from '../services/event.service.mock';
import { eventRoutes } from './event.routes';

describe('EventRoutes', () => {
  // App
  let app: express.Express;

  // Dependencies
  let eventServiceMock: MockType<EventService>;

  beforeEach(() => {
    eventServiceMock = mockEventService();

    app = express();
    app.use(eventRoutes(eventServiceMock as unknown as EventService));
  });

  it('works', (done) => {
    request(app).get('/not-found').expect(404, done);
  });
});
