
import { ArrowRight, TrendingUp, Shield, Users, BarChart3, BookOpen, Target, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="relative">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-medium text-blue-700 mb-6">
                <TrendingUp className="h-4 w-4 mr-2" />
                Evidence-Based Academic Forecasting
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Predict Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Graduation </span>
                Success
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Get personalized insights into your academic journey with our AI-powered graduation probability calculator. 
                Make informed decisions about your education path.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Link to="/calculator">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Try Calculator Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-medium border-2 border-gray-300 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300">
                    Learn How It Works
                  </Button>
                </Link>
              </div>
              
              <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3 inline-block">
                ✨ No registration required to try • Sign in only to save and see the results
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">&gt;80%</div>
                <div className="text-gray-600">Prediction Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Students Helped</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">2 min</div>
                <div className="text-gray-600">Assessment Time</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/60 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Calculator?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our evidence-based approach combines academic data with lifestyle factors to provide the most accurate graduation predictions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <BarChart3 className="h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle className="text-xl text-gray-900">Artificial Intelligence & Machine Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Advanced statistical modeling with 5,000+ simulation iterations for precise probability calculations.</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle className="text-xl text-gray-900">Holistic Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Considers academic performance, lifestyle factors, and well-being metrics for comprehensive insights.</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <Target className="h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle className="text-xl text-gray-900">Actionable Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Receive personalized recommendations to improve your graduation probability and academic success.</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <Shield className="h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle className="text-xl text-gray-900">Privacy First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Your data is encrypted and secure. We only ask for information essential to accurate predictions.</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <Clock className="h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle className="text-xl text-gray-900">Quick & Easy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Complete assessment in under  minutes. No complex forms or lengthy questionnaires required.</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <Users className="h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle className="text-xl text-gray-900">Proven Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Trusted by thousands of students and academic advisors across universities nationwide.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-gray-600">Simple, scientific, and personalized in three easy steps</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Input Your Data</h3>
                <p className="text-gray-600">Share your GPA, credits, study habits, and lifestyle factors through our quick assessment.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Analysis</h3>
                <p className="text-gray-600">Our AI-powered prediction engine analyzes your data using a trained machine learning model to deliver accurate, personalized CGPA forecasts.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Insights</h3>
                <p className="text-gray-600">Receive your graduation probability with personalized recommendations for academic success.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Discover Your Academic Future?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of students who have gained clarity about their graduation path. Start your free assessment now.
            </p>
            <Link to="/calculator">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Start Free Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <div className="mt-4 text-blue-200 text-sm">
                  Results in under 2 minutes
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
