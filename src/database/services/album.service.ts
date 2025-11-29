import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Album } from '../interfaces';

@Injectable()
export class AlbumService {
  private albums: Map<string, Album> = new Map();

  createAlbum(name: string, year: number, artistId: string | null): Album {
    const album: Album = {
      id: randomUUID(),
      name,
      year,
      artistId,
    };
    this.albums.set(album.id, album);
    return album;
  }

  getAlbumById(id: string): Album | undefined {
    return this.albums.get(id);
  }

  getAllAlbums(): Album[] {
    return Array.from(this.albums.values());
  }

  updateAlbum(
    id: string,
    updates: Partial<Omit<Album, 'id'>>,
  ): Album | undefined {
    const album = this.albums.get(id);
    if (!album) {
      return undefined;
    }

    const updatedAlbum: Album = {
      ...album,
      ...updates,
      id: album.id, // Ensure id cannot be changed
    };

    this.albums.set(id, updatedAlbum);
    return updatedAlbum;
  }

  deleteAlbum(id: string): boolean {
    return this.albums.delete(id);
  }
}
