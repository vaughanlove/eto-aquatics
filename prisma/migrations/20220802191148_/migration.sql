-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "certificationId" TEXT NOT NULL,
    "availableSpots" INTEGER NOT NULL,
    "instructor" TEXT,
    "classMinutes" INTEGER NOT NULL,
    "totalHours" INTEGER NOT NULL,
    "lessonCost" REAL NOT NULL,
    CONSTRAINT "Lesson_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "Certification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Lesson_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Timeslot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "lessonId" TEXT NOT NULL,
    CONSTRAINT "Timeslot_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Prerequisite" (
    "forId" TEXT NOT NULL,
    "needId" TEXT NOT NULL,

    PRIMARY KEY ("forId", "needId"),
    CONSTRAINT "Prerequisite_forId_fkey" FOREIGN KEY ("forId") REFERENCES "Certification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Prerequisite_needId_fkey" FOREIGN KEY ("needId") REFERENCES "Certification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
