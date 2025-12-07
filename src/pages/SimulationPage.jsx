import React, { useState, useEffect } from 'react';
import QuizManager from '../components/QuizManager';

export default function SimulationPage() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // Fetch chapters list to know which folders to scan
                const chaptersRes = await fetch('/chapters.json');
                if (!chaptersRes.ok) throw new Error("Failed to load chapters list");
                const chapters = await chaptersRes.json();

                let allQuestions = [];

                // Fetch multi.json for each chapter
                const promises = chapters.map(async (cap) => {
                    try {
                        const res = await fetch(`/${cap.id}/multi.json`);
                        if (!res.ok) return [];
                        const data = await res.json();
                        // Add chapter context if needed, or just use question
                        return data.map(q => ({
                            ...q,
                            originChapter: cap.title
                        }));
                    } catch (err) {
                        console.error(`Error loading questions for ${cap.id}`, err);
                        return [];
                    }
                });

                const results = await Promise.all(promises);
                results.forEach(arr => {
                    allQuestions = [...allQuestions, ...arr];
                });

                if (allQuestions.length === 0) {
                    setError("Nenhuma questão encontrada nos capítulos.");
                    setLoading(false);
                    return;
                }

                // Shuffle and Pick 30
                const shuffled = allQuestions.sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 30);

                setQuestions(selected);
                setLoading(false);

            } catch (err) {
                console.error("Simulation load error:", err);
                setError("Erro ao carregar simulado. Tente novamente.");
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-600">
                <h2 className="text-xl font-bold mb-2">Erro</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900">Simulado Geral</h1>
                <p className="text-gray-600 mt-2">
                    30 questões aleatórias selecionadas de todos os capítulos disponíveis.
                </p>
            </div>

            <QuizManager questions={questions} />
        </div>
    );
}
