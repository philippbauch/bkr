import * as joi from 'joi';

export interface UpdateTeamSchema {
  name?: string;
  number?: number;
  members?: string[];
  startedAt?: string;
  finishedAt?: string;
}

export const UpdateTeamSchema: joi.ObjectSchema<UpdateTeamSchema> = joi
  .object({
    name: joi.string().min(3),
    number: joi.number().min(1),
    members: joi.array().items(joi.string().min(3)),
    startedAt: joi.string().isoDate(),
    finishedAt: joi.string().isoDate(),
  })
  .xor('startedAt', 'finishedAt');