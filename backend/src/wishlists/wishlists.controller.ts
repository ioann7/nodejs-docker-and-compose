import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JWTGuard } from '../guards/jwt.guard';
import { EntityNotFoundFilter } from '../core/filters/entity-not-found-exception.filter';

@UseGuards(JWTGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createWishlistDto: CreateWishlistDto, @Req() req) {
    return await this.wishlistsService.create(createWishlistDto, req.user);
  }

  @Get()
  async findAll() {
    return await this.wishlistsService.findAll();
  }

  @Get(':id')
  @UseFilters(EntityNotFoundFilter)
  async findOne(@Param('id') id: string) {
    return await this.wishlistsService.findOne(+id);
  }

  @Patch(':id')
  @UseFilters(EntityNotFoundFilter)
  async update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req,
  ) {
    return await this.wishlistsService.update(+id, updateWishlistDto, req.user);
  }

  @Delete(':id')
  @UseFilters(EntityNotFoundFilter)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req) {
    return await this.wishlistsService.remove(+id, req.user);
  }
}
