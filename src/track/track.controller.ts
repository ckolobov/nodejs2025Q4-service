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
import { TrackService } from '../database/services';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllTracks() {
    return this.trackService.getAllTracks();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getTrackById(@Param('id') id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid track ID (not a valid UUID)');
    }

    const track = this.trackService.getTrackById(id);
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    return track;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTrack(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.createTrack(
      createTrackDto.name,
      createTrackDto.artistId,
      createTrackDto.albumId,
      createTrackDto.duration,
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateTrack(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid track ID (not a valid UUID)');
    }

    const track = this.trackService.getTrackById(id);
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    const updatedTrack = this.trackService.updateTrack(id, updateTrackDto);
    return updatedTrack;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrack(@Param('id') id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid track ID (not a valid UUID)');
    }

    const track = this.trackService.getTrackById(id);
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    this.trackService.deleteTrack(id);
  }
}
