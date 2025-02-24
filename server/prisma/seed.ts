import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import bcrypt from 'bcrypt';

// Helper types
type ExerciseCreate = {
  title: string;
  sets: {
    weight: number;
    reps: number;
    completed: boolean;
  }[];
}

const pushExercises: ExerciseCreate[] = [
  {
    title: "Bench Press",
    sets: [
      { weight: 135, reps: 12, completed: true },
      { weight: 155, reps: 10, completed: true },
      { weight: 185, reps: 8, completed: true }
    ]
  },
  {
    title: "Overhead Press",
    sets: [
      { weight: 95, reps: 10, completed: true },
      { weight: 105, reps: 8, completed: true },
      { weight: 115, reps: 6, completed: true }
    ]
  },
  {
    title: "Incline Dumbbell Press",
    sets: [
      { weight: 50, reps: 12, completed: true },
      { weight: 60, reps: 10, completed: true },
      { weight: 65, reps: 8, completed: true }
    ]
  },
  {
    title: "Lateral Raises",
    sets: [
      { weight: 15, reps: 15, completed: true },
      { weight: 20, reps: 12, completed: true },
      { weight: 20, reps: 12, completed: true }
    ]
  },
  {
    title: "Tricep Pushdowns",
    sets: [
      { weight: 50, reps: 15, completed: true },
      { weight: 60, reps: 12, completed: true },
      { weight: 70, reps: 10, completed: true }
    ]
  }
]

const pullExercises: ExerciseCreate[] = [
  {
    title: "Deadlift",
    sets: [
      { weight: 225, reps: 8, completed: true },
      { weight: 275, reps: 6, completed: true },
      { weight: 315, reps: 4, completed: true }
    ]
  },
  {
    title: "Barbell Rows",
    sets: [
      { weight: 135, reps: 12, completed: true },
      { weight: 155, reps: 10, completed: true },
      { weight: 175, reps: 8, completed: true }
    ]
  },
  {
    title: "Pull-ups",
    sets: [
      { weight: 0, reps: 12, completed: true },
      { weight: 0, reps: 10, completed: true },
      { weight: 0, reps: 8, completed: true }
    ]
  },
  {
    title: "Face Pulls",
    sets: [
      { weight: 40, reps: 15, completed: true },
      { weight: 50, reps: 12, completed: true },
      { weight: 60, reps: 10, completed: true }
    ]
  },
  {
    title: "Bicep Curls",
    sets: [
      { weight: 25, reps: 12, completed: true },
      { weight: 30, reps: 10, completed: true },
      { weight: 35, reps: 8, completed: true }
    ]
  }
]

const legExercises: ExerciseCreate[] = [
  {
    title: "Squats",
    sets: [
      { weight: 185, reps: 10, completed: true },
      { weight: 225, reps: 8, completed: true },
      { weight: 245, reps: 6, completed: true }
    ]
  },
  {
    title: "Romanian Deadlifts",
    sets: [
      { weight: 185, reps: 12, completed: true },
      { weight: 205, reps: 10, completed: true },
      { weight: 225, reps: 8, completed: true }
    ]
  },
  {
    title: "Leg Press",
    sets: [
      { weight: 225, reps: 15, completed: true },
      { weight: 275, reps: 12, completed: true },
      { weight: 315, reps: 10, completed: true }
    ]
  },
  {
    title: "Calf Raises",
    sets: [
      { weight: 135, reps: 20, completed: true },
      { weight: 155, reps: 15, completed: true },
      { weight: 175, reps: 12, completed: true }
    ]
  },
  {
    title: "Leg Extensions",
    sets: [
      { weight: 100, reps: 15, completed: true },
      { weight: 120, reps: 12, completed: true },
      { weight: 140, reps: 10, completed: true }
    ]
  }
]

async function main() {
  // Clear existing data
  await prisma.set.deleteMany({})
  await prisma.exercise.deleteMany({})
  await prisma.workout.deleteMany({})
  await prisma.user.deleteMany({})

  const salt = await bcrypt.genSalt(10);
  const defaultPassword = await bcrypt.hash('DefaultPass123', salt);

  // Create workouts with dates spanning the last week
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: defaultPassword,
      name: 'Test User',
      workouts: {
        create: [
          {
            title: 'Monday Push Day',
            exercises: {
              create: pushExercises.map(exercise => ({
                title: exercise.title,
                sets: {
                  create: exercise.sets
                }
              }))
            }
          },
          {
            title: 'Tuesday Pull Day',
            exercises: {
              create: pullExercises.map(exercise => ({
                title: exercise.title,
                sets: {
                  create: exercise.sets
                }
              }))
            }
          },
          {
            title: 'Wednesday Leg Day',
            exercises: {
              create: legExercises.map(exercise => ({
                title: exercise.title,
                sets: {
                  create: exercise.sets
                }
              }))
            }
          },
          {
            title: 'Friday Push Day',
            exercises: {
              create: pushExercises.map(exercise => ({
                title: exercise.title,
                sets: {
                  create: exercise.sets.map(set => ({
                    ...set,
                    weight: set.weight + 5 // Progressive overload!
                  }))
                }
              }))
            }
          },
          {
            title: 'Saturday Pull Day',
            exercises: {
              create: pullExercises.map(exercise => ({
                title: exercise.title,
                sets: {
                  create: exercise.sets.map(set => ({
                    ...set,
                    weight: set.weight + 5 // Progressive overload!
                  }))
                }
              }))
            }
          }
        ]
      }
    },
    include: {
      workouts: {
        include: {
          exercises: {
            include: {
              sets: true
            }
          }
        }
      }
    }
  })

  console.log('Database seeded with user and workouts:', 
    JSON.stringify(user, null, 2)
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })