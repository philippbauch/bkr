import { Station } from '@prisma/client';
import { Router } from 'express';
import { SetOptional } from 'type-fest';

import { Role } from '@bkr/types';

import { badRequest, forbidden, internalServerError, unauthorized } from '../errors';
import { hasRole } from '../middleware/has-role';
import { CreateStationSchema, UpdateStationSchema } from '../schemas';
import { StationService } from '../services/station.service';

export function stationRoutes(stationService: StationService): Router {
  const router = Router();

  router.post('/stations', hasRole(Role.ADMIN), async (req, res) => {
    const { value, error } = CreateStationSchema.validate(req.body);
    if (error) {
      return badRequest(res, error.message);
    }

    const { id, name, code, members } = value;

    let station: SetOptional<Station, 'code'> | null;

    try {
      station = await stationService.getStationById(id);
    } catch (err) {
      console.error(err);
      return internalServerError(res);
    }

    if (station !== null) {
      return badRequest(res, '"id" must be unique');
    }

    try {
      station = await stationService.getStationByCode(code);
    } catch (err) {
      console.error(err);
      return internalServerError(res);
    }

    if (station !== null) {
      return badRequest(res, '"code" must be unique');
    }

    try {
      station = await stationService.createStation(id, name, code, members);
    } catch (err) {
      console.error(err);
      return internalServerError(res);
    }

    delete station.code;

    res.status(201);
    res.json(station);
  });

  router.get('/stations', async (req, res) => {
    let stations: SetOptional<Station, 'code'>[];

    try {
      stations = await stationService.getAll();
    } catch (err) {
      console.error(err);
      return internalServerError(res);
    }

    stations.forEach((station) => delete station.code);

    res.json(stations);
  });

  router.put('/stations/:stationId', hasRole(Role.ADMIN, Role.STATION), async (req, res) => {
    const { value, error } = UpdateStationSchema.validate(req.body);
    if (error) {
      return badRequest(res, error.message);
    }

    const { name, code, members } = value;

    const stationId = parseInt(req.params.stationId);
    if (isNaN(stationId)) {
      return badRequest(res, "Parameter 'stationId' must be a number");
    }

    const sub = req.user?.sub;
    if (typeof sub === 'undefined') {
      return unauthorized(res);
    }

    const role = req.user?.role;
    if (typeof role === 'undefined') {
      return unauthorized(res);
    }

    if (sub !== stationId && role !== Role.ADMIN) {
      return forbidden(res);
    }

    let station: SetOptional<Station, 'code'> | null;

    try {
      station = await stationService.getStationById(stationId);
    } catch (err) {
      console.error(err);
      return internalServerError(res);
    }

    if (station === null) {
      return badRequest(res, `Station ${stationId} does not exist`);
    }

    if (typeof code !== 'undefined' && role !== Role.ADMIN) {
      return forbidden(res);
    }

    try {
      station = typeof code !== 'undefined' ? await stationService.getStationByCode(code) : null;
    } catch (err) {
      console.error(err);
      return internalServerError(res);
    }

    if (typeof code !== 'undefined' && station !== null) {
      return badRequest(res, '"code" must be unique');
    }

    try {
      station = await stationService.updateStation(stationId, {
        name: name,
        code: code,
        members: members,
      });
    } catch (err) {
      console.error(err);
      return internalServerError(res);
    }

    delete station.code;

    res.json(station);
  });

  router.delete('/stations/:stationId', hasRole(Role.ADMIN), async (req, res) => {
    const stationId = parseInt(req.params.stationId);
    if (isNaN(stationId)) {
      return badRequest(res, "Parameter 'stationId' must be a number");
    }

    try {
      await stationService.deleteStation(stationId);
    } catch (err) {
      console.error(err);
      return internalServerError(res);
    }

    res.end();
  });

  return router;
}
