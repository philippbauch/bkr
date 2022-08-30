import { MockType } from '../mock-type';
import { StationService } from './station.service';

export function mockStationService(): MockType<StationService> {
  return {
    createStation: jest.fn(() => {
      throw new Error('Default `StationService.createStation()` mock');
    }),
    deleteStation: jest.fn(() => {
      throw new Error('Default `StationService.deleteStation()` mock');
    }),
    getAll: jest.fn(() => {
      throw new Error('Default `StationService.getAll()` mock');
    }),
    getStationByCode: jest.fn(() => {
      throw new Error('Default `StationService.getStationByCode()` mock');
    }),
    getStationById: jest.fn(() => {
      throw new Error('Default `StationService.getStationById()` mock');
    }),
    updateStation: jest.fn(() => {
      throw new Error('Default `StationService.updateStation()` mock');
    }),
  };
}
