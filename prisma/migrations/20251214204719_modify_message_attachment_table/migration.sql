/*
  Warnings:

  - You are about to drop the column `url` on the `MessageAttachment` table. All the data in the column will be lost.
  - Added the required column `filename` to the `MessageAttachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MessageAttachment` DROP COLUMN `url`,
    ADD COLUMN `filename` VARCHAR(191) NOT NULL;
