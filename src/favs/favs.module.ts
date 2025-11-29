import { Module } from '@nestjs/common';
import { FavsController } from './favs.controller';

@Module({
  controllers: [FavsController],
})
export class FavsModule {}
