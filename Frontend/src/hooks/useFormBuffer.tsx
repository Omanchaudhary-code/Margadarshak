
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BufferedFormData {
  repeatedCourse: string;
  attendanceLevel: number;
  partTimeJob: string;
  motivationLevel: number;
  firstGeneration: string;
  friendAcademics: number;
  status: 'pending' | 'completed';
  created_at?: string;
}

export const useFormBuffer = () => {
  const { user } = useAuth();
  const [bufferedData, setBufferedData] = useState<BufferedFormData | null>(null);
  const [loading, setLoading] = useState(false);

  // Save form data to buffer
  const bufferFormData = async (formData: Omit<BufferedFormData, 'status' | 'created_at'>) => {
    const dataToBuffer = {
      ...formData,
      status: 'pending' as const,
      created_at: new Date().toISOString()
    };

    if (user) {
      // Save to Supabase for authenticated users
      try {
        const { error } = await supabase.rpc('upsert_form_buffer', {
          p_user_id: user.id,
          p_form_data: dataToBuffer,
          p_status: 'pending'
        });
        
        if (error) throw error;
      } catch (error) {
        console.error('Error buffering to Supabase:', error);
        // Fallback to localStorage
        localStorage.setItem('bufferedFormData', JSON.stringify(dataToBuffer));
      }
    } else {
      // Save to localStorage for unauthenticated users
      localStorage.setItem('bufferedFormData', JSON.stringify(dataToBuffer));
    }
    
    setBufferedData(dataToBuffer);
  };

  // Check for existing buffered or completed data
  const checkForExistingData = async (): Promise<BufferedFormData | null> => {
    if (!user) {
      // Check localStorage for unauthenticated users
      const localData = localStorage.getItem('bufferedFormData');
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          return parsed;
        } catch {
          localStorage.removeItem('bufferedFormData');
        }
      }
      return null;
    }

    setLoading(true);
    try {
      // Check Supabase for authenticated users using RPC
      const { data: bufferData, error: bufferError } = await supabase.rpc('get_form_buffer', {
        p_user_id: user.id
      });

      if (!bufferError && bufferData && bufferData.length > 0) {
        const latestBuffer = bufferData[0];
        const formData = typeof latestBuffer.form_data === 'string' 
          ? JSON.parse(latestBuffer.form_data) 
          : latestBuffer.form_data;
        return { ...formData, status: latestBuffer.status };
      }

      // Check if user has completed assessments
      const { data: predictions, error: predError } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!predError && predictions && predictions.length > 0) {
        return { 
          repeatedCourse: 'No',
          attendanceLevel: predictions[0].attendance_rate || 80,
          partTimeJob: 'No',
          motivationLevel: 5,
          firstGeneration: 'No',
          friendAcademics: 5,
          status: 'completed' as const
        };
      }

      return null;
    } catch (error) {
      console.error('Error checking for existing data:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Clear buffer
  const clearBuffer = async () => {
    if (user) {
      try {
        await supabase.rpc('clear_form_buffer', {
          p_user_id: user.id
        });
      } catch (error) {
        console.error('Error clearing buffer:', error);
      }
    }
    localStorage.removeItem('bufferedFormData');
    setBufferedData(null);
  };

  // Mark as completed
  const markAsCompleted = async () => {
    if (user) {
      try {
        await supabase.rpc('mark_form_buffer_completed', {
          p_user_id: user.id
        });
      } catch (error) {
        console.error('Error marking as completed:', error);
      }
    }
    localStorage.removeItem('bufferedFormData');
  };

  return {
    bufferedData,
    loading,
    bufferFormData,
    checkForExistingData,
    clearBuffer,
    markAsCompleted
  };
};
