import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Define el enum FrequencyType para uso en seed.ts
const FrequencyType = {
  INTERVAL: "INTERVAL",
  SPECIFIC: "SPECIFIC"
};

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
      busPrice: 150000,
      boatPrice: null,
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

  // Eliminar solicitudes existentes
  await prisma.requestNote.deleteMany({});
  await prisma.request.deleteMany({});
  console.log('Solicitudes existentes eliminadas');

  // Crear solicitudes de prueba
  const requests = [
    {
      origin: 'Cali',
      destination: 'Buenaventura',
      departureDate: new Date('2023-05-20'),
      passengers: 2,
      passengerData: [
        {
          fullName: 'Juan Pérez',
          documentType: 'CC',
          documentNumber: '12345678',
          email: 'juan@example.com',
          phone: '+57 321 456 7890'
        },
        {
          fullName: 'María López',
          documentType: 'CC',
          documentNumber: '87654321',
          email: 'maria@example.com',
          phone: '+57 321 987 6543'
        }
      ],
      totalPrice: 85000,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      customerName: 'Juan Pérez',
      customerEmail: 'juan@example.com',
      customerPhone: '+57 321 456 7890',
      departureTime: '08:00',
      ticketType: 'BUS'
    },
    {
      origin: 'Cali',
      destination: 'Juanchaco',
      departureDate: new Date('2023-05-22'),
      returnDate: new Date('2023-05-25'),
      passengers: 3,
      passengerData: [
        {
          fullName: 'Carlos Rodríguez',
          documentType: 'CC',
          documentNumber: '11223344',
          email: 'carlos@example.com',
          phone: '+57 311 222 3333'
        },
        {
          fullName: 'Ana Martínez',
          documentType: 'CC',
          documentNumber: '44332211',
          email: 'ana@example.com',
          phone: '+57 311 333 2222'
        },
        {
          fullName: 'Luis Sánchez',
          documentType: 'CC',
          documentNumber: '55667788',
          email: 'luis@example.com',
          phone: '+57 311 444 5555'
        }
      ],
      totalPrice: 547500,
      status: 'APPROVED',
      paymentStatus: 'PAID',
      customerName: 'Carlos Rodríguez',
      customerEmail: 'carlos@example.com',
      customerPhone: '+57 311 222 3333',
      departureTime: '10:00',
      returnTime: '14:00',
      ticketType: 'BUS_BOAT'
    },
    {
      origin: 'Buenaventura',
      destination: 'Cali',
      departureDate: new Date('2023-05-18'),
      passengers: 1,
      passengerData: [
        {
          fullName: 'Patricia Gómez',
          documentType: 'CC',
          documentNumber: '99887766',
          email: 'patricia@example.com',
          phone: '+57 312 123 4567'
        }
      ],
      totalPrice: 42500,
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      customerName: 'Patricia Gómez',
      customerEmail: 'patricia@example.com',
      customerPhone: '+57 312 123 4567',
      departureTime: '16:00',
      ticketType: 'BUS'
    },
    {
      origin: 'Buenaventura',
      destination: 'Juanchaco',
      departureDate: new Date('2023-05-21'),
      passengers: 2,
      passengerData: [
        {
          fullName: 'Roberto Fernández',
          documentType: 'CC',
          documentNumber: '11335577',
          email: 'roberto@example.com',
          phone: '+57 313 456 7890'
        },
        {
          fullName: 'Sofía Torres',
          documentType: 'CC',
          documentNumber: '22446688',
          email: 'sofia@example.com',
          phone: '+57 313 987 6543'
        }
      ],
      totalPrice: 280000,
      status: 'REJECTED',
      paymentStatus: 'CANCELLED',
      customerName: 'Roberto Fernández',
      customerEmail: 'roberto@example.com',
      customerPhone: '+57 313 456 7890',
      departureTime: '09:00',
      ticketType: 'BOAT'
    }
  ];

  for (const request of requests) {
    const createdRequest = await prisma.request.create({
      data: request,
    });
    console.log(`Solicitud de ${request.origin} a ${request.destination} creada correctamente`);

    // Crear notas para la solicitud
    if (request.status === 'APPROVED') {
      await prisma.requestNote.create({
        data: {
          requestId: createdRequest.id,
          content: 'Solicitud aprobada y confirmada.',
          createdBy: 'Admin'
        }
      });
      
      await prisma.requestNote.create({
        data: {
          requestId: createdRequest.id,
          content: 'Pago recibido correctamente.',
          createdBy: 'Sistema'
        }
      });
    } else if (request.status === 'COMPLETED') {
      await prisma.requestNote.create({
        data: {
          requestId: createdRequest.id,
          content: 'Solicitud aprobada y confirmada.',
          createdBy: 'Admin'
        }
      });
      
      await prisma.requestNote.create({
        data: {
          requestId: createdRequest.id,
          content: 'Pago recibido correctamente.',
          createdBy: 'Sistema'
        }
      });
      
      await prisma.requestNote.create({
        data: {
          requestId: createdRequest.id,
          content: 'Viaje completado exitosamente.',
          createdBy: 'Admin'
        }
      });
    } else if (request.status === 'REJECTED') {
      await prisma.requestNote.create({
        data: {
          requestId: createdRequest.id,
          content: 'Solicitud rechazada por falta de disponibilidad.',
          createdBy: 'Admin'
        }
      });
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