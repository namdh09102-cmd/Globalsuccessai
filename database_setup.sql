-- Globalsuccess AI - Initial Database Schema

-- Xóa các bảng cũ nếu đã tồn tại để tránh lỗi "relation already exists"
DROP TABLE IF EXISTS public.admin_settings CASCADE;
DROP TABLE IF EXISTS public.curriculums CASCADE;
DROP TABLE IF EXISTS public.class_members CASCADE;
DROP TABLE IF EXISTS public.classes CASCADE;
DROP TABLE IF EXISTS public.learning_logs CASCADE;
DROP TABLE IF EXISTS public.student_stats CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Bật UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Bảng Profiles (Thay thế gsa-users, gsa-current-user)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
    grade_level TEXT DEFAULT 'none',
    school TEXT DEFAULT 'Chưa cập nhật',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    pro_expires_at TIMESTAMP WITH TIME ZONE
);

-- Thêm các cột nếu bảng profiles đã tồn tại từ trước (để tránh lỗi relation already exists)
DO $$
BEGIN
    BEGIN
        ALTER TABLE public.profiles ADD COLUMN role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin'));
    EXCEPTION WHEN duplicate_column THEN END;
    
    BEGIN
        ALTER TABLE public.profiles ADD COLUMN tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro'));
    EXCEPTION WHEN duplicate_column THEN END;
    
    BEGIN
        ALTER TABLE public.profiles ADD COLUMN grade_level TEXT DEFAULT 'none';
    EXCEPTION WHEN duplicate_column THEN END;
    
    BEGIN
        ALTER TABLE public.profiles ADD COLUMN school TEXT DEFAULT 'Chưa cập nhật';
    EXCEPTION WHEN duplicate_column THEN END;
    
    BEGIN
        ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
    EXCEPTION WHEN duplicate_column THEN END;
    
    BEGIN
        ALTER TABLE public.profiles ADD COLUMN pro_expires_at TIMESTAMP WITH TIME ZONE;
    EXCEPTION WHEN duplicate_column THEN END;
END $$;

-- 2. Bảng Student Stats (Thay thế gsa-student-stats)
CREATE TABLE IF NOT EXISTS public.student_stats (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    xp INTEGER DEFAULT 0,
    diamonds INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    last_active_date DATE DEFAULT CURRENT_DATE
);

-- 3. Bảng Learning Logs (Lưu lại lịch sử làm bài, chấm điểm)
CREATE TABLE IF NOT EXISTS public.learning_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- e.g., 'speaking', 'dictation', 'lesson'
    lesson_id TEXT,
    score NUMERIC(5, 2),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Bảng Classes (Lớp học do giáo viên tạo)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    class_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    grade_level TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Bảng Class Members (Học sinh tham gia lớp)
CREATE TABLE IF NOT EXISTS public.class_members (
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (class_id, student_id)
);

-- 6. Bảng Curriculums (Giáo trình - gsa-curriculum)
CREATE TABLE IF NOT EXISTS public.curriculums (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    grade_level TEXT NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Bảng Admin Settings (Cấu hình chung của hệ thống)
CREATE TABLE IF NOT EXISTS public.admin_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Security Policies (Row Level Security)

-- Bật RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Profiles: Bất cứ ai đăng nhập đều có thể đọc profiles (để thấy bảng xếp hạng).
-- Update: User chỉ có thể update profile của chính mình. Admin có thể update mọi thứ.
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Student Stats: Bất kỳ ai cũng có thể đọc (leaderboard). User update của chính mình.
CREATE POLICY "Stats are viewable by everyone" ON public.student_stats FOR SELECT USING (true);
CREATE POLICY "Users can insert own stats" ON public.student_stats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON public.student_stats FOR UPDATE USING (auth.uid() = user_id);

-- Learning Logs: Chỉ user đó đọc được log của mình hoặc Admin.
CREATE POLICY "Users can view own logs" ON public.learning_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs" ON public.learning_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Classes: Mọi người có thể xem danh sách lớp (để join). Giáo viên chỉ sửa lớp mình.
CREATE POLICY "Classes viewable by everyone" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Teachers can insert classes" ON public.classes FOR INSERT WITH CHECK (auth.uid() = teacher_id);

-- Class Members: Mọi người có thể xem danh sách thành viên lớp. Học sinh tự insert mình.
CREATE POLICY "Class members viewable by everyone" ON public.class_members FOR SELECT USING (true);
CREATE POLICY "Students can join classes" ON public.class_members FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Curriculums: Mọi người đều đọc được. Chỉ admin sửa được.
CREATE POLICY "Curriculums viewable by everyone" ON public.curriculums FOR SELECT USING (true);

-- Settings: Mọi người đều đọc được các cài đặt cơ bản.
CREATE POLICY "Settings viewable by everyone" ON public.admin_settings FOR SELECT USING (true);

-- -- Trigger to automatically create stats for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_stats()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.student_stats (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_stats();
