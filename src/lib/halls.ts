import { prisma } from '@/lib/db';

export type HallOption = {
  name: string;
  style: string;
  group: string;
  neighborhood: string;
  notes: string;
};

export const DEFAULT_HALLS: HallOption[] = [
  { name: 'Brittany Hall', style: 'Traditional', group: 'First-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Founders Hall', style: 'Traditional', group: 'First-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Lipton Hall', style: 'Traditional', group: 'First-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Othmer Hall', style: 'Traditional', group: 'All Undergraduates', neighborhood: 'Brooklyn', notes: '' },
  { name: 'Palladium Hall', style: 'Traditional', group: 'First-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Rubin Hall', style: 'Traditional', group: 'First-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Weinstein Hall', style: 'Traditional', group: 'First-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Alumni Hall', style: 'Apartment', group: 'Upper-Year & Grad', neighborhood: 'Manhattan', notes: '' },
  { name: 'Broome Street Residential College', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Carlyle Court', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'St George Clark Hall', style: 'Apartment', group: 'All Undergraduates', neighborhood: 'Brooklyn', notes: '' },
  { name: 'Coral Tower', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Gramercy Green', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Greenwich Hotel', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Lafayette Hall', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Second Street', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Green House at 7th Street', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: '6th Street', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Third Avenue North', style: 'Apartment', group: 'All Undergraduates', neighborhood: 'Manhattan', notes: '' },
  { name: 'University Hall', style: 'Apartment', group: 'First-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'WSV & Stuy Town', style: 'Grad', group: 'Graduate Students', neighborhood: 'Manhattan', notes: '' },
];

export async function getHalls() {
  const halls = await prisma.hall.findMany({ orderBy: { name: 'asc' } });
  return halls.length ? halls : DEFAULT_HALLS;
}