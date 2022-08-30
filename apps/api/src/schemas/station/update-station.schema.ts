import * as joi from 'joi';

export interface UpdateStationSchema {
  name?: string;
  members?: string[];
  code?: string;
}

export const UpdateStationSchema: joi.ObjectSchema<UpdateStationSchema> = joi.object({
  name: joi.string().min(3),
  members: joi.array().items(joi.string()),
  code: joi.string().min(6),
});
