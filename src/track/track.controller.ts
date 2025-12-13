import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { validate as isValidUUID } from 'uuid';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllTracks() {
    return this.trackService.getAllTracks();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getTrackById(@Param('id') id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid track ID (not a valid UUID)');
    }

    const track = await this.trackService.getTrackById(id);
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    return track;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTrack(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.createTrack(
      createTrackDto.name,
      createTrackDto.artistId,
      createTrackDto.albumId,
      createTrackDto.duration,
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateTrack(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid track ID (not a valid UUID)');
    }

    const track = await this.trackService.getTrackById(id);
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    const updatedTrack = await this.trackService.updateTrack(
      id,
      updateTrackDto,
    );
    return updatedTrack;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrack(@Param('id') id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid track ID (not a valid UUID)');
    }

    const track = await this.trackService.getTrackById(id);
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    // Database relations will handle:
    // - Removing from favorites (ON DELETE CASCADE)
    await this.trackService.deleteTrack(id);
  }
}
