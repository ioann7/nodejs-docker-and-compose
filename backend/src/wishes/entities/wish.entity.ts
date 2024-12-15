import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { IsUrl, Length } from 'class-validator';
import Decimal from 'decimal.js';
import { BaseModel } from '../../core/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { ColumnNumericTransformer } from '../../core/utils/decimalTransformer';

@Entity()
export class Wish extends BaseModel {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  price: Decimal;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  raised: Decimal;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer;

  @Column({ type: 'int', default: 0 })
  copied: number;
}
