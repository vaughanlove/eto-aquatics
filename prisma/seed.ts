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
      name: "Preschool 1",
      description: "These preschoolers will have fun learning to get in and out of the water. We'll help them jump into chest deep water. They'll float and glide on their front and back and learn to get their faces wet and blow bubbles underwater.",
},
{
      name: "Preschool 2",
      description: "These preschoolers learn to jump into chest-deep water by themselves, and get in and get out. They'll submerge and exhale underwater. Wearing a lifejacket they'll glide on their front and back.",
},
{
      name: "Preschool 3",
      description: "These youngsters will try both jumping and a sideways entry into deep water. They'll recover objects from the bottom in waist-deep water. They'll work on kicking and gliding through the water on their front and back.",
},
{
      name: "Preschool 4",
      description: "Advanced preschoolers will learn to do solo jumps into deeper water and get out by themselves. They'll do sideways entries and open their eyes underwater. They'll master a short swim on their front and gliding and kicking on their side.",
},
{
      name: "Preschool 5",
      description: "These youngsters get more adventuresome with a forward roll entry wearing a lifejacket and treading water for 10 sec. They'll work on front and back crawl swims for 5 m, interval training and get a giggle out of whip kick.",
},
{
      name: "Swimmer 1",
      description: "These beginners will become comfortable jumping into water with and without a lifejacket. They'll learn to open their eyes, exhale and hold their breath underwater. They'll work on floats, glides and kicking through the water on their front and back.",
},
{
      name: "Swimmer 2",
      description: "These advanced beginners will jump into deeper water, and learn to be comfortable falling sideways into the water wearing a lifejacket. They'll be able to support themselves at the surface without an aid, learn whip kick, swim 10 m on their front and back, and be introduced to flutter kick interval training (4 x 5 m).",
},
{
      name: "Swimmer 3",
      description: " These junior swimmers will dive and do in-water front somersaults and handstands. They'll work on 15 m of front crawl, back crawl and 10 m of whip kick. Flutter kick interval training increases to 4 x 15 m.",
},
{
      name: "Swimmer 4",
      description: " These intermediate swimmers will swim 5 m underwater and lengths of front, back crawl, whip kick, and breaststroke arms with breathing. Their new bag of tricks includes the completion of the Canadian Swim to Survive® Standard. They'll cap it all off with front crawl sprints over 25 m and 4 x 25 m front or back crawl interval training.",
},
{
      name: "Swimmer 5",
      description: "These swimmers will master shallow dives, cannonball entries, eggbeater kicks, and in-water backward somersaults. They'll refine their front and back crawl over 50 m swims of each, and breaststroke over 25 m. Then they'll pick up the pace in 25 m sprints and two interval training bouts: 4 x 50 m front or back crawl; and 4 x 15 m breaststroke.",
},
{
      name: "Swimmer 6",
      description: "These advanced swimmers will rise to the challenge of sophisticated aquatic skills including stride entries, compact jumps and lifesaving kicks like eggbeater and scissor kick. They'll develop strength and power in head-up breaststroke sprints over 25 m. They'll easily swim lengths of front crawl, back crawl, and breaststroke, and they'll complain about the 300 m workout.",
},
{
      name: "Rookie Patrol",
      description: "Swimmers continue stroke development with 50 m swims of front crawl, back crawl and breaststroke. Lifesaving Sport skills include a 25 m obstacle swim and 15 m object carry. First aid focuses on assessment of conscious victims, contacting EMS and treatment for bleeding.  Fitness improves in 350 m workouts and 100 m timed swims.",
},
{
      name: "Ranger Patrol",
      description: "Swimmers develop better strokes over 75 m swims of each stroke. They tackle Lifesaving Sport skills in a lifesaving medley, timed object support and rescue with a buoyant aid. First aid focuses on assessment of unconscious victims, treatment of victims in shock and obstructed airway procedures. Skill drills develop a strong lifesaving foundation.",
},
{
      name: "Star Patrol",
      description: " Swimmers are challenged with 600 m workouts, 300 m timed swims and a 25 m object carry. Strokes are refined over 100 m swims. First aid focuses on treatment of bone or joint injuries and respiratory emergencies including asthma and allergic reactions. Lifesaving skills include defence methods, victim removals and rolling over and supporting a victim face up in shallow water.",
},
{
      name: "Bronze Star",
      description: " Swimmers develop swimming proficiency, lifesaving skill and personal fitness. Candidates refine their stroke mechanics, acquire self-rescue skills, and apply fitness principles in training workouts. Bronze Star is excellent preparation for success in Bronze Medallion and provides a fun introduction to lifesaving sport.",
},
{
      name: "Bronze Medallion",
      description: " Challenges the candidate both mentally and physically. Judgment, knowledge, skill, and fitness – the four components of water rescue – form the basis of Bronze Medallion training. Candidates acquire the assessment and problem-solving skills needed to make good decisions in, on, and around the water. Bronze Medallion is a prerequisite for assistant lifeguard training in Bronze Cross.",
},
{
      name: "Bronze Cross",
      description: "Begins the transition from lifesaving to lifeguarding and prepares candidates for responsibilities as assistant lifeguards. Candidates strengthen and expand their lifesaving skills and begin to apply the principles and techniques of active surveillance in aquatic facilities. Bronze Cross emphasizes the importance of teamwork and communication in preventing and responding to aquatic emergencies. Bronze Cross is a prerequisite for advanced training in the Society’s National Lifeguard and leadership certification programs. ",
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