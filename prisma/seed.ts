import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
    let nick = await db.user.create({
        data: {
            username: "nick",
            // twixrox hashed
            passwordHash: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
            isAdmin: true
        }
    });

    let testCert = await db.certification.create({data: {
      name: "Bronze Cross",
      description: `20 hour course beginning the transition from livesaving to lifeguarding.`,
      },
    })

    await db.lesson.create({data: {
      availableSpots: 12,
      instructor: "Nick",
      classMinutes: 60,
      totalHours: 16,
      lessonCost: 400,
      certificationId: testCert.id,
      times: {create: [{start: '2022-08-03T19:13:05.076Z', end: '2022-08-03T19:13:43.154Z'}, {start: '2022-08-03T19:13:15.076Z', end: '2022-08-03T19:20:43.154Z'}]}
    }})

    //await db.user.update({data: {}, where: {id: nick.id}})





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
      prereqIn: {
        create: [{
            name: "Swimmer 4", 
            description: `Make your child more independent and confident in the water.`
          }]
      },
      prereqFor: {
        create: [{
            name: "Bronze Medallion", 
            description: `next steps into lifeguarding.`
          }]
      }
    },
    {
      name: "Swimmer 3",
      description: `Make your child more independent and confident in the water.`,
    },
  ];
}

// function getLessons() {
//   return [
//     {
//       availableSpots: 12,
//       instructor: "Nick",
//       classMinutes: 60,
//       totalHours: 16,
//       lessonCost: 400,
//       award: {create: {}}
//     }
//   ]
// }