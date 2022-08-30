import * as express from 'express';
import * as request from 'supertest';

import { MockType } from '../mock-type';
import { StationService } from '../services/station.service';
import { mockStationService } from '../services/station.service.mock';
import { TokenService } from '../services/token.service';
import { mockTokenService } from '../services/token.service.mock';
import { tokenRoutes } from './token.routes';

describe('TokenRoutes', () => {
  // App
  let app: express.Express;

  // Dependencies
  let tokenServiceMock: MockType<TokenService>;
  let stationServiceMock: MockType<StationService>;

  beforeEach(() => {
    tokenServiceMock = mockTokenService();
    stationServiceMock = mockStationService();

    app = express();
    app.use(
      tokenRoutes(
        tokenServiceMock as unknown as TokenService,
        stationServiceMock as unknown as StationService
      )
    );
  });

  it('works', (done) => {
    request(app).get('/not-found').expect(404, done);
  });
});
