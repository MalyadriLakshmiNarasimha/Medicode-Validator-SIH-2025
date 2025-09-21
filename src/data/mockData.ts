import { faker } from '@faker-js/faker';
import { Patient, Diagnosis, Treatment, ValidationStatus } from '../types';

// Mock ICD-11 and NAMASTE codes
export const icd11Codes = [
  { code: '1A00', description: 'Cholera' },
  { code: '1A01', description: 'Cholera due to Vibrio cholerae 01' },
  { code: '1A02', description: 'Cholera due to Vibrio cholerae 0139' },
  { code: '8A00', description: 'Multiple congenital anomalies' },
  { code: '9A00', description: 'Congenital malformations of nervous system' },
  { code: 'BA00', description: 'Diseases of the nervous system' },
  { code: 'CA00', description: 'Diseases of the visual system' },
  { code: 'DA00', description: 'Diseases of the ear or mastoid process' }
];

export const namasteCodes = [
  { code: 'NAM001', description: 'Ayurvedic Panchakosha therapy' },
  { code: 'NAM002', description: 'Yoga therapy for stress management' },
  { code: 'NAM003', description: 'Unani blood purification treatment' },
  { code: 'NAM004', description: 'Siddha metabolic balance therapy' },
  { code: 'NAM005', description: 'Homeopathic constitutional treatment' },
  { code: 'NAM006', description: 'Traditional massage therapy' },
  { code: 'NAM007', description: 'Herbal medicine prescription' },
  { code: 'NAM008', description: 'Meditation and mindfulness therapy' }
];

const generateMockDiagnosis = (): Diagnosis => {
  const codeSystem = faker.helpers.arrayElement(['ICD-11', 'NAMASTE'] as const);
  const codes = codeSystem === 'ICD-11' ? icd11Codes : namasteCodes;
  const selectedCode = faker.helpers.arrayElement(codes);
  
  return {
    id: faker.string.uuid(),
    code: selectedCode.code,
    description: selectedCode.description,
    codeSystem,
    status: faker.helpers.arrayElement(['approved', 'rejected', 'pending'] as ValidationStatus[]),
    validationDate: faker.date.recent().toISOString(),
    validatedBy: faker.person.fullName(),
    suggestions: faker.datatype.boolean(0.3) ? [
      faker.helpers.arrayElement(codes).code,
      faker.helpers.arrayElement(codes).code
    ] : undefined
  };
};

const generateMockTreatment = (): Treatment => {
  const codeSystem = faker.helpers.arrayElement(['ICD-11', 'NAMASTE'] as const);
  const codes = codeSystem === 'ICD-11' ? icd11Codes : namasteCodes;
  const selectedCode = faker.helpers.arrayElement(codes);
  
  return {
    id: faker.string.uuid(),
    code: selectedCode.code,
    description: selectedCode.description,
    codeSystem,
    status: faker.helpers.arrayElement(['approved', 'rejected', 'pending'] as ValidationStatus[]),
    validationDate: faker.date.recent().toISOString(),
    validatedBy: faker.person.fullName(),
    suggestions: faker.datatype.boolean(0.2) ? [
      faker.helpers.arrayElement(codes).code,
      faker.helpers.arrayElement(codes).code
    ] : undefined
  };
};

export const generateMockPatients = (count: number = 50): Patient[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    age: faker.number.int({ min: 1, max: 90 }),
    gender: faker.helpers.arrayElement(['male', 'female', 'other'] as const),
    patientId: `P${faker.number.int({ min: 1000, max: 9999 })}`,
    lastVisit: faker.date.recent({ days: 180 }).toISOString(),
    diagnoses: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, generateMockDiagnosis),
    treatments: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, generateMockTreatment)
  }));
};

export const mockPatients = generateMockPatients();
