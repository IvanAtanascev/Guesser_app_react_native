import ScoreBoardRepositoryImpl from "@/layers/data/repositories/scoreboardrepository";
import ScoreBoardRepository from "@/layers/domain/repositories/scoreboardrepository";

export class GetScoreUseCase {
  private scoreBoardRepo: ScoreBoardRepository;

  constructor() {
    this.scoreBoardRepo = new ScoreBoardRepositoryImpl();
  }

  public async execute(categoryId: number): Promise<number> {
    return await this.scoreBoardRepo.getCategoryScore(categoryId);
  }
}
