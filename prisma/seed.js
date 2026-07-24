const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

const prisma = new PrismaClient();

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function main() {
  console.log("Iniciando seed do banco de dados...");

  // 1. Limpar banco existente (na ordem correta das chaves estrangeiras)
  await prisma.favorite.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.photo.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.coupon.deleteMany({});

  console.log("Banco de dados limpo.");

  // 2. Criar Usuário Admin
  const adminPassword = hashPassword("admin123");
  const admin = await prisma.user.create({
    data: {
      name: "Gabriel Luiz (Admin)",
      email: "admin@gabrielrec.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Admin padrão criado: admin@gabrielrec.com / admin123");

  // 3. Criar Clientes de Teste
  const clientPassword = hashPassword("testpassword123");
  await prisma.user.create({
    data: {
      name: "Cliente de Teste",
      email: "cliente@gmail.com",
      password: clientPassword,
      role: "CLIENT",
    },
  });
  console.log("Cliente padrão criado: cliente@gmail.com / testpassword123");

  // 4. Criar Cupons
  await prisma.coupon.createMany({
    data: [
      { code: "GABRIEL10", discount: 0.10 },
      { code: "VISIONARY", discount: 0.20 },
    ],
  });
  console.log("Cupons de desconto cadastrados.");

  // 5. Criar Eventos e Fotos
  // Evento 1
  const event1 = await prisma.event.create({
    data: {
      name: "Casamento de Marina & Lucas",
      slug: "casamento-marina-lucas",
      category: "Casamento",
      coverImage: "/mock/wedding.jpg",
      date: new Date("2026-05-15T18:00:00Z"),
      isPrivate: false,
    },
  });

  await prisma.photo.createMany({
    data: [
      { eventId: event1.id, s3Key: "/mock/photo-0.jpg", price: 15.00 },
      { eventId: event1.id, s3Key: "/mock/photo-1.jpg", price: 15.00 },
      { eventId: event1.id, s3Key: "/mock/photo-2.jpg", price: 18.00 },
    ],
  });

  // Evento 2
  const event2 = await prisma.event.create({
    data: {
      name: "Formatura de Medicina UEM",
      slug: "formatura-medicina-uem",
      category: "Formatura",
      coverImage: "/mock/grad.jpg",
      date: new Date("2026-06-20T19:00:00Z"),
      isPrivate: false,
    },
  });

  await prisma.photo.createMany({
    data: [
      { eventId: event2.id, s3Key: "/mock/photo-3.jpg", price: 20.00 },
      { eventId: event2.id, s3Key: "/mock/wedding.jpg", price: 20.00 },
      { eventId: event2.id, s3Key: "/mock/grad.jpg", price: 25.00 },
    ],
  });

  // Evento 3
  const event3 = await prisma.event.create({
    data: {
      name: "Confraternização Tech 2026",
      slug: "confraternizacao-tech-2026",
      category: "Corporativo",
      coverImage: "/mock/corp.jpg",
      date: new Date("2026-07-10T20:00:00Z"),
      isPrivate: true,
      password: "tech",
    },
  });

  await prisma.photo.createMany({
    data: [
      { eventId: event3.id, s3Key: "/mock/corp.jpg", price: 12.00 },
      { eventId: event3.id, s3Key: "/mock/party.jpg", price: 12.00 },
    ],
  });

  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro ao rodar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
