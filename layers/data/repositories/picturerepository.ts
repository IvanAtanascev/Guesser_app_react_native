import Picture from "@/layers/domain/entities/picture";
import PictureRepository from "@/layers/domain/repositories/picturerepository";
import DataSource from "../datasources/datasource";

class PictureRepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PictureRepositoryError";
  }
}

export default class PictureRepositoryImpl implements PictureRepository {
  private DataSource: DataSource;

  constructor() {
    this.DataSource = new DataSource();
  }

  public async findById(id: number): Promise<Picture> {
    const picture: Picture | null = await this.DataSource.getPictureById(id);

    if (picture === null) {
      throw new PictureRepositoryError(`Picture with id ${id} not found`);
    } else {
      return picture;
    }
  }

  public async findByCategory(categoryId: number): Promise<Picture[]> {
    const pictures: Picture[] | null =
      await this.DataSource.getPictureByCategory(categoryId);

    if (pictures === null) {
      throw new PictureRepositoryError(
        `Category with id ${categoryId} has no members`,
      );
    }

    return pictures;
  }
  
}
