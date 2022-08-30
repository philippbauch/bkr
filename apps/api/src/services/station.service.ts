import { PrismaClient, Station } from '@prisma/client';

import { ResultService } from './result.service';

export class StationService {
  constructor(private prisma: PrismaClient) {}

  createStation(id: number, name: string, code: string, members: string[]): Promise<Station> {
    return this.prisma.station.create({
      data: {
        id: id,
        name: name,
        code: code,
        members: members,
      },
      include: {
        results: {
          select: ResultService.RESULT_SELECT,
        },
      },
    });
  }

  async deleteStation(id: number): Promise<void> {
    await this.prisma.station.delete({
      where: {
        id: id,
      },
    });
  }

  getAll(): Promise<Station[]> {
    return this.prisma.station.findMany({
      include: {
        results: {
          select: ResultService.RESULT_SELECT,
        },
      },
    });
  }

  getStationById(id: number): Promise<Station | null> {
    return this.prisma.station.findUnique({
      where: {
        id: id,
      },
    });
  }

  getStationByCode(code: string): Promise<Station | null> {
    return this.prisma.station.findUnique({
      where: {
        code: code,
      },
    });
  }

  updateStation(
    id: number,
    updates: { name?: string; code?: string; members?: string[] }
  ): Promise<Station> {
    return this.prisma.station.update({
      where: {
        id: id,
      },
      data: {
        name: updates.name,
        code: updates.code,
        members: updates.members,
      },
      include: {
        results: {
          select: ResultService.RESULT_SELECT,
        },
      },
    });
  }
}
