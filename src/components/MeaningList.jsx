export default function MeaningList({ meanings }) {
  if (!meanings || meanings.length === 0) return null;

  return (
    <div className="space-y-4 mt-4 text-left">
      {meanings.map((meaning, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold italic text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
              {meaning.partOfSpeech || meaning.part_of_speech}
            </span>
          </div>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-1">
            {(meaning.definitions || []).map((def, idx) => (
              <li key={idx} className="text-sm leading-relaxed">
                <span>{def.definition}</span>
                {def.example && (
                  <p className="text-gray-500 mt-1 pl-5 border-l-2 border-gray-200 ml-1 italic">
                    "{def.example}"
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}