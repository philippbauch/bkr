import { MockType } from '../mock-type';
import { TeamService } from './team.service';

export function mockTeamService(): MockType<TeamService> {
  return {
    createTeam: jest.fn(() => {
      throw new Error('Default `TeamService.createTeam()` mock');
    }),
    deleteTeam: jest.fn(() => {
      throw new Error('Default `TeamService.deleteTeam()` mock');
    }),
    getAll: jest.fn(() => {
      throw new Error('Default `TeamService.getAll()` mock');
    }),
    getTeamById: jest.fn(() => {
      throw new Error('Default `TeamService.getTeamById()` mock');
    }),
    updateTeam: jest.fn(() => {
      throw new Error('Default `TeamService.updateTeam()` mock');
    }),
  };
}
