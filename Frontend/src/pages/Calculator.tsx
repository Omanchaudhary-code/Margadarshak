import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Info, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/LoginModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useFormBuffer } from "@/hooks/useFormBuffer";

const Calculator = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const { bufferFormData, checkForExistingData, clearBuffer, markAsCompleted } = useFormBuffer();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingData, setIsCheckingData] = useState(true);
  const [formData, setFormData] = useState({
    repeatedCourse: "",
    attendanceLevel: 80,
    partTimeJob: "",
    motivationLevel: 5,
    firstGeneration: "",
    friendAcademics: 5,
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  // Check for existing data on component mount and auth changes
  useEffect(() => {
    const checkData = async () => {
      setIsCheckingData(true);
      const existingData = await checkForExistingData();
      
      if (existingData) {
        if (existingData.status === 'completed') {
          // User has completed assessment, redirect to dashboard
          navigate('/dashboard', { replace: true });
          return;
        } else if (existingData.status === 'pending') {
          // Load buffered data into form
          setFormData({
            repeatedCourse: existingData.repeatedCourse,
            attendanceLevel: existingData.attendanceLevel,
            partTimeJob: existingData.partTimeJob,
            motivationLevel: existingData.motivationLevel,
            firstGeneration: existingData.firstGeneration,
            friendAcademics: existingData.friendAcademics,
          });
        }
      }
      setIsCheckingData(false);
    };

    checkData();
  }, [user, isLoggedIn]);

  // Check if user came back from authentication
  useEffect(() => {
    if (isLoggedIn && showLoginModal) {
      setShowLoginModal(false);
      handleSubmitAndRedirect();
    }
  }, [isLoggedIn]);

  const handleInputChange = (field: string, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Buffer data on each change
    bufferFormData(newFormData);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleGetResults();
    }
  };

  const handleGetResults = async () => {
    setIsSubmitting(true);
    
    try {
      // Validate form data
      if (!formData.repeatedCourse || !formData.partTimeJob || !formData.firstGeneration) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Check if user is authenticated
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error checking auth:', error);
      }
      
      if (!user) {
        // Buffer data before showing login modal
        await bufferFormData(formData);
        setShowLoginModal(true);
        setIsSubmitting(false);
        return;
      }

      await handleSubmitAndRedirect();
    } catch (error) {
      console.error('Error getting results:', error);
      toast({
        title: "Error",
        description: "Failed to process your assessment. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const callFastAPIModel = async (assessmentData: any) => {
    const payload = {
      repeated_course: assessmentData.repeatedCourse === "Yes" ? 1 : 0,
      attendance: parseFloat(assessmentData.attendanceLevel.toString()),
      part_time_job: assessmentData.partTimeJob === "Yes" ? 1 : 0,
      motivation_level: parseFloat(assessmentData.motivationLevel.toString()),
      first_generation: assessmentData.firstGeneration === "Yes" ? 1 : 0,
      friends_performance: parseFloat(assessmentData.friendAcademics.toString()),
    };

    console.log('Sending payload to FastAPI:', payload);

    const response = await fetch('https://fastapi-margadarshak-mmqn.onrender.com/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('FastAPI response:', result);
    
    return result;
  };

  const handleSubmitAndRedirect = async () => {
    try {
      setIsSubmitting(true);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Call FastAPI model to get predicted CGPA and recommendation
      const modelResponse = await callFastAPIModel(formData);
      const predictedCgpa = parseFloat(modelResponse.predicted_cgpa);
      const recommendation = modelResponse.recommendation || '';

      console.log('Model response data:', { predictedCgpa, recommendation });

      // Submit to try_calculator_inputs table with recommendation
      const { error: insertError } = await supabase
        .from('try_calculator_inputs')
        .insert([{
          given_compart_exam: formData.repeatedCourse === "Yes",
          attendance_level: formData.attendanceLevel,
          part_time_job: formData.partTimeJob === "Yes",
          motivation_level: formData.motivationLevel,
          first_generation: formData.firstGeneration === "Yes",
          friend_academic_level: formData.friendAcademics,
          recommendation: recommendation,
        }]);

      if (insertError) {
        console.error('Error inserting try calculator inputs:', insertError);
        throw new Error(`Failed to save assessment data: ${insertError.message}`);
      }

      // Insert assessment data into existing predictions table with recommendation
      const { error: predictionsError } = await supabase
        .from('predictions')
        .insert([{
          user_id: user.id,
          graduation_probability: Math.round(predictedCgpa * 25), // Convert CGPA to percentage approximation
          gpa: predictedCgpa,
          credits_completed: 60, // Default value
          study_hours: 4, // Default value
          attendance_rate: formData.attendanceLevel,
          recommendation: recommendation,
        }]);

      if (predictionsError) {
        console.error('Error inserting prediction:', predictionsError);
        throw new Error(`Failed to save prediction data: ${predictionsError.message}`);
      }
      
      // Mark buffer as completed and clean up
      await markAsCompleted();
      
      // Redirect without any messages or alerts
      navigate('/dashboard', { replace: true });
      
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit your assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // handleSubmitAndRedirect will be called via useEffect when isLoggedIn changes
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
    setIsSubmitting(false);
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStartNewAssessment = async () => {
    await clearBuffer();
    setFormData({
      repeatedCourse: "",
      attendanceLevel: 80,
      partTimeJob: "",
      motivationLevel: 5,
      firstGeneration: "",
      friendAcademics: 5,
    });
    setCurrentStep(1);
  };

  // Show loading spinner while checking for existing data
  if (isCheckingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Academic Background</h3>
              <p className="text-gray-600">Tell us about your academic experience</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="repeatedCourse" className="text-base font-medium">Have you repeated any courses?</Label>
                <Select value={formData.repeatedCourse} onValueChange={(value) => handleInputChange('repeatedCourse', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">Whether you have repeated any courses during your studies</p>
              </div>

              <div>
                <Label className="text-base font-medium mb-4 block">
                  On average, how often do you attend your classes: {formData.attendanceLevel}%
                </Label>
                <Slider
                  value={[formData.attendanceLevel]}
                  onValueChange={(value) => handleInputChange('attendanceLevel', value[0])}
                  max={100}
                  min={0}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>0%</span>
                  <span>100%</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Your average class attendance percentage</p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Work & Motivation</h3>
              <p className="text-gray-600">Help us understand your current situation</p>
            </div>

            <div className="space-y-8">
              <div>
                <Label htmlFor="partTimeJob" className="text-base font-medium">Are you doing any kind of job while going to college?</Label>
                <Select value={formData.partTimeJob} onValueChange={(value) => handleInputChange('partTimeJob', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">Whether you currently work part-time while studying</p>
              </div>

              <div>
                <Label className="text-base font-medium mb-4 block">
                  How motivated do you feel to complete your studies and graduate: {formData.motivationLevel}/10
                </Label>
                <Slider
                  value={[formData.motivationLevel]}
                  onValueChange={(value) => handleInputChange('motivationLevel', value[0])}
                  max={10}
                  min={0}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Background & Support</h3>
              <p className="text-gray-600">These factors help us provide better predictions</p>
            </div>

            <div className="space-y-8">
              <div>
                <Label htmlFor="firstGeneration" className="text-base font-medium">Are you the first person in your family to attend college or university?</Label>
                <Select value={formData.firstGeneration} onValueChange={(value) => handleInputChange('firstGeneration', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">Whether you are the first in your family to attend college</p>
              </div>

              <div>
                <Label className="text-base font-medium mb-4 block">
                  How much do your friends help you with your studies: {formData.friendAcademics}/10
                </Label>
                <Slider
                  value={[formData.friendAcademics]}
                  onValueChange={(value) => handleInputChange('friendAcademics', value[0])}
                  max={10}
                  min={0}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Low Support</span>
                  <span>High Support</span>
                </div>
              </div>
            </div>

            {/* Additional microcopy for final step */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800 font-medium">
                    Sign in to access your prediction and personalized tips.
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Login ensures your data is saved and tailored recommendations are delivered.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Academic Assessment</h1>
          <p className="text-lg text-gray-600">Answer a few questions to generate your graduation forecast</p>
          
          {/* Trust-building copy */}
          <div className="mt-4 flex items-center justify-center text-sm text-blue-700 bg-blue-50 rounded-lg p-3">
            <Info className="h-4 w-4 mr-2" />
            <span>Try it free. Sign in to view your result and save your progress.</span>
          </div>

          {/* Start New Assessment Button - only show for authenticated users */}
          {user && (
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={handleStartNewAssessment}
                className="text-sm"
              >
                Start New Assessment
              </Button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-center">
              {currentStep === 1 && "📚 Academic Details"}
              {currentStep === 2 && "⏰ Work & Motivation"}
              {currentStep === 3 && "💪 Background & Support"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {renderStep()}

            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1 || isSubmitting}
                className="px-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 px-6"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {currentStep === totalSteps ? 'Get Results' : 'Next'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={handleLoginModalClose}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Calculator;
