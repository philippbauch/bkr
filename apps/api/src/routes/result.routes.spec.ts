import * as express from 'express';
import * as request from 'supertest';

import { MockType } from '../mock-type';
import { EventService } from '../services/event.service';
import { mockEventService } from '../services/event.service.mock';
import { ResultService } from '../services/result.service';
import { mockResultService } from '../services/result.service.mock';
import { TeamService } from '../services/team.service';
import { mockTeamService } from '../services/team.service.mock';
import { resultRoutes } from './result.routes';

describe('ResultRoutes', () => {
  // App
  let app: express.Express;

  // Dependencies
  let resultServiceMock: MockType<ResultService>;
  let teamServiceMock: MockType<TeamService>;
  let eventServiceMock: MockType<EventService>;

  beforeEach(() => {
    resultServiceMock = mockResultService();
    teamServiceMock = mockTeamService();
    eventServiceMock = mockEventService();

    app = express();
    app.use(
      resultRoutes(
        resultServiceMock as unknown as ResultService,
        teamServiceMock as unknown as TeamService,
        eventServiceMock as unknown as EventService
      )
    );
  });

  it('works', (done) => {
    request(app).get('/not-found').expect(404, done);
  });
});
