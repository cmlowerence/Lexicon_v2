import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { Save, ArrowLeft, Plus } from 'lucide-react';

export default function WordEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({ word: '', phonetic: '', audio_url: '' });
  const [wordData, setWordData] = useState(null); // Full data including entities
  const [newMeaning, setNewMeaning] = useState({ part_of_speech: '', definition: '' });

  useEffect(() => {
    if (isEditMode) {
      const fetchWord = async () => {
        try {
          const data = await adminApi.getWordDetail(id);
          setWordData(data);
          setFormData({
            word: data.word || '',
            phonetic: data.phonetic || '',
            audio_url: data.audio_url || ''
          });
        } catch (error) {
          console.error("Failed to load word details");
        }
      };
      fetchWord();
    }
  }, [id, isEditMode]);

  const handleBaseSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await adminApi.updateWord(id, formData);
        alert('Word updated successfully');
      } else {
        const newWord = await adminApi.createWord(formData);
        navigate(`/admin/words/${newWord.id}`);
      }
    } catch (error) {
      alert('Error saving word details');
    }
  };

  const handleAddMeaning = async () => {
    if (!newMeaning.part_of_speech || !newMeaning.definition) return;
    try {
      await adminApi.addEntity(id, 'meaning', newMeaning);
      // Refresh word data
      const data = await adminApi.getWordDetail(id);
      setWordData(data);
      setNewMeaning({ part_of_speech: '', definition: '' });
    } catch (error) {
      alert('Failed to add meaning');
    }
  };

  const handleRemoveEntity = async (entityType, entityId) => {
    if (!window.confirm(`Remove this ${entityType}?`)) return;
    try {
      await adminApi.removeEntity(id, entityType, entityId);
      const data = await adminApi.getWordDetail(id);
      setWordData(data);
    } catch (error) {
      alert(`Failed to remove ${entityType}`);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/words')} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? `Edit Word: ${formData.word}` : 'Create New Word'}</h1>
      </div>

      {/* Base Details Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold mb-4 border-b pb-2">Base Details</h2>
        <form onSubmit={handleBaseSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Word</label>
              <input type="text" value={formData.word} onChange={(e) => setFormData({...formData, word: e.target.value})} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phonetic</label>
              <input type="text" value={formData.phonetic} onChange={(e) => setFormData({...formData, phonetic: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Audio URL</label>
            <input type="url" value={formData.audio_url} onChange={(e) => setFormData({...formData, audio_url: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <button type="submit" className="flex items-center gap-2 bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700">
            <Save size={18} /> {isEditMode ? 'Update Base Word' : 'Create Word'}
          </button>
        </form>
      </div>

      {/* Entity Management (Only available in Edit mode since they require a parent UUID) */}
      {isEditMode && wordData && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Meanings & Definitions</h2>
          
          {/* List Existing Meanings */}
          <div className="space-y-4 mb-6">
            {(wordData.meanings || []).map((meaning) => (
              <div key={meaning.id} className="p-4 bg-gray-50 border rounded-lg flex justify-between items-start">
                <div>
                  <span className="text-sm font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded">{meaning.part_of_speech}</span>
                  <p className="mt-2 text-gray-800">{meaning.definition || 'Definition missing'}</p>
                </div>
                <button onClick={() => handleRemoveEntity('meaning', meaning.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
              </div>
            ))}
          </div>

          {/* Add New Meaning Form */}
          <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl space-y-3 bg-gray-50">
            <h3 className="font-medium text-gray-700 text-sm">Add New Meaning Entity</h3>
            <div className="flex gap-2">
              <select value={newMeaning.part_of_speech} onChange={(e) => setNewMeaning({...newMeaning, part_of_speech: e.target.value})} className="px-3 py-2 border rounded-lg w-1/3 outline-none">
                <option value="">Select Part of Speech</option>
                <option value="noun">Noun</option>
                <option value="verb">Verb</option>
                <option value="adjective">Adjective</option>
                <option value="adverb">Adverb</option>
              </select>
              <input type="text" placeholder="Definition..." value={newMeaning.definition} onChange={(e) => setNewMeaning({...newMeaning, definition: e.target.value})} className="flex-1 px-4 py-2 border rounded-lg outline-none" />
            </div>
            <button type="button" onClick={handleAddMeaning} className="flex items-center gap-1 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 text-sm">
              <Plus size={16} /> Add Entity
            </button>
          </div>
        </div>
      )}
    </div>
  );
}