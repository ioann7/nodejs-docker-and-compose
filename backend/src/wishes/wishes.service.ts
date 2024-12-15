import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import Decimal from 'decimal.js';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, owner: User): Promise<Wish> {
    const wish = await this.wishesRepository.create({
      ...createWishDto,
      owner,
    });
    return await this.wishesRepository.save(wish);
  }

  async findLast(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
      relations: ['owner', 'offers'],
    });
  }

  async findTop(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: { raised: 'DESC' },
      take: 20,
      relations: ['owner', 'offers'],
    });
  }

  async findOne(id: number): Promise<Wish> {
    return await this.wishesRepository.findOneOrFail({
      where: { id },
      relations: ['owner', 'offers'],
    });
  }

  async findByUserId(userId): Promise<Wish[]> {
    return await this.wishesRepository.find({
      where: { owner: { id: userId } },
      relations: ['owner', 'offers'],
    });
  }

  async update(
    id: number,
    updateWishDto: UpdateWishDto,
    user: User,
  ): Promise<Wish> {
    const wish = await this.findOne(id);

    if (!wish) {
      throw new NotFoundException('Wish not found.');
    }

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException('You can update only your wishes.');
    }

    if ('price' in updateWishDto && wish.raised.greaterThan(new Decimal('0'))) {
      throw new ForbiddenException(
        'You cannot change the price if there are already offers.',
      );
    }

    return this.wishesRepository.save({ ...wish, ...updateWishDto });
  }

  async remove(id: number, user: User) {
    const wish = await this.findOne(id);

    if (!wish) {
      throw new NotFoundException('Wish not found.');
    }

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException('You can delete only your wishes.');
    }

    await this.wishesRepository.remove(wish);
  }

  async copyWish(id: number, user: User): Promise<Wish> {
    const originalWish = await this.findOne(id);

    if (!originalWish) {
      throw new NotFoundException('Wish not found.');
    }

    originalWish.copied++;

    const copiedWish = this.wishesRepository.create({
      ...originalWish,
      id: undefined,
      owner: user,
      copied: 0,
      raised: 0,
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let newWish;

    try {
      newWish = await this.wishesRepository.save(copiedWish);
      await this.wishesRepository.save(originalWish);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return newWish;
  }
}
