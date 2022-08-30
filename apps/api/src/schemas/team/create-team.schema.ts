import * as joi from 'joi';

export interface CreateTeamSchema {
  id: number;
  name: string;
  members: string[];
}

export const CreateTeamSchema: joi.ObjectSchema<CreateTeamSchema> = joi.object({
  id: joi.number().greater(0).required(),
  name: joi.string().min(3).required(),
  members: joi.array().items(joi.string()).default([]),
});
