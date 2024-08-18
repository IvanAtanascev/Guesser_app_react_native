import CategoryRepositoryImpl from "@/layers/data/repositories/categoryrepository";
import CategoryRepository from "@/layers/domain/repositories/categoryrepository";

export class ExistsUseCase {
  private categoryRepo: CategoryRepository;

  constructor() {
    this.categoryRepo = new CategoryRepositoryImpl();
  }

  public async execute(id: number): Promise<boolean> {
    return await this.categoryRepo.exists(id);
  }
}
