import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MobileHeader } from './MobileHeader';
import { Camera, MapPin, FileText, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCapacitor } from '@/hooks/useCapacitor';
import { toast } from '@/components/ui/use-toast';
import { useToast } from '@/components/ui/use-toast';

interface ReportIssueWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

const categories = [
  'Roads & Infrastructure',
  'Street Lighting',
  'Sanitation & Waste',
  'Water Supply',
  'Traffic & Transportation',
  'Public Safety',
  'Parks & Recreation',
  'Other'
];

export const ReportIssueWizard = ({ onComplete, onCancel }: ReportIssueWizardProps) => {
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
    // Replace with actual API call to submit report
    console.log('Submitting report:', reportData);

    // Success toast
    toast({
      title: 'Report Submitted',
      description: 'Your issue has been successfully submitted!',
      duration: 8000,
    });

    // Close wizard or reset form
    onComplete();
  } catch (error) {
    toast({
      title: 'Submission Failed',
      description: 'Something went wrong. Please try again later.',
      variant: 'destructive',
    });
  }
};
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="p-6 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <Camera className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Capture Image</h2>
            <p className="text-muted-foreground mb-8">
              Take a clear photo of the civic issue you want to report
            </p>
            {reportData.image && (
              <div className="mb-6">
                <img 
                  src={reportData.image} 
                  alt="Captured issue" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            <Button onClick={handleImageCapture} className="w-full" size="lg">
              <Camera className="mr-2 h-5 w-5" />
              {reportData.image ? 'Retake Photo' : 'Take Photo'}
            </Button>
            {reportData.image && (
              <Button onClick={nextStep} className="w-full mt-4" variant="outline">
                Use This Photo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        );

      case 2:
        return (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
                <MapPin className="h-12 w-12 text-accent" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Set Location</h2>
              <p className="text-muted-foreground">
                Confirm the location where this issue exists
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="location">Location Address</Label>
                <Input
                  id="location"
                  placeholder="Enter address or landmark"
                  value={reportData.location}
                  onChange={(e) => setReportData({ ...reportData, location: e.target.value })}
                />
              </div>

              <Button onClick={handleLocationCapture} className="w-full" variant="outline">
                <MapPin className="mr-2 h-4 w-4" />
                Use Current Location
              </Button>

              <Button 
                onClick={nextStep} 
                className="w-full" 
                disabled={!reportData.location}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto mb-6 bg-warning/10 rounded-full flex items-center justify-center">
                <FileText className="h-12 w-12 text-warning" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Issue Details</h2>
              <p className="text-muted-foreground">
                Provide details about the issue
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Issue Title</Label>
                <Input
                  id="title"
                  placeholder="Brief title for the issue"
                  value={reportData.title}
                  onChange={(e) => setReportData({ ...reportData, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  className="w-full p-2 border border-input rounded-md bg-background"
                  value={reportData.category}
                  onChange={(e) => setReportData({ ...reportData, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the issue in detail"
                  rows={4}
                  value={reportData.description}
                  onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                />
              </div>

              <Button 
                onClick={nextStep} 
                className="w-full" 
                disabled={!reportData.title || !reportData.category || !reportData.description}
              >
                Review & Submit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto mb-6 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-success" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Review & Submit</h2>
              <p className="text-muted-foreground">
                Please review your report before submitting
              </p>
            </div>

            <Card className="p-4 mb-6">
              {reportData.image && (
                <img 
                  src={reportData.image} 
                  alt="Issue" 
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Title: </span>
                  <span>{reportData.title}</span>
                </div>
                <div>
                  <span className="font-medium">Category: </span>
                  <span>{reportData.category}</span>
                </div>
                <div>
                  <span className="font-medium">Location: </span>
                  <span>{reportData.location}</span>
                </div>
                <div>
                  <span className="font-medium">Description: </span>
                  <span>{reportData.description}</span>
                </div>
              </div>
            </Card>

            <Button onClick={handleSubmit} className="w-full" size="lg">
              Submit Report
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader 
        title={`Step ${currentStep} of ${totalSteps}`}
        showBack={true}
        onBack={currentStep === 1 ? onCancel : prevStep}
      />
      
      <div className="p-4">
        <Progress value={progress} className="mb-6" />
      </div>

      {renderStep()}
    </div>
  );
};