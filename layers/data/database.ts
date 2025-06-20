import * as SQLite from "expo-sqlite";
import {
  localDatabaseName,
  categoryTableName,
  picturesTableName,
  scoreBoardTableName,
} from "./datasources/shared";

class DatabaseCreationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseCreationError";
  }
}

const createCategoryTable = (localDatabase: SQLite.SQLiteDatabase) => {
  localDatabase.execSync(
    `CREATE TABLE IF NOT EXISTS ${categoryTableName} (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        date_of_last_change TEXT NOT NULL
        )`,
  );
};

const createScoreBoardTable = (localDatabase: SQLite.SQLiteDatabase) => {
  localDatabase.execSync(
    `CREATE TABLE IF NOT EXISTS ${scoreBoardTableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER NOT NULL unique,
        score INTEGER DEFAULT 0,
        FOREIGN KEY (category_id) REFERENCES ${categoryTableName}(id) on DELETE CASCADE
        )`,
  );
};

const createPictureTable = (localDatabase: SQLite.SQLiteDatabase) => {
  localDatabase.execSync(
    `CREATE TABLE IF NOT EXISTS ${picturesTableName} (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        localPath TEXT,
        category_id INTEGER NOT NULL,
        FOREIGN KEY (category_id) REFERENCES ${categoryTableName}(id) ON DELETE CASCADE
        )`,
  );
};

function openDatabase(): SQLite.SQLiteDatabase {
  const db = SQLite.openDatabaseSync(localDatabaseName);
  db.withTransactionSync(() => {
    createCategoryTable(db);
    createScoreBoardTable(db);
    createPictureTable(db);
  });

  return db;
}

const db = openDatabase();
export default db;
