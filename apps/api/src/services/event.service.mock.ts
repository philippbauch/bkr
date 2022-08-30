import { MockType } from '../mock-type';
import { EventService } from './event.service';

export function mockEventService(): MockType<EventService> {
  return {
    createEventAndEmit: jest.fn(() => {
      throw new Error('Default `EventService.createEventAndEmit()` mock');
    }),
    getAll: jest.fn(() => {
      throw new Error('Default `EventService.getAll()` mock');
    }),
  };
}
