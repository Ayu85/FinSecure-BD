/*
  Warnings:

  - You are about to drop the column `address` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "address";

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "custId" INTEGER NOT NULL,
    "postCode" INTEGER NOT NULL,
    "line1" TEXT NOT NULL,
    "line2" TEXT NOT NULL,
    "landmark" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_custId_fkey" FOREIGN KEY ("custId") REFERENCES "Customer"("custId") ON DELETE RESTRICT ON UPDATE CASCADE;
