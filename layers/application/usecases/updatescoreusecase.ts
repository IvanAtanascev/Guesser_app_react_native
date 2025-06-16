import ScoreBoardRepositoryImpl from "@/layers/data/repositories/scoreboardrepository";
import ScoreBoardRepository from "@/layers/domain/repositories/scoreboardrepository";

export class UpdateScoreUseCase {
  private scoreBoardRepo: ScoreBoardRepository;

  constructor() {
    this.scoreBoardRepo = new ScoreBoardRepositoryImpl();
  }

  public async execute(amount: number, categoryId: number): Promise<void> {
    await this.scoreBoardRepo.updateCategoryScore(amount, categoryId);
  }
}
