export interface User {
  id: string;
  email: string;
  name: string;
  role: 'doctor' | 'admin' | 'medical_coder' | 'auditor';
  avatar?: string;
}

<<<<<<< HEAD
export type ValidationStatus = 'pending' | 'approved' | 'rejected';

=======
>>>>>>> 381f102573c856ffde4565c56d7a5cd1167e0c48
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  patientId: string;
  lastVisit: string;
  diagnoses: Diagnosis[];
  treatments: Treatment[];
}

export interface Diagnosis {
  id: string;
  code: string;
  description: string;
  codeSystem: 'ICD-11' | 'NAMASTE';
<<<<<<< HEAD
  status: ValidationStatus;
=======
  isValid: boolean;
>>>>>>> 381f102573c856ffde4565c56d7a5cd1167e0c48
  validationDate: string;
  validatedBy: string;
  suggestions?: string[];
}

export interface Treatment {
  id: string;
  code: string;
  description: string;
  codeSystem: 'ICD-11' | 'NAMASTE';
<<<<<<< HEAD
  status: ValidationStatus;
=======
  isValid: boolean;
>>>>>>> 381f102573c856ffde4565c56d7a5cd1167e0c48
  validationDate: string;
  validatedBy: string;
  suggestions?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  suggestions: string[];
  alternativeCodes: string[];
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
