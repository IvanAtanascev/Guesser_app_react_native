import Category from "@/layers/domain/entities/category";
import CategoryRepository from "@/layers/domain/repositories/categoryrepository";
import DataSource from "../datasources/datasource";
import {
  CategoryApiResponse,
  CategoryInfoApiResponse,
} from "@/layers/domain/entities/apiresponse";

class CategoryRepositoryClassError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CategoryRepositoryError";
  }
}

export default class CategoryRepositoryImpl implements CategoryRepository {
  private DataSource: DataSource;

  constructor() {
    this.DataSource = new DataSource();
  }

  public async download(category: string): Promise<boolean> {
    const categoryResponse: CategoryApiResponse =
      await this.DataSource.fetchCategory(
        "https://guesser.ivanata.cz/categories/" + category,
      );
    await this.DataSource.downloadAllCategoryFiles(categoryResponse);
    await this.DataSource.insertCategoryIntoDB(categoryResponse);

    return true;
  }

  public async findById(id: number): Promise<Category> {
    const category: Category | null = await this.DataSource.getCategoryById(id);

    if (category === null) {
      throw new CategoryRepositoryClassError(
        `Couldn't find category with the id ${id}`,
      );
    }

    return category;
  }

  public async findByName(name: string): Promise<Category> {
    const category: Category | null =
      await this.DataSource.getCategoryByName(name);

    if (category === null) {
      throw new CategoryRepositoryClassError(
        `Couldn't find category with the name ${name}`,
      );
    }

    return category;
  }

  public async getAllIdsInCategory(categoryId: number): Promise<number[]> {
    return await this.DataSource.getAllIdsInCategory(categoryId);
  }

  public async getAllAvailableCategoryIds(): Promise<number[]> {
    return await this.DataSource.getAllCategoryIds();
  }

  public async getAllCategoryInfo(): Promise<Category[]> {
    const apiResponseData: CategoryInfoApiResponse =
      await this.DataSource.fetchCategoryInfo();

    const categoryArray: Category[] = apiResponseData.results.map(
      (category: { id: number; name: string; date_of_last_change: string }) => {
        return new Category(
          category.id,
          category.name,
          category.date_of_last_change,
        );
      },
    );

    return categoryArray;
  }

  public async exists(id: number): Promise<boolean> {
    const result: Category | null = await this.DataSource.getCategoryById(id);

    if (result === null) {
      return false;
    } else {
      return true;
    }
  }
}
