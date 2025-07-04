import { PrismaClient, JobStatus, ProposalStatus, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Client
  const client = await prisma.user.upsert({
    where: { clerkId: 'user_2zJeVeZRSAYuKGCZGRom6Mr7IsI' },
    update: {},
    create: {
      clerkId: 'user_2zJeVeZRSAYuKGCZGRom6Mr7IsI',
      email: 'client@example.com',
      name: 'John Client',
      role: UserRole.CLIENT,
      profilePicture: 'https://i.pravatar.cc/200?img=1',
      skills: [],
      balance: 1000,
    },
  });

  // Create Freelancer
  const freelancer = await prisma.user.upsert({
    where: { clerkId: 'user_2zOxgaY5J9U7GYocqtvmD8Y0b1L' },
    update: {},
    create: {
      clerkId: 'user_2zOxgaY5J9U7GYocqtvmD8Y0b1L',
      email: 'freelancer@example.com',
      name: 'Jane Freelancer',
      role: UserRole.FREELANCER,
      profilePicture: 'https://i.pravatar.cc/200?img=2',
      bio: 'Experienced full-stack developer.',
      skills: ['React', 'Node.js', 'GraphQL'],
      hourlyRate: 50,
      balance: 200,
    },
  });

  // Create 3 Assigned Jobs
  const assignedJobs = await Promise.all(
    ['SaaS Dashboard', 'E-commerce App', 'Landing Page'].map((title, index) =>
      prisma.job.create({
        data: {
          title,
          description: `This is the ${title} project.`,
          budget: 800 + index * 100,
          requiredSkills: ['React', 'Next.js'],
          status: JobStatus.IN_PROGRESS,
          clientId: client.id,
          assignedFreelancerId: freelancer.id,
        },
      })
    )
  );

  // Create 2 Open Jobs with proposals
  const jobsWithProposals = await Promise.all(
    ['Portfolio Website', 'Marketing Page'].map((title, index) =>
      prisma.job.create({
        data: {
          title,
          description: `Need help building a ${title}.`,
          budget: 400 + index * 100,
          requiredSkills: ['HTML', 'CSS', 'JavaScript'],
          status: JobStatus.OPEN,
          clientId: client.id,
        },
      })
    )
  );

  // Create 5 proposals (2 for open jobs, 3 for already assigned)
  await Promise.all([
    // Proposals for open jobs
    prisma.proposal.create({
      data: {
        jobId: jobsWithProposals[0].id,
        freelancerId: freelancer.id,
        coverLetter: 'I can build this in 3 days.',
        proposedPrice: 450,
        status: ProposalStatus.PENDING,
      },
    }),
    prisma.proposal.create({
      data: {
        jobId: jobsWithProposals[1].id,
        freelancerId: freelancer.id,
        coverLetter: 'Experienced in building marketing pages.',
        proposedPrice: 500,
        status: ProposalStatus.PENDING,
      },
    }),
    // Proposals for already assigned jobs
    prisma.proposal.create({
      data: {
        jobId: assignedJobs[0].id,
        freelancerId: freelancer.id,
        coverLetter: 'Excited to work on SaaS dashboards!',
        proposedPrice: 850,
        status: ProposalStatus.ACCEPTED,
      },
    }),
    prisma.proposal.create({
      data: {
        jobId: assignedJobs[1].id,
        freelancerId: freelancer.id,
        coverLetter: 'I’ve built e-commerce apps before.',
        proposedPrice: 900,
        status: ProposalStatus.ACCEPTED,
      },
    }),
    prisma.proposal.create({
      data: {
        jobId: assignedJobs[2].id,
        freelancerId: freelancer.id,
        coverLetter: 'Landing pages are my specialty.',
        proposedPrice: 700,
        status: ProposalStatus.ACCEPTED,
      },
    }),
  ]);

  console.log('✅ Mock data seeded successfully.');
}

main()
  .catch((err) => {
    console.error('❌ Error seeding database:', err);
  })
  .finally(() => prisma.$disconnect());
