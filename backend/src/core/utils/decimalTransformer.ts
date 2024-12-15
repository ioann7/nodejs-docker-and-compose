import Decimal from 'decimal.js';

export class ColumnNumericTransformer {
  protected checkNullable(data: Decimal | number | string | undefined | null) {
    return data === undefined || data === null;
  }

  to(
    data: Decimal | number | string | undefined | null,
  ): string | undefined | null {
    if (this.checkNullable(data)) {
      return data as undefined | null;
    }
    return new Decimal(data).toString();
  }

  from(data: string | undefined | null): Decimal | undefined | null {
    if (this.checkNullable(data)) {
      return data as undefined | null;
    }
    return new Decimal(data);
  }
}
