import React from 'react';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="bg-charcoal/90 py-4 px-12 border-b border-white/5">
      <div className="flex items-center max-w-[420px] mx-auto">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className={`flex items-center gap-2 text-xs font-medium tracking-[0.15em] uppercase ${index <= currentStep ? 'text-cream' : 'text-cream/35'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0 transition-all ${
                index < currentStep 
                  ? 'border-cream/35 bg-transparent text-transparent' // Completed but empty for future
                  : index === currentStep 
                    ? 'border-cream bg-clay text-white' 
                    : 'border-cream/35'
              }`}>
                {index === currentStep ? (index + 1).toString() : ''}
              </div>
              <span>{step}</span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-px bg-white/20 mx-3" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Stepper;

