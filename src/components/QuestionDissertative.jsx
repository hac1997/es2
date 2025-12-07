import React, { useState } from 'react';

export default function QuestionDissertative({ question, topics = [], answer }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
            <div className="p-6">
                {/* Topics removed as per request */}

                <div
                    className="text-gray-700 mb-5 text-justify leading-7"
                    dangerouslySetInnerHTML={{ __html: question }}
                />

                {/* Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                    {isOpen ? "[- Ocultar resposta]" : "[+ Exibir resposta]"}
                </button>
            </div>

            {/* Answer Section */}
            {isOpen && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="prose prose-sm max-w-none text-gray-700">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Resposta Esperada:</h4>
                        <div
                            className="text-justify [&_p]:mb-4 last:[&_p]:mb-0"
                            dangerouslySetInnerHTML={{ __html: answer }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
