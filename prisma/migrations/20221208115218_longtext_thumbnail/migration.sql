/*
  Warnings:

  - Made the column `thumbnailB64` on table `Video` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Video` MODIFY `thumbnailB64` LONGTEXT NOT NULL;

-- CreateIndex
CREATE INDEX `Vote_votingId_idx` ON `Vote`(`votingId`);

-- CreateIndex
CREATE INDEX `Vote_userId_idx` ON `Vote`(`userId`);

-- CreateIndex
CREATE INDEX `Voting_userId_idx` ON `Voting`(`userId`);
