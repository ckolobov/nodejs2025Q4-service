import { Module, Global } from '@nestjs/common';
import { UserService, ArtistService, TrackService } from './services';

@Global()
@Module({
  providers: [UserService, ArtistService, TrackService],
  exports: [UserService, ArtistService, TrackService],
})
export class DatabaseModule {}
