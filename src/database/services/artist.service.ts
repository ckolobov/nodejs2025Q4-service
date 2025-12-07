import { Injectable } from '@nestjs/common';
import { Artist } from '../interfaces';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismaService) {}

  async createArtist(name: string, grammy: boolean): Promise<Artist> {
    return this.prisma.artist.create({
      data: {
        name,
        grammy,
      },
    });
  }

  async getArtistById(id: string): Promise<Artist | null> {
    return this.prisma.artist.findUnique({
      where: { id },
    });
  }

  async getAllArtists(): Promise<Artist[]> {
    return this.prisma.artist.findMany();
  }

  async updateArtist(
    id: string,
    updates: Partial<Omit<Artist, 'id'>>,
  ): Promise<Artist> {
    return this.prisma.artist.update({
      where: { id },
      data: updates,
    });
  }

  async deleteArtist(id: string): Promise<Artist> {
    return this.prisma.artist.delete({
      where: { id },
    });
  }
}
