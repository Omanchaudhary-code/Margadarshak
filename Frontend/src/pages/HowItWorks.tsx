import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";

const HowItWorks = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background */}
      <section 
        className="relative py-20 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.2)), url('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&h=600&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6 transform transition-all duration-700 hover:scale-105"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            How Margadarshak Works
          </h1>
          <p className="text-xl text-blue-50 max-w-2xl mx-auto">
            Understanding the science behind predictions
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <Card className="shadow-2xl border-0 transform hover:scale-105 transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <span className="text-3xl mr-4">📊</span>
                Data Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                We collect information across three key dimensions that research shows significantly impact academic success:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Academic Factors</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Current GPA</li>
                    <li>• Credit hours completed</li>
                    <li>• Course failure history</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Lifestyle Habits</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Daily study hours</li>
                    <li>• Sleep quality</li>
                    <li>• Extracurricular load</li>
                  </ul>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Well-being</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Mental health status</li>
                    <li>• Family support level</li>
                    <li>• Social engagement</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xl border-0 transform hover:scale-105 transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <span className="text-3xl mr-4">🧮</span>
                AI-Powered Prediction Engine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Our prediction system uses a Machine Learning model trained on real student data to forecast CGPA and graduation probability with high accuracy.
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3">The Process:</h4>
                  <ol className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <Badge className="mr-3 mt-0.5 bg-blue-600">1</Badge>
                      <span>Your academic, behavioral, and demographic data is collected.</span>
                    </li>
                    <li className="flex items-start">
                      <Badge className="mr-3 mt-0.5 bg-blue-600">2</Badge>
                      <span>We feed this data into our trained Multiple Linear Regression (MLR) model.</span>
                    </li>
                    <li className="flex items-start">
                      <Badge className="mr-3 mt-0.5 bg-blue-600">3</Badge>
                      <span>The model analyzes key features such as attendance, study habits, course repetition, and more.</span>
                    </li>
                    <li className="flex items-start">
                      <Badge className="mr-3 mt-0.5 bg-blue-600">4</Badge>
                      <span>Based on the output, we predict your expected CGPA and likelihood of graduating on time.</span>
                    </li>
                  </ol>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="text-blue-800">
                    <strong>Why MLR & AI?</strong> MLR offers a transparent and interpretable way to model relationships between multiple variables and your academic performance. Combined with AI techniques, it allows us to deliver personalized, data-driven insights to help you stay on track and succeed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xl border-0 transform hover:scale-105 transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <span className="text-3xl mr-4">📈</span>
                Result Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Your results are presented in an easy-to-understand format with actionable insights:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Visual Probability Gauge</h4>
                    <p className="text-gray-600 text-sm">
                      A circular progress indicator shows your graduation probability with color-coded risk levels.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Strength Analysis</h4>
                    <p className="text-gray-600 text-sm">
                      Identifies your academic and personal strengths that contribute to success.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Improvement Areas</h4>
                    <p className="text-gray-600 text-sm">
                      Highlights specific areas where focused effort can improve your outcomes.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Personalized Recommendations</h4>
                    <p className="text-gray-600 text-sm">
                      Actionable steps tailored to your specific situation and risk factors.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xl border-0 bg-gradient-to-r from-yellow-50 to-orange-50 transform hover:scale-105 transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800 text-2xl">
                <span className="text-3xl mr-4">⚠️</span>
                Important Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-orange-700">
                <p>
                  <strong>Probabilistic Nature:</strong> Our predictions are based on statistical models and historical data. 
                  Individual outcomes may vary based on personal circumstances, effort, and unforeseen events.
                </p>
                <p>
                  <strong>Guidance Tool:</strong> Margadarshak is designed to provide insights and guidance, not definitive predictions. 
                  Use these results as motivation and direction for improvement.
                </p>
                <p>
                  <strong>Professional Advice:</strong> For serious academic challenges, always consult with academic advisors, 
                  counselors, or other educational professionals.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HowItWorks;
