'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DownloadButtonProps {
    onDownload: () => Promise<{ success: boolean; error?: string }>;
    label?: string;
    variant?: 'default' | 'outline' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
    disabled?: boolean;
}

export default function DownloadButton({
    onDownload,
    label = 'Download',
    variant = 'outline',
    size = 'sm',
    className = '',
    disabled = false
}: DownloadButtonProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState('');

    const handleDownload = async () => {
        setIsDownloading(true);
        setError('');

        const result = await onDownload();

        if (!result.success) {
            setError(result.error || 'Download failed');
            setTimeout(() => setError(''), 3000);
        }

        setIsDownloading(false);
    };

    return (
        <div className="inline-block">
            <Button
                variant={variant}
                size={size}
                onClick={handleDownload}
                disabled={disabled || isDownloading}
                className={className}
            >
                {isDownloading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Downloading...
                    </>
                ) : (
                    <>
                        <Download className="mr-2 h-4 w-4" />
                        {label}
                    </>
                )}
            </Button>
            {error && (
                <p className="text-xs text-red-600 mt-1">{error}</p>
            )}
        </div>
    );
}
