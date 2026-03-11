import React, { useState } from 'react';
import { PanelRightClose, PanelRightOpen, Layers, CheckSquare, MessageSquare, Save } from 'lucide-react';
import { CalculatorState } from '../../types';

interface RightPaneProps {
    state: CalculatorState;
    updateState: (updates: Partial<CalculatorState>) => void;
    onSave: () => void;
}

export function RightPane({ state, updateState, onSave }: RightPaneProps) {
    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen) {
        return (
            <div className="h-full border-l border-slate-200 bg-white flex flex-col items-center py-4 w-[60px] flex-shrink-0 shadow-sm relative z-20">
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Open Copilot"
                >
                    <PanelRightOpen className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return (
        <aside className="w-[350px] h-full flex-shrink-0 bg-white border-l border-slate-200 flex flex-col shadow-xl relative z-20">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/80 backdrop-blur top-0 z-30">
                <h2 className="text-sm font-bold text-slate-900 flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
                    Live Action Notepad
                </h2>
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                    title="Close Copilot"
                >
                    <PanelRightClose className="w-4 h-4" />
                </button>
            </div>

            <div className="p-4 border-b border-slate-200 space-y-4 bg-white shrink-0">
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Target VRM (Company)</label>
                    <input
                        type="text"
                        value={state.targetVrm}
                        onChange={(e) => updateState({ targetVrm: e.target.value })}
                        placeholder="e.g. Acme Property Management"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-400 font-medium text-slate-900"
                    />
                </div>
                <div className="flex space-x-2">
                    <div className="flex-1">
                        <label className="text-[10px] text-slate-500 font-bold mb-1 block uppercase tracking-wider">Portfolio Size</label>
                        <input type="text" value={state.portfolioSize} onChange={(e) => updateState({ portfolioSize: e.target.value })} placeholder="e.g. 45 units" className="w-full px-2 py-1.5 text-sm font-medium bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-400" />
                    </div>
                    <div className="flex-1">
                        <label className="text-[10px] text-slate-500 font-bold mb-1 block uppercase tracking-wider">Target Geo</label>
                        <input type="text" value={state.targetGeo} onChange={(e) => updateState({ targetGeo: e.target.value })} placeholder="e.g. Destin, FL" className="w-full px-2 py-1.5 text-sm font-medium bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-400" />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">

                {/* Card 1: Discovery Notes */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 focus-within:border-emerald-500 transition-colors flex flex-col -mx-1">
                    <div className="flex items-center mb-3">
                        <div className="bg-emerald-50 p-1.5 rounded-md mr-2 text-emerald-500">
                            <MessageSquare className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">Live Call Notes</h3>
                    </div>
                    <textarea
                        value={state.discoveryNotes}
                        onChange={(e) => updateState({ discoveryNotes: e.target.value })}
                        placeholder="Jot down the CEO's main bottlenecks, their exit strategy, structural friction points..."
                        className="w-full h-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none placeholder:text-slate-400 text-slate-700 font-medium"
                    ></textarea>
                </div>

                {/* Card 2: Pricing Quick Reference */}
                <div className="bg-emerald-50 p-4 rounded-xl shadow-sm border border-emerald-100 flex flex-col -mx-1 mt-4">
                    <div className="flex items-center mb-4">
                        <div className="bg-emerald-100 p-1.5 rounded-md mr-2 text-emerald-600">
                            <Layers className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-emerald-900">Pricing Quick Reference</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-emerald-100 shadow-sm">
                            <span className="text-xs font-bold text-slate-700">Base Platform</span>
                            <span className="text-sm font-black text-emerald-600">$65<span className="text-[10px] text-slate-400 font-medium ml-0.5">/list/mo</span></span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-emerald-100 shadow-sm">
                            <span className="text-xs font-bold text-slate-700">RevMan Add-on</span>
                            <span className="text-sm font-black text-emerald-600">$55<span className="text-[10px] text-slate-400 font-medium ml-0.5">/list</span></span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-emerald-100 shadow-sm">
                            <span className="text-xs font-bold text-slate-700">Guest Support</span>
                            <span className="text-sm font-black text-emerald-600">$40<span className="text-[10px] text-slate-400 font-medium ml-0.5">/list</span></span>
                        </div>
                        <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mt-4 mb-2">HG Discounted Rates</h4>
                        <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-emerald-100 shadow-sm">
                            <span className="text-xs font-bold text-slate-700">Breezeway</span>
                            <span className="text-sm font-black text-emerald-600">$3.49<span className="text-[10px] text-slate-400 font-medium ml-0.5">/list/mo</span></span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-emerald-100 shadow-sm">
                            <span className="text-xs font-bold text-slate-700">Enso Connect</span>
                            <span className="text-sm font-black text-emerald-600">$5<span className="text-[10px] text-slate-400 font-medium ml-0.5">/list/mo</span></span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-emerald-100 shadow-sm">
                            <span className="text-xs font-bold text-slate-700">ConduitAI</span>
                            <span className="text-sm font-black text-emerald-600">$6<span className="text-[10px] text-slate-400 font-medium ml-0.5">/list/mo</span></span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-emerald-100 shadow-sm">
                            <span className="text-xs font-bold text-slate-700">SuiteOp</span>
                            <span className="text-sm font-black text-emerald-600">$8<span className="text-[10px] text-slate-400 font-medium ml-0.5">/list/mo</span></span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-emerald-100 shadow-sm">
                            <span className="text-xs font-bold text-slate-700">GuestyShield</span>
                            <span className="text-sm font-black text-emerald-600">$15<span className="text-[10px] text-slate-400 font-medium ml-0.5">/res</span></span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-emerald-100 shadow-sm">
                            <span className="text-xs font-bold text-slate-700">GuestyPay</span>
                            <span className="text-sm font-black text-emerald-600">2.6%<span className="text-[10px] text-slate-400 font-medium ml-0.5">fee</span></span>
                        </div>
                    </div>
                </div>

            </div>

            <div className="p-4 border-t border-slate-200 bg-white shrink-0">
                <button
                    onClick={onSave}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-lg shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 transition-all text-sm flex justify-center items-center group"
                >
                    <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Save Notes
                </button>
            </div>
        </aside>
    );
}
