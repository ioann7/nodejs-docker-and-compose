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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JWTGuard } from '../guards/jwt.guard';
import { EntityNotFoundFilter } from '../core/filters/entity-not-found-exception.filter';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JWTGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createWishDto: CreateWishDto, @Req() req) {
    await this.wishesService.create(createWishDto, req.user);
  }

  @Get('last')
  async findLast() {
    return await this.wishesService.findLast();
  }

  @Get('top')
  async findTop() {
    return await this.wishesService.findTop();
  }

  @UseGuards(JWTGuard)
  @Get(':id')
  @UseFilters(EntityNotFoundFilter)
  async findOne(@Param('id') id: string) {
    return await this.wishesService.findOne(+id);
  }

  @UseGuards(JWTGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req,
  ) {
    return await this.wishesService.update(+id, updateWishDto, req.user);
  }

  @UseGuards(JWTGuard)
  @Delete(':id')
  @UseFilters(EntityNotFoundFilter)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req) {
    return await this.wishesService.remove(+id, req.user);
  }

  @UseGuards(JWTGuard)
  @Post(':id/copy')
  @UseFilters(EntityNotFoundFilter)
  async copyWish(@Param('id') id: string, @Req() req) {
    return await this.wishesService.copyWish(+id, req.user);
  }
}
