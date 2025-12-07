import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, ChevronRight, ClipboardList } from 'lucide-react';

export default function MainLayout() {
    const [chapters, setChapters] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/chapters.json')
            .then(res => res.json())
            .then(data => {
                setChapters(data);
                if (data.length > 0 && window.location.pathname === '/') {
                    navigate(`/chapter/${data[0].id}`);
                }
            })
            .catch(err => console.error("Failed to load chapters:", err));
    }, [navigate]);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Mobile Sidebar Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white border-r border-[#e5e7eb] transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
                <div className="flex items-center justify-between h-16 px-6 border-b border-[#e5e7eb]">
                    <span className="text-xl font-semibold flex items-center gap-2">
                        ES2
                    </span>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-gray-500"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
                    {chapters.map((chapter) => (
                        <NavLink
                            key={chapter.id}
                            to={`/chapter/${chapter.id}`}
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center justify-between px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`
                            }
                            style={({ isActive }) => ({
                                backgroundColor: isActive ? '#eff6ff' : 'transparent',
                                color: isActive ? '#1d4ed8' : 'var(--color-text-primary)'
                            })}
                        >
                            <span>{chapter.title}</span>
                            <ChevronRight size={16} className="text-gray-400" />
                        </NavLink>
                    ))}

                    <div className="pt-4 mt-4 border-t border-gray-200">
                        <NavLink
                            to="/questoes"
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center justify-between px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive
                                    ? 'bg-purple-50 text-purple-700'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`
                            }
                        >
                            <span className="flex items-center gap-2">
                                <ClipboardList size={18} />
                                Simulado Geral
                            </span>
                        </NavLink>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="flex items-center h-16 px-4 bg-white border-b border-[#e5e7eb] lg:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-gray-500 focus:outline-none"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="ml-4 text-lg font-medium">Menu</span>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#f9fafb]">
                    <div className="max-w-4xl mx-auto min-h-[500px]">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
