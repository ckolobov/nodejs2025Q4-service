-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" BIGINT NOT NULL,
    "updatedAt" BIGINT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artists" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "grammy" BOOLEAN NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "albums" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "artistId" UUID,

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracks" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "artistId" UUID,
    "albumId" UUID,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_artists" (
    "id" UUID NOT NULL,
    "artistId" UUID NOT NULL,

    CONSTRAINT "favorite_artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_albums" (
    "id" UUID NOT NULL,
    "albumId" UUID NOT NULL,

    CONSTRAINT "favorite_albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_tracks" (
    "id" UUID NOT NULL,
    "trackId" UUID NOT NULL,

    CONSTRAINT "favorite_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_artists_artistId_key" ON "favorite_artists"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_albums_albumId_key" ON "favorite_albums"("albumId");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_tracks_trackId_key" ON "favorite_tracks"("trackId");

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE SET NULL ON UPDATE CASCADE;
