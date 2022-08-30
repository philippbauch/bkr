import { MockType } from '../mock-type';
import { ResultService } from './result.service';

export function mockResultService(): MockType<ResultService> {
  return {
    createResult: jest.fn(() => {
      throw new Error('Default `ResultService.createResult()` mock');
    }),
    deleteResult: jest.fn(() => {
      throw new Error('Default `ResultService.deleteResult()` mock');
    }),
    getResultById: jest.fn(() => {
      throw new Error('Default `ResultService.getResultById()` mock');
    }),
    updateResult: jest.fn(() => {
      throw new Error('Default `ResultService.updateResult()` mock');
    }),
  };
}
