import { Module, Global } from '@nestjs/common';
import {
  UserService,
  ArtistService,
  TrackService,
  AlbumService,
  FavoritesService,
} from './services';

@Global()
@Module({
  providers: [
    UserService,
    ArtistService,
    TrackService,
    AlbumService,
    FavoritesService,
  ],
  exports: [
    UserService,
    ArtistService,
    TrackService,
    AlbumService,
    FavoritesService,
  ],
})
export class DatabaseModule {}
