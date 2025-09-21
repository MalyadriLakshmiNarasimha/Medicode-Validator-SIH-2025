import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { faker } from '@faker-js/faker';
import { Patient, ValidationStatus, Diagnosis, Treatment } from '../../types';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (patient: Patient) => void;
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('other');
  
  const [codeType, setCodeType] = useState<'diagnosis' | 'treatment'>('diagnosis');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [codeSystem, setCodeSystem] = useState<'ICD-11' | 'NAMASTE'>('ICD-11');
  const [addInitialCode, setAddInitialCode] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setAge('');
    setGender('other');
    setCodeType('diagnosis');
    setCode('');
    setDescription('');
    setCodeSystem('ICD-11');
    setAddInitialCode(true);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    let diagnoses: any[] = [];
    let treatments: any[] = [];

    if (addInitialCode && code && description) {
      const newCodeEntry = {
        id: faker.string.uuid(),
        code,
        description,
        codeSystem,
        status: 'pending',
        validationDate: new Date().toISOString(),
        validatedBy: 'N/A',
      };
      if (codeType === 'diagnosis') {
        diagnoses.push(newCodeEntry);
      } else {
        treatments.push(newCodeEntry);
      }
    }

    const patientData = {
      name,
      age: parseInt(age, 10),
      gender,
      patient_id: `P${faker.number.int({ min: 10000, max: 99999 })}`,
      last_visit: new Date().toISOString(),
      // Temporarily remove nested diagnoses and treatments to isolate issue
      // diagnoses: diagnoses.map(d => ({
      //   id: d.id,
      //   code: d.code,
      //   description: d.description,
      //   codeSystem: d.codeSystem,
      //   status: d.status,
      //   validationDate: d.validationDate,
      //   validatedBy: d.validatedBy,
      // })),
      // treatments: treatments.map(t => ({
      //   id: t.id,
      //   code: t.code,
      //   description: t.description,
      //   codeSystem: t.codeSystem,
      //   status: t.status,
      //   validationDate: t.validationDate,
      //   validatedBy: t.validatedBy,
      // })),
    };

    try {
      const response = await fetch('http://localhost:8000/api/patients/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });

      if (response.ok) {
        const newPatient = await response.json();
        onAdd(newPatient);
        onClose();
        resetForm();
      } else {
        const errorData = await response.json();
        console.error('Failed to add patient:', errorData);
        setErrorMessage('Failed to add patient. Please check the input and try again.');
      }
    } catch (error) {
      console.error('Error adding patient:', error);
      setErrorMessage('An error occurred while adding the patient. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit}>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Patient</h2>
                
                {/* Patient Information */}
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500"
                        placeholder="e.g., John Doe"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500"
                        placeholder="e.g., 45"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500"
                        disabled={isSubmitting}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Initial Code Entry */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Initial Code Entry</h3>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" checked={addInitialCode} onChange={() => setAddInitialCode(!addInitialCode)} className="sr-only peer" disabled={isSubmitting} />
                      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-medical-blue-600"></div>
                      <span className="ms-3 text-sm font-medium text-gray-900">Add Code</span>
                    </label>
                  </div>
                  
                  <AnimatePresence>
                    {addInitialCode && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Code Type</label>
                            <select value={codeType} onChange={e => setCodeType(e.target.value as 'diagnosis' | 'treatment')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500" disabled={isSubmitting}>
                              <option value="diagnosis">Diagnosis</option>
                              <option value="treatment">Treatment</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Code System</label>
                            <select value={codeSystem} onChange={e => setCodeSystem(e.target.value as 'ICD-11' | 'NAMASTE')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500" disabled={isSubmitting}>
                              <option value="ICD-11">ICD-11</option>
                              <option value="NAMASTE">NAMASTE</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                            <input type="text" value={code} onChange={e => setCode(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500" placeholder="e.g., 1A01" required={addInitialCode} disabled={isSubmitting} />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500" rows={2} placeholder="e.g., Cholera due to Vibrio cholerae 01" required={addInitialCode} disabled={isSubmitting}></textarea>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {errorMessage && (
                  <div className="mt-4 text-red-600 font-medium">
                    {errorMessage}
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3 bg-gray-50 p-4 rounded-b-lg">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-medical-blue-600 text-white rounded-lg hover:bg-medical-blue-700 font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Patient'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddPatientModal;
