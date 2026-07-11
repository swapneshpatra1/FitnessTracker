-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "targetWeightKg" DOUBLE PRECISION,
ADD COLUMN     "weeklyWorkoutGoal" INTEGER NOT NULL DEFAULT 4;

-- CreateTable
CREATE TABLE "BodyweightEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "unit" "WeightUnit" NOT NULL DEFAULT 'KG',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BodyweightEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BodyweightEntry_userId_date_idx" ON "BodyweightEntry"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "BodyweightEntry_userId_date_key" ON "BodyweightEntry"("userId", "date");

-- AddForeignKey
ALTER TABLE "BodyweightEntry" ADD CONSTRAINT "BodyweightEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
