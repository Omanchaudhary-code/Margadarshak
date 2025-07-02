
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  TrendingUp, 
  Calendar, 
  Target, 
  BarChart3, 
  PlusCircle, 
  LogOut, 
  RefreshCw,
  GraduationCap,
  BookOpen,
  Trophy,
  Info,
  Download,
  Share2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import { useEffect } from "react";

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, predictions, loading, createMockPrediction } = useUserData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/google-login');
    }
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCreatePrediction = async () => {
    await createMockPrediction();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const latestPrediction = predictions[0];
  const hasAssessments = predictions.length > 0;

  // Calculate profile completion
  const profileFields = [
    profile?.full_name,
    profile?.email,
    latestPrediction?.gpa,
    latestPrediction?.credits_completed
  ];
  const completedFields = profileFields.filter(field => field !== null && field !== undefined).length;
  const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

  const getProbabilityStatus = (probability: number) => {
    if (probability >= 80) return { label: "On Track", color: "bg-green-100 text-green-800" };
    if (probability >= 60) return { label: "Moderate", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Needs Improvement", color: "bg-red-100 text-red-800" };
  };

  const getSuggestions = (prediction: any) => {
    const suggestions = [];
    
    if (!prediction) {
      return [
        { 
          icon: Info, 
          text: 'Take your first assessment to get personalized academic suggestions',
          type: 'info'
        }
      ];
    }

    if (prediction.gpa < 3.0) {
      suggestions.push({ 
        icon: BookOpen,
        text: 'Focus on improving your GPA - consider study groups and office hours',
        type: 'warning'
      });
    }
    
    if (prediction.attendance_rate < 85) {
      suggestions.push({ 
        icon: Calendar,
        text: 'Improve attendance rate - aim for 90%+ to boost graduation chances',
        type: 'error'
      });
    }
    
    if (prediction.study_hours < 25) {
      suggestions.push({ 
        icon: Target,
        text: 'Increase weekly study hours - target 25+ hours per week',
        type: 'warning'
      });
    }
    
    if (prediction.graduation_probability >= 80) {
      suggestions.push({ 
        icon: Trophy,
        text: 'Excellent progress! Maintain current habits and academic performance',
        type: 'success'
      });
    }

    // Always add general suggestions
    suggestions.push({
      icon: GraduationCap,
      text: 'Try to maintain at least 15 credit hours per semester',
      type: 'info'
    });

    if (suggestions.length === 1) {
      suggestions.push({ 
        icon: TrendingUp,
        text: 'Schedule regular academic advising sessions for continued success',
        type: 'success'
      });
    }

    return suggestions;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <section 
        className="relative py-16 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.2)), url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1920&h=400&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="animate-fadeInUp">
              <h1 className="text-4xl font-light text-white mb-2"
                  style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                Welcome back, {profile?.full_name || user.email?.split('@')[0]}!
              </h1>
              <p className="text-xl text-blue-50 font-light">Track your academic journey</p>
            </div>
            <div className="flex space-x-4">
              <Button 
                size="lg" 
                onClick={handleCreatePrediction}
                className="bg-white text-blue-600 hover:bg-blue-50 professional-hover shadow-lg"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                New Assessment
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleLogout}
                className="bg-white/20 border-white text-white hover:bg-white/30 professional-hover"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="shadow-lg border-0 professional-hover animate-fadeInUp">
              <CardHeader className="text-center">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-blue-100 shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-sm">
                    <User className="h-10 w-10 text-white" />
                  </div>
                )}
                <CardTitle className="text-xl font-medium">{profile?.full_name || 'Google User'}</CardTitle>
                <p className="text-slate-600 text-sm">{profile?.email || user.email}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-600 text-sm">Current GPA:</span>
                    </div>
                    <Badge className="bg-green-50 text-green-700 border-green-200">
                      {latestPrediction?.gpa || 'N/A'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-600 text-sm">Credits:</span>
                      </div>
                      <span className="text-sm font-medium">
                        {latestPrediction?.credits_completed || 0}/120
                      </span>
                    </div>
                    <Progress 
                      value={((latestPrediction?.credits_completed || 0) / 120) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-600 text-sm">Assessments:</span>
                    </div>
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                      {predictions.length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Completion Card */}
            <Card className="shadow-lg border-0 professional-hover">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Info className="mr-2 h-5 w-5 text-blue-600" />
                  Profile Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">
                      Profile {profileCompletion}% complete
                    </span>
                    <Badge className={profileCompletion === 100 ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}>
                      {profileCompletion === 100 ? "Complete" : "In Progress"}
                    </Badge>
                  </div>
                  <Progress value={profileCompletion} className="h-2" />
                  {profileCompletion < 100 && (
                    <p className="text-xs text-slate-500">
                      Complete your profile to unlock more accurate insights
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Status */}
            <Card className="shadow-lg border-0 professional-hover animate-fadeInUp">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl font-medium">
                  <Target className="mr-3 h-6 w-6 text-blue-600" />
                  Graduation Probability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  {hasAssessments ? (
                    <>
                      <div className="text-5xl font-light text-blue-600 mb-2">
                        {latestPrediction?.graduation_probability}%
                      </div>
                      <p className="text-slate-600 mb-4 font-light">Chance of graduating in 4 years</p>
                      <Badge className={`text-lg px-4 py-2 font-medium ${
                        getProbabilityStatus(latestPrediction?.graduation_probability).color
                      }`}>
                        {getProbabilityStatus(latestPrediction?.graduation_probability).label}
                      </Badge>
                    </>
                  ) : (
                    <>
                      <div className="text-5xl font-light text-slate-400 mb-2">--%</div>
                      <p className="text-slate-500 mb-4 font-light">Take your first assessment to see your graduation probability</p>
                      <Button onClick={handleCreatePrediction} className="shadow-sm">
                        Start Assessment
                      </Button>
                    </>
                  )}
                </div>
                
                {hasAssessments && (
                  <div className="mt-6 flex justify-center space-x-4">
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Download Report</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <Share2 className="h-4 w-4" />
                      <span>Share Progress</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assessment History */}
            <Card className="shadow-lg border-0 professional-hover">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl font-medium">
                  <Calendar className="mr-3 h-6 w-6 text-blue-600" />
                  Assessment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hasAssessments ? (
                    predictions.map((prediction, index) => (
                      <div key={prediction.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-100">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <span className="font-medium text-slate-800">
                              {new Date(prediction.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            <p className="text-sm text-slate-500">
                              GPA: {prediction.gpa} • {prediction.credits_completed} credits
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl font-medium text-blue-600">
                            {prediction.graduation_probability}%
                          </span>
                          <Badge className={getProbabilityStatus(prediction.graduation_probability).color}>
                            {getProbabilityStatus(prediction.graduation_probability).label}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                      <BarChart3 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 mb-4 font-medium">No assessments yet. Let's get started!</p>
                      <Button onClick={handleCreatePrediction} className="shadow-sm">
                        Take First Assessment
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Personalized Suggestions */}
            <Card className="shadow-lg border-0 professional-hover">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl font-medium">
                  <TrendingUp className="mr-3 h-6 w-6 text-blue-600" />
                  Academic Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getSuggestions(latestPrediction).map((suggestion, index) => {
                    const IconComponent = suggestion.icon;
                    return (
                      <div key={index} className={`p-4 rounded-lg border-l-4 flex items-start space-x-3 ${
                        suggestion.type === 'success' 
                          ? 'bg-green-50 border-green-500'
                          : suggestion.type === 'warning'
                          ? 'bg-yellow-50 border-yellow-500'
                          : suggestion.type === 'error'
                          ? 'bg-red-50 border-red-500'
                          : 'bg-blue-50 border-blue-500'
                      }`}>
                        <IconComponent className={`h-5 w-5 mt-0.5 ${
                          suggestion.type === 'success' 
                            ? 'text-green-600'
                            : suggestion.type === 'warning'
                            ? 'text-yellow-600'
                            : suggestion.type === 'error'
                            ? 'text-red-600'
                            : 'text-blue-600'
                        }`} />
                        <p className={`font-light ${
                          suggestion.type === 'success' 
                            ? 'text-green-800'
                            : suggestion.type === 'warning'
                            ? 'text-yellow-800'
                            : suggestion.type === 'error'
                            ? 'text-red-800'
                            : 'text-blue-800'
                        }`}>
                          {suggestion.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
