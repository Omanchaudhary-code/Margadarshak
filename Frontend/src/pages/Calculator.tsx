
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/LoginModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Calculator = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Check if user came back from authentication
  useEffect(() => {
    if (isLoggedIn && showLoginModal) {
      setShowLoginModal(false);
      handleSubmitAndRedirect();
    }
  }, [isLoggedIn]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

      // Check if user is authenticated using Supabase
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error checking auth:', error);
      }
      
      if (!user) {
        // Store form data temporarily before showing login modal
        localStorage.setItem('pendingAssessmentData', JSON.stringify(formData));
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
      repeatedCourses: assessmentData.repeatedCourse === "Yes",
      attendance: assessmentData.attendanceLevel,
      hasPartTimeJob: assessmentData.partTimeJob === "Yes",
      motivation: assessmentData.motivationLevel,
      isFirstGenCollegeStudent: assessmentData.firstGeneration === "Yes",
      friendAcademicSupport: assessmentData.friendAcademics,
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
      
      // Get form data from localStorage if it was stored during login flow
      const storedData = localStorage.getItem('pendingAssessmentData');
      const dataToSubmit = storedData ? JSON.parse(storedData) : formData;
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Submit to try_calculator_inputs table
      const { error: insertError } = await supabase
        .from('try_calculator_inputs')
        .insert([{
          repeated_course: dataToSubmit.repeatedCourse === "Yes",
          attendance_level: dataToSubmit.attendanceLevel,
          part_time_job: dataToSubmit.partTimeJob === "Yes",
          motivation_level: dataToSubmit.motivationLevel,
          first_generation: dataToSubmit.firstGeneration === "Yes",
          friend_academics: dataToSubmit.friendAcademics,
        }]);

      if (insertError) {
        console.error('Error inserting try calculator inputs:', insertError);
        throw new Error('Failed to save assessment data');
      }

      // Call FastAPI model to get graduation probability
      const modelResponse = await callFastAPIModel(dataToSubmit);
      const graduationProbability = Math.round(modelResponse.graduation_probability * 100);

      // Insert assessment data into existing predictions table using type assertion
      const { error: predictionsError } = await (supabase as any)
        .from('predictions')
        .insert([{
          user_id: user.id,
          graduation_probability: graduationProbability,
          gpa: 3.0, // Default value since we're not collecting this anymore
          credits_completed: 60, // Default value
          study_hours: 4, // Default value
          attendance_rate: dataToSubmit.attendanceLevel,
        }]);

      if (predictionsError) {
        console.error('Error inserting prediction:', predictionsError);
        // Continue anyway - we can still redirect to dashboard
      }
      
      // Clean up pending data
      localStorage.removeItem('pendingAssessmentData');
      
      // Show success toast
      toast({
        title: "Assessment Complete!",
        description: `Graduation probability: ${graduationProbability}%. Redirecting you to your dashboard...`,
      });
      
      // Small delay to show the success message, then redirect
      setTimeout(() => {
        navigate('/dashboard?from=assessment');
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit your assessment. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    toast({
      title: "Authentication Successful!",
      description: "Processing your assessment...",
    });
    // handleSubmitAndRedirect will be called via useEffect when isLoggedIn changes
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
    setIsSubmitting(false);
    // Keep the pending data in localStorage in case user wants to try again
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

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
                  Attendance Level: {formData.attendanceLevel}%
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
                <Label htmlFor="partTimeJob" className="text-base font-medium">Do you have a part-time job?</Label>
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
                  Motivation Level: {formData.motivationLevel}/10
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
                <Label htmlFor="firstGeneration" className="text-base font-medium">Are you a first-generation college student?</Label>
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
                  Friend Academic Support: {formData.friendAcademics}/10
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
