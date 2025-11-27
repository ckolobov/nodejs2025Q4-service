import { Module, Global } from '@nestjs/common';
import { UserService, ArtistService } from './services';

@Global()
@Module({
  providers: [UserService, ArtistService],
  exports: [UserService, ArtistService],
})
export class DatabaseModule {}
