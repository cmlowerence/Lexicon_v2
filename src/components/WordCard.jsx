import PronunciationPlayer from './PronunciationPlayer';
import MeaningList from './MeaningList';

export default function WordCard({ wordData }) {
  if (!wordData) return null;

  const wordText = wordData.text || wordData.word;
  const phonetic = wordData.phonetic_text || wordData.phonetic;
  const audioUrl = wordData.audio_url || wordData.pronunciations?.[0]?.audio_url;

  return (
    <article className="bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-2xl shadow-sm border border-gray-100/80 dark:border-slate-700 p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-full animate-slide-up">
      <div className="flex items-center justify-between mb-4 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white capitalize transition-colors tracking-tight">
            {wordText}
          </h2>
          {phonetic && (
            <p className="text-gray-500 dark:text-gray-300 font-mono mt-1 transition-colors text-sm">
              {phonetic}
            </p>
          )}
        </div>
        <PronunciationPlayer audioUrl={audioUrl} />
      </div>

      <hr className="border-gray-100 dark:border-slate-700 my-4 transition-colors" />

      <MeaningList meanings={wordData.meanings} />
    </article>
  );
}
