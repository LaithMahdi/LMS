const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [{ name: "Computer Science" }, { name: "Music" }, { name: "Fitness" }, { name: "Art" }, { name: "Photography" }, { name: "Accounting" }, { name: "Engineering" },]
        })
        console.log("successfully created category");
    } catch (error) {
        console.log("Error seeding the database categories", error);
    } finally {
        await database.$disconnect();
    }
}
// "node scripts/seed.ts" : Command for running the seed
main();