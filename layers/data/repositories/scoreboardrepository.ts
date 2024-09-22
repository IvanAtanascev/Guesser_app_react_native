import ScoreBoardRepository from "@/layers/domain/repositories/scoreboardrepository";
import DataSource from "../datasources/datasource";

class ScoreBoardRepositoryClassError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScoreBoardRepositoryError";
  }
}

export default class ScoreBoardRepositoryImpl implements ScoreBoardRepository {
  private DataSource: DataSource;

  constructor() {
    this.DataSource = new DataSource();
  }

  public async getCategoryScore(categoryId: number): Promise<number> {
    const score: number | null =
      await this.DataSource.getScoreForCategory(categoryId);

    if (score === null) {
      throw new ScoreBoardRepositoryClassError(
        `Couldn't find score for category ID ${categoryId}`,
      );
    } else {
      return score;
    }
  }

  public async updateCategoryScore(
    amount: number,
    categoryId: number,
  ): Promise<void> {
    try {
      await this.DataSource.updateScore(amount, categoryId);
    } catch (error) {
      throw new ScoreBoardRepositoryClassError(
        `Couldn't update score ${error}`,
      );
    }
  }

  public async deleteScoreBoardEntry(categoryId: number): Promise<void> {
    try {
      await this.DataSource.deleteScoreBoardEntry(categoryId);
    } catch (error) {
      throw new ScoreBoardRepositoryClassError(
        `Couldn't delete score ${error}`,
      );
    }
  }
}
