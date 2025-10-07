import { useState } from 'react';

export const useFormData = () => {
  const [formData, setFormData] = useState<any>({});

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetFormData = () => {
    setFormData({});
  };

  return {
    formData,
    setFormData,
    updateFormData,
    resetFormData,
  };
};
