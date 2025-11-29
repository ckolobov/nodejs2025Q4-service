import { Module, Global } from '@nestjs/common';
import {
  UserService,
  ArtistService,
  TrackService,
  AlbumService,
} from './services';

@Global()
@Module({
  providers: [UserService, ArtistService, TrackService, AlbumService],
  exports: [UserService, ArtistService, TrackService, AlbumService],
})
export class DatabaseModule {}
