-- Postgres has no ALTER TYPE ... DROP VALUE, so replacing enum values requires
-- swapping in a new type. Verified beforehand that only GENERAL_FITNESS (kept
-- as-is) is in use, so the USING cast below cannot fail on existing data.

-- CreateEnum
CREATE TYPE "Goal_new" AS ENUM ('LOSE_WEIGHT', 'BUILD_MUSCLE', 'IMPROVE_ENDURANCE', 'GENERAL_FITNESS', 'ATHLETIC_PERFORMANCE', 'OTHER');

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "goal" TYPE "Goal_new" USING ("goal"::text::"Goal_new");

-- DropEnum / rename
DROP TYPE "Goal";
ALTER TYPE "Goal_new" RENAME TO "Goal";
