import React, { useState, useEffect } from 'react';
import { ContentPackage } from '../types';
import { generateImageFromPrompt } from '../services/geminiService';
import { Copy, Check, Palette, Type, Layout, ImageIcon, Layers, FileText, Smartphone, Hash, Loader2, Download, RefreshCw, Edit2 } from 'lucide-react';

interface ResultDisplayProps {
  data: ContentPackage;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'copy' | 'design' | 'visuals'>('copy');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Image Generation State
  const [imageState, setImageState] = useState<{
    url: string | null;
    loading: boolean;
    error: string | null;
    prompt: string;
    isEditing: boolean;
  }>({
    url: null,
    loading: false,
    error: null,
    prompt: data.image_prompt,
    isEditing: false
  });

  // Reset image state when data changes (new generation)
  useEffect(() => {
    setImageState({
      url: null,
      loading: false,
      error: null,
      prompt: data.image_prompt,
      isEditing: false
    });
  }, [data]);

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const CopyButton = ({ text, id }: { text: string; id: string }) => (
    <button
      onClick={() => handleCopy(text, id)}
      className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors border border-slate-600"
    >
      {copiedSection === id ? (
        <><Check className="w-3 h-3 text-green-400" /> Copied</>
      ) : (
        <><Copy className="w-3 h-3" /> Copy</>
      )}
    </button>
  );

  const handleGenerateImage = async () => {
    setImageState(prev => ({ ...prev, loading: true, error: null, isEditing: false }));
    try {
        const url = await generateImageFromPrompt(imageState.prompt);
        setImageState(prev => ({ ...prev, url, loading: false }));
    } catch (e: any) {
        setImageState(prev => ({ ...prev, loading: false, error: e.message || "Failed to generate image" }));
    }
  };

  const handleApprove = () => {
    if (!imageState.url) return;
    const link = document.createElement('a');
    link.href = imageState.url;
    link.download = `post-tools-nano-banana-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleChange = () => {
      // Switch to edit mode, hide current image to focus on prompt
      setImageState(prev => ({ ...prev, isEditing: true }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      
      {/* Headline Card */}
      <div className="bg-slate-800 rounded-xl p-6 border-l-4 border-yellow-500 shadow-xl">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest">Headline</span>
          <CopyButton text={data.headline} id="headline" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
          {data.headline}
        </h1>
      </div>

      {/* Main Content Area */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab('copy')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap
              ${activeTab === 'copy' ? 'text-yellow-500 border-b-2 border-yellow-500 bg-slate-800' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
          >
            <FileText className="w-4 h-4" /> Copy & Structure
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap
              ${activeTab === 'design' ? 'text-yellow-500 border-b-2 border-yellow-500 bg-slate-800' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
          >
            <Palette className="w-4 h-4" /> Design Guide
          </button>
          <button
            onClick={() => setActiveTab('visuals')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap
              ${activeTab === 'visuals' ? 'text-yellow-500 border-b-2 border-yellow-500 bg-slate-800' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
          >
            <ImageIcon className="w-4 h-4" /> Visual Studio
          </button>
        </div>

        <div className="p-6 min-h-[400px]">
          {/* TAB: COPY */}
          {activeTab === 'copy' && (
            <div className="space-y-8">
              
              {/* Carousel Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-400" /> Carousel Breakdown
                  </h3>
                </div>
                
                <div className="grid gap-3">
                    {Object.entries(data.copy.carousel).map(([key, value]) => (
                        value && (
                            <div key={key} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 group hover:border-slate-600 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-mono text-indigo-400 uppercase">{key.replace('_', ' ')}</span>
                                    <CopyButton text={value as string} id={`carousel-${key}`} />
                                </div>
                                <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{value as string}</p>
                            </div>
                        )
                    ))}
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-pink-500" /> Reels Script / Feed Copy
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-pink-400 uppercase font-bold">Reels/Script</span>
                            <CopyButton text={data.copy.reels_script} id="reels" />
                        </div>
                        <p className="text-slate-300 text-sm whitespace-pre-wrap">{data.copy.reels_script || "N/A"}</p>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-blue-400 uppercase font-bold">Standard Feed</span>
                            <CopyButton text={data.copy.feed_version} id="feed" />
                        </div>
                        <p className="text-slate-300 text-sm whitespace-pre-wrap">{data.copy.feed_version || "N/A"}</p>
                    </div>
                </div>
              </div>

               <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg flex items-start gap-4">
                   <div className="bg-green-500/20 p-2 rounded-full">
                       <Check className="w-4 h-4 text-green-400" />
                   </div>
                   <div className="flex-1">
                       <div className="flex justify-between items-start">
                            <h4 className="text-sm font-bold text-green-400 uppercase mb-1">Call to Action (CTA)</h4>
                            <CopyButton text={data.cta} id="cta" />
                       </div>
                       <p className="text-white font-medium">{data.cta}</p>
                   </div>
               </div>
            </div>
          )}

          {/* TAB: DESIGN */}
          {activeTab === 'design' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-700">
                    <h4 className="text-blue-400 flex items-center gap-2 font-bold mb-3">
                        <Palette className="w-4 h-4" /> Color Palette
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{data.design_guide.palette}</p>
               </div>
               <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-700">
                    <h4 className="text-purple-400 flex items-center gap-2 font-bold mb-3">
                        <Type className="w-4 h-4" /> Typography
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{data.design_guide.typography}</p>
               </div>
               <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-700">
                    <h4 className="text-orange-400 flex items-center gap-2 font-bold mb-3">
                        <Layout className="w-4 h-4" /> Layout & Structure
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{data.design_guide.layout}</p>
               </div>
               <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-700">
                    <h4 className="text-yellow-400 flex items-center gap-2 font-bold mb-3">
                        <Hash className="w-4 h-4" /> Brand Alignment
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{data.design_guide.brand_alignment}</p>
               </div>
            </div>
          )}

          {/* TAB: VISUAL STUDIO */}
          {activeTab === 'visuals' && (
             <div className="space-y-8">
                 
                 {/* Generator Controls */}
                 <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 relative overflow-hidden">
                     <div className="flex items-center justify-between mb-4">
                         <h3 className="text-yellow-500 font-bold flex items-center gap-2">
                             <ImageIcon className="w-5 h-5" /> 
                             {imageState.url ? "Generated Content" : "Nano Banana Image Generator"}
                         </h3>
                         {imageState.url && (
                             <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30 flex items-center gap-1">
                                 <Check className="w-3 h-3" /> Ready
                             </span>
                         )}
                     </div>

                     {/* Prompt Editor */}
                     {(!imageState.url || imageState.isEditing) && (
                         <div className="space-y-4 animate-fade-in">
                             <div>
                                 <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Prompt</label>
                                 <textarea 
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all resize-y min-h-[120px]"
                                    value={imageState.prompt}
                                    onChange={(e) => setImageState(prev => ({...prev, prompt: e.target.value}))}
                                 />
                             </div>
                             
                             <div className="flex justify-end gap-3">
                                 {imageState.url && (
                                     <button 
                                        onClick={() => setImageState(prev => ({...prev, isEditing: false}))}
                                        className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                                     >
                                         Cancel
                                     </button>
                                 )}
                                 <button
                                     onClick={handleGenerateImage}
                                     disabled={imageState.loading}
                                     className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold px-6 py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                 >
                                     {imageState.loading ? (
                                         <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                                     ) : (
                                         <><RefreshCw className="w-4 h-4" /> {imageState.url ? "Regenerate" : "Generate Image"}</>
                                     )}
                                 </button>
                             </div>
                         </div>
                     )}

                     {/* Error Message */}
                     {imageState.error && (
                         <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                             {imageState.error}
                         </div>
                     )}

                     {/* Generated Image Result */}
                     {imageState.url && !imageState.isEditing && (
                         <div className="animate-fade-in space-y-6">
                             <div className="relative aspect-square md:aspect-video w-full rounded-lg overflow-hidden border border-slate-700 bg-black/50 group">
                                 <img 
                                     src={imageState.url} 
                                     alt="Generated Result" 
                                     className="w-full h-full object-contain"
                                 />
                             </div>

                             {/* Action Buttons: Approve, Change, Generate Another */}
                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                 
                                 <button 
                                     onClick={handleApprove}
                                     className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-3 px-4 rounded-lg font-medium transition-all shadow-lg shadow-green-900/20"
                                 >
                                     <Download className="w-4 h-4" />
                                     <span>Approve</span>
                                 </button>

                                 <button 
                                     onClick={handleChange}
                                     className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg font-medium transition-all"
                                 >
                                     <Edit2 className="w-4 h-4" />
                                     <span>Change</span>
                                 </button>

                                 <button 
                                     onClick={handleGenerateImage}
                                     disabled={imageState.loading}
                                     className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 py-3 px-4 rounded-lg font-medium transition-all shadow-lg shadow-yellow-900/20"
                                 >
                                     {imageState.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                     <span>Generate Another</span>
                                 </button>

                             </div>
                         </div>
                     )}
                 </div>

                 <div className="space-y-4 opacity-70 hover:opacity-100 transition-opacity">
                     <h4 className="text-slate-400 text-sm uppercase font-bold tracking-wider">Prompt Variations</h4>
                     <div className="grid gap-4">
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-400">FEED FORMAT</span>
                                <CopyButton text={data.format_variations.feed} id="prompt-feed" />
                            </div>
                            <p className="text-slate-300 text-xs font-mono line-clamp-2 hover:line-clamp-none transition-all cursor-default">{data.format_variations.feed}</p>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                             <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-400">REELS/STORY FORMAT</span>
                                <CopyButton text={data.format_variations.reels_story} id="prompt-reels" />
                            </div>
                            <p className="text-slate-300 text-xs font-mono line-clamp-2 hover:line-clamp-none transition-all cursor-default">{data.format_variations.reels_story}</p>
                        </div>
                     </div>
                 </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};