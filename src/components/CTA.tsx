
import React from 'react';
import WaitlistForm from './WaitlistForm';

const CTA: React.FC = () => {
  return (
    <section id="early-access" className="py-20 md:py-32 relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent -z-10" />
      <div className="absolute top-1/4 right-[10%] w-64 h-64 bg-accent/10 rounded-full filter blur-3xl animate-pulse-subtle -z-10" />
      <div className="absolute bottom-1/3 left-[15%] w-48 h-48 bg-primary/10 rounded-full filter blur-3xl animate-pulse-subtle -z-10" />
      
      <div className="container max-w-6xl mx-auto container-padding">
        <div className="bg-gradient-to-r from-primary/[0.05] to-accent/[0.05] rounded-2xl p-8 md:p-12 lg:p-16 border border-primary/10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex mb-4">
                <span className="chip bg-accent/10 text-accent">
                  Limited Early Access
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                Get early access and save 50%
              </h2>
              
              <p className="text-muted-foreground mb-6">
                Join our waitlist today and be the first to experience ContentAI when we launch. Early adopters receive a lifetime 50% discount on any plan.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Priority access to all new features',
                  'Lifetime 50% discount on any plan',
                  'Direct line to our founding team',
                  'Help shape the product roadmap'
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <div className="mr-3 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Limited spots available</span>
                  <p className="text-muted-foreground">Only 100 early access spots</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">Join the Waitlist</h3>
              <WaitlistForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
