const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Parse command line arguments
const args = process.argv.slice(2);
const shouldCheck = args.includes('--check') || args.includes('-c');
const shouldAssignRooms = args.includes('--rooms') || args.includes('-r');
const shouldOnlyCheck = args.includes('--check-only');

async function clearDatabase() {
  console.log("🗑️  Clearing existing data...");
  await prisma.user.deleteMany();
  console.log("✅ Database cleared");
}

async function seedUsers() {
  console.log("🌱 Seeding users...");
  
  const usersData = [
    {
      name: "Emma",
      age: 25,
      tgNickname: "em_johnson",
      avatar: "kendall.jpg",
      password: "password123",
      sex: "female",
    },
    {
      name: "Sophia",
      age: 30,
      tgNickname: "sophia_smith",
      avatar: "kendall2.jpg",
      password: "hello123",
      sex: "female",
    },
    {
      name: "Olivia",
      age: 28,
      tgNickname: "olivia_williams",
      avatar: "kendall3.jpg",
      password: "bob1234",
      sex: "female",
    },
    {
      name: "Isabella",
      age: 22,
      tgNickname: "isabella_brown",
      avatar: "kendall.jpg",
      password: "eva_123",
      sex: "female",
    },
    {
      name: "Ava",
      age: 35,
      tgNickname: "ava_lee",
      avatar: "kendall2.jpg",
      password: "michael456",
      sex: "female",
    },
    {
      name: "Mia",
      age: 27,
      tgNickname: "mia_chen",
      avatar: "kendall3.jpg",
      password: "sophia_pass",
      sex: "female",
    },
    {
      name: "Amelia",
      age: 29,
      tgNickname: "amelia_wang",
      avatar: "kendall.jpg",
      password: "william789",
      sex: "female",
    },
    {
      name: "Harper",
      age: 26,
      tgNickname: "harper_liu",
      avatar: "kendall2.jpg",
      password: "olivia_pass123",
      sex: "female",
    },
    {
      name: "Evelyn",
      age: 31,
      tgNickname: "evelyn_zhang",
      avatar: "kendall2.jpg",
      password: "james4321",
      sex: "female",
    },
    {
      name: "Abigail",
      age: 24,
      tgNickname: "abigail_wu",
      avatar: "kendall3.jpg",
      password: "wu_emily",
      sex: "female",
    },
    {
      name: "Emma",
      age: 25,
      tgNickname: "qem",
      avatar: "kendall.jpg",
      password: "qpassword123",
      sex: "female",
    },
    {
      name: "Sophia",
      age: 30,
      tgNickname: "qsophia",
      avatar: "kendall2.jpg",
      password: "qhello123",
      sex: "female",
    },
    {
      name: "Olivia",
      age: 28,
      tgNickname: "qolivia",
      avatar: "kendall3.jpg",
      password: "qbob1234",
      sex: "female",
    },
    {
      name: "Isabella",
      age: 22,
      tgNickname: "qisabella",
      avatar: "kendall.jpg",
      password: "qeva_123",
      sex: "female",
    },
    {
      name: "Ava",
      age: 35,
      tgNickname: "qava",
      avatar: "kendall2.jpg",
      password: "qmichael456",
      sex: "female",
    },
    {
      name: "Mia",
      age: 27,
      tgNickname: "qmia",
      avatar: "kendall3.jpg",
      password: "qsophia_pass",
      sex: "female",
    },
    {
      name: "Amelia",
      age: 29,
      tgNickname: "qamelia",
      avatar: "kendall.jpg",
      password: "qwilliam789",
      sex: "female",
    },
    {
      name: "Harper",
      age: 26,
      tgNickname: "qharper",
      avatar: "kendall2.jpg",
      password: "qolivia_pass123",
      sex: "female",
    },
    {
      name: "Evelyn",
      age: 31,
      tgNickname: "qevelyn",
      avatar: "kendall2.jpg",
      password: "1james4321",
      sex: "female",
    },
    {
      name: "Abigail",
      age: 24,
      tgNickname: "qabigail_wu",
      avatar: "kendall3.jpg",
      password: "1wu_emily",
      sex: "female",
    },
  ];

  for (const userData of usersData) {
    await prisma.user.create({ data: userData });
    console.log(`✅ User ${userData.tgNickname} created`);
  }
  
  console.log(`🎉 Successfully seeded ${usersData.length} users`);
}

async function assignRoomIds() {
  console.log("🏠 Assigning room IDs to users...");
  
  // Get all users
  const users = await prisma.user.findMany();
  
  if (users.length === 0) {
    console.log("❌ No users found to assign room IDs");
    return;
  }
  
  // Assign room IDs to the first 10 users (or half if less than 10)
  const usersToUpdate = users.slice(0, Math.min(10, Math.floor(users.length / 2)));
  
  let updatedCount = 0;
  for (const user of usersToUpdate) {
    // Generate a unique room ID (could be more sophisticated)
    const roomId = `room_${user.id}_${Date.now() + Math.random()}`;
    
    await prisma.user.update({
      where: { id: user.id },
      data: { roomId },
    });
    
    console.log(`✅ Assigned roomId "${roomId}" to user ${user.tgNickname}`);
    updatedCount++;
  }
  
  console.log(`🎉 Successfully assigned room IDs to ${updatedCount} users`);
}

async function checkDatabase() {
  console.log("🔍 Checking database state...");
  
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      tgNickname: true,
      roomId: true,
    },
    orderBy: {
      id: 'asc',
    },
  });

  console.log("\n📊 Database Statistics:");
  console.log(`Total users: ${allUsers.length}`);
  
  const usersWithRooms = allUsers.filter(user => user.roomId !== null);
  const usersWithoutRooms = allUsers.filter(user => user.roomId === null);
  
  console.log(`Users with rooms: ${usersWithRooms.length}`);
  console.log(`Users without rooms: ${usersWithoutRooms.length}`);
  
  if (usersWithRooms.length > 0) {
    console.log("\n👥 Users with rooms:");
    usersWithRooms.forEach(user => {
      console.log(`  - ${user.name} (@${user.tgNickname}) - Room: ${user.roomId}`);
    });
  }
  
  if (usersWithoutRooms.length > 0) {
    console.log("\n👤 Users without rooms:");
    usersWithoutRooms.forEach(user => {
      console.log(`  - ${user.name} (@${user.tgNickname})`);
    });
  }
}

async function main() {
  try {
    console.log("🚀 Starting database setup...\n");
    
    if (shouldOnlyCheck) {
      // Only check the database state
      await checkDatabase();
    } else {
      // Clear database and seed users
      await clearDatabase();
      await seedUsers();
      
      // Assign room IDs if requested
      if (shouldAssignRooms) {
        console.log("");
        await assignRoomIds();
      }
      
      // Check database state if requested
      if (shouldCheck) {
        console.log("");
        await checkDatabase();
      }
    }
    
    console.log("\n✨ Database setup completed!");
    
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Show usage if help is requested
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🌱 Database Seed Script Usage:

Basic seeding:
  node seed.js                    # Seed users only

With options:
  node seed.js --rooms           # Seed users and assign room IDs to some users
  node seed.js --check           # Seed users and show database state
  node seed.js --rooms --check   # Seed users, assign rooms, and show state
  
Check only:
  node seed.js --check-only      # Only check current database state (no seeding)

Options:
  --rooms, -r     Assign room IDs to some users after seeding
  --check, -c     Show database statistics after operations
  --check-only    Only check database state, don't seed
  --help, -h      Show this help message

Examples:
  node seed.js --rooms --check   # Full setup with verification
  node seed.js --check-only      # Just check what's in the database
  `);
  process.exit(0);
}

main();
