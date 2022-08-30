import * as cors from 'cors';
import * as express from 'express';
import helmet from 'helmet';
import * as http from 'http';
import { Server } from 'socket.io';

import { config } from './config';
import { prisma } from './prisma';
import { eventRoutes } from './routes/event.routes';
import { resultRoutes } from './routes/result.routes';
import { stationRoutes } from './routes/station.routes';
import { teamRoutes } from './routes/team.routes';
import { tokenRoutes } from './routes/token.routes';
import { EventService } from './services/event.service';
import { ResultService } from './services/result.service';
import { StationService } from './services/station.service';
import { TeamService } from './services/team.service';
import { TokenService } from './services/token.service';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.ORIGIN,
  },
});

// Services
const eventService = new EventService(prisma, io);
const resultService = new ResultService(prisma);
const stationService = new StationService(prisma);
const teamService = new TeamService(prisma);
const tokenService = new TokenService();

// Middleware
app.use(
  cors({
    origin: config.ORIGIN,
  })
);
app.use(express.json());
app.use(helmet());

// Routes
app.use(eventRoutes(eventService));
app.use(resultRoutes(resultService, teamService, eventService));
app.use(stationRoutes(stationService));
app.use(teamRoutes(teamService, eventService));
app.use(tokenRoutes(tokenService, stationService));

io.on('connection', () => {
  console.log('a user connected');
});

const port = process.env.PORT || 3333;
server.listen(port, () => {
  console.log('Listening at http://localhost:' + port);
});
server.on('error', console.error);
