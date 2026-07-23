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
  imageId: string; // folder name in free-exercise-db (github.com/yuhonas/free-exercise-db), served via jsDelivr
};

// Images: free-exercise-db (yuhonas/free-exercise-db), Unlicense (public domain), served
// from jsDelivr's GitHub CDN mirror rather than raw.githubusercontent.com (not intended
// for production hotlinking).
const IMAGE_BASE = "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises";
function imageUrl(imageId: string): string {
  return `${IMAGE_BASE}/${imageId}/0.jpg`;
}

const exercises: SeedExercise[] = [
  { name: "Barbell Bench Press", primaryMuscle: "CHEST", secondaryMuscles: ["TRICEPS", "SHOULDERS"], equipment: "Barbell", imageId: "Barbell_Bench_Press_-_Medium_Grip" },
  { name: "Incline Dumbbell Press", primaryMuscle: "CHEST", secondaryMuscles: ["SHOULDERS", "TRICEPS"], equipment: "Dumbbell", imageId: "Incline_Dumbbell_Press" },
  { name: "Push-Up", primaryMuscle: "CHEST", secondaryMuscles: ["TRICEPS"], equipment: "Bodyweight", imageId: "Pushups" },
  { name: "Barbell Overhead Press", primaryMuscle: "SHOULDERS", secondaryMuscles: ["TRICEPS"], equipment: "Barbell", imageId: "Standing_Military_Press" },
  { name: "Dumbbell Lateral Raise", primaryMuscle: "SHOULDERS", equipment: "Dumbbell", imageId: "Side_Lateral_Raise" },
  { name: "Face Pull", primaryMuscle: "SHOULDERS", secondaryMuscles: ["BACK"], equipment: "Cable", imageId: "Face_Pull" },
  { name: "Pull-Up", primaryMuscle: "BACK", secondaryMuscles: ["BICEPS"], equipment: "Bodyweight", imageId: "Pullups" },
  { name: "Lat Pulldown", primaryMuscle: "BACK", secondaryMuscles: ["BICEPS"], equipment: "Cable", imageId: "Wide-Grip_Lat_Pulldown" },
  { name: "Barbell Row", primaryMuscle: "BACK", secondaryMuscles: ["BICEPS"], equipment: "Barbell", imageId: "Bent_Over_Barbell_Row" },
  { name: "Seated Cable Row", primaryMuscle: "BACK", secondaryMuscles: ["BICEPS"], equipment: "Cable", imageId: "Seated_Cable_Rows" },
  { name: "Deadlift", primaryMuscle: "BACK", secondaryMuscles: ["HAMSTRINGS", "GLUTES"], equipment: "Barbell", imageId: "Barbell_Deadlift" },
  { name: "Barbell Back Squat", primaryMuscle: "QUADS", secondaryMuscles: ["GLUTES", "HAMSTRINGS"], equipment: "Barbell", imageId: "Barbell_Squat" },
  { name: "Front Squat", primaryMuscle: "QUADS", secondaryMuscles: ["GLUTES"], equipment: "Barbell", imageId: "Front_Squat_Clean_Grip" },
  { name: "Leg Press", primaryMuscle: "QUADS", secondaryMuscles: ["GLUTES"], equipment: "Machine", imageId: "Leg_Press" },
  { name: "Romanian Deadlift", primaryMuscle: "HAMSTRINGS", secondaryMuscles: ["GLUTES", "BACK"], equipment: "Barbell", imageId: "Romanian_Deadlift" },
  { name: "Walking Lunge", primaryMuscle: "QUADS", secondaryMuscles: ["GLUTES", "HAMSTRINGS"], equipment: "Dumbbell", imageId: "Dumbbell_Lunges" },
  { name: "Standing Calf Raise", primaryMuscle: "CALVES", equipment: "Machine", imageId: "Standing_Calf_Raises" },
  { name: "Barbell Curl", primaryMuscle: "BICEPS", secondaryMuscles: ["FOREARMS"], equipment: "Barbell", imageId: "Barbell_Curl" },
  { name: "Hammer Curl", primaryMuscle: "BICEPS", secondaryMuscles: ["FOREARMS"], equipment: "Dumbbell", imageId: "Hammer_Curls" },
  { name: "Triceps Pushdown", primaryMuscle: "TRICEPS", equipment: "Cable", imageId: "Triceps_Pushdown" },
  { name: "Skull Crusher", primaryMuscle: "TRICEPS", equipment: "Barbell", imageId: "EZ-Bar_Skullcrusher" },
  { name: "Plank", primaryMuscle: "CORE", equipment: "Bodyweight", imageId: "Plank" },
  { name: "Hanging Leg Raise", primaryMuscle: "CORE", equipment: "Bodyweight", imageId: "Hanging_Leg_Raise" },
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
        imageUrl: imageUrl(exercise.imageId),
      },
      create: {
        name: exercise.name,
        primaryMuscle: exercise.primaryMuscle,
        secondaryMuscles: exercise.secondaryMuscles ?? [],
        equipment: exercise.equipment,
        imageUrl: imageUrl(exercise.imageId),
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
