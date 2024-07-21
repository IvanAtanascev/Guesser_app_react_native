import Picture from "../entities/picture";

export default interface PictureRepository {
  download(picture: Picture): Promise<boolean>;
  findById(id: number): Promise<Picture>;
  findByCategory(categoryId: number): Promise<Picture[]>;
}
