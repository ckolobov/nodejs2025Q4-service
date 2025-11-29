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
import { ArtistService } from '../database/services';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllArtists() {
    return this.artistService.getAllArtists();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getArtistById(@Param('id') id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid artist ID (not a valid UUID)');
    }

    const artist = this.artistService.getArtistById(id);
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }

    return artist;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createArtist(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.createArtist(
      createArtistDto.name,
      createArtistDto.grammy,
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateArtist(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid artist ID (not a valid UUID)');
    }

    const artist = this.artistService.getArtistById(id);
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }

    const updatedArtist = this.artistService.updateArtist(id, updateArtistDto);
    return updatedArtist;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteArtist(@Param('id') id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid artist ID (not a valid UUID)');
    }

    const artist = this.artistService.getArtistById(id);
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }

    this.artistService.deleteArtist(id);
  }
}
