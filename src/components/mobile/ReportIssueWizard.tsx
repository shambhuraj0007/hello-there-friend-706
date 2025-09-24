import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MobileHeader } from './MobileHeader';
import { Camera, MapPin, FileText, CheckCircle, ArrowLeft, ArrowRight, Star, Clock, User, AlertCircle } from 'lucide-react';
import { useCapacitor } from '@/hooks/useCapacitor';
import { toast } from '@/components/ui/use-toast';
import LocationPicker from '@/contexts/LocationPicker';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReportIssueWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const ReportIssueWizard = ({ onComplete, onCancel }: ReportIssueWizardProps) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [reportData, setReportData] = useState({
    image: '',
    location: '',
    coordinates: { lat: 0, lng: 0 },
    title: '',
    description: '',
    category: '',
  });
  const { takePicture, getCurrentPosition, hapticFeedback } = useCapacitor();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  // Translated categories with icons
  const categories = [
    { name: t('roadsInfrastructure'), icon: '🛣️', color: 'bg-red-100 text-red-800 border-red-200' },
    { name: t('streetLighting'), icon: '💡', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { name: t('sanitationWaste'), icon: '🗑️', color: 'bg-green-100 text-green-800 border-green-200' },
    { name: t('waterSupply'), icon: '💧', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { name: t('trafficTransportation'), icon: '🚦', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { name: t('publicSafety'), icon: '🛡️', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { name: t('parksRecreation'), icon: '🌳', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { name: t('other'), icon: '📝', color: 'bg-gray-100 text-gray-800 border-gray-200' }
  ];

  // Translated step titles
  const stepTitles = [
    t('captureEvidence'),
    t('setLocation'), 
    t('issueDetails'),
    t('reviewAndSubmit')
  ];

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      hapticFeedback();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      hapticFeedback();
    }
  };

  const handleImageCapture = async () => {
    const imageUri = await takePicture();
    if (imageUri) {
      setReportData({ ...reportData, image: imageUri });
      nextStep();
    }
  };

  const handleLocationCapture = async () => {
    const position = await getCurrentPosition();
    if (position) {
      setReportData({
        ...reportData,
        coordinates: { lat: position.latitude, lng: position.longitude },
        location: `${position.latitude.toFixed(6)}, ${position.longitude.toFixed(6)}`
      });
      nextStep();
    }
  };

  const handleSubmit = async () => {
    await hapticFeedback();
    try {
      console.log('Submitting report:', reportData);

      toast({
        title: t('reportSubmitted'),
        description: t('reportSubmittedDescription'),
        duration: 5000,
      });

      setTimeout(() => onComplete(), 2000);
    } catch (error) {
      toast({
        title: t('submissionFailed'),
        description: t('tryAgainLater'),
        variant: 'destructive',
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex-1 flex flex-col animate-fadeIn">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary/10 via-blue-50 to-accent/5 p-8 text-center rounded-b-3xl shadow-sm">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Camera className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('documentIssue')}</h2>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
                {t('captureImageDescription')}
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 space-y-6">
              {reportData.image && (
                <Card className="overflow-hidden shadow-md border-0">
                  <img 
                    src={reportData.image} 
                    alt="Captured issue" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 bg-green-50 border-t border-green-100">
                    <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                      <CheckCircle className="h-4 w-4" />
                      {t('photoSuccessful')}
                    </div>
                  </div>
                </Card>
              )}

              {/* Instructions */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  {t('photoGuidelines')}
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>{t('ensureGoodLighting')}</li>
                  <li>{t('includeSurrounding')}</li>
                  <li>{t('avoidBlurryShots')}</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 space-y-3 bg-gray-50">
              <Button 
                onClick={handleImageCapture} 
                className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                size="lg"
              >
                <Camera className="mr-2 h-5 w-5" />
                {reportData.image ? t('retakePhoto') : t('capturePhoto')}
              </Button>
              {reportData.image && (
                <Button 
                  onClick={nextStep} 
                  className="w-full h-12" 
                  variant="outline"
                  size="lg"
                >
                  {t('useThisPhoto')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex-1 flex flex-col animate-fadeIn">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-accent/10 via-green-50 to-blue-50 p-8 text-center rounded-b-3xl shadow-sm">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                <MapPin className="h-10 w-10 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('pinpointLocation')}</h2>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
                {t('locationDescription')}
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700 mb-2 block">
                    {t('locationAddress')}
                  </Label>
                  <Input
                    id="location"
                    placeholder={t('enterLocationPlaceholder')}
                    value={reportData.location}
                    onChange={(e) => setReportData({ ...reportData, location: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>

                <Button 
                  onClick={handleLocationCapture} 
                  className="w-full h-12" 
                  variant="outline"
                  size="lg"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {t('useCurrentGPS')}
                </Button>

                {/* Map Component */}
                <Card className="overflow-hidden shadow-md border-0">
                  <LocationPicker reportData={reportData} setReportData={setReportData} />
                </Card>
              </div>

              {/* Location Status */}
              {reportData.location && (
                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                  <div className="flex items-center gap-2 text-green-700 text-sm font-medium mb-1">
                    <CheckCircle className="h-4 w-4" />
                    {t('locationSet')}
                  </div>
                  <p className="text-green-600 text-sm">{reportData.location}</p>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="p-6 bg-gray-50">
              <Button
                onClick={nextStep}
                className="w-full h-12 text-base font-semibold shadow-md"
                disabled={!reportData.location}
                size="lg"
              >
                {t('continueToDetails')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex-1 flex flex-col animate-fadeIn">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-warning/10 via-orange-50 to-yellow-50 p-8 text-center rounded-b-3xl shadow-sm">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                <FileText className="h-10 w-10 text-warning" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('describeIssue')}</h2>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
                {t('detailsDescription')}
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 space-y-6">
              <div className="space-y-5">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
                    {t('issueTitleRequired')}
                  </Label>
                  <Input
                    id="title"
                    placeholder={t('briefTitle')}
                    value={reportData.title}
                    onChange={(e) => setReportData({ ...reportData, title: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-3 block">
                    {t('issueCategoryRequired')}
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => setReportData({ ...reportData, category: cat.name })}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium text-left ${
                          reportData.category === cat.name
                            ? 'border-primary bg-primary/5 text-primary scale-105'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{cat.icon}</span>
                          <span className="text-xs leading-tight">{cat.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                    {t('detailedDescriptionRequired')}
                  </Label>
                  <Textarea
                    id="description"
                    placeholder={t('descriptionPlaceholder')}
                    rows={4}
                    value={reportData.description}
                    onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                    className="text-base resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {reportData.description.length}/500 {t('charactersCount')}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="p-6 bg-gray-50">
              <Button 
                onClick={nextStep} 
                className="w-full h-12 text-base font-semibold shadow-md" 
                disabled={!reportData.title || !reportData.category || !reportData.description}
                size="lg"
              >
                {t('reviewReport')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex-1 flex flex-col animate-fadeIn">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-green-100 via-emerald-50 to-teal-50 p-8 text-center rounded-b-3xl shadow-sm">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('finalReview')}</h2>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
                {t('reviewDescription')}
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 space-y-6">
              <Card className="shadow-lg border-0 overflow-hidden">
                {reportData.image && (
                  <div className="relative">
                    <img 
                      src={reportData.image} 
                      alt="Issue" 
                      className="w-full h-40 object-cover"
                    />
                    <Badge className="absolute top-3 left-3 bg-white/90 text-gray-700">
                      {t('photoEvidence')}
                    </Badge>
                  </div>
                )}
                
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{reportData.title}</h4>
                          <Badge variant="secondary" className="mb-2">
                            {reportData.category}
                          </Badge>
                          <p className="text-sm text-gray-600 leading-relaxed">{reportData.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1">{t('location')}</h4>
                          <p className="text-sm text-blue-700">{reportData.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Submission Info */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-1">{t('whatHappensNext')}</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>{t('reviewWithin24Hours')}</li>
                      <li>{t('authoritiesNotified')}</li>
                      <li>{t('receiveUpdates')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="p-6 bg-gray-50">
              <Button 
                onClick={handleSubmit} 
                className="w-full h-12 text-base font-semibold shadow-lg bg-green-600 hover:bg-green-700" 
                size="lg"
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                {t('submitCivicReport')}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Enhanced Header */}
      <MobileHeader 
        title={stepTitles[currentStep - 1]}
        subtitle={`${t('step')} ${currentStep} ${t('of')} ${totalSteps}`}
        showBack={true}
        onBack={currentStep === 1 ? onCancel : prevStep}
      />
      
      {/* Enhanced Progress Bar */}
      <div className="px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600">{t('progress')}</span>
          <span className="text-xs font-medium text-primary">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        
        {/* Step Indicators */}
        <div className="flex justify-between mt-3">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                i + 1 < currentStep
                  ? 'bg-green-500 text-white'
                  : i + 1 === currentStep
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i + 1 < currentStep ? '✓' : i + 1}
            </div>
          ))}
        </div>
      </div>

      {renderStep()}
    </div>
  );
};

// Add CSS for fade-in animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;
document.head.appendChild(style);
