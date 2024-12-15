import { Entity, ManyToOne, Column } from 'typeorm';
import Decimal from 'decimal.js';
import { BaseModel } from '../../core/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { ColumnNumericTransformer } from '../../core/utils/decimalTransformer';

@Entity()
export class Offer extends BaseModel {
  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Wish)
  item: Wish;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  amount: Decimal;

  @Column({ default: false })
  hidden: boolean;
}
