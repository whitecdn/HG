import React, { useState } from 'react';
import { CalculatorState } from '../types';
import { calculateHGCost, calculateManagementRevenue, calculateNetImpact, calculateToolSavings, calculateGrowthUpside, formatCurrency } from '../utils';

interface Props {
  state: CalculatorState;
}

export const SummarySidebar: React.FC<Props> = ({ state }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const mgmtRev = calculateManagementRevenue(state.listings, state.avgAnnualRevenue, state.commissionPercent);
  const hgCost = calculateHGCost(state.listings);
  const toolSavings = calculateToolSavings(state.listings, state.tools);
  
  // Net Impact now only includes Hard Costs (Tech Savings - HG Cost)
  const netImpact = calculateNetImpact(hgCost.monthly, toolSavings.monthly);
  const growth = calculateGrowthUpside(state.newProperties, state.avgAnnualRevenue, state.commissionPercent);

  // Total Net Monthly = (Tech Savings - HG Cost) + Growth Net Profit
  const totalNetMonthly = netImpact.monthly + growth.monthlyNetProfit;
  const isNetPositive = totalNetMonthly >= 0;

  // Logic: Show HG Investment from Tab 3 (HG Membership) onwards
  // Tabs: 0:Snapshot, 1:WhatYouGet, 2:Growth, 3:Membership, 4:Tech, 5:Summary
  const showInvestment = state.currentTab >= 3;

  const SummaryContent = () => (
    <div className="space-y-6 font-sans">
      <div className="border-b border-hg-navy/5 pb-4">
        <h3 className="text-hg-navy font-bold text-lg mb-4">Quick Snapshot</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-hg-slate text-sm font-medium">Listings</span>
          <span className="font-bold text-hg-navy">{state.listings}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-hg-slate text-sm font-medium">Monthly Mgmt Rev</span>
          <span className="font-bold text-hg-navy">{formatCurrency(mgmtRev.monthly)}</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* HG Investment line removed */}
        
        {toolSavings.monthly > 0 && (
          <div className="flex justify-between items-center animate-fade-in">
            <span className="text-hg-slate text-sm font-medium">Tech Savings</span>
            <span className="font-bold text-hg-teal">+{formatCurrency(toolSavings.monthly)}</span>
          </div>
        )}

        {/* Removed Time Value Saved display */}

        {growth.monthlyNetProfit > 0 && (
          <div className="flex justify-between items-center animate-fade-in">
            <span className="text-hg-slate text-sm font-medium">Growth Profit</span>
            <span className="font-bold text-hg-teal">+{formatCurrency(growth.monthlyNetProfit)}</span>
          </div>
        )}
      </div>

      <div className={`p-5 rounded-xl transition-colors duration-300 ${isNetPositive ? 'bg-hg-teal/5 border border-hg-teal/20' : 'bg-hg-gray/50 border border-hg-navy/10'}`}>
        <p className="text-xs uppercase tracking-widest font-bold text-hg-slate mb-2">Total Monthly Value</p>
        <div className={`text-3xl font-black ${isNetPositive ? 'text-hg-teal' : 'text-hg-navy'}`}>
          {isNetPositive ? '+' : ''}{formatCurrency(totalNetMonthly)}
        </div>
        <p className="text-xs text-hg-slate mt-2 font-medium">
          {isNetPositive ? 'Value created per month.' : 'Net investment per month.'}
        </p>
      </div>
      
      {/* Brand Motif Decor */}
      <div className="pt-4 flex justify-center opacity-20">
         <svg width="40" height="40" viewBox="0 0 32 32" fill="none" className="text-hg-navy">
             <path d="M22 10V22M10 22V10L10 10.01M10 22L10 16C10 12.6863 12.6863 10 16 10C19.3137 10 22 12.6863 22 16V22" stroke="currentColor" strokeWidth="3"/>
         </svg>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <div className="hidden lg:block w-80 shrink-0">
        <div className="sticky top-28 bg-white rounded-2xl shadow-soft p-6 border border-hg-navy/5">
          <SummaryContent />
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-hg-navy/10 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-50">
        <div className="px-4 py-3 flex items-center justify-between" onClick={() => setIsMobileOpen(!isMobileOpen)}>
          <div>
            <p className="text-xs text-hg-slate font-bold uppercase tracking-wider">Total Monthly Value</p>
            <p className={`font-black text-lg ${isNetPositive ? 'text-hg-teal' : 'text-hg-navy'}`}>
              {isNetPositive ? '+' : ''}{formatCurrency(totalNetMonthly)}
            </p>
          </div>
          <button className="text-hg-navy font-bold text-sm flex items-center gap-1 bg-hg-gray/50 px-3 py-1.5 rounded-lg">
            {isMobileOpen ? 'Hide' : 'Details'}
            <svg className={`w-4 h-4 transition-transform ${isMobileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
        {/* Drawer Content */}
        {isMobileOpen && (
          <div className="px-4 pb-8 pt-2 border-t border-hg-navy/5 bg-hg-ivory">
            <SummaryContent />
          </div>
        )}
      </div>
    </>
  );
};