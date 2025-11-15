
import React, { useState } from 'react';
import type { AnalysisResult } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { CheckCircleIcon, ExclamationTriangleIcon, ChevronDownIcon, ClipboardIcon } from './icons/UtilityIcons';
import { ScoreCard } from './ScoreCard';
import { RecommendationCard } from './RecommendationCard';

interface ResultsSectionProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ result, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="bg-brand-surface border border-brand-border rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px]">
        <LoadingSpinner />
        <p className="mt-4 text-brand-text-secondary">AI đang phân tích, vui lòng chờ trong giây lát...</p>
        <p className="text-sm text-brand-text-secondary mt-2">Quá trình này có thể mất đến 30 giây.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-brand-danger rounded-lg p-6 text-center">
        <ExclamationTriangleIcon className="w-12 h-12 text-brand-danger mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-brand-text-primary">Đã xảy ra lỗi</h3>
        <p className="text-brand-text-secondary mt-2">{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
        <div className="bg-brand-surface border-2 border-dashed border-brand-border rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
            <CheckCircleIcon className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-brand-text-primary">Sẵn sàng để phân tích</h3>
            <p className="text-brand-text-secondary mt-2 max-w-md">Nhập thông tin video và thumbnail của bạn, sau đó nhấp vào 'Phân tích bằng AI' để xem báo cáo chi tiết.</p>
        </div>
    );
  }

  const overallScore = Math.round(
      (result.scores.compliance.score +
      result.scores.thumbnail.score +
      result.scores.title.score +
      result.scores.description.score +
      result.scores.seoOpportunity.score) / 5
  );

  return (
    <div className="bg-brand-surface border border-brand-border rounded-lg p-6 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-brand-text-primary mb-4">3. Kết quả phân tích & Cảnh báo</h2>
        <div className={`flex items-center p-4 rounded-lg ${overallScore > 80 ? 'bg-green-900/30' : 'bg-yellow-900/30'}`}>
            <div className={`p-2 rounded-full ${overallScore > 80 ? 'bg-brand-success' : 'bg-brand-warning'}`}>
                {overallScore > 80 ? <CheckCircleIcon className="w-8 h-8 text-white"/> : <ExclamationTriangleIcon className="w-8 h-8 text-white" />}
            </div>
            <div className="ml-4">
                <h3 className="text-lg font-semibold text-brand-text-primary">{overallScore > 80 ? 'An toàn!' : 'Cần xem xét'}</h3>
                <p className="text-brand-text-secondary">Không tìm thấy rủi ro nào đáng kể. Vui lòng xem các đề xuất bên dưới để tối ưu hóa nội dung của bạn.</p>
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
          <ScoreCard title="Tuân thủ" score={result.scores.compliance.score} />
          <ScoreCard title="Thumbnail" score={result.scores.thumbnail.score} />
          <ScoreCard title="Tiêu đề" score={result.scores.title.score} />
          <ScoreCard title="Mô tả" score={result.scores.description.score} />
          <ScoreCard title="Cơ hội SEO" score={result.scores.seoOpportunity.score} />
      </div>

      <div className="space-y-4">
        <RecommendationCard title="Phân tích & Gợi ý SEO (Tăng CTR)" recommendations={result.recommendations.titles.map(t => ({type: 'title', content: t}))} issues={result.issues}/>
        <RecommendationCard title="Gợi ý Mô tả (Tối ưu Algorithm)" recommendations={[{type: 'description', content: result.recommendations.description}]} />
        <RecommendationCard title="Gợi ý Tags (Tăng khả năng được khám phá)" recommendations={[{type: 'tags', content: result.recommendations.hashtags.join(', ')}]} />
      </div>

    </div>
  );
};

export default ResultsSection;
