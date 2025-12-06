import { Injectable } from '@nestjs/common';
import { Favorites } from '../interfaces';

@Injectable()
export class FavoritesService {
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  getFavorites(): Favorites {
    return this.favorites;
  }

  addArtist(artistId: string): Favorites {
    if (!this.favorites.artists.includes(artistId)) {
      this.favorites.artists.push(artistId);
    }
    return this.favorites;
  }

  removeArtist(artistId: string): Favorites {
    this.favorites.artists = this.favorites.artists.filter(
      (id) => id !== artistId,
    );
    return this.favorites;
  }

  addAlbum(albumId: string): Favorites {
    if (!this.favorites.albums.includes(albumId)) {
      this.favorites.albums.push(albumId);
    }
    return this.favorites;
  }

  removeAlbum(albumId: string): Favorites {
    this.favorites.albums = this.favorites.albums.filter(
      (id) => id !== albumId,
    );
    return this.favorites;
  }

  addTrack(trackId: string): Favorites {
    if (!this.favorites.tracks.includes(trackId)) {
      this.favorites.tracks.push(trackId);
    }
    return this.favorites;
  }

  removeTrack(trackId: string): Favorites {
    this.favorites.tracks = this.favorites.tracks.filter(
      (id) => id !== trackId,
    );
    return this.favorites;
  }

  isArtistFavorite(artistId: string): boolean {
    return this.favorites.artists.includes(artistId);
  }

  isAlbumFavorite(albumId: string): boolean {
    return this.favorites.albums.includes(albumId);
  }

  isTrackFavorite(trackId: string): boolean {
    return this.favorites.tracks.includes(trackId);
  }
}
