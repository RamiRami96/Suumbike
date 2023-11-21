-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "sex" TEXT NOT NULL,
    "tgNickname" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roomId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikedUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "sex" TEXT NOT NULL,
    "tgNickname" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roomId" TEXT,
    "userId" TEXT,

    CONSTRAINT "LikedUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_tgNickname_key" ON "User"("tgNickname");

-- CreateIndex
CREATE UNIQUE INDEX "User_password_key" ON "User"("password");

-- CreateIndex
CREATE UNIQUE INDEX "User_roomId_key" ON "User"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "LikedUser_tgNickname_key" ON "LikedUser"("tgNickname");

-- CreateIndex
CREATE UNIQUE INDEX "LikedUser_password_key" ON "LikedUser"("password");

-- CreateIndex
CREATE UNIQUE INDEX "LikedUser_roomId_key" ON "LikedUser"("roomId");

-- AddForeignKey
ALTER TABLE "LikedUser" ADD CONSTRAINT "LikedUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
