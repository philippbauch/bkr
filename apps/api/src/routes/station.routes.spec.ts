import * as express from 'express';
import * as request from 'supertest';

import { MockType } from '../mock-type';
import { StationService } from '../services/station.service';
import { mockStationService } from '../services/station.service.mock';
import { stationRoutes } from './station.routes';

describe('StationRoutes', () => {
  // App
  let app: express.Express;

  // Dependencies
  let stationServiceMock: MockType<StationService>;

  beforeEach(() => {
    stationServiceMock = mockStationService();

    app = express();
    app.use(stationRoutes(stationServiceMock as unknown as StationService));
  });

  it('works', (done) => {
    request(app).get('/not-found').expect(404, done);
  });
});
