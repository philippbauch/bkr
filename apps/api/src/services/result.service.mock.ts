/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs';

import { Result } from '@bkr/api-interface';

import { MockType } from '../test-utils';
import { ResultService } from './result.service';

export const resultServiceMock: MockType<ResultService> = {
  createResult: jest.fn((...args) => {
    throw new Error('createResult not implemented');
  }),
  deleteResult: jest.fn((...args) => {
    throw new Error('deleteResult not implemented');
  }),
  getResultById: jest.fn((...args) => {
    throw new Error('getResultById not implemented');
  }),
  updateResult: jest.fn((...args) => {
    throw new Error('updateResult not implemented');
  }),
};

export const mockResult = (updates: Partial<Result>): Result => ({
  stationId: '00000000-0000-0000-0000-000000000000',
  teamId: '00000000-0000-0000-0000-000000000000',
  checkIn: dayjs(),
  checkOut: dayjs(),
  points: 0,
  ...updates,
});
