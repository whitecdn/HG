import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { KNOWLEDGE_BASE } from '../../data/knowledgeBase';

interface CenterPaneProps {
    activeCategory: string;
}

export function CenterPane({ activeCategory }: CenterPaneProps) {
    const categoryData = KNOWLEDGE_BASE[activeCategory] || { title: activeCategory, items: [] };

    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

    const toggleExpand = (id: string) => {
        setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <main className="flex-1 h-full flex flex-col bg-slate-50 overflow-hidden relative z-0">
            <header className="px-8 pt-8 border-b border-slate-200 bg-white shadow-sm z-10 shrink-0">
                <div className="flex items-center mb-6">
                    <div className="bg-emerald-100 p-2 rounded-lg mr-3">
                        <AlertCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 leading-tight">{categoryData.title}</h2>
                        <p className="text-sm text-slate-500 font-medium">Knowledge Base Data</p>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 relative z-0">
                <div className="max-w-4xl mx-auto space-y-4 pb-20">
                    {categoryData.items.length === 0 ? (
                        <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-white">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Battle Cards Found</h3>
                            <p className="text-slate-500 text-sm">More battle cards and intel data loading...</p>
                        </div>
                    ) : (
                        categoryData.items.map(item => (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:border-emerald-300 hover:shadow-md transition-all">
                                <div
                                    className="p-5 cursor-pointer hover:bg-slate-50 transition-colors flex justify-between items-start group"
                                    onClick={() => toggleExpand(item.id)}
                                >
                                    <div className="pr-4">
                                        <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">{item.headline}</h3>
                                    </div>
                                    <div className="text-slate-400 bg-slate-100 p-1.5 rounded-full group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors shrink-0 mt-1">
                                        {expandedItems[item.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </div>
                                </div>

                                {expandedItems[item.id] && (
                                    <div className="px-5 pb-5 pt-0 border-t border-slate-100 bg-slate-50/50">
                                        <ul className="space-y-2.5 mt-4 mb-4">
                                            {item.bullets.map((bullet, idx) => (
                                                <li key={idx} className="flex text-sm text-slate-700 leading-relaxed">
                                                    <span className="text-emerald-500 mr-2.5 font-bold mt-0.5">•</span>
                                                    <span>
                                                        {bullet.label && <strong className="text-slate-900">{bullet.label}: </strong>}
                                                        {bullet.text}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                                            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center">
                                                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                                                Talk Track
                                            </h4>
                                            <p className="text-sm text-amber-800 font-medium leading-relaxed italic">&quot;{item.talkTrack}&quot;</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
