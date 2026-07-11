import "dotenv/config";
import { PrismaClient, MuscleGroup } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type SeedExercise = {
  name: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  equipment?: string;
};

const exercises: SeedExercise[] = [
  { name: "Barbell Bench Press", primaryMuscle: "CHEST", secondaryMuscles: ["TRICEPS", "SHOULDERS"], equipment: "Barbell" },
  { name: "Incline Dumbbell Press", primaryMuscle: "CHEST", secondaryMuscles: ["SHOULDERS", "TRICEPS"], equipment: "Dumbbell" },
  { name: "Push-Up", primaryMuscle: "CHEST", secondaryMuscles: ["TRICEPS"], equipment: "Bodyweight" },
  { name: "Barbell Overhead Press", primaryMuscle: "SHOULDERS", secondaryMuscles: ["TRICEPS"], equipment: "Barbell" },
  { name: "Dumbbell Lateral Raise", primaryMuscle: "SHOULDERS", equipment: "Dumbbell" },
  { name: "Face Pull", primaryMuscle: "SHOULDERS", secondaryMuscles: ["BACK"], equipment: "Cable" },
  { name: "Pull-Up", primaryMuscle: "BACK", secondaryMuscles: ["BICEPS"], equipment: "Bodyweight" },
  { name: "Lat Pulldown", primaryMuscle: "BACK", secondaryMuscles: ["BICEPS"], equipment: "Cable" },
  { name: "Barbell Row", primaryMuscle: "BACK", secondaryMuscles: ["BICEPS"], equipment: "Barbell" },
  { name: "Seated Cable Row", primaryMuscle: "BACK", secondaryMuscles: ["BICEPS"], equipment: "Cable" },
  { name: "Deadlift", primaryMuscle: "BACK", secondaryMuscles: ["HAMSTRINGS", "GLUTES"], equipment: "Barbell" },
  { name: "Barbell Back Squat", primaryMuscle: "QUADS", secondaryMuscles: ["GLUTES", "HAMSTRINGS"], equipment: "Barbell" },
  { name: "Front Squat", primaryMuscle: "QUADS", secondaryMuscles: ["GLUTES"], equipment: "Barbell" },
  { name: "Leg Press", primaryMuscle: "QUADS", secondaryMuscles: ["GLUTES"], equipment: "Machine" },
  { name: "Romanian Deadlift", primaryMuscle: "HAMSTRINGS", secondaryMuscles: ["GLUTES", "BACK"], equipment: "Barbell" },
  { name: "Walking Lunge", primaryMuscle: "QUADS", secondaryMuscles: ["GLUTES", "HAMSTRINGS"], equipment: "Dumbbell" },
  { name: "Standing Calf Raise", primaryMuscle: "CALVES", equipment: "Machine" },
  { name: "Barbell Curl", primaryMuscle: "BICEPS", secondaryMuscles: ["FOREARMS"], equipment: "Barbell" },
  { name: "Hammer Curl", primaryMuscle: "BICEPS", secondaryMuscles: ["FOREARMS"], equipment: "Dumbbell" },
  { name: "Triceps Pushdown", primaryMuscle: "TRICEPS", equipment: "Cable" },
  { name: "Skull Crusher", primaryMuscle: "TRICEPS", equipment: "Barbell" },
  { name: "Plank", primaryMuscle: "CORE", equipment: "Bodyweight" },
  { name: "Hanging Leg Raise", primaryMuscle: "CORE", equipment: "Bodyweight" },
];

async function main() {
  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: {
        name: exercise.name,
      },
      update: {
        primaryMuscle: exercise.primaryMuscle,
        secondaryMuscles: exercise.secondaryMuscles ?? [],
        equipment: exercise.equipment,
      },
      create: {
        name: exercise.name,
        primaryMuscle: exercise.primaryMuscle,
        secondaryMuscles: exercise.secondaryMuscles ?? [],
        equipment: exercise.equipment,
        isCustom: false,
      },
    });
  }
  console.log(`Seeded ${exercises.length} exercises.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
