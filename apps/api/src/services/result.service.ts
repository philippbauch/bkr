import { PrismaClient, Result } from '@prisma/client';

export class ResultService {
  static readonly RESULT_SELECT = {
    stationId: true,
    teamId: true,
    arrivedAt: true,
    beganAt: true,
    leftAt: true,
    points: true,
  };

  constructor(private prisma: PrismaClient) {}

  createResult(stationId: number, teamId: number): Promise<Result> {
    return this.prisma.result.create({
      data: {
        stationId: stationId,
        teamId: teamId,
      },
      select: ResultService.RESULT_SELECT,
    });
  }

  async deleteResult(stationId: number, teamId: number): Promise<void> {
    await this.prisma.result.delete({
      where: {
        teamId_stationId: {
          stationId: stationId,
          teamId: teamId,
        },
      },
    });
  }

  getResultById(stationId: number, teamId: number): Promise<Result | null> {
    return this.prisma.result.findUnique({
      where: {
        teamId_stationId: {
          stationId: stationId,
          teamId: teamId,
        },
      },
      select: ResultService.RESULT_SELECT,
    });
  }

  updateResult(
    stationId: number,
    teamId: number,
    updates: { points?: number; beganAt?: string; leftAt?: string }
  ): Promise<Result> {
    return this.prisma.result.update({
      where: {
        teamId_stationId: {
          stationId: stationId,
          teamId: teamId,
        },
      },
      data: {
        points: updates.points,
        beganAt: updates.beganAt ? new Date(updates.beganAt) : undefined,
        leftAt: updates.leftAt ? new Date(updates.leftAt) : undefined,
      },
      select: ResultService.RESULT_SELECT,
    });
  }
}
