export interface User {
  id: string;
  email: string;
  name: string;
  role: 'doctor' | 'admin' | 'medical_coder' | 'auditor';
  avatar?: string;
}

export type ValidationStatus = 'pending' | 'approved' | 'rejected';

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
  status: ValidationStatus;
  validationDate: string;
  validatedBy: string;
  suggestions?: string[];
}

export interface Treatment {
  id: string;
  code: string;
  description: string;
  codeSystem: 'ICD-11' | 'NAMASTE';
  status: ValidationStatus;
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
