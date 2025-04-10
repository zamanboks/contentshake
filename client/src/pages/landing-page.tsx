import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { CheckCircle, ChevronRight, LayoutPanelTop, Zap, Target, Type, Share2, Sparkles, BarChart4, Fingerprint } from "lucide-react";

const features = [
  {
    title: "AI-Powered Content Generation",
    description: "Create high-quality articles, blog posts, and more with advanced AI assistance.",
    icon: <Sparkles className="h-6 w-6 text-indigo-600" />,
  },
  {
    title: "Content Optimization",
    description: "Maximize your content's SEO potential with real-time scoring and suggestions.",
    icon: <Target className="h-6 w-6 text-indigo-600" />,
  },
  {
    title: "Brand Voice Creation",
    description: "Develop and maintain a consistent brand voice across all your content.",
    icon: <Fingerprint className="h-6 w-6 text-indigo-600" />,
  },
  {
    title: "Social Media Content",
    description: "Generate engaging posts tailored for different social media platforms.",
    icon: <Share2 className="h-6 w-6 text-indigo-600" />,
  },
  {
    title: "Content Ideas",
    description: "Never run out of topics with AI-generated content ideas for your niche.",
    icon: <Zap className="h-6 w-6 text-indigo-600" />,
  },
  {
    title: "Performance Analytics",
    description: "Track your content's performance and get insights to improve.",
    icon: <BarChart4 className="h-6 w-6 text-indigo-600" />,
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out ContentShake.ai",
    features: [
      "3 content generations per month",
      "3 content optimizations per month",
      "5 social posts per month",
      "Basic analytics",
      "1 brand voice",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Premium",
    price: "$19",
    period: "per month",
    description: "Everything you need for professional content creation",
    features: [
      "Unlimited content generations",
      "Unlimited content optimizations",
      "Unlimited social posts",
      "Advanced analytics",
      "5 brand voices",
      "Collaboration tools",
      "Priority support",
    ],
    cta: "Upgrade Now",
    popular: true,
  },
  {
    name: "Basic",
    price: "$9",
    period: "per month",
    description: "More power for growing content creators",
    features: [
      "15 content generations per month",
      "15 content optimizations per month",
      "30 social posts per month",
      "Standard analytics",
      "3 brand voices",
      "Email support",
    ],
    cta: "Choose Basic",
    popular: false,
  },
];

const testimonials = [
  {
    quote: "ContentShake.ai transformed our content strategy. We're creating more engaging posts in half the time.",
    author: "Sarah Johnson",
    title: "Marketing Director, TechStart Inc.",
  },
  {
    quote: "The optimization suggestions have increased our organic traffic by 35% in just two months.",
    author: "Michael Chen",
    title: "SEO Specialist, GrowthLab",
  },
  {
    quote: "As a solo blogger, ContentShake.ai feels like having a full marketing team working with me.",
    author: "Emma Rodriguez",
    title: "Travel Blogger",
  },
];

const faqs = [
  {
    question: "How does the AI content generation work?",
    answer: "ContentShake.ai uses advanced artificial intelligence to analyze your topic, target keywords, and audience to generate high-quality, unique content tailored to your needs. The AI is trained on diverse writing styles and can adapt to match your brand voice.",
  },
  {
    question: "Is the content generated by ContentShake.ai original?",
    answer: "Yes, all content generated by ContentShake.ai is unique and original. Our AI creates new content based on your inputs rather than copying existing work. We recommend reviewing and editing the generated content to add your personal touch.",
  },
  {
    question: "Can I switch between subscription plans?",
    answer: "Absolutely! You can upgrade or downgrade your subscription plan at any time. Changes will take effect at the start of your next billing cycle. Your usage limits will adjust accordingly.",
  },
  {
    question: "How accurate are the SEO optimization suggestions?",
    answer: "Our SEO optimization suggestions are based on current best practices and real-time analysis of top-performing content. While we can't guarantee specific rankings, following our suggestions has helped many users significantly improve their search visibility.",
  },
  {
    question: "Do you offer refunds if I'm not satisfied?",
    answer: "Yes, we offer a 14-day money-back guarantee for new subscribers. If you're not satisfied with ContentShake.ai, contact our support team within 14 days of your initial purchase for a full refund.",
  },
];

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="border-b sticky top-0 bg-white z-10">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-700 flex items-center">
                <LayoutPanelTop className="mr-2 h-6 w-6" />
                ContentShake.ai
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/auth")}
                  >
                    Sign In
                  </Button>
                  <Button onClick={() => navigate("/auth")}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-white to-indigo-50">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-gray-900 mb-6">
                  Create better content with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    AI and competitor insights
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-lg">
                  ContentShake.ai combines powerful AI with real-world competitor
                  analysis to help you create engaging, high-performing content
                  that stands out.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" onClick={() => navigate("/auth")}>
                    Start Creating <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg">
                    Watch Demo
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl blur opacity-30"></div>
                  <div className="relative bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                    <div className="px-6 pt-6 pb-4 bg-indigo-50 border-b border-gray-200">
                      <div className="flex items-center">
                        <Type className="h-5 w-5 text-indigo-600 mr-2" />
                        <span className="text-sm font-medium text-indigo-900">
                          Content Editor
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="mt-6 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                        <div className="flex items-start">
                          <Sparkles className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-indigo-800 mb-1">
                              AI Suggestion
                            </p>
                            <p className="text-xs text-indigo-700">
                              Try adding more specific examples to strengthen your argument.
                            </p>
                          </div>
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
        <section className="py-16 bg-white">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Everything you need to create amazing content
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                ContentShake.ai provides powerful tools to help you at every step
                of your content creation process.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="inline-flex items-center justify-center p-2 bg-indigo-50 rounded-lg mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-gray-50">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Simple, transparent pricing
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose the plan that's right for you. All plans include a 14-day
                free trial.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative rounded-xl shadow-sm bg-white border ${
                    plan.popular
                      ? "border-indigo-600 ring-2 ring-indigo-600"
                      : "border-gray-200"
                  } overflow-hidden`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-semibold py-1 px-3 rounded-bl-lg">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.period && (
                        <span className="text-gray-500">{plan.period}</span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-indigo-600 hover:bg-indigo-700"
                          : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => navigate("/auth")}
                    >
                      {plan.cta}
                    </Button>
                  </div>
                  <div className="px-6 pt-4 pb-6 bg-gray-50 border-t border-gray-200">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start text-sm"
                        >
                          <CheckCircle className="h-5 w-5 text-indigo-600 mr-2 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Loved by content creators
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                See what our users have to say about ContentShake.ai
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="p-6 bg-white rounded-xl shadow-sm border border-gray-200"
                >
                  <div className="mb-4 text-indigo-600">
                    {"★★★★★"}
                  </div>
                  <blockquote className="text-gray-800 mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently asked questions
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Got questions? We've got answers.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="p-6 bg-white rounded-xl shadow-sm border border-gray-200"
                >
                  <h3 className="text-lg font-semibold mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to transform your content strategy?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of content creators who are using ContentShake.ai to
              create better content in less time.
            </p>
            <Button
              size="lg"
              className="bg-white text-indigo-700 hover:bg-gray-100"
              onClick={() => navigate("/auth")}
            >
              Get Started for Free
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="mb-8 md:mb-0">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
                <LayoutPanelTop className="mr-2 h-5 w-5" />
                ContentShake.ai
              </h3>
              <p className="mb-4 pr-4 text-sm">
                AI-powered content creation platform that combines artificial
                intelligence with competitor insights to help you create
                better content.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-white text-base font-semibold mb-4">
                Product
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-base font-semibold mb-4">
                Resources
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    API Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-base font-semibold mb-4">
                Company
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
            <p>© {new Date().getFullYear()} ContentShake.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}