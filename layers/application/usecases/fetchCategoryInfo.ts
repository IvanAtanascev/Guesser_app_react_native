import CategoryRepositoryImpl from "@/layers/data/repositories/categoryrepository";
import Category from "@/layers/domain/entities/category";
import CategoryRepository from "@/layers/domain/repositories/categoryrepository";

export default class FetchCategoryInfoUseCase {
  private categoryRepository: CategoryRepository;
  constructor() {
    this.categoryRepository = new CategoryRepositoryImpl();
  }

  public async execute(): Promise<Category[]> {
    return await this.categoryRepository.getAllCategoryInfo();
  }
}
