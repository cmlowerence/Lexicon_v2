import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { Save, ArrowLeft, Plus, X } from 'lucide-react';

const defaultFormState = {
  text: '',
  language: 'en',
  phonetic_text: '',
  is_sophisticated: false,
  difficulty_score: 0,
  source_api: 'MANUAL',
  source_reference: '',
  word_type: 'WORD',
  is_active: true,
};

export default function WordEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(defaultFormState);
  const [wordData, setWordData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newMeaning, setNewMeaning] = useState({ part_of_speech: '', definition: '', example: '' });
  const [newPronunciation, setNewPronunciation] = useState({ audio_url: '', region: 'US' });

  const hydrateWord = (data) => {
    setWordData(data);
    setFormData({
      text: data.text || '',
      language: data.language || 'en',
      phonetic_text: data.phonetic_text || '',
      is_sophisticated: Boolean(data.is_sophisticated),
      difficulty_score: Number(data.difficulty_score || 0),
      source_api: data.source_api || 'MANUAL',
      source_reference: data.source_reference || '',
      word_type: data.word_type || 'WORD',
      is_active: data.is_active ?? true,
    });
  };

  const fetchWord = async () => {
    const data = await adminApi.getWordDetail(id);
    hydrateWord(data);
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const categoryData = await adminApi.getCategories();
        setCategories(categoryData || []);

        if (isEditMode) {
          await fetchWord();
        }
      } catch (error) {
        console.error('Failed to load editor data', error);
      }
    };

    bootstrap();
  }, [id, isEditMode]);

  const handleBaseSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      difficulty_score: Number(formData.difficulty_score),
    };

    try {
      if (isEditMode) {
        const updatedWord = await adminApi.updateWord(id, payload);
        hydrateWord(updatedWord);
        alert('Word updated successfully');
      } else {
        const createdWord = await adminApi.createWord(payload);
        navigate(`/admin/words/${createdWord.id}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error saving word details');
    }
  };

  const handleAddMeaning = async () => {
    if (!newMeaning.part_of_speech || !newMeaning.definition) return;
    try {
      await adminApi.addEntity(id, 'meaning', newMeaning);
      await fetchWord();
      setNewMeaning({ part_of_speech: '', definition: '', example: '' });
    } catch (error) {
      alert('Failed to add meaning');
    }
  };

  const handleAddPronunciation = async () => {
    if (!newPronunciation.audio_url || !newPronunciation.region) return;
    try {
      await adminApi.addEntity(id, 'pronunciation', newPronunciation);
      await fetchWord();
      setNewPronunciation({ audio_url: '', region: 'US' });
    } catch (error) {
      alert('Failed to add pronunciation');
    }
  };

  const handleRemoveEntity = async (entityType, entityId) => {
    if (!window.confirm(`Remove this ${entityType}?`)) return;
    try {
      await adminApi.removeEntity(id, entityType, entityId);
      await fetchWord();
    } catch (error) {
      alert(`Failed to remove ${entityType}`);
    }
  };

  const handleAssignCategory = async () => {
    if (!selectedCategory) return;
    try {
      const updatedWord = await adminApi.assignCategory(id, selectedCategory);
      hydrateWord(updatedWord);
      setSelectedCategory('');
    } catch {
      alert('Failed to assign category');
    }
  };

  const handleRemoveCategory = async (categoryId) => {
    try {
      const updatedWord = await adminApi.removeCategory(id, categoryId);
      hydrateWord(updatedWord);
    } catch {
      alert('Failed to remove category');
    }
  };

  const assignedCategories = wordData?.categories || [];

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/words')} className="p-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isEditMode ? `Edit Word: ${formData.text}` : 'Create New Word'}</h1>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-bold mb-4 border-b border-gray-200 dark:border-slate-700 pb-2 dark:text-gray-100">Base Details</h2>
        <form onSubmit={handleBaseSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Text</label>
              <input type="text" value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })} className="w-full px-4 py-2 border dark:bg-slate-900 dark:text-white rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Language</label>
              <select value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} className="w-full px-4 py-2 border dark:bg-slate-900 dark:text-white rounded-lg">
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Phonetic Text</label>
              <input type="text" value={formData.phonetic_text} onChange={(e) => setFormData({ ...formData, phonetic_text: e.target.value })} className="w-full px-4 py-2 border dark:bg-slate-900 dark:text-white rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Word Type</label>
              <select value={formData.word_type} onChange={(e) => setFormData({ ...formData, word_type: e.target.value })} className="w-full px-4 py-2 border dark:bg-slate-900 dark:text-white rounded-lg">
                <option value="WORD">WORD</option>
                <option value="IDIOM">IDIOM</option>
                <option value="PHRASAL">PHRASAL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Difficulty Score</label>
              <input type="number" min="0" max="10" step="0.1" value={formData.difficulty_score} onChange={(e) => setFormData({ ...formData, difficulty_score: e.target.value })} className="w-full px-4 py-2 border dark:bg-slate-900 dark:text-white rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Source API</label>
              <select value={formData.source_api} onChange={(e) => setFormData({ ...formData, source_api: e.target.value })} className="w-full px-4 py-2 border dark:bg-slate-900 dark:text-white rounded-lg">
                <option value="MANUAL">MANUAL</option>
                <option value="MW">MW</option>
                <option value="FDA">FDA</option>
                <option value="MIXED">MIXED</option>
                <option value="IMPORT">IMPORT</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Source Reference</label>
            <input type="text" value={formData.source_reference} onChange={(e) => setFormData({ ...formData, source_reference: e.target.value })} className="w-full px-4 py-2 border dark:bg-slate-900 dark:text-white rounded-lg" />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm dark:text-gray-200">
              <input type="checkbox" checked={formData.is_sophisticated} onChange={(e) => setFormData({ ...formData, is_sophisticated: e.target.checked })} />
              Sophisticated
            </label>
            <label className="flex items-center gap-2 text-sm dark:text-gray-200">
              <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />
              Active
            </label>
          </div>

          <button type="submit" className="flex items-center gap-2 bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700">
            <Save size={18} /> {isEditMode ? 'Update Word' : 'Create Word'}
          </button>
        </form>
      </div>

      {isEditMode && wordData && (
        <>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 space-y-4">
            <h2 className="text-lg font-bold border-b pb-2 dark:text-gray-100 border-gray-200 dark:border-slate-700">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {assignedCategories.map((cat) => (
                <span key={cat.id} className="inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-200 px-3 py-1 rounded-full text-sm">
                  {cat.name}
                  <button type="button" onClick={() => handleRemoveCategory(cat.id)}>
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-2 border rounded-lg dark:bg-slate-900 dark:text-white flex-1">
                <option value="">Select category to assign</option>
                {categories.filter((cat) => !assignedCategories.some((assigned) => assigned.id === cat.id)).map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <button type="button" onClick={handleAssignCategory} className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Assign</button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-bold mb-4 border-b pb-2 dark:text-gray-100 border-gray-200 dark:border-slate-700">Meanings</h2>
            <div className="space-y-4 mb-6">
              {(wordData.meanings || []).map((meaning) => (
                <div key={meaning.id} className="p-4 bg-gray-50 dark:bg-slate-900 border rounded-lg flex justify-between items-start border-gray-200 dark:border-slate-700">
                  <div>
                    <span className="text-sm font-bold text-brand-600 bg-brand-50 dark:bg-brand-900/40 px-2 py-1 rounded">{meaning.part_of_speech}</span>
                    <p className="mt-2 text-gray-800 dark:text-gray-200">{meaning.definition || 'Definition missing'}</p>
                    {meaning.example && <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">“{meaning.example}”</p>}
                  </div>
                  <button onClick={() => handleRemoveEntity('meaning', meaning.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
                </div>
              ))}
            </div>

            <div className="p-4 border-2 border-dashed border-gray-200 dark:border-slate-600 rounded-xl space-y-3 bg-gray-50 dark:bg-slate-900">
              <h3 className="font-medium text-gray-700 dark:text-gray-200 text-sm">Add New Meaning</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <select value={newMeaning.part_of_speech} onChange={(e) => setNewMeaning({ ...newMeaning, part_of_speech: e.target.value })} className="px-3 py-2 border rounded-lg dark:bg-slate-800 dark:text-white">
                  <option value="">Part of Speech</option>
                  <option value="noun">Noun</option>
                  <option value="verb">Verb</option>
                  <option value="adjective">Adjective</option>
                  <option value="adverb">Adverb</option>
                </select>
                <input type="text" placeholder="Definition" value={newMeaning.definition} onChange={(e) => setNewMeaning({ ...newMeaning, definition: e.target.value })} className="px-4 py-2 border rounded-lg dark:bg-slate-800 dark:text-white" />
                <input type="text" placeholder="Example (optional)" value={newMeaning.example} onChange={(e) => setNewMeaning({ ...newMeaning, example: e.target.value })} className="px-4 py-2 border rounded-lg dark:bg-slate-800 dark:text-white" />
              </div>
              <button type="button" onClick={handleAddMeaning} className="flex items-center gap-1 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 text-sm">
                <Plus size={16} /> Add Meaning
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-bold mb-4 border-b pb-2 dark:text-gray-100 border-gray-200 dark:border-slate-700">Pronunciations</h2>
            <div className="space-y-3 mb-6">
              {(wordData.pronunciations || []).map((pron) => (
                <div key={pron.id} className="p-4 bg-gray-50 dark:bg-slate-900 border rounded-lg border-gray-200 dark:border-slate-700 flex justify-between items-center gap-4">
                  <div className="text-sm text-gray-800 dark:text-gray-200">
                    <span className="font-semibold mr-2">{pron.region}</span>
                    <a href={pron.audio_url} target="_blank" rel="noreferrer" className="text-brand-600 underline break-all">{pron.audio_url}</a>
                  </div>
                  <button onClick={() => handleRemoveEntity('pronunciation', pron.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
                </div>
              ))}
            </div>

            <div className="p-4 border-2 border-dashed border-gray-200 dark:border-slate-600 rounded-xl space-y-3 bg-gray-50 dark:bg-slate-900">
              <h3 className="font-medium text-gray-700 dark:text-gray-200 text-sm">Add Pronunciation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input type="url" placeholder="Audio URL" value={newPronunciation.audio_url} onChange={(e) => setNewPronunciation({ ...newPronunciation, audio_url: e.target.value })} className="px-4 py-2 border rounded-lg dark:bg-slate-800 dark:text-white md:col-span-2" />
                <select value={newPronunciation.region} onChange={(e) => setNewPronunciation({ ...newPronunciation, region: e.target.value })} className="px-3 py-2 border rounded-lg dark:bg-slate-800 dark:text-white">
                  <option value="US">US</option>
                  <option value="UK">UK</option>
                  <option value="IN">IN</option>
                  <option value="SCO">SCO</option>
                  <option value="GEN">GEN</option>
                </select>
              </div>
              <button type="button" onClick={handleAddPronunciation} className="flex items-center gap-1 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 text-sm">
                <Plus size={16} /> Add Pronunciation
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
