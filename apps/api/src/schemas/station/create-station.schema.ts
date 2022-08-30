import * as joi from 'joi';

export interface CreateStationSchema {
  id: number;
  name: string;
  members: string[];
  code: string;
}

export const CreateStationSchema: joi.ObjectSchema<CreateStationSchema> = joi.object({
  id: joi.number().greater(0).required(),
  name: joi.string().min(3).required(),
  members: joi.array().items(joi.string()).default([]),
  code: joi.string().min(6).required(),
});
