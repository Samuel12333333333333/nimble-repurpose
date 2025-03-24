
import React, { useState } from 'react';
import { Check, HelpCircle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const tiers = [
  {
    name: 'Starter',
    price: '$19',
    description: 'Perfect for creators just getting started',
    features: [
      '10 content clips per month',
      'Basic editing features',
      'Standard output quality',
      'Export to 3 platforms',
      'Email support'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    price: '$49',
    description: 'For serious creators ready to scale',
    features: [
      '50 content clips per month',
      'Advanced editing tools',
      'Premium output quality',
      'Export to all platforms',
      '1-click publishing',
      'Performance analytics',
      'Priority support'
    ],
    cta: 'Choose Pro',
    popular: true
  },
  {
    name: 'Unlimited',
    price: '$99',
    description: 'For agencies and power users',
    features: [
      'Unlimited content clips',
      'All Pro features',
      'Team collaboration tools',
      'White-label exports',
      'Custom branding',
      '24/7 priority support'
    ],
    cta: 'Choose Unlimited',
    popular: false
  }
];

interface FeatureTooltipProps {
  children: React.ReactNode;
  content: string;
}

const FeatureTooltip: React.FC<FeatureTooltipProps> = ({ children, content }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="inline-flex items-center">
          {children}
          <HelpCircle className="ml-1 h-3.5 w-3.5 text-muted-foreground inline cursor-help" />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs text-xs">{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const handleBillingToggle = () => {
    setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly');
  };

  return (
    <section id="pricing" className="py-20 md:py-32 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="container max-w-7xl mx-auto container-padding">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex mb-4">
            <span className="chip bg-primary/10 text-primary">
              Pricing
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground mb-8">
            Choose the plan that works best for your content creation needs
          </p>
          
          <div className="flex items-center justify-center space-x-3 mb-8">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button 
              onClick={handleBillingToggle}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary/20"
            >
              <span className="sr-only">Toggle billing cycle</span>
              <span 
                className={`absolute transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-primary`} 
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Annual <span className="text-xs text-accent font-normal ml-1">Save 20%</span>
            </span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <div 
              key={i}
              className={`rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl relative ${
                tier.popular 
                  ? 'border-2 border-primary shadow-lg' 
                  : 'border border-border bg-card hover:-translate-y-1'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                  Most Popular
                </div>
              )}
              
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-semibold mb-1">{tier.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{tier.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground ml-1">/month</span>
                  {billingCycle === 'annual' && (
                    <div className="text-xs text-accent mt-1">Billed annually</div>
                  )}
                </div>
                
                <a 
                  href="#early-access" 
                  className={`block text-center py-2.5 px-4 rounded-lg font-medium transition-colors mb-6 ${
                    tier.popular 
                      ? 'bg-primary text-white hover:bg-primary/90' 
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  {tier.cta}
                </a>
                
                <div className="space-y-3">
                  {tier.features.map((feature, j) => (
                    <div key={j} className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2" strokeWidth={2.5} />
                      <span className="text-sm">
                        {feature.includes('content clips') ? (
                          <FeatureTooltip content="A content clip is a single piece of short-form content generated from your long-form content.">
                            {feature}
                          </FeatureTooltip>
                        ) : (
                          feature
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Need a custom plan for your enterprise?
          </p>
          <a href="#" className="text-primary font-medium hover:underline">
            Contact us for custom pricing
          </a>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
