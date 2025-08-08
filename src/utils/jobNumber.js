import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function generateJobNumber() {
  const today = new Date();
  const dateString = today.getFullYear().toString().slice(-2) + 
                    String(today.getMonth() + 1).padStart(2, '0') + 
                    String(today.getDate()).padStart(2, '0');
  
  // Find the highest job number for today
  const todayJobs = await prisma.lead.findMany({
    where: {
      jobNumber: {
        startsWith: `DD-${dateString}-`
      }
    },
    orderBy: {
      jobNumber: 'desc'
    },
    take: 1
  });

  let sequence = 1;
  if (todayJobs.length > 0) {
    const lastJobNumber = todayJobs[0].jobNumber;
    const lastSequence = parseInt(lastJobNumber.split('-')[2]);
    sequence = lastSequence + 1;
  }

  return `DD-${dateString}-${String(sequence).padStart(4, '0')}`;
}

