import React, { useState, ChangeEvent } from 'react';
import { UserInput, SocialFormat } from '../types';
import { Upload, X, Wand2, Loader2, Image as ImageIcon } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserInput>({
    niche: '',
    format: SocialFormat.CAROUSEL,
    topic: '',
    style: '',
    image: null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
      <div className="p-6 bg-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-yellow-500 p-2 rounded-lg">
            <Wand2 className="w-6 h-6 text-slate-900" />
          </div>
          <h2 className="text-xl font-bold text-white">Create Content Package</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Niche & Format Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Niche</label>
              <input
                type="text"
                name="niche"
                required
                placeholder="e.g. Fitness, Tech, Beauty"
                value={formData.niche}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all placeholder-slate-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Format</label>
              <select
                name="format"
                value={formData.format}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all text-white appearance-none cursor-pointer"
              >
                {Object.values(SocialFormat).map((fmt) => (
                  <option key={fmt} value={fmt}>{fmt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Topic */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Topic / Idea</label>
            <textarea
              name="topic"
              required
              rows={3}
              placeholder="What should this post be about?"
              value={formData.topic}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all placeholder-slate-600 text-white resize-none"
            />
          </div>

          {/* Style */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Visual Style</label>
            <input
              type="text"
              name="style"
              placeholder="e.g. Minimalist, Neon, Luxury"
              value={formData.style}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all placeholder-slate-600 text-white"
            />
          </div>

          {/* Reference Image */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex justify-between">
              <span>Reference Image</span>
              <span className="text-slate-500 normal-case font-normal">(Optional but recommended)</span>
            </label>
            
            {!previewUrl ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer hover:bg-slate-800/80 hover:border-yellow-500/50 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-slate-500 group-hover:text-yellow-500 transition-colors" />
                  <p className="mb-2 text-sm text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            ) : (
              <div className="relative w-full h-48 bg-slate-900 rounded-lg overflow-hidden border border-slate-700 group">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white p-1.5 rounded-full transition-colors backdrop-blur-sm"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white backdrop-blur-sm flex items-center gap-1">
                   <ImageIcon className="w-3 h-3" /> Reference
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-lg font-bold text-slate-900 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2
              ${isLoading 
                ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                : 'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500'
              }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <span>Generate Content Package</span>
                <Wand2 className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};