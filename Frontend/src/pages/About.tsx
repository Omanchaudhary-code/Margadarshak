
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background */}
      <section 
        className="relative py-20 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.2)), url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&h=600&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6 transform transition-all duration-700 hover:scale-105"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            About Margadarshak
          </h1>
          <p className="text-xl text-blue-50 max-w-2xl mx-auto">
            Empowering students with data-driven insights
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <Card className="shadow-2xl border-0 transform hover:scale-105 transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-3xl text-center text-gray-900 mb-4">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 text-center leading-relaxed">
                Margadarshak helps students understand their academic journey through AI-powered predictions and personalized recommendations.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-2xl border-0 transform hover:scale-105 transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-3xl text-center text-gray-900 mb-4">Our Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl text-white">👨‍🎓</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">BBIS Students</h3>
                  <p className="text-gray-600">Kathmandu University</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl text-white">🎯</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Second Year Project</h3>
                  <p className="text-gray-600">Academic Excellence Initiative</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
