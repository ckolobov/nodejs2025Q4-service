import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Artist } from '../interfaces';

@Injectable()
export class ArtistService {
  private artists: Map<string, Artist> = new Map();

  createArtist(name: string, grammy: boolean): Artist {
    const artist: Artist = {
      id: randomUUID(),
      name,
      grammy,
    };
    this.artists.set(artist.id, artist);
    return artist;
  }

  getArtistById(id: string): Artist | undefined {
    return this.artists.get(id);
  }

  getAllArtists(): Artist[] {
    return Array.from(this.artists.values());
  }

  updateArtist(
    id: string,
    updates: Partial<Omit<Artist, 'id'>>,
  ): Artist | undefined {
    const artist = this.artists.get(id);
    if (!artist) {
      return undefined;
    }

    const updatedArtist: Artist = {
      ...artist,
      ...updates,
      id: artist.id, // Ensure id cannot be changed
    };

    this.artists.set(id, updatedArtist);
    return updatedArtist;
  }

  deleteArtist(id: string): boolean {
    return this.artists.delete(id);
  }
}
