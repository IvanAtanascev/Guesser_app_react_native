import Category from "../entities/category";

export default interface CategoryRepository {
  download(category: Category): Promise<boolean>;
  findById(id: number): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  getAllIdsInCategory(categoryId: number): Promise<number []>;
  getAllAvailableCategoryIds(): Promise<number []>;
  exists(): Promise<boolean>;
}
