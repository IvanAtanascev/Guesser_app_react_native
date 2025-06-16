import Category from "../entities/category";

export default interface CategoryRepository {
  download(category: string): Promise<boolean>;
  findById(id: number): Promise<Category>;
  findByName(name: string): Promise<Category>;
  getAllIdsInCategory(categoryId: number): Promise<number[]>;
  getAllLocalCategories(): Promise<Category[]>;
  getSingleLocalCategory(id: number): Promise<Category>;
  getAllAvailableCategoryIds(): Promise<number[]>;
  getAllCategoryInfo(): Promise<Category[]>;
  deleteCategory(name: string): Promise<void>;
  exists(id: number): Promise<boolean>;
}
