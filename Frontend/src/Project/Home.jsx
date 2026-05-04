// home.jsx
import React, { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  MessageCircle,
  Ticket,
  Users,
  Shield,
  Zap,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Bot,
  Headphones,
  GitBranch,
  Star,
  Quote,
} from "lucide-react";

const Home = () => {
  const [darkMode, setDarkMode] = useState(true);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const features = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI-Powered Support",
      description:
        "Intelligent AI handles common queries instantly, 24/7, reducing response times by up to 80%.",
    },
    {
      icon: <GitBranch className="w-6 h-6" />,
      title: "Smart Ticket Routing",
      description:
        "Complex issues are automatically escalated to the right human agent with full conversation context.",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Unified Inbox",
      description:
        "Manage chats, emails, and social messages from a single, intuitive dashboard.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Suggested Replies",
      description:
        "AI-generated response suggestions help agents resolve tickets faster and consistently.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Multi-Tenant Analytics",
      description:
        "Granular insights per business unit with cross-tenant performance comparisons.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description:
        "Data isolation, SSO, and compliance with GDPR, SOC2, and HIPAA standards.",
    },
  ];

  const testimonials = [
    {
      name: "Emma Rodriguez",
      role: "Head of Customer Experience",
      company: "TechRetail Group",
      quote:
        "TenantDesk AI completely transformed our support operations. The AI handles 65% of tickets autonomously, and our CSAT scores have never been higher.",
      rating: 5,
    },
    {
      name: "Sarah Chen",
      role: "Director of Operations",
      company: "Global SaaS Inc.",
      quote:
        "Finally, a platform that truly understands multi-tenant complexity. The AI routing is incredibly accurate, saving our senior agents hours of triage work daily.",
      rating: 5,
    },
    {
      name: "Marcus Williams",
      role: "Support Team Lead",
      company: "FinServe Platform",
      quote:
        "The quality of AI-suggested replies is remarkable. Our resolution time dropped by 40% in the first month alone. It's like having a co-pilot for every agent.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Navigation */}

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/40 px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                AI-Powered Multi-Tenant Support
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              TenantDesk AI
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Multi-Tenant Customer Support System
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Where businesses can manage chats, tickets, and customer issues.
              AI handles common queries, generates suggested replies, and routes
              complex tickets to human agents.
            </p>

            {/* Trust Badge */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-center">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  Trusted by{" "}
                  <strong className="text-gray-900 dark:text-white">
                    500+
                  </strong>{" "}
                  enterprises
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  <strong className="text-gray-900 dark:text-white">
                    99.9%
                  </strong>{" "}
                  uptime SLA
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  <strong className="text-gray-900 dark:text-white">2M+</strong>{" "}
                  tickets resolved monthly
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-2 shadow-2xl">
              <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                <div className="h-8 bg-gray-100 dark:bg-gray-800 flex items-center px-3 gap-1.5 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50/20 to-purple-50/20 dark:from-blue-950/20 dark:to-purple-950/20">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Active Chats
                        </span>
                        <Bot className="w-4 h-4 text-blue-500" />
                      </div>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        24
                      </span>
                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                        +12% vs yesterday
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Pending Tickets
                        </span>
                        <Ticket className="w-4 h-4 text-purple-500" />
                      </div>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        142
                      </span>
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        AI resolved 67%
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Avg Response
                        </span>
                        <Zap className="w-4 h-4 text-orange-500" />
                      </div>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        2.4m
                      </span>
                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                        -58% faster
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Exceptional services and unparalleled intelligence
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Set the standard for multi-tenant customer support with AI-first
              architecture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">
                50%
              </div>
              <div className="text-blue-100 mt-1">
                Reduction in response time
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">
                10+
              </div>
              <div className="text-blue-100 mt-1">Years of AI innovation</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">
                99.9%
              </div>
              <div className="text-blue-100 mt-1">Ticket accuracy rate</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">
                500+
              </div>
              <div className="text-blue-100 mt-1">Enterprise clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What our clients say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Hear from customer support leaders who trust TenantDesk AI for
              their most important operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="relative p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <Quote className="absolute top-4 right-4 w-8 h-8 text-gray-200 dark:text-gray-700" />
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to transform your customer support?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join 500+ businesses that have reduced response times by 50% with
            TenantDesk AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition shadow-lg">
              Start Free Trial
            </button>
            <button className="px-8 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              Schedule Demo
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
            No credit card required. Free for 14 days. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Product
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    Integrations
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Company
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Resources
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    Status
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Legal
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    GDPR
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    SOC2
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-8 border-t border-gray-200 dark:border-gray-800">
            <p>
              © 2024 TenantDesk AI. All rights reserved. Built for
              multi-enterprise support excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
