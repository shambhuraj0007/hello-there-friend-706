import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, MapPin, Award, ChevronRight } from 'lucide-react';

const onboardingSteps = [
  {
    icon: Camera,
    title: 'Report Issues',
    description: 'Capture photos of civic problems like potholes, broken streetlights, or garbage dumps in your neighborhood.',
    color: 'text-primary'
  },
  {
    icon: MapPin,
    title: 'Track Progress',
    description: 'Monitor the status of your reports and see when local authorities take action to resolve issues.',
    color: 'text-accent'
  },
  {
    icon: Award,
    title: 'Earn Rewards',
    description: 'Get credits for resolved issues that can be redeemed for utility bill payments and other benefits.',
    color: 'text-warning'
  }
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  const step = onboardingSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <div className="text-xl font-bold text-primary">समाधान</div>
        <Button variant="ghost" onClick={skipOnboarding}>
          Skip
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="text-center mb-8">
          <div className={`w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center`}>
            <Icon className={`h-12 w-12 ${step.color}`} />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {step.title}
          </h2>
          
          <p className="text-muted-foreground text-lg leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6">
        <Button 
          onClick={nextStep}
          className="w-full text-lg h-12"
          size="lg"
        >
          {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};