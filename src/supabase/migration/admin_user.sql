/*
  # Admin Features Schema

  1. New Tables
    - `user_profiles`
      - Extended user information including wallet addresses and balances
    - `kyc_verifications` 
      - KYC verification requests and status
    - `admin_actions`
      - Log of all admin actions
    - `support_tickets`
      - Support ticket system
    - `ticket_messages`
      - Messages within support tickets

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

-- User Profiles table
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE admin_role AS ENUM ('super_admin', 'support_admin', 'kyc_admin');

CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  role admin_role NOT NULL DEFAULT 'support_admin',
  created_at timestamptz DEFAULT now(),
  last_login timestamptz,
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  eth_address text,
  btc_address text,
  eth_balance numeric DEFAULT 0,
  btc_balance numeric DEFAULT 0,
  is_blocked boolean DEFAULT false,
  two_factor_enabled boolean DEFAULT false,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- KYC Verifications table
CREATE TABLE IF NOT EXISTS kyc_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  status text CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  document_type text NOT NULL,
  document_url text NOT NULL,
  submitted_at timestamptz DEFAULT now(),
  verified_at timestamptz,
  verified_by uuid REFERENCES auth.users,
  notes text,
  UNIQUE(user_id)
);

-- Admin Actions table
CREATE TABLE IF NOT EXISTS admin_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users NOT NULL,
  action_type text NOT NULL,
  target_user_id uuid REFERENCES auth.users,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Support Tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  subject text NOT NULL,
  status text CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')) DEFAULT 'open',
  priority text CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  assigned_to uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ticket Messages table
CREATE TABLE IF NOT EXISTS ticket_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES support_tickets ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

-- Policies for admin access
CREATE POLICY "Admins can view all user profiles"
  ON user_profiles FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admins can update user profiles"
  ON user_profiles FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all KYC verifications"
  ON kyc_verifications FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admins can update KYC verifications"
  ON kyc_verifications FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all actions"
  ON admin_actions FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admins can insert actions"
  ON admin_actions FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all tickets"
  ON support_tickets FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admins can update tickets"
  ON support_tickets FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all ticket messages"
  ON ticket_messages FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admins can insert ticket messages"
  ON ticket_messages FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  ));