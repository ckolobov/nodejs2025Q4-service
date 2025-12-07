import { Injectable } from '@nestjs/common';
import { Favorites } from '../interfaces';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async getFavorites(): Promise<Favorites> {
    const [artists, albums, tracks] = await Promise.all([
      this.prisma.favoriteArtist.findMany(),
      this.prisma.favoriteAlbum.findMany(),
      this.prisma.favoriteTrack.findMany(),
    ]);

    return {
      artists: artists.map((fav) => fav.artistId),
      albums: albums.map((fav) => fav.albumId),
      tracks: tracks.map((fav) => fav.trackId),
    };
  }

  async addArtist(artistId: string): Promise<void> {
    await this.prisma.favoriteArtist.upsert({
      where: { artistId },
      create: { artistId },
      update: {},
    });
  }

  async removeArtist(artistId: string): Promise<void> {
    try {
      await this.prisma.favoriteArtist.delete({
        where: { artistId },
      });
    } catch (error) {
      // Ignore if not found
    }
  }

  async addAlbum(albumId: string): Promise<void> {
    await this.prisma.favoriteAlbum.upsert({
      where: { albumId },
      create: { albumId },
      update: {},
    });
  }

  async removeAlbum(albumId: string): Promise<void> {
    try {
      await this.prisma.favoriteAlbum.delete({
        where: { albumId },
      });
    } catch (error) {
      // Ignore if not found
    }
  }

  async addTrack(trackId: string): Promise<void> {
    await this.prisma.favoriteTrack.upsert({
      where: { trackId },
      create: { trackId },
      update: {},
    });
  }

  async removeTrack(trackId: string): Promise<void> {
    try {
      await this.prisma.favoriteTrack.delete({
        where: { trackId },
      });
    } catch (error) {
      // Ignore if not found
    }
  }

  async isArtistFavorite(artistId: string): Promise<boolean> {
    const favorite = await this.prisma.favoriteArtist.findUnique({
      where: { artistId },
    });
    return favorite !== null;
  }

  async isAlbumFavorite(albumId: string): Promise<boolean> {
    const favorite = await this.prisma.favoriteAlbum.findUnique({
      where: { albumId },
    });
    return favorite !== null;
  }

  async isTrackFavorite(trackId: string): Promise<boolean> {
    const favorite = await this.prisma.favoriteTrack.findUnique({
      where: { trackId },
    });
    return favorite !== null;
  }
}
