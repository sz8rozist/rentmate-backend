/*
  Warnings:

  - You are about to drop the column `path` on the `FlatImage` table. All the data in the column will be lost.
  - Added the required column `filename` to the `FlatImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `FlatImage` DROP COLUMN `path`,
    ADD COLUMN `filename` VARCHAR(191) NOT NULL;
