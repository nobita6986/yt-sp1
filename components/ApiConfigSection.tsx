
import React from 'react';
import type { ApiKeys } from '../types';
import { KeyIcon } from './icons/UtilityIcons';

interface ApiConfigSectionProps {
  apiKeys: ApiKeys;
  onApiKeysChange: (newKeys: ApiKeys) => void;
}

const ApiConfigSection: React.FC<ApiConfigSectionProps> = ({ apiKeys, onApiKeysChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onApiKeysChange({ ...apiKeys, [name]: value });
    };

    return (
        <div className="bg-brand-surface border border-brand-border rounded-lg p-6 space-y-6 mb-8">
            <h2 className="text-lg font-semibold text-brand-text-primary flex items-center">
                <KeyIcon className="w-5 h-5 mr-2 text-brand-secondary"/>
                Cấu hình API Keys
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="gemini" className="block text-sm font-medium text-brand-text-secondary mb-2">
                        Gemini API Key
                    </label>
                    <input
                        type="password"
                        id="gemini"
                        name="gemini"
                        value={apiKeys.gemini}
                        onChange={handleChange}
                        placeholder="Nhập Gemini API Key của bạn"
                        className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 text-brand-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200"
                    />
                </div>
                <div>
                    <label htmlFor="youtube" className="block text-sm font-medium text-brand-text-secondary mb-2">
                        YouTube Data API Key
                    </label>
                    <input
                        type="password"
                        id="youtube"
                        name="youtube"
                        value={apiKeys.youtube}
                        onChange={handleChange}
                        placeholder="Nhập YouTube API Key (để lấy metadata)"
                        className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 text-brand-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200"
                    />
                </div>
            </div>
            <p className="text-xs text-brand-text-secondary">API keys của bạn được lưu trữ cục bộ trên trình duyệt và không được gửi đi bất cứ đâu ngoại trừ tới các dịch vụ tương ứng.</p>
        </div>
    );
};

export default ApiConfigSection;
