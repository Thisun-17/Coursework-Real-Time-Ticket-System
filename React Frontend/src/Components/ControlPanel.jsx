import React from 'react';

const ControlPanel = ({ isRunning, onStart, onStop, onReset }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-bold mb-3">Control Panel</h2>
            <div className="flex space-x-4">
                <button
                    onClick={onStart}
                    disabled={isRunning}
                    className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Start
                </button>
                <button
                    onClick={onStop}
                    disabled={!isRunning}
                    className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Stop
                </button>
                <button
                    onClick={onReset}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Reset
                </button>
            </div>
            <div className="mt-4 flex items-center">
                <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500' : 'bg-red-500'} mr-2`} />
                <span>System is {isRunning ? 'Running' : 'Stopped'}</span>
            </div>
        </div>
    );
};

export default ControlPanel;