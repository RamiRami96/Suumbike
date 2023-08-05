const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    const usersData = [
      {
        name: "Emma",
        age: 25,
        tgNickname: "em_johnson",
        avatar: "kendall.jpg",
        password: "password123",
        isOnline: true,
      },
      {
        name: "Sophia",
        age: 30,
        tgNickname: "sophia_smith",
        avatar: "kendall2.jpg",
        password: "hello123",
        isOnline: false,
      },
      {
        name: "Olivia",
        age: 28,
        tgNickname: "olivia_williams",
        avatar: "kendall3.jpg",
        password: "bob1234",
        isOnline: true,
      },
      {
        name: "Isabella",
        age: 22,
        tgNickname: "isabella_brown",
        avatar: "kendall.jpg",
        password: "eva_123",
        isOnline: false,
      },
      {
        name: "Ava",
        age: 35,
        tgNickname: "ava_lee",
        avatar: "kendall2.jpg",
        password: "michael456",
        isOnline: true,
      },
      {
        name: "Mia",
        age: 27,
        tgNickname: "mia_chen",
        avatar: "kendall3.jpg",
        password: "sophia_pass",
        isOnline: false,
      },
      {
        name: "Amelia",
        age: 29,
        tgNickname: "amelia_wang",
        avatar: "kendall.jpg",
        password: "william789",
        isOnline: true,
      },
      {
        name: "Harper",
        age: 26,
        tgNickname: "harper_liu",
        avatar: "kendall2.jpg",
        password: "olivia_pass123",
        isOnline: false,
      },
      {
        name: "Evelyn",
        age: 31,
        tgNickname: "evelyn_zhang",
        avatar: "kendall2.jpg",
        password: "james4321",
        isOnline: true,
      },
      {
        name: "Abigail",
        age: 24,
        tgNickname: "abigail_wu",
        avatar: "kendall3.jpg",
        password: "wu_emily",
        isOnline: false,
      },
      {
        name: "Emma",
        age: 25,
        tgNickname: "qem",
        avatar: "kendall.jpg",
        password: "qpassword123",
        isOnline: true,
      },
      {
        name: "Sophia",
        age: 30,
        tgNickname: "qsophia",
        avatar: "kendall2.jpg",
        password: "qhello123",
        isOnline: false,
      },
      {
        name: "Olivia",
        age: 28,
        tgNickname: "qolivia",
        avatar: "kendall3.jpg",
        password: "qbob1234",
        isOnline: true,
      },
      {
        name: "Isabella",
        age: 22,
        tgNickname: "qisabella",
        avatar: "kendall.jpg",
        password: "qeva_123",
        isOnline: false,
      },
      {
        name: "Ava",
        age: 35,
        tgNickname: "qava",
        avatar: "kendall2.jpg",
        password: "qmichael456",
        isOnline: true,
      },
      {
        name: "Mia",
        age: 27,
        tgNickname: "qmia",
        avatar: "kendall3.jpg",
        password: "qsophia_pass",
        isOnline: false,
      },
      {
        name: "Amelia",
        age: 29,
        tgNickname: "qamelia",
        avatar: "kendall.jpg",
        password: "qwilliam789",
        isOnline: true,
      },
      {
        name: "Harper",
        age: 26,
        tgNickname: "qharper",
        avatar: "kendall2.jpg",
        password: "qolivia_pass123",
        isOnline: false,
      },
      {
        name: "Evelyn",
        age: 31,
        tgNickname: "qevelyn",
        avatar: "kendall2.jpg",
        password: "1james4321",
        isOnline: true,
      },
      {
        name: "Abigail",
        age: 24,
        tgNickname: "qabigail_wu",
        avatar: "kendall3.jpg",
        password: "1wu_emily",
        isOnline: false,
      },
    ];

    for (const userData of usersData) {
      await prisma.user.create({ data: userData });
      console.log(`User ${userData.tgNickname} created`);
    }
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers();
