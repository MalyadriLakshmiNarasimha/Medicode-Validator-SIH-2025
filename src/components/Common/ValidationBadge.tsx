import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';

interface ValidationBadgeProps {
  isValid: boolean;
  codeSystem: 'ICD-11' | 'NAMASTE';
  showTooltip?: boolean;
}

const ValidationBadge: React.FC<ValidationBadgeProps> = ({ 
  isValid, 
  codeSystem, 
  showTooltip = true 
}) => {
  const getValidationIcon = () => {
    if (isValid) {
      return <CheckCircle className="h-4 w-4 text-medical-green-600" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getCodeSystemBadge = () => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    
    if (codeSystem === 'ICD-11') {
      return (
        <span className={`${baseClasses} bg-medical-blue-100 text-medical-blue-800`}>
          ICD-11
        </span>
      );
    }
    
    return (
      <span className={`${baseClasses} bg-medical-green-100 text-medical-green-800`}>
        NAMASTE
      </span>
    );
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        {getValidationIcon()}
        <span className={`text-sm font-medium ${
          isValid ? 'text-medical-green-600' : 'text-red-500'
        }`}>
          {isValid ? 'Valid' : 'Invalid'}
        </span>
      </div>
      {getCodeSystemBadge()}
      {showTooltip && (
        <div className="group relative">
          <HelpCircle className="h-4 w-4 text-gray-400" />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
            {codeSystem === 'ICD-11' 
              ? 'WHO International Classification of Diseases' 
              : 'National AYUSH Morbidity and Standardised Terminologies Electronic'
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationBadge;
