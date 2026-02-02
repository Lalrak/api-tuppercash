/*
  Warnings:

  - Made the column `status` on table `Installment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Installment" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'OPEN';
