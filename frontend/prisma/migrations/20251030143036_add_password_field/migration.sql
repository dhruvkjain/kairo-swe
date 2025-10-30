-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'APPLICANT';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;
