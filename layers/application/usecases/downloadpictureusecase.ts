import Picture from "@/layers/domain/entities/picture";
import PictureRepository from "@/layers/domain/repositories/picturerepository";

export class DownloadPictureUseCase {
  private pictureRepo: PictureRepository;

  constructor(pictureRepo: PictureRepository) {
    this.pictureRepo = pictureRepo;
  }

  public async execute(picture: Picture) {
    this.pictureRepo.download(picture);
  }
}
