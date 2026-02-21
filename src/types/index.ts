
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type MedicationStatus = 'taken' | 'missed' | 'pending';
export type UserRole = 'patient' | 'caretaker' | 'both';
export type MedicationFrequency = 'daily' | 'twice_daily' | 'three_times_daily' | 'weekly';


export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  caretaker_email: string | null;
  notification_time: string | null;
  created_at: string;
  updated_at: string;
}

export type SafeProfile = {
  id: string
  full_name: string
  role: UserRole
  caretaker_email: string | null
  notification_time: string
}

// export type MedicationLog = {
//   id: string
//   medication_id: string
//   user_id: string
//   scheduled_date: string
//   taken: boolean
//   status: String | null
//   taken_at: string | null
//   created_at: string | null
// }


export interface Medication {
  id: string;
  user_id: string | null;
  name: string ;
  dosage: string ;
  frequency: MedicationFrequency;
  reminder_time: string | null;
  is_active: boolean ;
  created_at: string ;
  updated_at: string ;
}

export type MedicationRow = {
  id: string
  name: string
  user_id: string | null
  dosage: string | null
  frequency: string | null
  reminder_time: string | null
  is_active: boolean | null
  created_at: string | null
  updated_at: string | null
}

export interface MedicationLog {
  id: string;
  medication_id: string;
  user_id: string;
  taken_at: string;
  scheduled_date: string;
  status: MedicationStatus;
  created_at: string;
  taken: boolean;
}


export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Profile, 'id'>>;
      };
      medications: {
        Row: Medication;
        Insert: Omit<Medication, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Medication, 'id' | 'user_id'>>;
      };
      medication_logs: {
        Row: MedicationLog;
        Insert: Omit<MedicationLog, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<MedicationLog, 'id' | 'user_id' | 'medication_id'>>;
      };
    };
  };
}


export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  caretaker_email: string;
}

export interface MedicationFormData {
  name: string;
  dosage: string;
  frequency: MedicationFrequency;
  reminder_time?: string;
}

export interface ProfileFormData {
  full_name: string;
  caretaker_email: string;
  notification_time: string;
}


export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

export interface ModalState {
  isOpen: boolean;
  type: 'add-medication' | 'edit-medication' | 'delete-medication' | 'settings' | null;
  data?: Medication | null;
}


export interface MedicationWithStatus extends Medication {
  todayStatus: MedicationStatus | null;
  logId?: string;
}

export interface DailyProgress {
  total: number;
  taken: number;
  missed: number;
  pending: number;
  percentage: number;
}