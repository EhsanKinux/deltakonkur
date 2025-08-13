import AuthForm from "../_components/form/AuthForm";
import logo from "@/assets/images/DeltaKonkur_Logo.png";

const SignIn = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Primary Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/8 via-purple-400/5 to-indigo-400/8"></div>

        {/* Floating Geometric Elements */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-400/12 to-purple-400/12 rounded-full animate-float-slow blur-sm"></div>
        <div className="absolute top-40 right-32 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-blue-400/10 rounded-full animate-float-medium blur-sm"></div>
        <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-to-br from-purple-400/8 to-pink-400/8 rounded-full animate-float-fast blur-sm"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-gradient-to-br from-blue-300/12 to-indigo-300/12 rounded-full animate-float-slow blur-sm"></div>

        {/* Animated Shapes */}
        <div className="absolute top-1/3 left-1/3 w-16 h-16 bg-gradient-to-br from-blue-500/6 to-purple-500/6 rounded-lg rotate-45 animate-pulse-slow"></div>
        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-gradient-to-br from-indigo-500/8 to-blue-500/8 rounded-full animate-bounce-slow"></div>
        <div className="absolute bottom-1/3 left-1/2 w-14 h-14 bg-gradient-to-br from-purple-500/6 to-pink-500/6 rounded-lg animate-spin-slow"></div>

        {/* Large Gradient Orbs */}
        <div className="absolute top-10 right-10 w-60 h-60 bg-gradient-to-br from-blue-400/2 to-purple-400/2 rounded-full blur-3xl animate-pulse-very-slow"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-indigo-400/1.5 to-blue-400/1.5 rounded-full blur-3xl animate-pulse-very-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/1 to-pink-400/1 rounded-full blur-3xl animate-pulse-very-slow delay-2000"></div>

        {/* Animated Lines */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-0 w-40 h-px bg-gradient-to-r from-transparent via-blue-400/15 to-transparent animate-slide-right"></div>
          <div className="absolute top-40 right-0 w-32 h-px bg-gradient-to-l from-transparent via-purple-400/15 to-transparent animate-slide-left"></div>
          <div className="absolute bottom-32 left-0 w-28 h-px bg-gradient-to-r from-transparent via-indigo-400/15 to-transparent animate-slide-right delay-1000"></div>
        </div>

        {/* Particle Effects */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/25 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-400/35 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-indigo-400/45 rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Main Content Container - Full Screen Layout */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Enhanced Brand Section (Desktop Only) */}
        <div className="hidden lg:flex lg:w-1/2 relative z-10">
          <div className="flex flex-col justify-center items-center text-gray-800 px-16 py-12 w-full">
            <div className="text-center space-y-10 max-w-md animate-fade-in-down">
              {/* Enhanced Logo */}
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl animate-glow-pulse">
                <span className="text-5xl font-extrabold text-white drop-shadow-lg">
                  <img src="/DeltaKonkur_Logo.png" alt="delta logo" />
                </span>
              </div>

              {/* Enhanced Typography */}
              <div className="space-y-6">
                <h1 className="text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                  دلتا کنکور
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed font-medium">
                  سیستم مدیریت جامع موسسه آموزشی
                </p>
                <p className="text-base text-gray-500 leading-relaxed">
                  مدیریت هوشمند دانش‌آموزان، مشاوران، ناظران و تمامی بخش‌های
                  موسسه
                </p>
              </div>

              {/* Feature Highlights for Management Dashboard */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-3 space-x-reverse text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>مدیریت دانش‌آموزان و مشاوران</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>نظارت و کنترل عملکرد</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>حسابداری و مدیریت مالی</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse text-sm text-gray-600">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <span>گزارش‌گیری و تحلیل داده‌ها</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse text-sm text-gray-600">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span>مدیریت فروش و بازاریابی</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Enhanced Login Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
          <div className="w-full max-w-md">
            {/* Mobile Brand Section */}
            <div className="lg:hidden text-center mb-8 animate-fade-in-down">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-2xl shadow-lg animate-glow-pulse mb-4">
                <span className="text-3xl font-extrabold text-white drop-shadow-lg">
                  <img src={logo} alt="logo" className="w-6 h-6" />
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
                دلتا کنکور
              </h2>
              <p className="text-sm text-gray-600">سیستم مدیریت هوشمند</p>
            </div>

            {/* Enhanced Form Container */}
            <div className="bg-white/90 backdrop-blur-xl rounded-lg shadow-2xl border border-white/30 p-8 md:p-10 animate-scale-in">
              <AuthForm />
            </div>

            {/* Enhanced Footer */}
            <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center animate-fade-in-up delay-300">
              <p className="text-xs text-gray-600">
                برای دسترسی به تمامی امکانات سیستم، لطفاً وارد حساب کاربری خود
                شوید
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
