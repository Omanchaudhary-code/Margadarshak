
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";

const Results = () => {
  const [data, setData] = useState<any>(null);
  const [probability, setProbability] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get data from localStorage
    const assessmentData = localStorage.getItem('assessmentData');
    if (assessmentData) {
      const parsedData = JSON.parse(assessmentData);
      setData(parsedData);
      
      // Simulate Monte Carlo calculation
      setTimeout(() => {
        const calculatedProbability = calculateGraduationProbability(parsedData);
        setProbability(calculatedProbability);
        setLoading(false);
      }, 2000);
    } else {
      setLoading(false);
    }
  }, []);

  const calculateGraduationProbability = (data: any) => {
    // Simplified Monte Carlo simulation
    let successCount = 0;
    const iterations = 10000;

    for (let i = 0; i < iterations; i++) {
      let score = 0;
      
      // GPA factor (40% weight)
      score += (data.gpa / 4.0) * 40;
      
      // Credit progress factor (20% weight)
      const creditProgress = Math.min(data.creditsCompleted / 120, 1);
      score += creditProgress * 20;
      
      // Failed courses penalty
      score -= data.coursesFailed * 3;
      
      // Lifestyle factors (25% weight)
      score += (data.studyHours / 12) * 10;
      score += (data.sleepQuality / 10) * 8;
      score -= (data.extracurriculars / 10) * 7; // Too much can be negative
      
      // Well-being factors (15% weight)
      score += (data.mentalHealth / 10) * 8;
      score += (data.familySupport / 10) * 4;
      score += (data.socialActivity / 10) * 3;
      
      // Add some randomness
      score += (Math.random() - 0.5) * 10;
      
      if (score >= 65) successCount++;
    }
    
    return Math.round((successCount / iterations) * 100);
  };

  const getStrengths = (data: any) => {
    const strengths = [];
    if (data.gpa >= 3.5) strengths.push("Strong academic performance");
    if (data.studyHours >= 6) strengths.push("Dedicated study routine");
    if (data.sleepQuality >= 8) strengths.push("Excellent sleep habits");
    if (data.mentalHealth >= 8) strengths.push("Good mental health");
    if (data.familySupport >= 8) strengths.push("Strong family support");
    if (data.coursesFailed === 0) strengths.push("No failed courses");
    return strengths;
  };

  const getImprovements = (data: any) => {
    const improvements = [];
    if (data.gpa < 3.0) improvements.push("Focus on improving GPA");
    if (data.studyHours < 4) improvements.push("Increase daily study time");
    if (data.sleepQuality < 6) improvements.push("Improve sleep quality");
    if (data.mentalHealth < 6) improvements.push("Consider mental health support");
    if (data.extracurriculars > 7) improvements.push("Balance extracurricular activities");
    if (data.socialActivity < 4) improvements.push("Increase social engagement");
    return improvements;
  };

  const getRecommendations = (data: any, probability: number) => {
    const recommendations = [];
    
    if (probability < 60) {
      recommendations.push("Consider meeting with an academic advisor");
      recommendations.push("Explore tutoring services for challenging subjects");
    }
    
    if (data.studyHours < 5) {
      recommendations.push("Gradually increase study time by 30 minutes per day");
    }
    
    if (data.sleepQuality < 7) {
      recommendations.push("Establish a consistent sleep schedule");
    }
    
    if (data.mentalHealth < 7) {
      recommendations.push("Utilize campus counseling services");
    }
    
    if (data.gpa < 3.0) {
      recommendations.push("Focus on core courses and consider reducing course load");
    }
    
    return recommendations;
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <Card className="w-96 p-8 text-center">
          <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Analyzing Your Data...</h3>
          <p className="text-gray-600">Running Monte Carlo simulation with 10,000 iterations</p>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <Card className="w-96 p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">No Assessment Data Found</h3>
          <p className="text-gray-600 mb-4">Please complete the assessment first.</p>
          <Link to="/calculator">
            <Button>Take Assessment</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const strengths = getStrengths(data);
  const improvements = getImprovements(data);
  const recommendations = getRecommendations(data, probability);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/calculator">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Assessment
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Graduation Forecast</h1>
          <p className="text-lg text-gray-600">Based on Monte Carlo simulation analysis</p>
        </div>

        {/* Probability Gauge */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Graduation Probability</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={probability >= 70 ? "#10b981" : probability >= 50 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${probability * 2.51} 251`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">{probability}%</div>
                  <div className="text-sm text-gray-600">4-year graduation</div>
                </div>
              </div>
            </div>
            <Badge 
              variant={probability >= 70 ? "default" : probability >= 50 ? "secondary" : "destructive"}
              className="text-lg px-4 py-2"
            >
              {probability >= 70 ? "High Probability" : probability >= 50 ? "Moderate Probability" : "Needs Attention"}
            </Badge>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <CheckCircle className="mr-2 h-5 w-5" />
                What's Working Well
              </CardTitle>
            </CardHeader>
            <CardContent>
              {strengths.length > 0 ? (
                <ul className="space-y-2">
                  {strengths.map((strength, index) => (
                    <li key={index} className="flex items-center text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      {strength}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Let's work on building your strengths!</p>
              )}
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              {improvements.length > 0 ? (
                <ul className="space-y-2">
                  {improvements.map((improvement, index) => (
                    <li key={index} className="flex items-center text-orange-600">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      {improvement}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">You're doing great! Keep up the good work.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700">
              <Lightbulb className="mr-2 h-5 w-5" />
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-blue-600 text-sm font-semibold">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="space-x-4">
            <Link to="/calculator">
              <Button variant="outline" size="lg">
                Retake Assessment
              </Button>
            </Link>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <TrendingUp className="mr-2 h-4 w-4" />
              Track Progress
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
