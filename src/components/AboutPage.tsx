import React from 'react';
import { Music, Heart, Users, Headphones, Coffee, Star } from 'lucide-react';

const AboutPage: React.FC = () => {
  const stats = [
    { icon: Music, label: 'Tracks Available', value: '10,000+' },
    { icon: Users, label: 'Active Listeners', value: '500K+' },
    { icon: Headphones, label: 'Hours Streamed', value: '2M+' },
    { icon: Heart, label: 'Artists Supported', value: '1,200+' }
  ];

  const features = [
    {
      icon: Coffee,
      title: 'Curated Collections',
      description: 'Hand-picked lo-fi beats and chillhop tracks perfect for studying, working, and relaxing.'
    },
    {
      icon: Headphones,
      title: 'High-Quality Audio',
      description: 'Crystal clear sound quality with professional mastering for the best listening experience.'
    },
    {
      icon: Heart,
      title: 'Artist Support',
      description: 'We directly support independent artists and help them reach new audiences worldwide.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by music lovers, for music lovers. Join our growing community of lo-fi enthusiasts.'
    }
  ];

  const team = [
    {
      name: 'Hoang Trong Tra',
      role: 'Founder & Music Curator',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Passionate about lo-fi music and creating the perfect study atmosphere.'
    },
    {
      name: 'Hoang Trong Tra',
      role: 'Head of Artist Relations',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Connecting talented artists with music lovers around the world.'
    },
    {
      name: 'Hoang Trong Tra',
      role: 'Lead Developer',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Building the technology that powers your perfect listening experience.'
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About LoFi Café
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to create the perfect soundtrack for your daily life. 
            From late-night study sessions to peaceful morning routines, we curate 
            the finest lo-fi beats and chillhop tracks to enhance every moment.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <stat.icon className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-white/80 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
                Our Story
              </h2>
              <div className="space-y-6 text-white/90 text-lg leading-relaxed">
                <p>
                  LoFi Café was born from a simple idea: music has the power to transform 
                  ordinary moments into extraordinary experiences. Founded in 2023 by a group 
                  of music enthusiasts and developers, we set out to create more than just 
                  another streaming platform.
                </p>
                <p>
                  We wanted to build a digital sanctuary where students could find their 
                  perfect study companion, where remote workers could create their ideal 
                  focus environment, and where anyone could discover the calming power of 
                  lo-fi music.
                </p>
                <p>
                  Today, LoFi Café serves hundreds of thousands of listeners worldwide, 
                  supporting independent artists and fostering a community united by our 
                  shared love for beautiful, atmospheric music.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            What Makes Us Special
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8">
                <feature.icon className="w-12 h-12 text-indigo-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-white/80 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 shadow-lg"
                />
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-indigo-400 font-medium mb-4">{member.role}</p>
                <p className="text-white/80 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl border border-white/20 p-8 md:p-12 text-center">
          <Star className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
            To create a world where everyone has access to the perfect soundtrack for 
            their daily life, while supporting the talented artists who make it all possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
              Join Our Community
            </button>
            <button className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full font-medium transition-all duration-200 backdrop-blur-md border border-white/30">
              Support Artists
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;