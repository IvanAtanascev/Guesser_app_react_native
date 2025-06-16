import Category from "@/layers/domain/entities/category";

export class CompareCategoryUseCase {
  constructor() {}

  public execute(category1: Category, category2: Category): boolean {
    if (category1.isSameAs(category2).isSame) {
      return true;
    } else {
      return false;
    }
  }
}
