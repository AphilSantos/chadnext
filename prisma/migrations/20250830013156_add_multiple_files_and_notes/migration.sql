/*
  Warnings:

  - You are about to drop the column `videoUrl` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `voiceoverUrl` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "videoUrl",
DROP COLUMN "voiceoverUrl",
ADD COLUMN     "videoUrls" JSONB,
ADD COLUMN     "voiceoverUrls" JSONB;
