import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Define el enum FrequencyType para uso en seed.ts
enum FrequencyType {
  INTERVAL = "INTERVAL",
  SPECIFIC = "SPECIFIC"
}

async function main() {
  // Verificar si el usuario admin ya existe
  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: 'admin@test.com',
    },
  });

  if (!existingAdmin) {
    // Crear usuario admin
    const hashedPassword = await bcrypt.hash('abcd1234', 10);

    await prisma.user.create({
      data: {
        email: 'admin@test.com',
        name: 'Administrador',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('Usuario administrador creado correctamente');
  } else {
    console.log('El usuario administrador ya existe');
  }

  // Eliminar rutas existentes
  await prisma.route.deleteMany({});
  console.log('Rutas existentes eliminadas');

  // Crear nuevas rutas predeterminadas
  const routes = [
    {
      origin: 'Cali',
      destination: 'Buenaventura',
      busPrice: 42500,
      boatPrice: null,
      startTime: '04:08',
      endTime: '19:52',
      frequencyType: FrequencyType.INTERVAL,
      intervalMinutes: 8,
      specificTimes: [],
      operatingDays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    },
    {
      origin: 'Cali',
      destination: 'Juanchaco',
      busPrice: 42500,
      boatPrice: 140000,
      startTime: '04:08',
      endTime: '23:00',
      frequencyType: FrequencyType.INTERVAL,
      intervalMinutes: 8,
      specificTimes: [],
      operatingDays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    },
    {
      origin: 'Cali',
      destination: 'Chucheros',
      busPrice: 42500,
      boatPrice: 160000,
      startTime: '04:08',
      endTime: '23:00',
      frequencyType: FrequencyType.INTERVAL,
      intervalMinutes: 8,
      specificTimes: [],
      operatingDays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    },
    {
      origin: 'Cali',
      destination: 'Piangüita',
      busPrice: 42500,
      boatPrice: 70000,
      startTime: '04:08',
      endTime: '23:00',
      frequencyType: FrequencyType.INTERVAL,
      intervalMinutes: 8,
      specificTimes: [],
      operatingDays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    },
    {
      origin: 'Cali',
      destination: 'Pacifico Hostal',
      busPrice: 42500,
      boatPrice: 160000,
      startTime: '04:08',
      endTime: '23:00',
      frequencyType: FrequencyType.INTERVAL,
      intervalMinutes: 8,
      specificTimes: [],
      operatingDays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    },
    {
      origin: 'Cali',
      destination: 'Playa juan de dios',
      busPrice: 42500,
      boatPrice: 160000,
      startTime: '04:08',
      endTime: '23:00',
      frequencyType: FrequencyType.INTERVAL,
      intervalMinutes: 8,
      specificTimes: [],
      operatingDays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    },
    {
      origin: 'Cali',
      destination: 'Playa Dorada Magüipi',
      busPrice: 42500,
      boatPrice: 160000,
      startTime: '04:08',
      endTime: '23:00',
      frequencyType: FrequencyType.INTERVAL,
      intervalMinutes: 8,
      specificTimes: [],
      operatingDays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    },
    {
      origin: 'Cali',
      destination: 'Bahia plata malaga',
      busPrice: 42500,
      boatPrice: 190000,
      startTime: '04:08',
      endTime: '23:00',
      frequencyType: FrequencyType.INTERVAL,
      intervalMinutes: 8,
      specificTimes: [],
      operatingDays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    },
    {
      origin: 'Cali',
      destination: 'Bocana',
      busPrice: 42500,
      boatPrice: 60000,
      startTime: '04:08',
      endTime: '23:00',
      frequencyType: FrequencyType.INTERVAL,
      intervalMinutes: 8,
      specificTimes: [],
      operatingDays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    },
    {
      origin: 'Buenaventura',
      destination: 'Cali',
      busPrice: 42500,
      boatPrice: null,
      startTime: '04:08',
      endTime: '19:52',
      frequencyType: FrequencyType.INTERVAL,
      intervalMinutes: 8,
      specificTimes: [],
      operatingDays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    },
    {
      origin: 'Buenaventura',
      destination: 'Juanchaco',
      busPrice: null,
      boatPrice: 140000,
      startTime: '08:00',
      endTime: '16:00',
      frequencyType: FrequencyType.INTERVAL,
      intervalMinutes: 15,
      specificTimes: [],
      operatingDays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    },
    {
      origin: 'Buenaventura',
      destination: 'Chucheros',
      busPrice: null,
      boatPrice: 160000,
      startTime: '08:00',
      endTime: '16:00',
      frequencyType: FrequencyType.INTERVAL,
      intervalMinutes: 15,
      specificTimes: [],
      operatingDays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    },
    {
      origin: 'Buenaventura',
      destination: 'Güapi',
      busPrice: null,
      boatPrice: 160000,
      startTime: '08:00',
      endTime: '09:00',
      frequencyType: FrequencyType.SPECIFIC,
      intervalMinutes: null,
      specificTimes: ['08:00', '09:00'],
      operatingDays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    },
    {
      origin: 'Buenaventura',
      destination: 'Timbiquí',
      busPrice: null,
      boatPrice: 150000,
      startTime: '08:00',
      endTime: '09:00',
      frequencyType: FrequencyType.SPECIFIC,
      intervalMinutes: null,
      specificTimes: ['08:00', '09:00'],
      operatingDays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    },
    {
      origin: 'Buenaventura',
      destination: 'Piangüita',
      busPrice: null,
      boatPrice: 70000,
      startTime: '08:00',
      endTime: '16:00',
      frequencyType: FrequencyType.INTERVAL,
      intervalMinutes: 15,
      specificTimes: [],
      operatingDays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    },
    {
      origin: 'Buenaventura',
      destination: 'Pacifico Hostal',
      busPrice: null,
      boatPrice: 160000,
      startTime: '08:00',
      endTime: '16:00',
      frequencyType: FrequencyType.INTERVAL,
      intervalMinutes: 15,
      specificTimes: [],
      operatingDays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    },
    {
      origin: 'Buenaventura',
      destination: 'Playa juan de dios',
      busPrice: null,
      boatPrice: 160000,
      startTime: '08:00',
      endTime: '16:00',
      frequencyType: FrequencyType.INTERVAL,
      intervalMinutes: 15,
      specificTimes: [],
      operatingDays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    },
    {
      origin: 'Buenaventura',
      destination: 'Playa Dorada Magüipi',
      busPrice: null,
      boatPrice: 160000,
      startTime: '08:00',
      endTime: '16:00',
      frequencyType: FrequencyType.INTERVAL,
      intervalMinutes: 15,
      specificTimes: [],
      operatingDays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    },
    {
      origin: 'Buenaventura',
      destination: 'Bahía plata malaga',
      busPrice: null,
      boatPrice: 190000,
      startTime: '08:00',
      endTime: '16:00',
      frequencyType: FrequencyType.INTERVAL,
      intervalMinutes: 15,
      specificTimes: [],
      operatingDays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    },
    {
      origin: 'Buenaventura',
      destination: 'La Bocana',
      busPrice: null,
      boatPrice: 60000,
      startTime: '08:00',
      endTime: '16:00',
      frequencyType: FrequencyType.INTERVAL,
      intervalMinutes: 15,
      specificTimes: [],
      operatingDays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    },
    {
      origin: 'Guapi',
      destination: 'Buenaventura',
      busPrice: null,
      boatPrice: 160000,
      startTime: '08:00',
      endTime: '09:00',
      frequencyType: FrequencyType.SPECIFIC,
      intervalMinutes: null,
      specificTimes: ['08:00', '09:00'],
      operatingDays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    },
    {
      origin: 'Guapi',
      destination: 'Cali',
      busPrice: 42500,
      boatPrice: 160000,
      startTime: '08:00',
      endTime: '09:00',
      frequencyType: FrequencyType.SPECIFIC,
      intervalMinutes: null,
      specificTimes: ['08:00', '09:00'],
      operatingDays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    },
    {
      origin: 'Timbiquí',
      destination: 'Buenaventura',
      busPrice: null,
      boatPrice: 150000,
      startTime: '08:00',
      endTime: '09:00',
      frequencyType: FrequencyType.SPECIFIC,
      intervalMinutes: null,
      specificTimes: ['08:00', '09:00'],
      operatingDays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    },
    {
      origin: 'Timbiquí',
      destination: 'Cali',
      busPrice: 42500,
      boatPrice: 150000,
      startTime: '08:00',
      endTime: '09:00',
      frequencyType: FrequencyType.SPECIFIC,
      intervalMinutes: null,
      specificTimes: ['08:00', '09:00'],
      operatingDays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    },
  ];

  for (const route of routes) {
    await prisma.route.create({
      data: route,
    });
    console.log(`Ruta ${route.origin} a ${route.destination} creada correctamente`);
  }

  // Crear configuraciones básicas
  const configs = [
    {
      key: 'company_name',
      value: 'Movi5',
      description: 'Nombre de la empresa',
    },
    {
      key: 'contact_email',
      value: 'info@movi5.co',
      description: 'Email de contacto',
    },
    {
      key: 'contact_phone',
      value: '+57 317 123 4567',
      description: 'Teléfono de contacto',
    },
  ];

  for (const config of configs) {
    const existingConfig = await prisma.configuration.findUnique({
      where: {
        key: config.key,
      },
    });

    if (!existingConfig) {
      await prisma.configuration.create({
        data: config,
      });
      console.log(`Configuración ${config.key} creada correctamente`);
    }
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