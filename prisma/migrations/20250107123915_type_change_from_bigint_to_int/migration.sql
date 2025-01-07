/*
  Warnings:

  - You are about to alter the column `totalAssets` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `maturityAmount` on the `RecurringDeposit` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "totalAssets" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "RecurringDeposit" ALTER COLUMN "maturityAmount" SET DATA TYPE INTEGER;
