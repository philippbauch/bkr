import { Result, Team } from '@prisma/client';
import { Router } from 'express';

import { EventType, Role } from '@bkr/types';

import { badRequest, internalServerError } from '../errors';
import { hasRole } from '../middleware/has-role';
import { CreateResultSchema, UpdateResultSchema } from '../schemas';
import { EventService } from '../services/event.service';
import { ResultService } from '../services/result.service';
import { TeamService } from '../services/team.service';

export function resultRoutes(
  resultService: ResultService,
  teamService: TeamService,
  eventService: EventService
): Router {
  const router = Router();

  router.post(
    '/stations/:stationId/results',
    hasRole(Role.ADMIN, Role.STATION),
    async (req, res) => {
      const { value, error } = CreateResultSchema.validate(req.body);
      if (error) {
        return badRequest(res, error.message);
      }

      const { teamId } = value;

      const stationId = parseInt(req.params.stationId);
      if (isNaN(stationId)) {
        return badRequest(res, "Parameter 'stationId' must be a number");
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

      let result: Result | null;

      try {
        result = await resultService.getResultById(stationId, teamId);
      } catch (err) {
        console.error(err);
        return internalServerError(res);
      }

      if (result !== null) {
        return badRequest(
          res,
          `A result for team ${teamId} at station ${stationId} already exists`
        );
      }

      try {
        result = await resultService.createResult(stationId, teamId);
      } catch (err) {
        console.error(err);
        return internalServerError(res);
      }

      eventService.createEventAndEmit(EventType.STATION_IN, teamId, stationId);

      res.status(201);
      res.json(result);
    }
  );

  router.put(
    '/stations/:stationId/results/:teamId',
    hasRole(Role.ADMIN, Role.STATION),
    async (req, res) => {
      const { value, error } = UpdateResultSchema.validate(req.body);
      if (error) {
        return badRequest(res, error.message);
      }

      const { points, beganAt, leftAt } = value;

      const stationId = parseInt(req.params.stationId);
      if (isNaN(stationId)) {
        return badRequest(res, "Parameter 'stationId' must be a number");
      }

      const teamId = parseInt(req.params.teamId);
      if (isNaN(teamId)) {
        return badRequest(res, "Parameter 'teamId' must be a number");
      }

      let result: Result | null;

      try {
        result = await resultService.getResultById(stationId, teamId);
      } catch (err) {
        console.error(err);
        return internalServerError(res);
      }

      if (result === null) {
        return badRequest(
          res,
          `A result for team ${teamId} at station ${stationId} does not exist`
        );
      }

      const hasAlreadyLeft = typeof result.leftAt !== 'undefined';

      try {
        result = await resultService.updateResult(stationId, teamId, {
          points: points,
          beganAt: beganAt,
          leftAt: leftAt,
        });
      } catch (err) {
        console.error(err);
        return internalServerError(res);
      }

      if (!hasAlreadyLeft && leftAt) {
        eventService.createEventAndEmit(EventType.STATION_OUT, teamId, stationId);
      }

      res.json(result);
    }
  );

  router.delete(
    '/stations/:stationId/results/:teamId',
    hasRole(Role.ADMIN, Role.STATION),
    async (req, res) => {
      const stationId = parseInt(req.params.stationId);
      if (isNaN(stationId)) {
        return badRequest(res, "Parameter 'stationId' must be a number");
      }

      const teamId = parseInt(req.params.teamId);
      if (isNaN(teamId)) {
        return badRequest(res, "Parameter 'teamId' must be a number");
      }

      try {
        await resultService.deleteResult(stationId, teamId);
      } catch (err) {
        console.error(err);
        return internalServerError(res);
      }

      res.end();
    }
  );

  return router;
}
