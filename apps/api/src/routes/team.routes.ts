import { Team } from '@prisma/client';
import { Router } from 'express';

import { EventType, Role } from '@bkr/types';

import { badRequest, internalServerError } from '../errors';
import { hasRole } from '../middleware/has-role';
import { CreateTeamSchema, UpdateTeamSchema } from '../schemas';
import { EventService } from '../services/event.service';
import { TeamService } from '../services/team.service';

export function teamRoutes(teamService: TeamService, eventService: EventService): Router {
  const router = Router();

  router.post('/teams', hasRole(Role.ADMIN), async (req, res) => {
    const { value, error } = CreateTeamSchema.validate(req.body);
    if (error) {
      return badRequest(res, error.message);
    }

    const { id, name, members } = value;

    let team: Team | null;

    try {
      team = await teamService.getTeamById(id);
    } catch (err) {
      console.error(err);
      return internalServerError(res);
    }

    if (team !== null) {
      return badRequest(res, '"id" must be unique');
    }

    try {
      team = await teamService.createTeam(id, name, members);
    } catch (err) {
      console.error(err);
      return internalServerError(res);
    }

    res.status(201);
    res.json(team);
  });

  router.get('/teams', async (req, res) => {
    let teams: Team[];

    try {
      teams = await teamService.getAll();
    } catch (err) {
      console.error(err);
      return internalServerError(res);
    }

    res.json(teams);
  });

  router.put('/teams/:teamId', hasRole(Role.ADMIN), async (req, res) => {
    const { value, error } = UpdateTeamSchema.validate(req.body);
    if (error) {
      return badRequest(res, error.message);
    }

    const { name, members, startedAt, finishedAt } = value;

    const teamId = parseInt(req.params.teamId);
    if (isNaN(teamId)) {
      return badRequest(res, "Parameter 'teamId' must be a number");
    }

    let team: Team | null;

    try {
      team = await teamService.getTeamById(teamId);
    } catch (err) {
      console.error(err);
      return internalServerError(res);
    }

    if (team === null) {
      return badRequest(res, `Team ${teamId} does not exist`);
    }

    const hasAlreadyStarted = typeof team.startedAt !== 'undefined';
    const hasAlreadyFinished = typeof team.finishedAt !== 'undefined';

    try {
      team = await teamService.updateTeam(teamId, {
        name,
        members,
        startedAt,
        finishedAt,
      });
    } catch (err) {
      console.error(err);
      return internalServerError(res);
    }

    if (!hasAlreadyStarted && startedAt) {
      eventService.createEventAndEmit(EventType.RUN_IN, teamId);
    }

    if (!hasAlreadyFinished && finishedAt) {
      eventService.createEventAndEmit(EventType.RUN_OUT, teamId);
    }

    res.json(team);
  });

  router.delete('/teams/:teamId', hasRole(Role.ADMIN), async (req, res) => {
    const teamId = parseInt(req.params.teamId);
    if (isNaN(teamId)) {
      return badRequest(res, "Parameter 'teamId' must be a number");
    }

    try {
      await teamService.deleteTeam(teamId);
    } catch (err) {
      console.error(err);
      return internalServerError(res);
    }

    res.end();
  });

  return router;
}
