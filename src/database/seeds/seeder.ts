import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { AppDataSource } from '../data-source';
import { User } from '../../modules/users/entities/user.entity';
import { UserCredit } from '../../modules/credits/entities/user-credit.entity';
import { UserRole } from '../../common/enums/user-role.enum';

async function seed() {
  await AppDataSource.initialize();

  //Seed Credit Packages (prices in cents)
  const creditPackages = [
    { name: 'Starter', credits: 100, price: 1000 }, // $10.00
    { name: 'Pro', credits: 500, price: 4000 }, // $40.00
    { name: 'Enterprise', credits: 2000, price: 12000 }, // $120.00
  ];
  for (const pkg of creditPackages) {
    const exists = await AppDataSource.getRepository('CreditPackage').findOneBy(
      { name: pkg.name },
    );
    if (!exists) {
      await AppDataSource.getRepository('CreditPackage').save(pkg);
    }
  }

  // Seed Users (mentees and mentors)
  const users = [
    // Mentees
    { name: 'Alice Mentee', email: 'alice.mentee@example.com', role: 'MENTEE' },
    { name: 'Bob Mentee', email: 'bob.mentee@example.com', role: 'MENTEE' },
    // Mentors
    { name: 'Carol Mentor', email: 'carol.mentor@example.com', role: 'MENTOR' },
    { name: 'Dave Mentor', email: 'dave.mentor@example.com', role: 'MENTOR' },
  ];
  const userRepo = AppDataSource.getRepository(User);
  const userCreditRepo = AppDataSource.getRepository(UserCredit);
  for (const user of users) {
    let dbUser = await userRepo.findOneBy({ email: user.email });
    dbUser ??= await userRepo.save({
      ...user,
      role: UserRole[user.role as keyof typeof UserRole],
    });
    // Only mentees get a UserCredit record with 0 balance
    if (dbUser.role === UserRole.MENTEE) {
      const credit = await userCreditRepo.findOneBy({ userId: dbUser.id });
      if (!credit) {
        await userCreditRepo.save({
          userId: dbUser.id,
          balance: 0,
          totalPurchased: 0,
          totalUsed: 0,
        });
      }
    }
  }

  await AppDataSource.destroy();
  console.log('Seeding complete!');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
