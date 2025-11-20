/*
  Warnings:

  - You are about to alter the column `imageUrls` on the `Message` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `Message` MODIFY `imageUrls` JSON NULL;
