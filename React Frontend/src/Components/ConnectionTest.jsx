const ConnectionTest = () => {
    const [connectionStatus, setConnectionStatus] = useState('Checking connection...');
    const [debugInfo, setDebugInfo] = useState(null);

    useEffect(() => {
        const testConnection = async () => {
            try {
                // Log the URL we're trying to connect to
                const apiUrl = `${import.meta.env.VITE_API_URL}/api/test`;
                console.log('Attempting to connect to:', apiUrl);

                const response = await fetch(apiUrl);

                // If we get a non-JSON response, let's see what it is
                const contentType = response.headers.get('content-type');
                if (!contentType?.includes('application/json')) {
                    const textResponse = await response.text();
                    setDebugInfo({
                        status: response.status,
                        contentType: contentType,
                        responseText: textResponse.substring(0, 100) + '...' // First 100 characters
                    });
                    throw new Error(`Expected JSON but got ${contentType}`);
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setConnectionStatus('Backend connected successfully');
                setDebugInfo(null);
            } catch (err) {
                setConnectionStatus(`Connection error: ${err.message}`);
                console.error('Connection error:', err);
            }
        };

        testConnection();
    }, []);

    return (
        <div className="bg-gray-100 p-4 mb-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
            <p className={connectionStatus.includes('error') ? 'text-red-500' : 'text-green-500'}>
                {connectionStatus}
            </p>
            {debugInfo && (
                <div className="mt-2 text-sm text-gray-600">
                    <p>Debug Information:</p>
                    <pre className="bg-gray-200 p-2 rounded mt-1">
                        {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};