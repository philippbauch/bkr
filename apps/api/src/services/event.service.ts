import { Event, PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';

import { EventType } from '@bkr/types';

export class EventService {
  constructor(private prisma: PrismaClient, private io: Server) {}

  async createEventAndEmit(type: EventType, teamId: number, stationId?: number): Promise<Event> {
    const event = await this.prisma.event.create({
      data: {
        teamId: teamId,
        type: type,
        stationId: stationId,
      },
    });

    this.io.emit('event', event);

    return event;
  }

  getAll(): Promise<Event[]> {
    return this.prisma.event.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
