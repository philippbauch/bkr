import * as joi from 'joi';

export interface UpdateResultSchema {
  points?: number;
  beganAt?: string;
  leftAt?: string;
}

export const UpdateResultSchema: joi.ObjectSchema<UpdateResultSchema> = joi.object({
  points: joi.number().min(0),
  beganAt: joi.string().isoDate(),
  leftAt: joi.string().isoDate(),
});
