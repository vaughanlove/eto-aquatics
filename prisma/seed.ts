import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {

  // create admin nick account. Not sure if this is exactly safe. - obviously remove from git and change password once in prod
  // todo: find the proper way to initialize an admin account.
  let nick = await db.user.create({
      data: {
          username: "nick",
          // twixrox hashed
          passwordHash: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
          isAdmin: true
      }
  });

  
  let testCert = await db.certification.create({data: {
    name: "Bronze Medallion",
    description: `20 hour course beginning the transition from livesaving to lifeguarding.`,
    },
  })

  let secondCert = await db.certification.create({data: {
      name: "Silver",
      description: "bogus",
    },
  })

  // update testCert to be a prereq for secondCert - many to many self-relationship
  await db.certification.update({data: {prereqFor: {connect: {id: secondCert.id}}}, where: {id: testCert.id}}) 

  // make lesson with times and certification awarded on completion
  let testLesson = await db.lesson.create({data: {
    availableSpots: 12,
    instructor: "Nick",
    classMinutes: 60,
    totalHours: 16,
    lessonCost: 400,
    certificationId: testCert.id,
    times: {create: [{start: '2022-08-03T19:13:05.076Z', end: '2022-08-03T19:13:43.154Z'}, {start: '2022-08-03T19:13:15.076Z', end: '2022-08-03T19:20:43.154Z'}]}
  }})


  // nick signs up to take testLesson
  await db.userTakingLesson.create({data: {userId: nick.id, lessonId: testLesson.id}})

  await Promise.all(
    getCerts().map((cert) => {
      return db.certification.create({ data: cert });
    })
  );
}

seed();

// every certification offered by eto swim academy.
function getCerts() {

  return [
    {
      name: "Bronze Cross",
      description: `20 hour course beginning the transition from livesaving to lifeguarding.`,
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