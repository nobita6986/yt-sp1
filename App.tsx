
import React, { useState, useCallback } from 'react';
import type { AnalysisResult, VideoData, ApiKeys } from './types';
import { analyzeVideoContent } from './services/geminiService';
import { fetchVideoMetadata } from './services/youtubeService';
import { extractVideoId } from './utils/youtubeUtils';
import Header from './components/Header';
import ApiConfigSection from './components/ApiConfigSection';
import InputSection from './components/InputSection';
import ThumbnailSection from './components/ThumbnailSection';
import ResultsSection from './components/ResultsSection';
import { initialVideoData, initialAnalysisResult, placeholderVideoData } from './constants';
import { fileToBase64 } from './utils/fileUtils';

const App: React.FC = () => {
  const [videoData, setVideoData] = useState<VideoData>(initialVideoData);
  const [apiKeys, setApiKeys] = useState<ApiKeys>({ gemini: '', youtube: '' });
  const [thumbnail, setThumbnail] = useState<{ file: File | null; preview: string | null }>({
    file: null,
    preview: null,
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingMeta, setIsFetchingMeta] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVideoData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const handleFetchMetadata = useCallback(async () => {
    const url = videoData.youtubeLink;
    const videoId = extractVideoId(url);

    if (!videoId) {
      setError("Vui lòng nhập một link YouTube hợp lệ.");
      return;
    }
    
    if (!apiKeys.youtube) {
        setError("Vui lòng nhập YouTube Data API Key trong phần Cấu hình API.");
        return;
    }

    setIsFetchingMeta(true);
    setError(null);
    try {
        const metadata = await fetchVideoMetadata(videoId, apiKeys.youtube);
        setVideoData(prev => ({
            ...prev,
            ...metadata,
            youtubeLink: url
        }));
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Lỗi lấy metadata: ${errorMessage}`);
    } finally {
        setIsFetchingMeta(false);
    }
  }, [apiKeys.youtube, videoData.youtubeLink]);

  const handleThumbnailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setThumbnail({ file, preview });
    }
  }, []);

  const handleAnalyze = async () => {
    if (!apiKeys.gemini) {
        setError("Vui lòng nhập Gemini API Key trong phần Cấu hình API.");
        return;
    }
    
    // Clear previous results and errors before starting
    setError(null);
    setAnalysisResult(null);
    setIsLoading(true);

    let thumbnailBase64: string | null = null;
    if (thumbnail.file) {
      try {
        thumbnailBase64 = await fileToBase64(thumbnail.file);
      } catch (err) {
        setError('Lỗi xử lý ảnh thumbnail.');
        setIsLoading(false);
        return;
      }
    }
    
    try {
        const result = await analyzeVideoContent(videoData, thumbnailBase64, apiKeys.gemini);
        setAnalysisResult(result);
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Phân tích thất bại: ${errorMessage}`);
        // Optionally load mock data on error for demonstration
        // console.warn("API call failed, loading mock data for demonstration.");
        // setAnalysisResult(initialAnalysisResult);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen text-brand-text-primary font-sans">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <ApiConfigSection apiKeys={apiKeys} onApiKeysChange={setApiKeys} />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <InputSection 
              videoData={videoData} 
              placeholders={placeholderVideoData} 
              onInputChange={handleInputChange} 
              onFetchMetadata={handleFetchMetadata}
              isFetchingMeta={isFetchingMeta}
            />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <ThumbnailSection
              thumbnailPreview={thumbnail.preview}
              analysisResult={analysisResult}
              onThumbnailChange={handleThumbnailChange}
              onAnalyze={handleAnalyze}
              isLoading={isLoading || isFetchingMeta}
            />
          </div>
        </div>
        <div className="mt-8">
          <ResultsSection result={analysisResult} isLoading={isLoading} error={error} />
        </div>
      </main>
    </div>
  );
};

export default App;
