/*
  Warnings:

  - You are about to drop the `LikedProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LikedProfile" DROP CONSTRAINT "LikedProfile_likedProfileId_fkey";

-- DropTable
DROP TABLE "LikedProfile";

-- CreateTable
CREATE TABLE "_likedProfiles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_likedProfiles_AB_unique" ON "_likedProfiles"("A", "B");

-- CreateIndex
CREATE INDEX "_likedProfiles_B_index" ON "_likedProfiles"("B");

-- AddForeignKey
ALTER TABLE "_likedProfiles" ADD CONSTRAINT "_likedProfiles_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_likedProfiles" ADD CONSTRAINT "_likedProfiles_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
