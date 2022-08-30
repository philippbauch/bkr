import * as express from 'express';
import * as request from 'supertest';

import { MockType } from '../mock-type';
import { EventService } from '../services/event.service';
import { mockEventService } from '../services/event.service.mock';
import { TeamService } from '../services/team.service';
import { mockTeamService } from '../services/team.service.mock';
import { teamRoutes } from './team.routes';

describe('TeamRoutes', () => {
  // App
  let app: express.Express;

  // Dependencies
  let teamServiceMock: MockType<TeamService>;
  let eventServiceMock: MockType<EventService>;

  beforeEach(() => {
    teamServiceMock = mockTeamService();
    eventServiceMock = mockEventService();

    app = express();
    app.use(
      teamRoutes(
        teamServiceMock as unknown as TeamService,
        eventServiceMock as unknown as EventService
      )
    );
  });

  it('works', (done) => {
    request(app).get('/not-found').expect(404, done);
  });
});
