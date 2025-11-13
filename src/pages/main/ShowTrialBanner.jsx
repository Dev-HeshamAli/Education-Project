


  const [showTrialBanner, setShowTrialBanner] = useState(true);

  const closeBanner = () => {
    setShowTrialBanner(false);
  };


{
  showTrialBanner && (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative bg-gradient-to-r from-orange-500/90 to-orange-600/90 backdrop-blur-md rounded-2xl p-8 mx-4 max-w-2xl w-full shadow-2xl border border-orange-300/30">
        {/* Animated Stars */}
        {/*<div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute top-4 left-4 text-yellow-300 animate-pulse">⭐</div>
              <div className="absolute top-6 right-8 text-yellow-300 animate-bounce">⭐</div>
              <div className="absolute bottom-8 left-8 text-yellow-300 animate-pulse">⭐</div>
              <div className="absolute bottom-4 right-4 text-yellow-300 animate-bounce">⭐</div>
              <div className="absolute top-1/2 left-1/4 text-yellow-300 animate-pulse">⭐</div>
              <div className="absolute top-1/3 right-1/4 text-yellow-300 animate-bounce">⭐</div>
            </div>*/}

        {/* Close Button */}
        <button
          onClick={closeBanner}
          className="absolute top-4 right-4 text-white hover:text-orange-200 transition-colors duration-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20"
        >
          ×
        </button>

        {/* Banner Content */}
        <div className="text-center relative z-10">
          <div className="mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
              بدأ التشغيل
            </h2>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-xl md:text-2xl font-semibold text-white drop-shadow-md">
                تبدأ الدراسة يوم السبت
              </p>
              <p className="text-2xl md:text-3xl font-bold text-yellow-300 mt-2 drop-shadow-lg">
                18-10-2025
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-white/90 text-lg mb-4 drop-shadow-md">
              كن من أول المستفيدين من منصتنا التعليمية المبتكرة
            </p>
            <button
              onClick={closeBanner}
              className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              سجل الآن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
