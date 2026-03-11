import React from "react";
import { CenterPane } from "./CenterPane";
import { RightPane } from "./RightPane";
import { CalculatorState } from "../../types";

export function WarRoomView({ activeCategory, state, updateState, onSave }: { activeCategory: string, state: CalculatorState, updateState: (updates: Partial<CalculatorState>) => void, onSave: () => void }) {
    return (
        <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
            <CenterPane activeCategory={activeCategory} />
            <RightPane state={state} updateState={updateState} onSave={onSave} />
        </div>
    );
}
