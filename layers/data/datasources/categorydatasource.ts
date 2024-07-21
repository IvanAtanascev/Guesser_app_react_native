import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import Category from "@/layers/domain/entities/category";

class CategoryDataSourceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CategoryDataSourceError";
  }
}

const localDatabaseName: string = "guesser.db";

const localDatabase = SQLite.openDatabaseSync(localDatabaseName);

export default class CategoryDataSource {
  createTable() {
    localDatabase
      .execAsync(
        `CREATE TABLE IF NOT EXISTS guesser_files (id INTEGER PRIMARY KEY, name TEXT, localPath TEXT)`,
      )
      .catch((error) => {
        throw new CategoryDataSourceError(`Table create error: ${error}`);
      });
  }

  async downloadFile(id: number, name: string, url: string): Promise<void> {
    const localPath: string = `${FileSystem.cacheDirectory}${name}`;
    try {
      await FileSystem.downloadAsync(url, localPath);
    } catch (e) {
      console.error("Could not download file");
    }
  }

  async insertFileInDB(id: number, name: string, localPath: string): Promise<void> {
    
  }
}
