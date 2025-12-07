import React, { useState } from 'react';

export default function QuizManager({ questions = [] }) {
    const [answers, setAnswers] = useState({}); // { index: selectedOptionString }
    const [showResults, setShowResults] = useState(false);
    const [error, setError] = useState(null);

    const handleSelect = (questionIndex, option) => {
        if (showResults) return; // Prevent changing after submission
        setAnswers(prev => ({ ...prev, [questionIndex]: option }));
        setError(null);
    };

    const calculateScore = () => {
        // Validation: All questions must be answered
        const unanswered = questions.map((_, idx) => idx).filter(idx => !answers[idx]);
        if (unanswered.length > 0) {
            setError(`Você precisa responder todas as questões! Faltam: ${unanswered.map(i => i + 1).join(', ')}`);
            return;
        }

        setShowResults(true);
    };

    const getResult = () => {
        let correctCount = 0;
        const incorrectDetails = [];
        const topicsToReview = new Set();

        questions.forEach((q, idx) => {
            const userAnswer = answers[idx];
            const correctAnswer = q.resposta; // e.g., "D. Text..."

            // Simple inclusion check or exact match if structured differently
            const isCorrect = correctAnswer.includes(userAnswer) || correctAnswer === userAnswer;

            if (isCorrect) {
                correctCount++;
            } else {
                incorrectDetails.push({ question: q, userAnswer, correctAnswer });
                q.tópicos?.forEach(t => topicsToReview.add(t));
            }
        });

        const score = (correctCount / questions.length) * 10;
        return { score, incorrectDetails, topicsToReview: Array.from(topicsToReview) };
    };

    if (questions.length === 0) return null;

    const { score, incorrectDetails, topicsToReview } = showResults ? getResult() : {};

    return (
        <div className="space-y-12">

            {questions.map((q, idx) => {
                const isAnswered = !!answers[idx];
                const userAnswer = answers[idx];

                return (
                    <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-8 shadow-sm">
                        <div className="flex items-start gap-4 mb-6">
                            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 font-bold text-sm">
                                {idx + 1}
                            </span>
                            <div className="flex-1">
                                {/* Topics removed as per request */}
                                <div
                                    className="text-gray-700 mb-6 font-medium leading-7 text-justify"
                                    dangerouslySetInnerHTML={{ __html: q.questão }}
                                />

                                <div className="space-y-3">
                                    {q.alternativas?.map((opt, optIdx) => (
                                        <label
                                            key={optIdx}
                                            className={`block p-4 rounded-lg border cursor-pointer transition-colors ${userAnswer === opt
                                                ? 'bg-indigo-50 border-indigo-500'
                                                : 'hover:bg-gray-50 border-gray-200'
                                                } ${showResults ? 'pointer-events-none opacity-90' : ''}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="radio"
                                                    name={`question-${idx}`}
                                                    value={opt}
                                                    checked={userAnswer === opt}
                                                    onChange={() => handleSelect(idx, opt)}
                                                    className="mt-1"
                                                />
                                                <span className="text-gray-800 text-justify">{opt}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                {/* Individual Question Feedback (after results) */}
                                {showResults && (
                                    <div className="mt-6 p-4 rounded-md text-sm">
                                        {(q.resposta.includes(userAnswer)) ? (
                                            <div className="text-green-700 bg-green-50 p-3 rounded border border-green-200">
                                                <strong>✓ Resposta Correta!</strong>
                                            </div>
                                        ) : (
                                            <div className="text-red-700 bg-red-50 p-4 rounded border border-red-200">
                                                <div className="font-bold mb-2">✕ Resposta Incorreta</div>
                                                <div className="mb-2">Sua resposta: {userAnswer}</div>
                                                <div className="font-semibold bg-white/50 p-2 rounded">Resposta correta: {q.resposta}</div>
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                );
            })}

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">
                    {error}
                </div>
            )}

            {!showResults ? (
                <button
                    onClick={calculateScore}
                    className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                >
                    Terminar Simulado
                </button>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 text-center">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Resultado Final</h3>
                    <div className="text-5xl font-extrabold text-indigo-600 mb-8">
                        {score.toFixed(1)} <span className="text-2xl text-gray-400 font-normal">/ 10</span>
                    </div>

                    {incorrectDetails.length > 0 && (
                        <div className="text-left mt-8 border-t border-gray-100 pt-8">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Tópicos para Revisar:</h4>
                            <div className="flex flex-wrap gap-2">
                                {topicsToReview.map((topic, i) => (
                                    <span key={i} className="px-3 py-1 bg-orange-50 text-orange-800 border border-orange-200 rounded-full text-sm font-medium">
                                        {topic}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Refazer Simulado
                    </button>
                </div>
            )}
        </div>
    );
}
