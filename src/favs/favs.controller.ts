import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { validate as isValidUUID } from 'uuid';
import {
  FavoritesService,
  ArtistService,
  AlbumService,
  TrackService,
} from '../database/services';
import { FavoritesResponse } from './interfaces/favorites-response.interface';

@Controller('favs')
export class FavsController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllFavorites(): FavoritesResponse {
    const favorites = this.favoritesService.getFavorites();

    const artists = favorites.artists
      .map((id) => this.artistService.getArtistById(id))
      .filter((artist) => artist !== undefined);

    const albums = favorites.albums
      .map((id) => this.albumService.getAlbumById(id))
      .filter((album) => album !== undefined);

    const tracks = favorites.tracks
      .map((id) => this.trackService.getTrackById(id))
      .filter((track) => track !== undefined);

    return { artists, albums, tracks };
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  addTrackToFavorites(@Param('id') id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid track ID (not a valid UUID)');
    }

    const track = this.trackService.getTrackById(id);
    if (!track) {
      throw new UnprocessableEntityException(
        `Track with id ${id} doesn't exist`,
      );
    }

    this.favoritesService.addTrack(id);
    return { message: 'Track added to favorites' };
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrackFromFavorites(@Param('id') id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid track ID (not a valid UUID)');
    }

    if (!this.favoritesService.isTrackFavorite(id)) {
      throw new NotFoundException('Track is not in favorites');
    }

    this.favoritesService.removeTrack(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  addAlbumToFavorites(@Param('id') id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid album ID (not a valid UUID)');
    }

    const album = this.albumService.getAlbumById(id);
    if (!album) {
      throw new UnprocessableEntityException(
        `Album with id ${id} doesn't exist`,
      );
    }

    this.favoritesService.addAlbum(id);
    return { message: 'Album added to favorites' };
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAlbumFromFavorites(@Param('id') id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid album ID (not a valid UUID)');
    }

    if (!this.favoritesService.isAlbumFavorite(id)) {
      throw new NotFoundException('Album is not in favorites');
    }

    this.favoritesService.removeAlbum(id);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  addArtistToFavorites(@Param('id') id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid artist ID (not a valid UUID)');
    }

    const artist = this.artistService.getArtistById(id);
    if (!artist) {
      throw new UnprocessableEntityException(
        `Artist with id ${id} doesn't exist`,
      );
    }

    this.favoritesService.addArtist(id);
    return { message: 'Artist added to favorites' };
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteArtistFromFavorites(@Param('id') id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid artist ID (not a valid UUID)');
    }

    if (!this.favoritesService.isArtistFavorite(id)) {
      throw new NotFoundException('Artist is not in favorites');
    }

    this.favoritesService.removeArtist(id);
  }
}
