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

  await Promise.all(
    getCerts().map((cert) => {
      return db.certification.create({ data: cert });
    })
  );
}

seed();

function getCerts() {
  // shout-out to https://icanhazdadjoke.com/

  return [
    {
      name: "Bronze Cross",
      description: `20 hour course beginning the transition from livesaving to lifeguarding.`,
    },
    {
      name: "Swimmer 4",
      description: `Make your child more independent and confident in the water.`,
    },
  ];
}