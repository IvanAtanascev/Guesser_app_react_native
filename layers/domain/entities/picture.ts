import Category from "./category";

export default class Picture {
  constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly url: string,
    private readonly category: Category,
  ) {}

  public getId(): number {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getUrl(): string {
    return this.url;
  }

  public getCategory(): Category {
    return this.category;
  }

  public isSameAs(other: Picture): boolean {
    if (this.id === other.id) {
      return true;
    }

    return false;
  }
}
