import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JWTGuard } from '../guards/jwt.guard';
import { EntityNotFoundFilter } from '../core/filters/entity-not-found-exception.filter';
import { WishesService } from '../wishes/wishes.service';

@UseGuards(JWTGuard)
@Controller('users')
export class UsersController {
  constructor(
    private wishesService: WishesService,
    private usersService: UsersService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get('me')
  async findMe(@Req() req) {
    return await this.usersService.findById(req.user.id);
  }

  @Patch('me')
  async updateMe(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  async findMeWishes(@Req() req) {
    return await this.wishesService.findByUserId(req.user.id);
  }

  @Post('find')
  async find(@Body() body: { query: string }) {
    return await this.usersService.findManyByQuery(body.query);
  }

  @Get(':username')
  @UseFilters(EntityNotFoundFilter)
  async findOne(@Param('username') username: string) {
    return await this.usersService.findByUsername(username);
  }

  @Get(':username/wishes')
  @UseFilters(EntityNotFoundFilter)
  async findUsernameWishes(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    return await this.wishesService.findByUserId(user.id);
  }
}
