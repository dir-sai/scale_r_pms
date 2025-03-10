import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@scale-r.com' },
    update: {},
    create: {
      email: 'admin@scale-r.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create a landlord
  const landlordPassword = await hash('landlord123', 12)
  const landlord = await prisma.user.upsert({
    where: { email: 'landlord@scale-r.com' },
    update: {},
    create: {
      email: 'landlord@scale-r.com',
      name: 'John Landlord',
      password: landlordPassword,
      role: 'LANDLORD',
    },
  })

  // Create a property
  const property = await prisma.property.create({
    data: {
      name: 'Sunset Apartments',
      address: '123 Main Street',
      city: 'Accra',
      state: 'Greater Accra',
      zipCode: '00233',
      ownerId: landlord.id,
    },
  })

  // Create units
  const units = await Promise.all([
    prisma.unit.create({
      data: {
        number: 'A1',
        type: 'Studio',
        size: 45.5,
        rent: 1000,
        propertyId: property.id,
      },
    }),
    prisma.unit.create({
      data: {
        number: 'A2',
        type: '1 Bedroom',
        size: 65.0,
        rent: 1500,
        propertyId: property.id,
      },
    }),
  ])

  // Create a tenant
  const tenantPassword = await hash('tenant123', 12)
  const tenant = await prisma.user.upsert({
    where: { email: 'tenant@scale-r.com' },
    update: {},
    create: {
      email: 'tenant@scale-r.com',
      name: 'Jane Tenant',
      password: tenantPassword,
      role: 'TENANT',
    },
  })

  // Create a tenancy
  const tenancy = await prisma.tenancy.create({
    data: {
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      rentAmount: units[0].rent,
      deposit: units[0].rent * 2,
      userId: tenant.id,
      unitId: units[0].id,
    },
  })

  // Create a payment
  await prisma.payment.create({
    data: {
      amount: units[0].rent,
      date: new Date(),
      type: 'RENT',
      method: 'BANK_TRANSFER',
      propertyId: property.id,
      unitId: units[0].id,
      userId: tenant.id,
      tenancyId: tenancy.id,
    },
  })

  // Create a maintenance request
  await prisma.maintenanceRequest.create({
    data: {
      title: 'Leaking Faucet',
      description: 'The kitchen faucet is leaking and needs repair',
      priority: 'MEDIUM',
      propertyId: property.id,
      unitId: units[0].id,
      userId: tenant.id,
    },
  })

  console.log('Database has been seeded. 🌱')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 