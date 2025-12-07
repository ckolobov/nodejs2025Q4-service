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
import {
  AlbumService,
  TrackService,
  FavoritesService,
} from '../database/services';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllAlbums() {
    return this.albumService.getAllAlbums();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getAlbumById(@Param('id') id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid album ID (not a valid UUID)');
    }

    const album = await this.albumService.getAlbumById(id);
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }

    return album;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAlbum(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.createAlbum(
      createAlbumDto.name,
      createAlbumDto.year,
      createAlbumDto.artistId,
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateAlbum(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid album ID (not a valid UUID)');
    }

    const album = await this.albumService.getAlbumById(id);
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }

    const updatedAlbum = await this.albumService.updateAlbum(id, updateAlbumDto);
    return updatedAlbum;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbum(@Param('id') id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid album ID (not a valid UUID)');
    }

    const album = await this.albumService.getAlbumById(id);
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }

    // Set albumId to null for all tracks that reference this album
    const allTracks = await this.trackService.getAllTracks();
    for (const track of allTracks) {
      if (track.albumId === id) {
        await this.trackService.updateTrack(track.id, { albumId: null });
      }
    }

    // Remove album from favorites if it's there
    await this.favoritesService.removeAlbum(id);

    await this.albumService.deleteAlbum(id);
  }
}
