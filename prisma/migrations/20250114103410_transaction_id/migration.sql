-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Transaction_id_seq";
