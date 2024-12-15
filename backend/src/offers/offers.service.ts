import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';
import Decimal from 'decimal.js';

@Injectable()
export class OffersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User): Promise<Offer> {
    const { hidden, itemId } = createOfferDto;
    const amount = new Decimal(createOfferDto.amount);

    const wish = await this.wishRepository.findOne({
      where: { id: itemId },
      relations: ['owner', 'offers'],
    });

    if (!wish) {
      throw new NotFoundException(`Wish ${itemId} not found.`);
    }

    if (user.id !== wish.owner.id) {
      throw new ForbiddenException('You can create offer only for your wish.');
    }

    if (wish.price.lessThan(amount.add(wish.raised))) {
      throw new ForbiddenException(
        'Your donation surpasses the price of the wish.',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let newOffer;

    try {
      wish.raised = wish.raised.add(amount);
      await this.wishRepository.save(wish);

      const offer = this.offersRepository.create({
        user,
        item: wish,
        amount,
        hidden,
      });

      newOffer = await this.offersRepository.save(offer);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return newOffer;
  }

  async findAll(): Promise<Offer[]> {
    return await this.offersRepository.find({ relations: ['user', 'item'] });
  }

  async findOne(id: number): Promise<Offer> {
    return await this.offersRepository.findOneOrFail({
      where: { id },
      relations: ['user', 'item'],
    });
  }
}
