import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const items = await this.wishesRepository.findBy({
      id: In(createWishlistDto.itemsId),
    });

    const wishlist = this.wishlistsRepository.create({
      ...createWishlistDto,
      items,
      owner: user,
    });

    return await this.wishlistsRepository.save(wishlist);
  }

  async findAll(): Promise<Wishlist[]> {
    return await this.wishlistsRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async findOne(id: number): Promise<Wishlist> {
    return await this.wishlistsRepository.findOneOrFail({
      where: { id },
      relations: ['owner', 'items'],
    });
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const wishlist = await this.findOne(id);

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found.');
    }

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException('You can update only your wishlists.');
    }

    return this.wishlistsRepository.save({ ...wishlist, ...updateWishlistDto });
  }

  async remove(id: number, user: User) {
    const wishlist = await this.findOne(id);

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found.');
    }

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException('You can delete only your wishlists.');
    }

    await this.wishlistsRepository.remove(wishlist);
  }
}
