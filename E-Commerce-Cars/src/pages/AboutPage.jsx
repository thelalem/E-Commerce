import React from 'react';
import {Link} from "react-router-dom";

function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 animate-fade-in">
            About Our E-Commerce Cars Platform
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto animate-fade-in-up delay-100">
            Revolutionizing the way you buy cars with transparency, convenience, and unbeatable prices.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Mission
          </h2>
          <div className="mt-4 h-1 w-20 bg-indigo-600 mx-auto"></div>
        </div>
        <div className="bg-white shadow-xl rounded-lg p-8 md:p-12 max-w-4xl mx-auto">
          <p className="text-lg text-gray-700 mb-6">
            We're on a mission to make car shopping easy, transparent, and accessible for everyone. 
            Gone are the days of stressful dealership experiences and hidden fees.
          </p>
          <p className="text-lg text-gray-700">
            Our platform brings the entire car buying process online, offering competitive prices, 
            detailed vehicle histories, and a seamless purchasing experience from the comfort of your home.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Core Values
            </h2>
            <div className="mt-4 h-1 w-20 bg-indigo-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Transparency",
                description: "No hidden fees, no surprises. We provide complete vehicle history and pricing breakdowns.",
                icon: (
                  <svg className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
              {
                title: "Quality",
                description: "Every vehicle undergoes a rigorous 200-point inspection before being listed.",
                icon: (
                  <svg className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                )
              },
              {
                title: "Customer First",
                description: "Your satisfaction is our priority. 7-day returns and 24/7 support.",
                icon: (
                  <svg className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )
              }
            ].map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-center mb-4 text-gray-900">{value.title}</h3>
                <p className="text-gray-600 text-center">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Meet Our Team
          </h2>
          <div className="mt-4 h-1 w-20 bg-indigo-600 mx-auto"></div>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
            Passionate car enthusiasts dedicated to improving your car buying experience.
          </p>
        </div>

        {/* Team Members List */}
        <ul className="max-w-2xl mx-auto text-lg text-gray-800 list-disc pl-6">
          {[
            "Zelalem Argaw",
            "Khalid Abduljelil",
            "Naod Wubshet",
            "Nebil Bulad",
            "Natnael Amde",
          ].map((member, index) => (
            <li key={index} className="mb-2">
              {member}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-6">Ready to find your perfect car?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers who found their dream car through our platform.</p>
          <Link 
            to="/"
          className="bg-white text-indigo-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-300 text-lg">
            Browse Inventory
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;