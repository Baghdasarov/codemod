import { faker } from "@faker-js/faker";
import { CodemodType, PrismaClient } from "@prisma/client";
import "dotenv/config";

if (!("DATABASE_URI" in process.env)) {
	throw new Error("DATABASE_URI not found in .env");
}

const prisma = new PrismaClient();

async function main() {
	for (let i = 0; i < 10; i++) {
		const codemod = await prisma.codemod.create({
			data: {
				slug: faker.datatype.uuid(),
				name: faker.lorem.words(2),
				type: faker.helpers.arrayElement(Object.values(CodemodType)),
				featured: faker.datatype.boolean(),
				verified: faker.datatype.boolean(),
				private: faker.datatype.boolean(),
				author: faker.person.fullName(),
				amountOfUses: faker.datatype.number(),
				totalTimeSaved: faker.datatype.number(100),
				openedPrs: faker.datatype.number(10),
				labels: faker.lorem.words(3).split(" "),
				from: faker.system.semver(),
				to: faker.system.semver(),
			},
		});

		await prisma.codemodVersion.create({
			data: {
				version: faker.system.semver(),
				shortDescription: faker.lorem.sentence(),
				engine: faker.helpers.arrayElement(["jscodeshift", "ts-morph"]),
				requirements: faker.lorem.words(3),
				vsCodeLink: faker.internet.url(),
				codemodStudioExampleLink: faker.internet.url(),
				testProjectCommand: faker.lorem.words(2),
				sourceRepo: faker.internet.url(),
				bucketLink: faker.internet.url(),
				codemodId: codemod.id,
			},
		});
	}

	console.log("Data seeding completed.");
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
