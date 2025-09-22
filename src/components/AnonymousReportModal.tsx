import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, MapPin, Camera, Send, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { useCapacitor } from '@/hooks/useCapacitor';

interface AnonymousReportModalProps {
  onClose: () => void;
}

export const AnonymousReportModal: React.FC<AnonymousReportModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const { takePicture, getCurrentPosition } = useCapacitor();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isCapturingLocation, setIsCapturingLocation] = useState(false);

  const categories = [
    'Roads',
    'Lighting',
    'Sanitation',
    'Water Supply',
    'Public Safety',
    'Traffic',
    'Noise Pollution',
    'Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call for anonymous report
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Report Submitted",
        description: "Your anonymous report has been submitted successfully. We'll investigate this issue.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTakePhoto = async () => {
    try {
      const photoResult = await takePicture();
      
      if (photoResult) {
        setCapturedImages(prev => [...prev, photoResult]);
        toast({
          title: t('photoCapture'),
          description: t('photoCaptured'),
        });
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedTakePhoto'),
        variant: 'destructive',
      });
    }
  };

  const handleGetLocation = async () => {
    setIsCapturingLocation(true);
    try {
      const position = await getCurrentPosition();
      if (position) {
        // In a real app, you'd use reverse geocoding to get the address
        const locationText = `${position.latitude.toFixed(6)}, ${position.longitude.toFixed(6)}`;
        setFormData(prev => ({ ...prev, location: locationText }));
        toast({
          title: t('locationCapture'),
          description: t('locationCaptured'),
        });
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedGetLocation'),
        variant: 'destructive',
      });
    } finally {
      setIsCapturingLocation(false);
    }
  };

  const removeImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            {t('anonymousReport')}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {t('anonymousDescription')}
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="title">Issue Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Brief description of the issue..."
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select onValueChange={(value) => handleInputChange('category', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select issue category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">Location *</Label>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter location or address..."
                  className="pl-10"
                  required
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGetLocation}
                disabled={isCapturingLocation}
                className="w-full"
              >
                <MapPin className="mr-2 h-4 w-4" />
                {isCapturingLocation ? t('gettingLocation') : t('getCurrentLocation')}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Provide detailed description of the issue..."
              rows={4}
              required
            />
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <div className="flex items-center">
                <Camera className="mr-2 h-4 w-4" />
                {t('photoUpload')} ({t('optional')})
              </div>
              <span className="text-xs">{capturedImages.length}/5</span>
            </div>
            
            {capturedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {capturedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={image} 
                      alt={`Captured ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={handleTakePhoto}
              disabled={capturedImages.length >= 5}
              className="w-full"
            >
              <Camera className="mr-2 h-4 w-4" />
              {capturedImages.length >= 5 ? t('maxPhotosReached') : t('takePhoto')}
            </Button>
            
            {capturedImages.length < 5 && (
              <p className="text-xs text-muted-foreground mt-1">
                {t('photoHelpText')}
              </p>
            )}
          </div>

          <div className="bg-accent/10 p-4 rounded-lg">
            <p className="text-sm text-accent-foreground">
              🔒 <strong>Privacy Notice:</strong> This report will be submitted without storing any personal information or user credentials.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.category || !formData.location || !formData.description}
              className="flex-1"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {t('submitAnonymously')}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};