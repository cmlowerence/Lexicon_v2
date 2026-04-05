import PronunciationPlayer from './PronunciationPlayer';
import MeaningList from './MeaningList';

export default function WordCard({ wordData }) {
  if (!wordData) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 capitalize">{wordData.word}</h2>
          {wordData.phonetic && (
            <p className="text-gray-500 font-mono mt-1">{wordData.phonetic}</p>
          )}
        </div>
        <PronunciationPlayer audioUrl={wordData.audio_url} />
      </div>
      
      <hr className="border-gray-100 my-4" />
      
      <MeaningList meanings={wordData.meanings} />
    </div>
  );
}