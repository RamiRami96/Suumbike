-- DropForeignKey
ALTER TABLE "LikedProfile" DROP CONSTRAINT "LikedProfile_profileId_fkey";

-- AlterTable
ALTER TABLE "LikedProfile" ALTER COLUMN "profileId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "LikedProfile" ADD CONSTRAINT "LikedProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
