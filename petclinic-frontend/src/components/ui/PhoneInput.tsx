import React, { useState, useEffect } from 'react';

interface CountryConfig {
  code: string;
  name: string;
  length: number;
  placeholder: string;
}

const COUNTRY_CONFIGS: CountryConfig[] = [
  { code: '+852', name: 'Hong Kong', length: 8, placeholder: 'XXXX-XXXX' },
  { code: '+86', name: 'Mainland China', length: 11, placeholder: '1XX-XXXX-XXXX' },
  { code: '+1', name: 'USA', length: 10, placeholder: 'XXX-XXX-XXXX' },
  { code: '+44', name: 'UK', length: 10, placeholder: 'XXXXXXXXXX' },
  { code: '+65', name: 'Singapore', length: 8, placeholder: 'XXXXXXXX' },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onValidationChange?: (isValid: boolean) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, error, onValidationChange }) => {
  const [countryCode, setCountryCode] = useState('+852');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    // Parse existing value if provided
    if (value && !phoneNumber) {
      const config = COUNTRY_CONFIGS.find(c => value.startsWith(c.code));
      if (config) {
        setCountryCode(config.code);
        setPhoneNumber(value.substring(config.code.length));
      }
    }
  }, [value, phoneNumber]);

  const validatePhoneNumber = (code: string, number: string) => {
    const config = COUNTRY_CONFIGS.find(c => c.code === code);
    if (!config) return false;

    const digits = number.replace(/\D/g, '');
    
    if (digits.length === 0) {
      setValidationError('');
      return true;
    }

    if (digits.length !== config.length) {
      setValidationError(`Invalid length for selected region. Expected ${config.length} digits.`);
      return false;
    }

    setValidationError('');
    return true;
  };

  const handleCountryChange = (newCode: string) => {
    setCountryCode(newCode);
    const isValid = validatePhoneNumber(newCode, phoneNumber);
    onChange(newCode + phoneNumber.replace(/\D/g, ''));
    onValidationChange?.(isValid && phoneNumber.replace(/\D/g, '').length > 0);
  };

  const handlePhoneChange = (newPhone: string) => {
    // Only allow digits and common separators
    const cleaned = newPhone.replace(/[^\d-]/g, '');
    setPhoneNumber(cleaned);
    
    const isValid = validatePhoneNumber(countryCode, cleaned);
    const digits = cleaned.replace(/\D/g, '');
    onChange(countryCode + digits);
    onValidationChange?.(isValid && digits.length > 0);
  };

  const currentConfig = COUNTRY_CONFIGS.find(c => c.code === countryCode);

  return (
    <div className="w-full">
      <div className="flex gap-2">
        <select
          value={countryCode}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="border border-slate-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
        >
          {COUNTRY_CONFIGS.map((config) => (
            <option key={config.code} value={config.code}>
              {config.code} {config.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => handlePhoneChange(e.target.value)}
          placeholder={currentConfig?.placeholder || ''}
          className="flex-1 border border-slate-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder:text-slate-400"
        />
      </div>
      {(validationError || error) && (
        <div className="text-red-500 text-sm mt-1">{validationError || error}</div>
      )}
    </div>
  );
};

export default PhoneInput;
