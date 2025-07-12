import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GraduationLoader } from "@/components/ui/graduation-loader";
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
  Share2,
  MessageSquare
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import { useFormBuffer } from "@/hooks/useFormBuffer";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';

const ASSESSMENT_LIMIT = 5;

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, predictions, loading, createMockPrediction } = useUserData();
  const { clearBuffer } = useFormBuffer();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [showNewAssessmentAlert, setShowNewAssessmentAlert] = useState(false);
  const [isPreparingNewAssessment, setIsPreparingNewAssessment] = useState(false);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
  const [isCalculatingCGPA, setIsCalculatingCGPA] = useState(false);
  const [displayedRecommendation, setDisplayedRecommendation] = useState<string | null>(null);
  const [displayedCGPA, setDisplayedCGPA] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Show success message if user came from assessment
    if (searchParams.get('from') === 'assessment') {
      setShowNewAssessmentAlert(true);
      // Remove the search param
      navigate('/dashboard', { replace: true });
      // Auto-hide after 5 seconds
      setTimeout(() => setShowNewAssessmentAlert(false), 5000);
    }
  }, [searchParams, navigate]);

  // Handle recommendation loading state
  useEffect(() => {
    const latestPrediction = predictions[0];
    if (latestPrediction?.recommendation && !displayedRecommendation) {
      setIsLoadingRecommendation(true);
      setDisplayedRecommendation(null);
      
      setTimeout(() => {
        // Extract recommendation from API response
        let recommendation = '';
        if (typeof latestPrediction.recommendation === 'string') {
          try {
            // Try to parse if it's a JSON string
            const parsed = JSON.parse(latestPrediction.recommendation);
            recommendation = Array.isArray(parsed.recommendations) 
              ? parsed.recommendations[0] 
              : parsed.recommendations || latestPrediction.recommendation;
          } catch {
            // If not JSON, use as string
            recommendation = latestPrediction.recommendation;
          }
        } else if (Array.isArray(latestPrediction.recommendation)) {
          recommendation = latestPrediction.recommendation[0];
        } else {
          recommendation = 'No recommendation available';
        }
        
        setDisplayedRecommendation(recommendation);
        setIsLoadingRecommendation(false);
      }, 2000);
    }
  }, [predictions, displayedRecommendation]);

  // Handle CGPA loading state
  useEffect(() => {
    const latestPrediction = predictions[0];
    if (latestPrediction?.gpa && !displayedCGPA) {
      setIsCalculatingCGPA(true);
      setDisplayedCGPA(null);
      
      setTimeout(() => {
        setDisplayedCGPA(Number(latestPrediction.gpa).toFixed(2));
        setIsCalculatingCGPA(false);
      }, 2000);
    }
  }, [predictions, displayedCGPA]);

  // Reset displayed values when new assessment is created
  useEffect(() => {
    if (showNewAssessmentAlert) {
      setDisplayedRecommendation(null);
      setDisplayedCGPA(null);
    }
  }, [showNewAssessmentAlert]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCreatePrediction = async () => {
    // Check assessment limit
    if (predictions.length >= ASSESSMENT_LIMIT) {
      toast({
        title: "Assessment Limit Reached",
        description: `You've completed the maximum of ${ASSESSMENT_LIMIT} assessments.`,
        variant: "destructive",
      });
      return;
    }

    setIsPreparingNewAssessment(true);
    
    try {
      // Clear any existing buffered data
      await clearBuffer();
      
      // Clear localStorage as well
      localStorage.removeItem('bufferedFormData');
      localStorage.removeItem('assessmentTimeout');
      
      // Show preparing message
      toast({
        title: "Preparing a new assessment...",
        description: "Please wait while we set up your assessment.",
      });
      
      // Wait 2 seconds then redirect (changed from 5 to 2 seconds)
      setTimeout(() => {
        setIsPreparingNewAssessment(false);
        navigate('/calculator');
      }, 2000);
      
    } catch (error) {
      console.error('Error preparing new assessment:', error);
      setIsPreparingNewAssessment(false);
      toast({
        title: "Error",
        description: "Failed to prepare new assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadReport = () => {
    if (!predictions.length) {
      toast({
        title: "No Data Available",
        description: "Complete an assessment first to download your report.",
        variant: "destructive",
      });
      return;
    }

    try {
      const latestPrediction = predictions[0];
      const firstName = getFirstName();
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      
      // Create PDF
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.text('CGPA Prediction Report', 20, 30);
      
      // User info
      doc.setFontSize(12);
      doc.text(`Student Name: ${firstName}`, 20, 50);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 60);
      
      // Prediction results
      doc.setFontSize(14);
      doc.text('Prediction Results:', 20, 80);
      doc.setFontSize(12);
      doc.text(`Predicted CGPA: ${latestPrediction.gpa || 'N/A'}`, 20, 95);
      doc.text(`Graduation Probability: ${latestPrediction.graduation_probability}%`, 20, 105);
      doc.text(`Credits Completed: ${latestPrediction.credits_completed || 'N/A'}`, 20, 115);
      doc.text(`Study Hours per Week: ${latestPrediction.study_hours || 'N/A'}`, 20, 125);
      doc.text(`Attendance Rate: ${latestPrediction.attendance_rate || 'N/A'}%`, 20, 135);
      
      // Add recommendation if available
      if (latestPrediction.recommendation) {
        doc.setFontSize(14);
        doc.text('Personalized Recommendation:', 20, 155);
        doc.setFontSize(10);

        // Handle both string and array cases
        const recommendationText = Array.isArray(latestPrediction.recommendation)
          ? latestPrediction.recommendation.join(' ')
          : latestPrediction.recommendation;

        const splitRecommendation = doc.splitTextToSize(recommendationText, 170);
        doc.text(splitRecommendation, 20, 165);
      }

      // Assessment date
      const yPosition = latestPrediction.recommendation ? 185 + (Array.isArray(latestPrediction.recommendation) ? latestPrediction.recommendation.length * 5 : 20) : 175;
      doc.setFontSize(12);
      doc.text(`Assessment Date: ${new Date(latestPrediction.created_at).toLocaleDateString()}`, 20, yPosition);
      
      // Download
      const filename = `cgpa_report_${firstName.toLowerCase()}_${timestamp}.pdf`;
      doc.save(filename);
      
      toast({
        title: "Report Downloaded!",
        description: `Your CGPA report has been saved as ${filename}`,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShareProgress = async () => {
    if (!predictions.length) {
      toast({
        title: "No Data to Share",
        description: "Complete an assessment first to share your progress.",
        variant: "destructive",
      });
      return;
    }

    try {
      const latestPrediction = predictions[0];
      const shareText = `My predicted CGPA is ${latestPrediction.gpa}! 🎓\nTry yours at: ${window.location.origin}/calculator`;
      
      // Try native share API first
      if (navigator.share) {
        await navigator.share({
          title: 'My CGPA Prediction',
          text: shareText,
        });
        toast({
          title: "Shared Successfully!",
          description: "Your progress has been shared.",
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "✅ Copied to clipboard",
          description: "Your progress summary has been copied to clipboard.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Try clipboard as final fallback
      try {
        const latestPrediction = predictions[0];
        const shareText = `My predicted CGPA is ${latestPrediction.gpa}! 🎓\nTry yours at: ${window.location.origin}/calculator`;
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "✅ Copied to clipboard",
          description: "Your progress summary has been copied to clipboard.",
        });
      } catch (clipboardError) {
        toast({
          title: "Share Failed",
          description: "Unable to share or copy to clipboard. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const getFirstName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name.split(' ')[0];
    }
    if (profile?.full_name) {
      return profile.full_name.split(' ')[0];
    }
    return 'Guest';
  };

  const getAvatarUrl = () => {
    return user?.user_metadata?.avatar_url || profile?.avatar_url;
  };

  const getProbabilityStatus = (probability: number) => {
    if (probability >= 80) return { label: "On Track", color: "bg-green-100 text-green-800" };
    if (probability >= 60) return { label: "Moderate", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Needs Improvement", color: "bg-red-100 text-red-800" };
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <GraduationLoader size="lg" />
          <p className="mt-4 text-slate-600">Loading your academic dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const latestPrediction = predictions[0];
  const hasAssessments = predictions.length > 0;
  const firstName = getFirstName();
  const avatarUrl = getAvatarUrl();
  const hasReachedLimit = predictions.length >= ASSESSMENT_LIMIT;

  // Calculate profile completion
  const profileFields = [
    profile?.full_name,
    profile?.email,
    latestPrediction?.gpa,
    latestPrediction?.credits_completed
  ];
  const completedFields = profileFields.filter(field => field !== null && field !== undefined).length;
  const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Success Alert for New Assessment */}
      {showNewAssessmentAlert && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md mb-4 mx-4 mt-4">
          ✅ Your new prediction has been updated on the dashboard.
        </div>
      )}

      {/* Header Section */}
      <section 
        className="relative py-8 md:py-16 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.2)), url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1920&h=400&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="animate-fadeInUp text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                {avatarUrl && (
                  <img 
                    src={avatarUrl} 
                    alt="Profile" 
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-white/50 shadow-lg"
                  />
                )}
                <div>
                  <h1 className="text-2xl md:text-4xl font-light text-white mb-1"
                      style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                    Welcome back, {firstName}!
                  </h1>
                  <p className="text-lg md:text-xl text-blue-50 font-light">Track your academic journey</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
              {hasReachedLimit ? (
                <Button 
                  size="lg" 
                  disabled
                  className="bg-gray-400 text-gray-600 cursor-not-allowed shadow-lg w-full sm:w-auto"
                >
                  <Trophy className="mr-2 h-5 w-5" />
                  Assessment Limit Reached ({ASSESSMENT_LIMIT}/{ASSESSMENT_LIMIT})
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  onClick={handleCreatePrediction}
                  disabled={isPreparingNewAssessment}
                  className="bg-white text-blue-600 hover:bg-blue-50 professional-hover shadow-lg w-full sm:w-auto disabled:opacity-50"
                >
                  {isPreparingNewAssessment ? (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Preparing...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-5 w-5" />
                      New Assessment ({predictions.length}/{ASSESSMENT_LIMIT})
                    </>
                  )}
                </Button>
              )}
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleLogout}
                className="bg-white/20 border-white text-white hover:bg-white/30 professional-hover w-full sm:w-auto"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="shadow-lg border-0 professional-hover animate-fadeInUp">
              <CardHeader className="text-center">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Profile" 
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto mb-4 border-4 border-blue-100 shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-sm">
                    <User className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                )}
                <CardTitle className="text-lg md:text-xl font-medium">{profile?.full_name || firstName}</CardTitle>
                <p className="text-slate-600 text-xs md:text-sm">{profile?.email || user.email}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-600 text-sm">Predicted GPA:</span>
                    </div>
                    <Badge className="bg-green-50 text-green-700 border-green-200">
                      {displayedCGPA || (latestPrediction?.gpa ? Number(latestPrediction.gpa).toFixed(2) : 'N/A')}
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
                    <Badge className={`${hasReachedLimit ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                      {predictions.length}/{ASSESSMENT_LIMIT}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Completion Card */}
            <Card className="shadow-lg border-0 professional-hover">
              <CardHeader className="pb-4">
                <CardTitle className="text-base md:text-lg font-medium flex items-center">
                  <Info className="mr-2 h-4 md:h-5 w-4 md:w-5 text-blue-600" />
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
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Latest Assessment Results - Two Column Layout */}
            {hasAssessments && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Predicted CGPA Card with Loading State */}
                <Card className="shadow-lg border-0 professional-hover animate-fadeInUp">
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center text-lg md:text-xl font-medium">
                      <GraduationCap className="mr-2 h-5 w-5 text-blue-600" />
                      Predicted CGPA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    {isCalculatingCGPA ? (
                      <div className="space-y-3">
                        <div className="text-2xl md:text-3xl font-light text-blue-600">
                          Calculating CGPA...
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                          {displayedCGPA || (latestPrediction?.gpa ? Number(latestPrediction.gpa).toFixed(2) : 'N/A')}
                        </div>
                        <p className="text-slate-600 font-light">Based on your latest assessment</p>
                        <Badge className="mt-3 bg-blue-50 text-blue-700 border-blue-200">
                          Latest Result
                        </Badge>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* AI Recommendation Card with Loading State */}
                <Card className="shadow-lg border-0 professional-hover animate-fadeInUp">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg md:text-xl font-medium">
                      <MessageSquare className="mr-2 h-5 w-5 text-green-600" />
                      AI Recommendation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingRecommendation ? (
                      <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                        <p className="text-green-800 font-light text-sm md:text-base">
                          Generating recommendation...
                        </p>
                      </div>
                    ) : displayedRecommendation ? (
                      <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                        <p className="text-green-800 font-light text-sm md:text-base">
                          {displayedRecommendation}
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-50 border-l-4 border-slate-300 rounded-lg">
                        <p className="text-slate-600 font-light text-sm">
                          {hasReachedLimit 
                            ? "You've completed all available assessments." 
                            : "Complete an assessment to receive personalized recommendations"}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Current Status */}
            <Card className="shadow-lg border-0 professional-hover animate-fadeInUp">
              <CardHeader>
                <CardTitle className="flex items-center text-xl md:text-2xl font-medium">
                  <Target className="mr-2 md:mr-3 h-5 md:h-6 w-5 md:w-6 text-blue-600" />
                  Graduation Probability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  {hasAssessments ? (
                    <>
                      <div className="text-4xl md:text-5xl font-light text-blue-600 mb-2">
                        {latestPrediction?.graduation_probability}%
                      </div>
                      <p className="text-slate-600 mb-4 font-light">Chance of graduating in 4 years</p>
                      <Badge className={`text-base md:text-lg px-3 md:px-4 py-1 md:py-2 font-medium ${
                        getProbabilityStatus(latestPrediction?.graduation_probability).color
                      }`}>
                        {getProbabilityStatus(latestPrediction?.graduation_probability).label}
                      </Badge>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl md:text-5xl font-light text-slate-400 mb-2">--%</div>
                      <p className="text-slate-500 mb-4 font-light">
                        {hasReachedLimit 
                          ? "You've completed all available assessments" 
                          : "Take your first assessment to see your graduation probability"}
                      </p>
                      {!hasReachedLimit && (
                        <Button 
                          onClick={handleCreatePrediction} 
                          disabled={isPreparingNewAssessment}
                          className="shadow-sm w-full sm:w-auto disabled:opacity-50"
                        >
                          {isPreparingNewAssessment ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Preparing...
                            </>
                          ) : (
                            "Start Assessment"
                          )}
                        </Button>
                      )}
                    </>
                  )}
                </div>
                
                {hasAssessments && (
                  <div className="mt-6 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center justify-center space-x-2 w-full sm:w-auto"
                      onClick={handleDownloadReport}
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Report</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center justify-center space-x-2 w-full sm:w-auto"
                      onClick={handleShareProgress}
                    >
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
                <CardTitle className="flex items-center text-xl md:text-2xl font-medium">
                  <Calendar className="mr-2 md:mr-3 h-5 md:h-6 w-5 md:w-6 text-blue-600" />
                  Assessment History
                  <Badge className="ml-3 bg-slate-100 text-slate-600">
                    {predictions.length}/{ASSESSMENT_LIMIT}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hasAssessments ? (
                    predictions.map((prediction, index) => (
                      <div key={prediction.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-100 gap-4 sm:gap-0">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                              GPA: {prediction.gpa ? Number(prediction.gpa).toFixed(2) : 'N/A'} • {prediction.credits_completed} credits
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end space-x-4">
                          <span className="text-xl md:text-2xl font-medium text-blue-600">
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
                      <p className="text-slate-500 mb-4 font-medium">
                        {hasReachedLimit 
                          ? "You've completed all available assessments. Great job!" 
                          : "No assessments yet. Let's get started!"}
                      </p>
                      {!hasReachedLimit && (
                        <Button 
                          onClick={handleCreatePrediction} 
                          disabled={isPreparingNewAssessment}
                          className="shadow-sm w-full sm:w-auto disabled:opacity-50"
                        >
                          {isPreparingNewAssessment ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Preparing...
                            </>
                          ) : (
                            "Take First Assessment"
                          )}
                        </Button>
                      )}
                    </div>
                  )}
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
