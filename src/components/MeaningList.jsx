export default function MeaningList({ meanings }) {
  if (!meanings || meanings.length === 0) return null;

  return (
    <div className="space-y-4 mt-4 text-left">
      {meanings.map((meaning, index) => {
        const partOfSpeech = meaning.part_of_speech || meaning.partOfSpeech;
        const definition = meaning.definition || meaning?.definitions?.[0]?.definition;
        const example = meaning.example || meaning?.definitions?.[0]?.example;

        return (
          <div key={meaning.id || index} className="space-y-2">
            <div className="flex items-center gap-2">
              {partOfSpeech && (
                <span className="text-xs font-semibold tracking-wide uppercase text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/40 px-2 py-1 rounded-full">
                  {partOfSpeech}
                </span>
              )}
            </div>
            {definition && (
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                {definition}
              </p>
            )}
            {example && (
              <p className="text-gray-500 dark:text-gray-400 mt-1 pl-4 border-l-2 border-gray-200 dark:border-slate-600 ml-1 italic text-sm">
                “{example}”
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
