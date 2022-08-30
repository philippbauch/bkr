import { PrismaClient, Team } from '@prisma/client';

import { ResultService } from './result.service';

export class TeamService {
  constructor(private prisma: PrismaClient) {}

  createTeam(id: number, name: string, members: string[]): Promise<Team> {
    return this.prisma.team.create({
      data: {
        id: id,
        name: name,
        members: members,
      },
      include: {
        results: {
          select: ResultService.RESULT_SELECT,
        },
      },
    });
  }

  async deleteTeam(id: number): Promise<void> {
    await this.prisma.team.delete({
      where: {
        id: id,
      },
    });
  }

  getAll(): Promise<Team[]> {
    return this.prisma.team.findMany({
      include: {
        results: {
          select: ResultService.RESULT_SELECT,
        },
      },
    });
  }

  getTeamById(id: number): Promise<Team | null> {
    return this.prisma.team.findUnique({
      where: {
        id: id,
      },
    });
  }

  updateTeam(
    id: number,
    updates: { name?: string; members?: string[]; startedAt?: string; finishedAt?: string }
  ): Promise<Team> {
    return this.prisma.team.update({
      where: {
        id: id,
      },
      data: {
        name: updates.name,
        members: updates.members,
        startedAt: updates.startedAt ? new Date(updates.startedAt) : undefined,
        finishedAt: updates.finishedAt ? new Date(updates.finishedAt) : undefined,
      },
      include: {
        results: {
          select: ResultService.RESULT_SELECT,
        },
      },
    });
  }
}
