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
  async getAllFavorites(): Promise<FavoritesResponse> {
    const favorites = await this.favoritesService.getFavorites();

    const artistsPromises = favorites.artists.map((id) =>
      this.artistService.getArtistById(id),
    );
    const albumsPromises = favorites.albums.map((id) =>
      this.albumService.getAlbumById(id),
    );
    const tracksPromises = favorites.tracks.map((id) =>
      this.trackService.getTrackById(id),
    );

    const [artists, albums, tracks] = await Promise.all([
      Promise.all(artistsPromises),
      Promise.all(albumsPromises),
      Promise.all(tracksPromises),
    ]);

    return {
      artists: artists.filter((artist) => artist !== null),
      albums: albums.filter((album) => album !== null),
      tracks: tracks.filter((track) => track !== null),
    };
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  async addTrackToFavorites(@Param('id') id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid track ID (not a valid UUID)');
    }

    const track = await this.trackService.getTrackById(id);
    if (!track) {
      throw new UnprocessableEntityException(
        `Track with id ${id} doesn't exist`,
      );
    }

    await this.favoritesService.addTrack(id);
    return { message: 'Track added to favorites' };
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrackFromFavorites(@Param('id') id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid track ID (not a valid UUID)');
    }

    if (!(await this.favoritesService.isTrackFavorite(id))) {
      throw new NotFoundException('Track is not in favorites');
    }

    await this.favoritesService.removeTrack(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  async addAlbumToFavorites(@Param('id') id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid album ID (not a valid UUID)');
    }

    const album = await this.albumService.getAlbumById(id);
    if (!album) {
      throw new UnprocessableEntityException(
        `Album with id ${id} doesn't exist`,
      );
    }

    await this.favoritesService.addAlbum(id);
    return { message: 'Album added to favorites' };
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbumFromFavorites(@Param('id') id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid album ID (not a valid UUID)');
    }

    if (!(await this.favoritesService.isAlbumFavorite(id))) {
      throw new NotFoundException('Album is not in favorites');
    }

    await this.favoritesService.removeAlbum(id);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  async addArtistToFavorites(@Param('id') id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid artist ID (not a valid UUID)');
    }

    const artist = await this.artistService.getArtistById(id);
    if (!artist) {
      throw new UnprocessableEntityException(
        `Artist with id ${id} doesn't exist`,
      );
    }

    await this.favoritesService.addArtist(id);
    return { message: 'Artist added to favorites' };
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArtistFromFavorites(@Param('id') id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid artist ID (not a valid UUID)');
    }

    if (!(await this.favoritesService.isArtistFavorite(id))) {
      throw new NotFoundException('Artist is not in favorites');
    }

    await this.favoritesService.removeArtist(id);
  }
}
