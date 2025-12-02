import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient(); 

async function main(){
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@seila.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'conas';

    const existingAdmin = await prisma.user.findUnique({
        where: {
            email: adminEmail
        }
    });

    if (!existingAdmin) {

        const hashedPassword = await bcrypt.hash(adminPassword ?? '', 10);
        await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                name: 'Admin',
                role: 'admin',
            }
        });
        console.log('Admin created');
    }
    else {
        console.log('Admin already exists');
    }
}

main()
.catch((e) => {
    console.error(e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
});