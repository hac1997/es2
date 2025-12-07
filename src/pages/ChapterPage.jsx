import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuestionDissertative from '../components/QuestionDissertative';
import QuizManager from '../components/QuizManager';
import LatexRenderer from '../components/LatexRenderer'; // [NEW]

const TextRenderer = ({ content }) => {
    if (!content) return null;

    // Helper to parse **bold** text
    const parseBold = (text) => {
        if (!text) return null;
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <strong key={index} className="font-bold text-gray-900">
                        <LatexRenderer>{part.slice(2, -2)}</LatexRenderer>
                    </strong>
                );
            }
            return <LatexRenderer key={index}>{part}</LatexRenderer>;
        });
    };

    const lines = content.split('\n');
    const elements = [];
    let currentList = null;
    let inGlossary = false;
    let glossaryTerm = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Check for Glossary Section start
        if (trimmed.toLowerCase().includes('glossário de termos-chave')) {
            inGlossary = true;
            elements.push(<h2 key={`glossary-title-${i}`} className="text-2xl font-bold text-gray-900 mt-12 mb-6 pb-2 border-b border-gray-200">Glossário de Termos-Chave</h2>);
            continue;
        }

        // Glossary Processing logic
        if (inGlossary) {
            // Skip headers "Termo" / "Definição" if they appear
            if (trimmed === 'Termo' || trimmed === 'Definição') continue;

            if (!glossaryTerm) {
                glossaryTerm = trimmed;
            } else {
                elements.push(
                    <div key={`glossary-item-${i}`} className="mb-6">
                        <dt className="font-bold text-gray-900 mb-1">{parseBold(glossaryTerm)}</dt>
                        <dd className="text-gray-700 text-justify leading-relaxed ml-4 border-l-4 border-gray-100 pl-4">{parseBold(trimmed)}</dd>
                    </div>
                );
                glossaryTerm = null;
            }
            continue;
        }

        // Normal Text Processing

        // Horizontal Rule
        if (trimmed.startsWith('------')) {
            if (currentList) {
                elements.push(<ul key={`list-${i}`} className="list-disc pl-6 mb-4 space-y-2 text-gray-700 text-justify">{currentList}</ul>);
                currentList = null;
            }
            elements.push(<hr key={i} className="my-10 border-gray-200" />);
            continue;
        }

        // List Items
        if (trimmed.startsWith('•') || trimmed.startsWith('- ')) {
            const text = trimmed.replace(/^[•-]\s*/, '');
            if (!currentList) currentList = [];
            currentList.push(<li key={`item-${i}`} className="pl-2">{parseBold(text)}</li>);
            continue;
        }

        // Flush list if we encounter non-list item
        if (currentList) {
            elements.push(<ul key={`list-${i}`} className="list-disc pl-6 mb-6 space-y-2 text-gray-700 text-justify">{currentList}</ul>);
            currentList = null;
        }

        // Headers
        // 1. Title (Main Header - ONLY at the top)
        if (i === 0) {
            elements.push(<h1 key={i} className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 leading-tight">{trimmed}</h1>);
            continue;
        }

        // 2. Sections (1. X, 1.1. X, 2. X)
        // Matches "1. ", "1.1 ", "10. ", etc.  AND must be short (< 100 chars)
        if (/^\d+(\.\d+)*\.\s/.test(trimmed) && trimmed.length < 100) {
            elements.push(<h2 key={i} className="text-2xl font-bold text-gray-800 mt-10 mb-5">{trimmed}</h2>);
            continue;
        }

        // 3. Subheaders (All caps line in middle of text)
        // Must be longer than 3 chars, all caps, not end with period, AND short (< 100 chars)
        const isSubHeader = trimmed.length > 3 && trimmed === trimmed.toUpperCase() && !/[.]$/.test(trimmed) && trimmed.length < 100;
        if (isSubHeader) {
            elements.push(<h3 key={i} className="text-lg font-semibold text-gray-600 mt-8 mb-3 uppercase tracking-wider">{trimmed}</h3>);
            continue;
        }

        // Default Paragraph
        elements.push(<p key={i} className="mb-5 text-gray-700 leading-7 text-justify">{parseBold(trimmed)}</p>);
    }

    // Flush remaining list
    if (currentList) {
        elements.push(<ul key="list-end" className="list-disc pl-6 mb-6 space-y-2 text-gray-700 text-justify">{currentList}</ul>);
    }

    return (
        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600">
            {elements}
        </div>
    );
};

export default function ChapterPage() {
    const { id } = useParams();
    const [textContent, setTextContent] = useState('');
    const [dissertativas, setDissertativas] = useState([]);
    const [multiQuestions, setMultiQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        setTextContent('');
        setDissertativas([]);
        setMultiQuestions([]);
        setError(null);

        const fetchData = async () => {
            try {
                // Load Text Content instead of HTML
                try {
                    const textRes = await fetch(`/${id}/cap.txt`);
                    if (textRes.ok) {
                        const text = await textRes.text();
                        setTextContent(text);
                    } else {
                        console.warn(`Text content not found for ${id}`);
                    }
                } catch (e) {
                    console.warn("Failed to load Text:", e);
                }

                // Load Dissertativas
                try {
                    const dissRes = await fetch(`/${id}/dissertativas.json`);
                    if (dissRes.ok && dissRes.headers.get("content-type")?.includes("application/json")) {
                        const data = await dissRes.json();
                        setDissertativas(data);
                    }
                } catch (e) {
                    console.warn("No dissertative questions found or invalid JSON:", e);
                }

                // Load Multi (and filter)
                try {
                    const multiRes = await fetch(`/${id}/multi.json`);
                    if (multiRes.ok && multiRes.headers.get("content-type")?.includes("application/json")) {
                        const data = await multiRes.json();
                        const filtered = data.filter(q => q.tipo === 'multi');
                        setMultiQuestions(filtered);
                    }
                } catch (e) {
                    console.warn("No multiple choice questions found or invalid JSON:", e);
                }

            } catch (err) {
                console.error(err);
                if (!textContent) {
                    setError('Ocorreu um erro ao carregar os dados principais do capítulo.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-gray-500">Carregando conteúdo...</div>;

    if (error && !textContent && dissertativas.length === 0 && multiQuestions.length === 0) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Text Content */}
            {textContent ? (
                <div className="mb-16 bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-xl">
                    <TextRenderer content={textContent} />
                </div>
            ) : (
                <div className="text-gray-500 italic mb-8">Nenhum texto encontrado para este capítulo.</div>
            )}

            {/* Dissertativas */}
            {dissertativas.length > 0 && (
                <section className="mb-16">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-gray-200"></div>
                        <h2 className="text-2xl font-bold text-gray-900">Questões Dissertativas</h2>
                        <div className="h-px flex-1 bg-gray-200"></div>
                    </div>
                    {dissertativas.map((q, idx) => (
                        <QuestionDissertative
                            key={idx}
                            question={q.questão}
                            answer={q.resposta}
                            topics={q.tópicos}
                        />
                    ))}
                </section>
            )}

            {/* Simulado */}
            {multiQuestions.length > 0 && (
                <section className="mb-12">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-gray-200"></div>
                        <h2 className="text-2xl font-bold text-gray-900">Simulado</h2>
                        <div className="h-px flex-1 bg-gray-200"></div>
                    </div>
                    <QuizManager questions={multiQuestions} />
                </section>
            )}
        </div>
    );
}
