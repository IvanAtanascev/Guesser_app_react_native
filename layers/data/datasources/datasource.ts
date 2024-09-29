import {
  picturesTableName,
  categoryTableName,
  scoreBoardTableName,
} from "./shared";
import {
  CategoryApiResponse,
  CategoryInfoApiResponse,
} from "@/layers/domain/entities/apiresponse";
import Category from "@/layers/domain/entities/category";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import Picture from "@/layers/domain/entities/picture";
import db from "../database";
import { SQLiteDatabase } from "expo-sqlite";
import { fileNameToNameMap } from "./fileNameToName";

class DataSourceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CategoryDataSourceError";
  }
}

export default class DataSource {
  private db: SQLiteDatabase;
  constructor() {
    this.db = db;
  }

  public async fetchCategory(
    categoryUrl: string,
  ): Promise<CategoryApiResponse> {
    const response = await axios.get<CategoryApiResponse>(categoryUrl);

    if (response.status !== 200) {
      console.error(`Category fetch error: ${response.status}`);
    }

    return response.data;
  }

  public async downloadAllCategoryFiles(
    categoryApiResponse: CategoryApiResponse,
  ): Promise<void> {
    const downloadPromises = categoryApiResponse.pictures.map((picture) => {
      return this.downloadPicture(picture.name, picture.url);
    });

    try {
      await Promise.all(downloadPromises);
    } catch (error) {
      throw new DataSourceError(`${error}`);
    }
  }

  public async insertCategoryIntoDB(
    category: CategoryApiResponse,
  ): Promise<void> {
    try {
      await this.db.runAsync(
        `INSERT INTO ${categoryTableName} (id, name, date_of_last_change) VALUES(?, ?, ?)`,
        [category.id, category.name, category.date_of_last_change],
      );
      await this.db.runAsync(
        `INSERT INTO ${scoreBoardTableName} (category_id) VALUES(?)`,
        [category.id],
      );
    } catch (error) {
      throw new DataSourceError(`${error}`);
    }

    const dbPromises = category.pictures.map((picture) => {
      this.insertPictureInDB(
        picture.id,
        picture.name,
        `${FileSystem.cacheDirectory}${picture.name}`,
        picture.category,
      );
    });

    try {
      await Promise.all(dbPromises);
    } catch (error) {
      throw new DataSourceError(`${error}`);
    }
  }

  public async deleteCategory(name: string): Promise<void> {
    await this.db.runAsync(
      `DELETE FROM ${categoryTableName} WHERE name = ?`,
      name,
    );
  }

  public async deletePicturesFromCategory(categoryId: number): Promise<void> {
    await this.db.runAsync(
      `DELETE FROM ${picturesTableName} WHERE category_id = ?`,
      [categoryId],
    );
  }

  public async deleteScoreBoardEntry(categoryId: number): Promise<void> {
    await this.db.runAsync(
      `DELETE FROM ${scoreBoardTableName} WHERE category_id = ?`,
      [categoryId],
    );
  }

  public async getCategoryById(id: number): Promise<Category | null> {
    const row = await this.db.getFirstAsync<{
      id: number;
      name: string;
      date_of_last_change: string;
    }>(`SELECT * FROM ${categoryTableName} WHERE id = ?`, id);

    if (row === null) {
      return null;
    } else {
      const category: Category = new Category(
        row.id,
        row.name,
        row.date_of_last_change,
      );
      return category;
    }
  }

  public async getCategoryByName(name: string): Promise<Category | null> {
    const row = await this.db.getFirstAsync<{
      id: number;
      name: string;
      date_of_last_change: string;
    }>(`SELECT * FROM ${categoryTableName} WHERE name = ?`, name);

    if (row === null) {
      return null;
    } else {
      const category: Category = new Category(
        row.id,
        row.name,
        row.date_of_last_change,
      );
      return category;
    }
  }

  public async getAllCategoryIds(): Promise<number[]> {
    const allRows = await this.db.getAllAsync<{
      id: number;
    }>(`SELECT id FROM ${categoryTableName}`);

    const idArray: number[] = allRows.map((row: { id: number }) => {
      return row.id;
    });

    return idArray;
  }

  public async getAllLocalCategories(): Promise<Category[]> {
    const allRows = await this.db.getAllAsync<{
      id: number;
      name: string;
      date_of_last_change: string;
    }>(`SELECT * FROM ${categoryTableName}`);

    const categoryArray: Category[] = allRows.map(
      (row: { id: number; name: string; date_of_last_change: string }) => {
        const category: Category = new Category(
          row.id,
          row.name,
          row.date_of_last_change,
        );
        return category;
      },
    );

    return categoryArray;
  }

  public async getSingleLocalCategory(
    categoryId: number,
  ): Promise<Category | null> {
    const row = await this.db.getFirstAsync<{
      id: number;
      name: string;
      date_of_last_change: string;
    }>(`SELECT * FROM ${categoryTableName} WHERE id = ?`, [categoryId]);

    if (row === null) {
      return null;
    }

    const category: Category = new Category(
      row.id,
      row.name,
      row.date_of_last_change,
    );

    return category;
  }

  public async fetchCategoryInfo(): Promise<CategoryInfoApiResponse> {
    const response = await axios.get<CategoryInfoApiResponse>(
      "https://guesser.ivanata.cz/categoriesinfo/",
    );

    if (response.status !== 200) {
      console.error(`Category fetch error: ${response.status}`);
    }
    return response.data;
  }

  public async downloadPicture(name: string, url: string): Promise<void> {
    const localPath: string = `${FileSystem.cacheDirectory}${name}`;
    try {
      await FileSystem.downloadAsync(url, localPath);
    } catch (e) {
      console.error("Could not download file");
      return;
    }
  }

  public async insertPictureInDB(
    id: number,
    name: string,
    localPath: string,
    categoryId: number,
  ): Promise<void> {
    try {
      await this.db.runAsync(
        `INSERT INTO ${picturesTableName} (id, name, localPath, category_id) VALUES (?, ?, ?, ?)`,
        [id, name, localPath, categoryId],
      );
    } catch (error) {
      throw new DataSourceError(`${error}`);
    }
  }

  public async getPictureById(id: number): Promise<Picture | null> {
    const row = await this.db.getFirstAsync<{
      id: number;
      name: string;
      localPath: string;
      category_id: number;
    } | null>(`SELECT * FROM ${picturesTableName} WHERE id = ?`, id);

    if (row === null) {
      return null;
    } else {
      const categoryObject: Category | null = await this.getCategoryById(
        row.category_id,
      );

      if (categoryObject === null) {
        return null;
      } else {
        const picture: Picture = new Picture(
          row.id,
          row.name,
          row.localPath,
          categoryObject,
        );

        return picture;
      }
    }
  }

  public async getPictureByCategory(
    categoryId: number,
  ): Promise<Picture[] | null> {
    const allRows = await this.db.getAllAsync<{
      id: number;
      name: string;
      url: string;
      category: number;
    }>(`SELECT * FROM ${picturesTableName} WHERE category_id = ?`, categoryId);

    const categoryObject: Category | null =
      await this.getCategoryById(categoryId);

    if (categoryObject === null) {
      return null;
    }

    const pictureArray: Picture[] | null = allRows.map(
      (row: { id: number; name: string; url: string; category: number }) => {
        const picture = new Picture(row.id, row.name, row.url, categoryObject);
        return picture;
      },
    );

    return pictureArray;
  }

  public async getAllIdsInCategory(categoryId: number): Promise<number[]> {
    const allRows = await this.db.getAllAsync<{
      id: number;
    }>(`SELECT id FROM ${picturesTableName} WHERE category_id = ?`, categoryId);

    const idArray: number[] = allRows.map((row: { id: number }) => {
      return row.id;
    });

    return idArray;
  }

  public async getScoreForCategory(categoryId: number): Promise<number | null> {
    const row = await this.db.getFirstAsync<{
      score: number;
    }>(
      `SELECT score FROM ${scoreBoardTableName} WHERE category_id = ?`,
      categoryId,
    );

    if (row === null) {
      return null;
    }

    console.log(row.score);

    return row.score;
  }

  public async updateScore(
    updateAmount: number,
    categoryId: number,
  ): Promise<void> {
    console.log(updateAmount);
    console.log(categoryId);
    await db.runAsync(
      `UPDATE ${scoreBoardTableName} SET score = ? WHERE category_id = ?`,
      [updateAmount, categoryId],
    );
  }
}
