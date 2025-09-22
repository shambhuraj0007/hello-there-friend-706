import React, { useState } from 'react';
import { MobileHeader } from '@/components/mobile/MobileHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { Droplets, CreditCard, Receipt, Calendar, MapPin, Phone } from 'lucide-react';

interface WaterBill {
  id: string;
  consumerNumber: string;
  consumerName: string;
  address: string;
  billAmount: number;
  dueDate: string;
  billMonth: string;
  status: 'pending' | 'paid';
}

const mockWaterBills: WaterBill[] = [
  {
    id: '1',
    consumerNumber: 'WB001234567',
    consumerName: 'राज पटेल',
    address: 'फ्लैट 101, सनशाइन अपार्टमेंट, पुणे',
    billAmount: 1250,
    dueDate: '2024-02-15',
    billMonth: 'January 2024',
    status: 'pending'
  },
  {
    id: '2', 
    consumerNumber: 'WB001234568',
    consumerName: 'सुनीता शर्मा',
    address: 'घर संख्या 45, मार्केट रोड, मुंबई',
    billAmount: 890,
    dueDate: '2024-02-20',
    billMonth: 'January 2024',
    status: 'paid'
  }
];

export const PayWaterBills = () => {
  const { t } = useLanguage();
  const [searchConsumerNumber, setSearchConsumerNumber] = useState('');
  const [selectedBill, setSelectedBill] = useState<WaterBill | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearchBill = () => {
    if (!searchConsumerNumber.trim()) {
      toast({
        title: t('error'),
        description: t('pleaseEnterConsumerNumber'),
        variant: 'destructive',
      });
      return;
    }

    // Mock search - in real app this would be an API call
    const foundBill = mockWaterBills.find(
      bill => bill.consumerNumber === searchConsumerNumber
    );

    if (foundBill) {
      setSelectedBill(foundBill);
      toast({
        title: t('billFound'),
        description: t('billFoundMessage'),
      });
    } else {
      toast({
        title: t('billNotFound'),
        description: t('invalidConsumerNumber'),
        variant: 'destructive',
      });
    }
  };

  const handlePayBill = async () => {
    if (!selectedBill || !paymentMethod) {
      toast({
        title: t('error'),
        description: t('selectPaymentMethod'),
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: t('paymentSuccessful'),
        description: t('waterBillPaid'),
      });
      
      // Reset form
      setSelectedBill(null);
      setSearchConsumerNumber('');
      setPaymentMethod('');
    } catch (error) {
      toast({
        title: t('paymentFailed'),
        description: t('tryAgainLater'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader 
        title={t('payWaterBills')}
        showBack={true}
      />
      
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 m-4 rounded-xl border border-blue-100">
        <div className="flex items-center mb-4">
          <Droplets className="h-8 w-8 text-blue-500 mr-3" />
          <div>
            <h2 className="text-xl font-bold text-blue-900">
              {t('waterBillPayment')}
            </h2>
            <p className="text-blue-700 text-sm">
              {t('payWaterBillDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="px-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Receipt className="h-5 w-5 mr-2 text-primary" />
              {t('findYourBill')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="consumerNumber">{t('consumerNumber')} *</Label>
              <Input
                id="consumerNumber"
                value={searchConsumerNumber}
                onChange={(e) => setSearchConsumerNumber(e.target.value)}
                placeholder={t('enterConsumerNumber')}
              />
            </div>
            <Button onClick={handleSearchBill} className="w-full">
              {t('searchBill')}
            </Button>
          </CardContent>
        </Card>

        {/* Bill Details */}
        {selectedBill && (
          <Card className="border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="text-lg text-blue-900">
                {t('billDetails')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-2">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{t('consumerNumber')}:</span>
                  <span className="text-sm">{selectedBill.consumerNumber}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{t('consumerName')}:</span>
                  <span className="text-sm">{selectedBill.consumerName}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{t('address')}:</span>
                  <span className="text-sm">{selectedBill.address}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{t('billMonth')}:</span>
                  <span className="text-sm">{selectedBill.billMonth}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">{t('dueDate')}:</span>
                  <span className="text-sm text-red-600">{selectedBill.dueDate}</span>
                </div>
              </div>

              {/* Amount Section */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-green-800">
                    {t('totalAmount')}
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{selectedBill.billAmount}
                  </span>
                </div>
              </div>

              {/* Payment Method Selection */}
              {selectedBill.status === 'pending' && (
                <>
                  <div>
                    <Label htmlFor="paymentMethod">{t('selectPaymentMethod')} *</Label>
                    <Select onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('choosePaymentMethod')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="debit_card">{t('debitCard')}</SelectItem>
                        <SelectItem value="credit_card">{t('creditCard')}</SelectItem>
                        <SelectItem value="net_banking">{t('netBanking')}</SelectItem>
                        <SelectItem value="wallet">{t('wallet')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handlePayBill}
                    className="w-full"
                    disabled={loading || !paymentMethod}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {loading ? t('processing') : `${t('payNow')} ₹${selectedBill.billAmount}`}
                  </Button>
                </>
              )}

              {selectedBill.status === 'paid' && (
                <div className="bg-green-100 p-4 rounded-lg text-center">
                  <p className="text-green-800 font-semibold">
                    ✅ {t('billAlreadyPaid')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Help */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <Phone className="h-4 w-4 text-amber-600 mr-2" />
              <span className="font-semibold text-amber-800">
                {t('needHelp')}
              </span>
            </div>
            <p className="text-sm text-amber-700">
              {t('waterBillHelpText')}
            </p>
            <p className="text-sm text-amber-700 mt-1">
              {t('helpline')}: 1800-XXX-XXXX
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};