interface VoiceControlsProps {
  onMicClick: () => void;
  isListening: boolean;
  selectedLang: 'auto' | 'fa-IR' | 'en-US';
  onLangChange: (lang: 'auto' | 'fa-IR' | 'en-US') => void;
}

export default function VoiceControls({
  onMicClick,
  isListening,
  selectedLang,
  onLangChange,
}: VoiceControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onMicClick}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
          isListening
            ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
            : 'bg-gray-600 text-white hover:bg-gray-500'
        }`}
      >
        {isListening ? (
          <>
            <span className="text-lg">⏹️</span>
            <span>Stop</span>
          </>
        ) : (
          <>
            <span className="text-lg">🎤</span>
            <span>Mic</span>
          </>
        )}
      </button>
      
      <label className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Language:</span>
        <select
          value={selectedLang}
          onChange={(e) => onLangChange(e.target.value as 'auto' | 'fa-IR' | 'en-US')}
          className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="auto">Auto-detect</option>
          <option value="fa-IR">فارسی (Persian)</option>
          <option value="en-US">English</option>
        </select>
      </label>
    </div>
  );
}



