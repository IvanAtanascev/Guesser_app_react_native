import Picture from "../entities/picture";

export default interface PictureRepository {
  findById(id: number): Promise<Picture>;
  findByCategory(categoryId: number): Promise<Picture[]>;
  deleteAllInCategory(categoryId: number): Promise<void>;
}
