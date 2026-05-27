/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Portfolio` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_userId_fkey";

-- AlterTable
ALTER TABLE "Portfolio" ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "User";
