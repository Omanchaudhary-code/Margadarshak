
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  id: string;
  google_id: string | null;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
}

interface Prediction {
  id: string;
  graduation_probability: number;
  gpa: number | null;
  credits_completed: number | null;
  study_hours: number | null;
  attendance_rate: number | null;
  created_at: string;
}

export const useUserData = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchPredictions();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPredictions = async () => {
    if (!user) return;

    try {
      // Using type assertion to work around the type issue
      const { data, error } = await (supabase as any)
        .from('predictions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPredictions(data || []);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  const createMockPrediction = async () => {
    if (!user) return;

    const mockPrediction = {
      user_id: user.id,
      graduation_probability: Math.floor(Math.random() * 40) + 60, // 60-100%
      gpa: Number((Math.random() * 1.5 + 2.5).toFixed(2)), // 2.5-4.0
      credits_completed: Math.floor(Math.random() * 40) + 80, // 80-120
      study_hours: Math.floor(Math.random() * 20) + 20, // 20-40 hours
      attendance_rate: Math.floor(Math.random() * 20) + 80, // 80-100%
    };

    try {
      // Using type assertion to work around the type issue
      const { data, error } = await (supabase as any)
        .from('predictions')
        .insert([mockPrediction])
        .select()
        .single();

      if (error) throw error;

      setPredictions(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating mock prediction:', error);
    }
  };

  return {
    profile,
    predictions,
    loading,
    createMockPrediction,
    refetch: () => {
      fetchUserProfile();
      fetchPredictions();
    }
  };
};
