-- Supabase Database Schema for Portfolio
-- Run these commands in your Supabase SQL Editor

-- 1. CERTIFICATES TABLE
CREATE TABLE certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  issuer VARCHAR(255) NOT NULL,
  issue_date DATE,
  expiry_date DATE,
  credential_id VARCHAR(255),
  credential_url TEXT,
  description TEXT,
  skills TEXT[], -- Array of skills
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. EDUCATION TABLE
CREATE TABLE education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  institution VARCHAR(255) NOT NULL,
  degree VARCHAR(255) NOT NULL,
  field_of_study VARCHAR(255),
  start_year INTEGER NOT NULL,
  end_year INTEGER,
  is_current BOOLEAN DEFAULT false,
  grade VARCHAR(50),
  description TEXT,
  location VARCHAR(255),
  achievements TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. EXPERIENCE TABLE
CREATE TABLE experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  employment_type VARCHAR(100), -- Full-time, Part-time, Internship, etc.
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  location VARCHAR(255),
  description TEXT,
  responsibilities TEXT[],
  technologies TEXT[],
  achievements TEXT[],
  company_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on certificates" ON certificates
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on education" ON education
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on experience" ON experience
  FOR SELECT USING (true);

-- Create policies for authenticated admin access (you'll need to set up authentication)
-- For now, we'll allow all operations (you can restrict this later)
CREATE POLICY "Allow all operations on certificates" ON certificates
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on education" ON education
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on experience" ON experience
  FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_certificates_issue_date ON certificates(issue_date DESC);
CREATE INDEX idx_certificates_featured ON certificates(is_featured);
CREATE INDEX idx_education_start_year ON education(start_year DESC);
CREATE INDEX idx_experience_start_date ON experience(start_date DESC);
CREATE INDEX idx_experience_current ON experience(is_current);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON certificates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. FEATURED PROJECTS TABLE
CREATE TABLE featured_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  github_id TEXT NOT NULL UNIQUE, -- GitHub repository ID (as text to avoid JS precision issues)
  name VARCHAR(255) NOT NULL,
  description TEXT,
  html_url TEXT NOT NULL,
  homepage TEXT,
  language VARCHAR(100),
  stargazers_count INTEGER DEFAULT 0,
  forks_count INTEGER DEFAULT 0,
  created_at_github TIMESTAMP WITH TIME ZONE,
  updated_at_github TIMESTAMP WITH TIME ZONE,
  topics TEXT[], -- Array of repository topics
  size INTEGER DEFAULT 0,
  default_branch VARCHAR(100),
  is_private BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0, -- For custom ordering
  is_featured BOOLEAN DEFAULT true, -- Allow toggling without deletion
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for featured_projects
ALTER TABLE featured_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for featured_projects
CREATE POLICY "Allow public read access on featured_projects" ON featured_projects
  FOR SELECT USING (is_featured = true);

CREATE POLICY "Allow all operations on featured_projects" ON featured_projects
  FOR ALL USING (true);

-- Create indexes for featured_projects
CREATE INDEX idx_featured_projects_github_id ON featured_projects(github_id);
CREATE INDEX idx_featured_projects_featured ON featured_projects(is_featured);
CREATE INDEX idx_featured_projects_order ON featured_projects(display_order);
CREATE INDEX idx_featured_projects_updated ON featured_projects(updated_at_github DESC);

-- Create trigger for featured_projects updated_at
CREATE TRIGGER update_featured_projects_updated_at BEFORE UPDATE ON featured_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO certificates (title, issuer, issue_date, credential_url, description, skills, is_featured) VALUES
('Intermediate Machine Learning', 'Kaggle', '2024-01-15', 'https://www.kaggle.com/learn/certification/znaxxh/intermediate-machine-learning', 'Advanced machine learning techniques and model optimization', ARRAY['Machine Learning', 'Python', 'Data Science'], true),
('API Fundamentals Student Expert', 'Postman', '2024-02-20', 'https://api.postman.com/collections/12345', 'API development and testing fundamentals', ARRAY['API Development', 'Testing', 'Postman'], true);

INSERT INTO education (institution, degree, field_of_study, start_year, end_year, is_current, location, description) VALUES
('International Institute Of Information Technology', 'B.Tech', 'Data Science And Artificial Intelligence', 2022, 2026, true, 'Raipur, Chhattisgarh', 'Currently pursuing B.Tech in Data Science and Artificial Intelligence with focus on machine learning and AI applications.');

INSERT INTO experience (company, position, employment_type, start_date, end_date, is_current, location, description, responsibilities, technologies) VALUES
('CDAC', 'Virtual Cybersecurity Intern', 'Internship', '2024-06-01', '2024-08-31', false, 'Remote', 'Cybersecurity internship focusing on network security and vulnerability assessment',
ARRAY['Performed network monitoring and vulnerability scans', 'Utilized Google Dorks and DNS enumeration', 'Led six-week security assessment', 'Implemented layered security defenses'],
ARRAY['Wireshark', 'NMAP', 'Nuclei', 'DNS Enumeration', 'Network Security']);
