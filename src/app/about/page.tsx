"use client";

import Layout from '@/components/Layout';
import { Users, Target, Award, Heart, Building, Shield, Globe, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('bio');

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "/api/placeholder/150/150",
      description: "Real estate expert with 15+ years of experience in property management and technology innovation."
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "/api/placeholder/150/150",
      description: "Tech visionary leading our platform development with expertise in scalable web applications."
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Operations",
      image: "/api/placeholder/150/150",
      description: "Operations specialist ensuring seamless service delivery and customer satisfaction."
    },
    {
      name: "David Thompson",
      role: "Head of Customer Success",
      image: "/api/placeholder/150/150",
      description: "Customer advocate dedicated to providing exceptional support and building lasting relationships."
    }
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust & Security",
      description: "We prioritize the security of your data and transactions, ensuring a safe platform for all users."
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Every decision we make is guided by what's best for our customers and their property needs."
    },
    {
      icon: Globe,
      title: "Innovation",
      description: "We continuously innovate to provide cutting-edge solutions for modern property management."
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a strong community of landlords, agents, and renters who support each other."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Properties Listed" },
    { number: "5,000+", label: "Happy Customers" },
    { number: "50+", label: "Cities Covered" },
    { number: "99.9%", label: "Uptime" }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Fixed Tabs */}
        <div className="fixed top-18 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-white rounded-lg p-1 shadow-sm border-2 border-gray-300 flex">
            <button
              onClick={() => setActiveTab('bio')}
              className={`px-6 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeTab === 'bio'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Bio
            </button>
            <button
              onClick={() => setActiveTab('values')}
              className={`px-2 py-2 rounded-md font-medium transition-colors whitespace-nowrap ml-1 ${
                activeTab === 'values'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Our Values
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-3 py-2 rounded-md font-medium transition-colors whitespace-nowrap ml-1 ${
                activeTab === 'team'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Our Team
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-20">
          {/* Tab Content */}
          {activeTab === 'bio' && (
            <div className="mb-16">
              <div className="max-w-4xl mx-auto">
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Founded in 2020, Rentapp emerged from a simple observation: the property rental process was unnecessarily complex and fragmented. Our founders, experienced in both real estate and technology, saw an opportunity to create a unified platform that would streamline every aspect of property management.
                </p>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  What started as a vision to simplify property listings has evolved into a comprehensive ecosystem that supports landlords, agents, and renters throughout their entire journey. Today, we&apos;re proud to serve thousands of users across multiple cities, helping them find, list, and manage properties with unprecedented ease.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Our commitment to innovation, customer satisfaction, and community building continues to drive us forward as we expand our services and reach new markets.
                </p>
              </div>
            </div>
          )}


          {activeTab === 'values' && (
            <div className="mb-16">
              <div className="grid grid-cols-1 gap-8">
                {values.map((value, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-black mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="mb-16">
              <div className="grid grid-cols-1 gap-8">
                {/* Community Card - Special Highlight */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-center text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
                  <div className="relative z-10">
                    <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Our Community</h3>
                    <p className="text-blue-100 font-medium mb-3">Brokers & Property Owners</p>
                    <p className="text-blue-50 text-sm leading-relaxed max-w-md mx-auto">
                      The heart of our platform. Without our dedicated brokers and property owners, Rentapp wouldn't exist. 
                      They are the foundation of our success, bringing quality properties and expertise to help renters find their perfect home.
                    </p>
                    <div className="mt-4 flex justify-center space-x-6 text-blue-100">
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">500+</div>
                        <div className="text-xs">Active Brokers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">2,000+</div>
                        <div className="text-xs">Property Owners</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Core Team Members */}
                {teamMembers.map((member, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-black mb-2">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* Call to Action */}
          <div className="bg-blue-600 text-white p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have transformed their property rental experience with Rentapp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/list-property"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                List Your Property
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
