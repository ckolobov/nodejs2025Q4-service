import { Artist, Album, Track } from '../../database/interfaces';

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
