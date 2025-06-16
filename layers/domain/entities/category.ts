export type CategoryComparisonType = {
  isSame: boolean;
  context: "same" | "differentCategory" | "differentDate";
};

export default class Category {
  constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly dateOfLastChange: string,
  ) {}

  public getId(): number {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getDateOfLastChange(): string {
    return this.dateOfLastChange;
  }

  public isSameAs(other: Category): CategoryComparisonType {
    if (this.id !== other.id || this.name !== other.name) {
      return {
        isSame: false,
        context: "differentCategory",
      };
    }

    if (this.dateOfLastChange !== other.dateOfLastChange) {
      return {
        isSame: false,
        context: "differentDate",
      };
    }

    return {
      isSame: true,
      context: "same",
    };
  }
}
