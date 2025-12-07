import { Injectable } from '@nestjs/common';
import { Track } from '../interfaces';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private readonly prisma: PrismaService) {}

  async createTrack(
    name: string,
    artistId: string | null,
    albumId: string | null,
    duration: number,
  ): Promise<Track> {
    return this.prisma.track.create({
      data: {
        name,
        artistId,
        albumId,
        duration,
      },
    });
  }

  async getTrackById(id: string): Promise<Track | null> {
    return this.prisma.track.findUnique({
      where: { id },
    });
  }

  async getAllTracks(): Promise<Track[]> {
    return this.prisma.track.findMany();
  }

  async updateTrack(
    id: string,
    updates: Partial<Omit<Track, 'id'>>,
  ): Promise<Track> {
    return this.prisma.track.update({
      where: { id },
      data: updates,
    });
  }

  async deleteTrack(id: string): Promise<Track> {
    return this.prisma.track.delete({
      where: { id },
    });
  }
}
