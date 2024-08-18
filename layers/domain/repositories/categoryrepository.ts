import Category from "../entities/category";

export default interface CategoryRepository {
  download(category: string): Promise<boolean>;
  findById(id: number): Promise<Category>;
  findByName(name: string): Promise<Category>;
  getAllIdsInCategory(categoryId: number): Promise<number[]>;
  getAllAvailableCategoryIds(): Promise<number[]>;
  getAllCategoryInfo(): Promise<Category[]>;
  exists(id: number): Promise<boolean>;
}
