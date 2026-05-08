export type HallOption = {
  id?: string;
  name: string;
  style: string;
  group: string;
  neighborhood: string;
  notes: string;
};

export const DEFAULT_HALLS: HallOption[] = [
  { id: 'brittany-hall', name: 'Brittany Hall', style: 'Traditional', group: 'First-Year Students', neighborhood: 'Manhattan', notes: '' },
  { id: 'founders-hall', name: 'Founders Hall', style: 'Traditional', group: 'First-Year Students', neighborhood: 'Manhattan', notes: '' },
  { id: 'lipton-hall', name: 'Lipton Hall', style: 'Traditional', group: 'First-Year Students', neighborhood: 'Manhattan', notes: '' },
  { id: 'othmer-hall', name: 'Othmer Hall', style: 'Traditional', group: 'All Undergraduates', neighborhood: 'Brooklyn', notes: '' },
  { id: 'palladium-hall', name: 'Palladium Hall', style: 'Traditional', group: 'First-Year Students', neighborhood: 'Manhattan', notes: '' },
  { id: 'rubin-hall', name: 'Rubin Hall', style: 'Traditional', group: 'First-Year Students', neighborhood: 'Manhattan', notes: '' },
  { id: 'weinstein-hall', name: 'Weinstein Hall', style: 'Traditional', group: 'First-Year Students', neighborhood: 'Manhattan', notes: '' },
  { id: 'alumni-hall', name: 'Alumni Hall', style: 'Apartment', group: 'Upper-Year & Grad', neighborhood: 'Manhattan', notes: '' },
  { id: 'broome-street-residential-college', name: 'Broome Street Residential College', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { id: 'carlyle-court', name: 'Carlyle Court', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { id: 'st-george-clark-hall', name: 'St George Clark Hall', style: 'Apartment', group: 'All Undergraduates', neighborhood: 'Brooklyn', notes: '' },
  { id: 'coral-tower', name: 'Coral Tower', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { id: 'gramercy-green', name: 'Gramercy Green', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { id: 'greenwich-hotel', name: 'Greenwich Hotel', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { id: 'lafayette-hall', name: 'Lafayette Hall', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { id: 'second-street', name: 'Second Street', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { id: 'green-house-at-7th-street', name: 'Green House at 7th Street', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { id: '6th-street', name: '6th Street', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { id: 'third-avenue-north', name: 'Third Avenue North', style: 'Apartment', group: 'All Undergraduates', neighborhood: 'Manhattan', notes: '' },
  { id: 'university-hall', name: 'University Hall', style: 'Apartment', group: 'First-Year Students', neighborhood: 'Manhattan', notes: '' },
  { id: 'wsv-stuy-town', name: 'WSV & Stuy Town', style: 'Grad', group: 'Graduate Students', neighborhood: 'Manhattan', notes: '' },
];