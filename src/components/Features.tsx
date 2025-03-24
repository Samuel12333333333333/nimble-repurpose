
import React from 'react';
import { ArrowRight, Sparkles, Repeat, Clock, BarChart3, Award, Zap } from 'lucide-react';

const features = [
  {
    icon: <Sparkles className="h-5 w-5" />,
    color: 'bg-blue-500',
    title: 'AI-Powered Analysis',
    description: 'Our AI identifies the most engaging moments in your content, automatically selecting clips with high virality potential.'
  },
  {
    icon: <Repeat className="h-5 w-5" />,
    color: 'bg-purple-500',
    title: 'Multi-Platform Formatting',
    description: 'Automatically reshape content for every platform—TikTok, Instagram, Twitter, LinkedIn, and more.'
  },
  {
    icon: <Clock className="h-5 w-5" />,
    color: 'bg-amber-500',
    title: 'Save Hours of Work',
    description: 'What takes a video editor hours to complete, ContentAI does in minutes. Focus on creating, not editing.'
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    color: 'bg-green-500',
    title: 'Engagement Analytics',
    description: 'Track which clips perform best and why, so you can optimize your future content strategy.'
  },
  {
    icon: <Award className="h-5 w-5" />,
    color: 'bg-rose-500',
    title: 'Premium Quality Output',
    description: 'Captions, transitions, and edits that look professionally made, not AI-generated.'
  },
  {
    icon: <Zap className="h-5 w-5" />,
    color: 'bg-orange-500',
    title: 'One-Click Publishing',
    description: 'Connect your social accounts and publish directly from ContentAI, or download files for manual posting.'
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 md:py-32 relative">
      {/* Background elements */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-primary/5 to-transparent -z-10" />
      
      <div className="container max-w-7xl mx-auto container-padding">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex mb-4">
            <span className="chip bg-primary/10 text-primary">
              Features
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            The ultimate AI toolkit for content creators
          </h2>
          <p className="text-muted-foreground">
            Transform hours of tedious editing work into seconds of AI magic, while maintaining complete creative control.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-background border rounded-xl p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`${feature.color} w-10 h-10 rounded-lg flex items-center justify-center text-white mb-4`}>
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground mb-4">{feature.description}</p>
              
              <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center text-primary text-sm font-medium">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
        
        {/* How it works section */}
        <div id="how-it-works" className="mt-24 md:mt-32">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex mb-4">
              <span className="chip bg-accent/10 text-accent">
                Simple Process
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              How ContentAI works
            </h2>
            <p className="text-muted-foreground">
              Three simple steps to transform your long-form content into engaging social media posts
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Upload Your Content',
                description: 'Upload your video, podcast, or article. Our AI analyzes it to identify high-engagement moments.'
              },
              {
                step: '02',
                title: 'AI Does the Heavy Lifting',
                description: 'Our AI transcribes, edits, and formats your content for each social platform.'
              },
              {
                step: '03',
                title: 'Review and Publish',
                description: 'Preview the generated content, make any tweaks, and publish directly to your social accounts.'
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="mb-4 relative">
                  <span className="text-5xl font-bold text-gradient opacity-30">{item.step}</span>
                  <div className="absolute bottom-0 left-12 right-0 h-1 bg-gradient-to-r from-primary/20 to-transparent"></div>
                </div>
                <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
