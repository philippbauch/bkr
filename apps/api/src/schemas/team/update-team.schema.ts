import * as joi from 'joi';

export interface UpdateTeamSchema {
  name?: string;
  members?: string[];
  startedAt?: string;
  finishedAt?: string;
}

export const UpdateTeamSchema: joi.ObjectSchema<UpdateTeamSchema> = joi
  .object({
    name: joi.string().min(3),
    members: joi.array().items(joi.string()),
    startedAt: joi.string().isoDate(),
    finishedAt: joi.string().isoDate(),
  })
  .xor('startedAt', 'finishedAt');
