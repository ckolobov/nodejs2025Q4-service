import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Track } from '../interfaces';

@Injectable()
export class TrackService {
  private tracks: Map<string, Track> = new Map();

  createTrack(
    name: string,
    artistId: string | null,
    albumId: string | null,
    duration: number,
  ): Track {
    const track: Track = {
      id: randomUUID(),
      name,
      artistId,
      albumId,
      duration,
    };
    this.tracks.set(track.id, track);
    return track;
  }

  getTrackById(id: string): Track | undefined {
    return this.tracks.get(id);
  }

  getAllTracks(): Track[] {
    return Array.from(this.tracks.values());
  }

  updateTrack(
    id: string,
    updates: Partial<Omit<Track, 'id'>>,
  ): Track | undefined {
    const track = this.tracks.get(id);
    if (!track) {
      return undefined;
    }

    const updatedTrack: Track = {
      ...track,
      ...updates,
      id: track.id, // Ensure id cannot be changed
    };

    this.tracks.set(id, updatedTrack);
    return updatedTrack;
  }

  deleteTrack(id: string): boolean {
    return this.tracks.delete(id);
  }
}
