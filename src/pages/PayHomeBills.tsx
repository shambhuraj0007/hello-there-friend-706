import React, { useState } from 'react';
import { MobileHeader } from '@/components/mobile/MobileHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { Home, CreditCard, Receipt, Calendar, Zap, Fuel, Wifi, Phone } from 'lucide-react';

interface HomeBill {
  id: string;
  billType: 'electricity' | 'gas' | 'internet' | 'phone';
  accountNumber: string;
  consumerName: string;
  billAmount: number;
  dueDate: string;
  billMonth: string;
  status: 'pending' | 'paid';
  provider: string;
}

const mockHomeBills: HomeBill[] = [
  {
    id: '1',
    billType: 'electricity',
    accountNumber: 'ELE001234567',
    consumerName: 'राज पटेल',
    billAmount: 2450,
    dueDate: '2024-02-18',
    billMonth: 'January 2024',
    status: 'pending',
    provider: 'Maharashtra State Electricity Board'
  },
  {
    id: '2',
    billType: 'gas',
    accountNumber: 'GAS987654321',
    consumerName: 'राज पटेल',
    billAmount: 800,
    dueDate: '2024-02-25',
    billMonth: 'January 2024',
    status: 'pending',
    provider: 'Bharat Gas'
  },
  {
    id: '3',
    billType: 'internet',
    accountNumber: 'INT555666777',
    consumerName: 'राज पटेल',
    billAmount: 999,
    dueDate: '2024-02-20',
    billMonth: 'February 2024',
    status: 'paid',
    provider: 'JioFiber'
  }
];

const billTypeConfig = {
  electricity: {
    icon: Zap,
    color: 'text-yellow-500',
    bgColor: 'from-yellow-50 to-amber-50',
    borderColor: 'border-yellow-200'
  },
  gas: {
    icon: Fuel,
    color: 'text-orange-500',
    bgColor: 'from-orange-50 to-red-50',
    borderColor: 'border-orange-200'
  },
  internet: {
    icon: Wifi,
    color: 'text-blue-500',
    bgColor: 'from-blue-50 to-cyan-50',
    borderColor: 'border-blue-200'
  },
  phone: {
    icon: Phone,
    color: 'text-green-500',
    bgColor: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-200'
  }
};

export const PayHomeBills = () => {
  const { t } = useLanguage();
  const [selectedBillType, setSelectedBillType] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBill, setSelectedBill] = useState<HomeBill | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearchBill = () => {
    if (!selectedBillType || !accountNumber.trim()) {
      toast({
        title: t('error'),
        description: t('selectBillTypeAndNumber'),
        variant: 'destructive',
      });
      return;
    }

    // Mock search - in real app this would be an API call
    const foundBill = mockHomeBills.find(
      bill => bill.billType === selectedBillType && bill.accountNumber === accountNumber
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
        description: t('invalidAccountNumber'),
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
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: t('paymentSuccessful'),
        description: t('homeBillPaid'),
      });
      
      // Reset form
      setSelectedBill(null);
      setAccountNumber('');
      setSelectedBillType('');
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

  const getBillTypeIcon = (billType: HomeBill['billType']) => {
    const IconComponent = billTypeConfig[billType].icon;
    return <IconComponent className={`h-5 w-5 ${billTypeConfig[billType].color}`} />;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader 
        title={t('payHomeBills')}
        showBack={true}
      />
      
      {/* Header Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 m-4 rounded-xl border border-green-100">
        <div className="flex items-center mb-4">
          <Home className="h-8 w-8 text-green-500 mr-3" />
          <div>
            <h2 className="text-xl font-bold text-green-900">
              {t('homeBillPayment')}
            </h2>
            <p className="text-green-700 text-sm">
              {t('payHomeBillDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* Bill Type Selection */}
      <div className="px-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Receipt className="h-5 w-5 mr-2 text-primary" />
              {t('selectBillType')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="billType">{t('billType')} *</Label>
              <Select onValueChange={setSelectedBillType}>
                <SelectTrigger>
                  <SelectValue placeholder={t('chooseBillType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electricity">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span>{t('electricityBill')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="gas">
                    <div className="flex items-center space-x-2">
                      <Fuel className="h-4 w-4 text-orange-500" />
                      <span>{t('gasBill')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="internet">
                    <div className="flex items-center space-x-2">
                      <Wifi className="h-4 w-4 text-blue-500" />
                      <span>{t('internetBill')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="phone">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-green-500" />
                      <span>{t('phoneBill')}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="accountNumber">{t('accountNumber')} *</Label>
              <Input
                id="accountNumber"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder={t('enterAccountNumber')}
              />
            </div>
            
            <Button onClick={handleSearchBill} className="w-full">
              {t('searchBill')}
            </Button>
          </CardContent>
        </Card>

        {/* Bill Details */}
        {selectedBill && (
          <Card className={`${billTypeConfig[selectedBill.billType].borderColor}`}>
            <CardHeader className={`bg-gradient-to-r ${billTypeConfig[selectedBill.billType].bgColor}`}>
              <CardTitle className="text-lg flex items-center">
                {getBillTypeIcon(selectedBill.billType)}
                <span className="ml-2">{t('billDetails')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-2">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{t('accountNumber')}:</span>
                  <span className="text-sm">{selectedBill.accountNumber}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{t('provider')}:</span>
                  <span className="text-sm">{selectedBill.provider}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{t('consumerName')}:</span>
                  <span className="text-sm">{selectedBill.consumerName}</span>
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

        {/* Quick Bill Types */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          {Object.entries(billTypeConfig).map(([type, config]) => {
            const IconComponent = config.icon;
            return (
              <Card 
                key={type}
                className={`cursor-pointer hover:shadow-md transition-shadow ${config.borderColor}`}
                onClick={() => setSelectedBillType(type)}
              >
                <CardContent className={`p-4 bg-gradient-to-r ${config.bgColor}`}>
                  <div className="flex flex-col items-center text-center">
                    <IconComponent className={`h-8 w-8 ${config.color} mb-2`} />
                    <span className="text-sm font-medium">
                      {t(`${type}Bill`)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};