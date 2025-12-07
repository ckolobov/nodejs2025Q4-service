import { Injectable } from '@nestjs/common';
import { Album } from '../interfaces';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {}

  async createAlbum(
    name: string,
    year: number,
    artistId: string | null,
  ): Promise<Album> {
    return this.prisma.album.create({
      data: {
        name,
        year,
        artistId,
      },
    });
  }

  async getAlbumById(id: string): Promise<Album | null> {
    return this.prisma.album.findUnique({
      where: { id },
    });
  }

  async getAllAlbums(): Promise<Album[]> {
    return this.prisma.album.findMany();
  }

  async updateAlbum(
    id: string,
    updates: Partial<Omit<Album, 'id'>>,
  ): Promise<Album> {
    return this.prisma.album.update({
      where: { id },
      data: updates,
    });
  }

  async deleteAlbum(id: string): Promise<Album> {
    return this.prisma.album.delete({
      where: { id },
    });
  }
}
