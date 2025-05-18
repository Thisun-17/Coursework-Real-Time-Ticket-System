import React from 'react';
import { AlertCircle } from 'lucide-react';

const LogDisplay = ({ logs, errors }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-bold mb-3">System Logs</h2>

            {/* Error Display */}
            {errors.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-red-600 mb-2">Errors</h3>
                    <div className="space-y-2">
                        {errors.map((error, index) => (
                            <div key={index} className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded">
                                <div className="flex items-center">
                                    <AlertCircle className="h-5 w-5 mr-2" />
                                    <p>{error}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* System Logs */}
            <div className="bg-gray-100 p-3 rounded max-h-60 overflow-y-auto">
                {logs.map((log, index) => (
                    <div key={index} className="text-sm mb-1">
                        <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{' '}
                        <span className={`font-medium ${
                            log.type === 'error' ? 'text-red-600' :
                                log.type === 'warning' ? 'text-yellow-600' :
                                    'text-gray-800'
                        }`}>
              {log.message}
            </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LogDisplay;