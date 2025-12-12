// Helper function to download files from the server
export const downloadFile = async (url: string, filename: string, token: string) => {
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Download failed');
        }

        // Get the blob from response
        const blob = await response.blob();

        // Create a temporary URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);

        // Create a temporary anchor element and trigger download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);

        return { success: true };
    } catch (error: any) {
        console.error('Download error:', error);
        return { success: false, error: error.message };
    }
};

// Download research publication document
export const downloadResearchDocument = async (publicationId: string, title: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return { success: false, error: 'Not authenticated' };
    }

    const url = `http://localhost:5000/api/downloads/research/${publicationId}/download`;
    const filename = `${title.substring(0, 50)}_document.pdf`;

    return await downloadFile(url, filename, token);
};

// Download professional development certificate
export const downloadPDCertificate = async (pdId: string, title: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return { success: false, error: 'Not authenticated' };
    }

    const url = `http://localhost:5000/api/downloads/professional-development/${pdId}/download`;
    const filename = `${title.substring(0, 50)}_certificate.pdf`;

    return await downloadFile(url, filename, token);
};

// Download event report
export const downloadEventReport = async (eventId: string, eventName: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return { success: false, error: 'Not authenticated' };
    }

    const url = `http://localhost:5000/api/downloads/events/${eventId}/download-report`;
    const filename = `${eventName.substring(0, 50)}_report.pdf`;

    return await downloadFile(url, filename, token);
};

// Download institutional event report
export const downloadInstitutionalEventReport = async (eventId: string, eventName: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return { success: false, error: 'Not authenticated' };
    }

    const url = `http://localhost:5000/api/downloads/institutional-events/${eventId}/download`;
    const filename = `${eventName.substring(0, 50)}_report.pdf`;

    return await downloadFile(url, filename, token);
};

// Download general document (for student/faculty uploaded documents)
export const downloadDocument = async (documentId: string, title: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return { success: false, error: 'Not authenticated' };
    }

    const url = `http://localhost:5000/api/documents/${documentId}/download`;
    const filename = `${title.substring(0, 50)}_document.pdf`;

    return await downloadFile(url, filename, token);
};
