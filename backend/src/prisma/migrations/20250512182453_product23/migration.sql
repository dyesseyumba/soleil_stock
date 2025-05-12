/*
  Warnings:

  - You are about to drop the `Lot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `lotNumber` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `lotNumber` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `lotNumber` on the `StockSummary` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Lot";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Purchase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitCost" DECIMAL NOT NULL,
    "expirationDate" DATETIME,
    "purchasedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Purchase_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Purchase_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Purchase" ("expirationDate", "id", "productId", "purchasedAt", "quantity", "supplierId", "unitCost", "updatedAt") SELECT "expirationDate", "id", "productId", "purchasedAt", "quantity", "supplierId", "unitCost", "updatedAt" FROM "Purchase";
DROP TABLE "Purchase";
ALTER TABLE "new_Purchase" RENAME TO "Purchase";
CREATE TABLE "new_Sale" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "soldAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Sale_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Sale" ("id", "productId", "quantity", "soldAt", "updatedAt") SELECT "id", "productId", "quantity", "soldAt", "updatedAt" FROM "Sale";
DROP TABLE "Sale";
ALTER TABLE "new_Sale" RENAME TO "Sale";
CREATE TABLE "new_StockSummary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "nextToExpire" DATETIME,
    "availableQuantity" INTEGER NOT NULL,
    "lastUpdated" DATETIME NOT NULL,
    CONSTRAINT "StockSummary_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_StockSummary" ("availableQuantity", "id", "lastUpdated", "productId") SELECT "availableQuantity", "id", "lastUpdated", "productId" FROM "StockSummary";
DROP TABLE "StockSummary";
ALTER TABLE "new_StockSummary" RENAME TO "StockSummary";
CREATE UNIQUE INDEX "StockSummary_productId_key" ON "StockSummary"("productId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
