import React from 'react';
import { CheckCircle, XCircle, Clock, HelpCircle } from 'lucide-react';
import { ValidationStatus } from '../../types';

interface StatusBadgeProps {
  status: ValidationStatus;
  showTooltip?: boolean;
  codeSystem?: 'ICD-11' | 'NAMASTE';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status,
  showTooltip = true,
  codeSystem
}) => {
  const statusConfig = {
    approved: {
      icon: <CheckCircle className="h-4 w-4 text-medical-green-600" />,
      text: 'Approved',
      textColor: 'text-medical-green-600',
      bgColor: 'bg-medical-green-100',
    },
    rejected: {
      icon: <XCircle className="h-4 w-4 text-red-500" />,
      text: 'Rejected',
      textColor: 'text-red-500',
      bgColor: 'bg-red-100',
    },
    pending: {
      icon: <Clock className="h-4 w-4 text-orange-500" />,
      text: 'Pending',
      textColor: 'text-orange-500',
      bgColor: 'bg-orange-100',
    },
  };

  const config = statusConfig[status];

  const getCodeSystemBadge = () => {
    if (!codeSystem) return null;
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
        {config.icon}
        <span className={`text-sm font-medium ${config.textColor}`}>
          {config.text}
        </span>
      </div>
      {getCodeSystemBadge()}
      {showTooltip && codeSystem && (
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

export default StatusBadge;
