export default interface ScoreBoardRepository {
  getCategoryScore(categoryId: number): Promise<number>;
  updateCategoryScore(amount: number, categoryId: number): Promise<void>;
}
