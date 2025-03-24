
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const videoRef = useRef<HTMLDivElement>(null);
  
  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (videoRef.current) {
        const scrollY = window.scrollY;
        videoRef.current.style.transform = `translateY(${scrollY * 0.1}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen pt-28 pb-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent -z-10" />
      
      {/* Floating elements */}
      <div className="absolute top-1/4 right-[10%] w-64 h-64 bg-primary/10 rounded-full filter blur-3xl animate-pulse-subtle -z-10" />
      <div className="absolute bottom-1/3 left-[15%] w-48 h-48 bg-accent/10 rounded-full filter blur-3xl animate-pulse-subtle -z-10" />
      
      <div className="container max-w-7xl mx-auto container-padding">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-6 animate-fade-in-up">
            <div className="inline-flex">
              <span className="chip bg-primary/10 text-primary">
                AI-Powered Content Repurposing
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight md:leading-tight tracking-tight">
              <span className="block">Transform your</span>
              <span className="text-gradient">long-form content</span>
              <span className="block">into social gold</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              Our AI automatically converts your videos, podcasts, and articles into engaging social posts for every platform. Save hours of work with one click.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link to="/login" className="primary-btn">
                Get Early Access
              </Link>
              <a href="#how-it-works" className="secondary-btn">
                See How It Works
              </a>
            </div>
            
            <div className="pt-4">
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">50+</span> creators already on the waitlist
                </p>
              </div>
            </div>
          </div>
          
          <div 
            ref={videoRef}
            className="relative aspect-[4/3] w-full max-w-lg mx-auto md:ml-auto md:mr-0 animate-fade-in"
          >
            <div className="glass-card p-3 md:p-5 rounded-xl h-full">
              <div className="bg-gray-100 rounded-lg h-full overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <div className="w-10 h-10 bg-primary/40 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-primary rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">Preview video loading...</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white text-sm font-medium">How ContentAI Works</p>
                      <p className="text-white/70 text-xs">2:34</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="w-8 h-8 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>
                      </button>
                      <button className="w-8 h-8 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-0.5"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-8 -right-10 glass-card p-3 rounded-lg shadow-lg animate-float">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-md bg-red-500 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM15 9H9V15H15V9Z" fill="white"/>
                  </svg>
                </div>
                <span className="text-xs font-medium">TikTok Clip Generated</span>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 glass-card p-3 rounded-lg shadow-lg animate-float" style={{ animationDelay: '1s' }}>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9 21.59 18.03 20.4 19.6 18.68C21.18 16.96 22.09 14.78 22 12.55C21.8 6.82 17.42 2.19 12 2.04Z" fill="white"/>
                  </svg>
                </div>
                <span className="text-xs font-medium">FB Post Created</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Brands section */}
      <div className="container max-w-5xl mx-auto mt-20 md:mt-28 container-padding">
        <p className="text-center text-sm text-muted-foreground mb-6">TRUSTED BY CONTENT CREATORS FROM</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {['YouTube', 'Instagram', 'TikTok', 'LinkedIn', 'Twitter'].map((brand) => (
            <div key={brand} className="text-lg md:text-xl font-medium text-muted-foreground/70">
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
