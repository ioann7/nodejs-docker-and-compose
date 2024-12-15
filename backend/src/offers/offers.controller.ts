import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  UseFilters,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JWTGuard } from '../guards/jwt.guard';
import { EntityNotFoundFilter } from '../core/filters/entity-not-found-exception.filter';

@UseGuards(JWTGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @UseFilters(EntityNotFoundFilter)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOfferDto: CreateOfferDto, @Req() req) {
    return await this.offersService.create(createOfferDto, req.user);
  }

  @Get()
  async findAll() {
    return await this.offersService.findAll();
  }

  @Get(':id')
  @UseFilters(EntityNotFoundFilter)
  async findOne(@Param('id') id: string) {
    return await this.offersService.findOne(+id);
  }
}
