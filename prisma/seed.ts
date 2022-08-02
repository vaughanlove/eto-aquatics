import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
    await db.user.create({
        data: {
            username: "nick",
            // twixrox hashed
            passwordHash: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
            isAdmin: true
        }
    });

    await db.user.create({
      data: {
          username: "testuser",
          // twixrox hashed
          passwordHash: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
          isAdmin: false
      }
  });

  await Promise.all(
    getLessons().map((lesson) => {
      return db.lesson.create({ data: lesson });
    })
  );
}

seed();

function getLessons() {
  // shout-out to https://icanhazdadjoke.com/

  return [
    {
      name: "Bronze Cross",
      description: `20 hour course beginning the transition from livesaving to lifeguarding.`,
      availableSpots: 10,
      instructor: "Nicholas Eto",
      lowerAge: 12,
      upperAge: 15,
      recurringDate: "2022-10-05T10:30:00.000Z",
      classMinuteDuration: 60,
      totalDurationHours: 20,
      lessonCost: 320,
      prerequisite: " Bronze Medallion and Lifesaving Society Emergency or Standard First Aid certifications" 
    },
    {
        name: "Swimmer 4",
        description: `Make your child more independent and confident in the water.`,
        availableSpots: 8,
        instructor: "Nicholas Eto",
        lowerAge: 5,
        upperAge: 8,
        recurringDate: "2022-10-05T11:30:00.000Z",
        classMinuteDuration: 30,
        totalDurationHours: 4,
        lessonCost: 180,
        prerequisite: "Swimmer 3 or equivalent" 
      },
  ];
}