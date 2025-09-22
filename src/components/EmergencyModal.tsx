import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, PhoneCall } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface EmergencyModalProps {
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ onClose }) => {
  const { t } = useLanguage();

  const emergencyNumbers = [
    { service: t('police'), number: '100', color: 'bg-blue-500' },
    { service: t('fire'), number: '101', color: 'bg-red-500' },
    { service: t('ambulance'), number: '102', color: 'bg-green-500' },
    { service: t('womenHelpline'), number: '1091', color: 'bg-pink-500' },
    { service: t('childHelpline'), number: '1098', color: 'bg-orange-500' },
  ];

  const handleCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-destructive">
            <Phone className="mr-2 h-5 w-5" />
            {t('emergency')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          {emergencyNumbers.map((emergency, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border border-border"
            >
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${emergency.color} mr-3`} />
                <span className="font-medium">{emergency.service}</span>
              </div>
              <Button
                size="sm"
                onClick={() => handleCall(emergency.number)}
                className="bg-primary hover:bg-primary/90"
              >
                <PhoneCall className="mr-2 h-4 w-4" />
                {emergency.number}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-destructive/10 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            🚨 Use these numbers only in genuine emergencies
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};