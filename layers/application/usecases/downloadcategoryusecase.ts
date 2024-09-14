import CategoryRepositoryImpl from "@/layers/data/repositories/categoryrepository";
import CategoryRepository from "@/layers/domain/repositories/categoryrepository";

export class DownloadCategoryUseCase {
  private categoryRepo: CategoryRepository;

  constructor() {
    this.categoryRepo = new CategoryRepositoryImpl();
  }

  public async execute(
    category: string,
    triggerCallback: () => void,
    successCallback: () => void,
  ) {
    triggerCallback();
    try {
      await this.categoryRepo.download(category);
    } catch (error) {
      throw new Error(`DownloadCategoryUseCase fail: ${error}`);
    } finally {
      successCallback();
    }
  }
}
