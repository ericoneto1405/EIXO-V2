import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const DEFAULT_MODULES = [
    'Visão Geral',
    'Fazendas',
    'Rebanho Comercial',
    'Rebanho Genética',
    'Fornecedores',
    'Remédios',
    'Rações',
    'Suplementos',
    'Contas a Pagar',
    'Contas a Receber',
    'Fluxo de Caixa',
    'DRE',
    'Operações',
    'Configurações',
];
const LEGACY_MODULE_NAME = 'Rebanho P.O.';
const NEW_MODULE_NAME = 'Rebanho Genética';

const main = async () => {
    const hashedPassword = await bcrypt.hash('admin', 10);
    await prisma.user.upsert({
        where: { email: 'admin@eixo.com' },
        update: {
            password: hashedPassword,
            modules: DEFAULT_MODULES,
            roles: ['admin'],
        },
        create: {
            name: 'Administrador',
            email: 'admin@eixo.com',
            password: hashedPassword,
            modules: DEFAULT_MODULES,
            roles: ['admin'],
        },
    });
    const legacyUsers = await prisma.user.findMany({
        where: { modules: { has: LEGACY_MODULE_NAME } },
        select: { id: true, modules: true },
    });
    for (const user of legacyUsers) {
        const modulesWithoutLegacy = user.modules.filter((module) => module !== LEGACY_MODULE_NAME);
        if (modulesWithoutLegacy.includes(NEW_MODULE_NAME)) {
            if (modulesWithoutLegacy.length !== user.modules.length) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { modules: modulesWithoutLegacy },
                });
            }
            continue;
        }
        const legacyIndex = Math.max(0, user.modules.indexOf(LEGACY_MODULE_NAME));
        const nextModules = [...modulesWithoutLegacy];
        nextModules.splice(legacyIndex, 0, NEW_MODULE_NAME);
        await prisma.user.update({
            where: { id: user.id },
            data: { modules: nextModules },
        });
    }
    console.log('Admin upsert ok: admin@eixo.com');
};

main()
    .catch((error) => {
        console.error('Erro ao rodar seed.', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
