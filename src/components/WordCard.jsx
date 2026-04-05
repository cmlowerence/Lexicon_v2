import PronunciationPlayer from './PronunciationPlayer';
import MeaningList from './MeaningList';

export default function WordCard({ wordData }) {
  if (!wordData) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 hover:shadow-md dark:hover:shadow-slate-900/50 transition-all duration-300 w-full animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white capitalize transition-colors">
            {wordData.word}
          </h2>
          {wordData.phonetic && (
            <p className="text-gray-500 dark:text-gray-400 font-mono mt-1 transition-colors">
              {wordData.phonetic}
            </p>
          )}
        </div>
        <PronunciationPlayer audioUrl={wordData.audio_url} />
      </div>
      
      <hr className="border-gray-100 dark:border-slate-700 my-4 transition-colors" />
      
      <MeaningList meanings={wordData.meanings} />
    </div>
  );
}