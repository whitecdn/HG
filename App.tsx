import React, { useEffect, useState, useMemo } from 'react';
import { TOOLS_LIST, OPS_TASK_LIST, INITIAL_STATE, CalculatorState, CustomTool } from './types';

import { NumberInput, TextInput } from './components/Input';
import { SummarySidebar } from './components/SummarySidebar';
import {
  calculateHGCost,
  calculateManagementRevenue,
  calculateToolSavings,
  calculateNetImpact,
  calculateGrowthUpside,
  calculateTimeSavings,
  formatCurrency,
  compressStateToUrl,
  decompressStateFromUrl,
  saveScenarioToDb,
  getAllScenariosFromDb,
  deleteScenarioFromDb
} from './utils';

const STORAGE_KEY = 'hg_calculator_state_v3';

// --- Analytics Stub ---
const trackEvent = (name: string, props: any) => {
  try {
    if ((window as any).trackEvent) {
      (window as any).trackEvent(name, props);
    }
  } catch (e) {
    // no-op
  }
};

// --- DATA: COMMUNITY CASE STUDIES ---
interface CaseStudy {
  id: string;
  name: string;
  role: string;
  market: string;
  title: string;
  quote: string;
  story: string;
  stats: { label: string; value: string }[];
}

const COMMUNITY_CASES: CaseStudy[] = [
  {
    id: 'sarah-j',
    name: 'Sarah Jenkins',
    role: 'Portfolio Manager',
    market: 'Joshua Tree, CA',
    title: "From 15 to 45 Units in 8 Months",
    quote: "I was drowning in ops. HostGenius gave me the systems to triple my door count without hiring more staff.",
    story: "Sarah hit a ceiling at 15 units. She was doing everything herself—pricing, guest comms, and cleaner scheduling. Her growth had stalled because she simply ran out of hours in the day. After joining HostGenius, she implemented the 'Ops Automation Stack' and utilized the community masterminds to restructure her cleaning agreements. Within 8 months, she acquired 30 new units and actually works fewer hours now than she did with 15.",
    stats: [
      { label: 'Growth', value: '+300%' },
      { label: 'Hours Saved', value: '25/wk' },
      { label: 'Rev Increase', value: '$420k' }
    ]
  },
  {
    id: 'marcus-t',
    name: 'Marcus Thorne',
    role: 'Investment Group Lead',
    market: 'Smoky Mountains, TN',
    title: "Optimizing for Yield: The 22% Margin Jump",
    quote: "We thought we were efficient. The audit showed us we were bleeding cash on bad tech and underpricing peak dates.",
    story: "Marcus runs an investment group focused on high-yield cabins. They were using a fragmented tech stack costing $120/door and relying on basic dynamic pricing. The HostGenius audit identified immediate tech consolidation savings and a revenue management strategy for their high-season dates. By switching to the HG preferred stack and implementing active revenue management, they cut costs by 40% and boosted ADR by 18%.",
    stats: [
      { label: 'Margin Boost', value: '+22%' },
      { label: 'Tech Savings', value: '$45/door' },
      { label: 'ADR Growth', value: '18%' }
    ]
  },
  {
    id: 'elena-r',
    name: 'Elena Rodriguez',
    role: 'Luxury Operator',
    market: 'Miami, FL',
    title: "Building a Brand that Owners Trust",
    quote: "The biggest hurdle was convincing owners I could compete with the big national vacasa-style agencies. The HG assets solved that.",
    story: "Elena targets luxury waterfront properties. She struggled to win contracts against national players with flashy brochures and dashboards. Using the HostGenius Homeowner Acquisition Assets and the 'CEO Command Dashboard' concept, she was able to show prospective owners a level of professionalism and transparency that the big box managers couldn't match. She closed 4 luxury waterfronts in her first month.",
    stats: [
      { label: 'Contracts Won', value: '4' },
      { label: 'Portfolio Value', value: '$12M' },
      { label: 'Owner Churn', value: '0%' }
    ]
  }
];

// --- DATA: WHAT YOU GET ---
type BadgeType = 'Core' | 'Add-on' | 'Coming Soon';

interface BenefitItem {
  title: string;
  badge: BadgeType;
  bullets: [string, string, string];
}

interface BenefitCategory {
  name: string;
  items: BenefitItem[];
}

const BENEFITS_DATA: BenefitCategory[] = [
  {
    name: "Community",
    items: [
      {
        title: "Curated, facilitated weekly masterminds",
        badge: "Core",
        bullets: [
          "A weekly room of serious operators, guided, structured, and ruthlessly practical.",
          "Every session is built around real problems, real numbers, and what’s working right now.",
          "You leave with decisions made, actions assigned, and momentum you can feel by Monday."
        ]
      },
      {
        title: "Collective brain",
        badge: "Core",
        bullets: [
          "On-demand access to a living library of operator answers, not generic advice.",
          "Ask one question, get ten solutions from people who’ve already paid the tuition.",
          "Shortcut months of trial-and-error into one thread, one call, one decision."
        ]
      },
      {
        title: "Core groups",
        badge: "Core",
        bullets: [
          "Small, tight circles of peers at your stage, same problems, same pace, same ambition.",
          "A built-in accountability crew that keeps you executing between masterminds.",
          "You’re never solving the hard stuff alone, you’ve got a squad that moves with you."
        ]
      },
      {
        title: "Economies of scale technology rates",
        badge: "Core",
        bullets: [
          "Get enterprise-level pricing on the tools you already use, without enterprise headaches.",
          "Upgrade your stack while keeping your overhead flat or lower.",
          "More margin, better tools, and no Frankenstack chaos, just a cleaner system."
        ]
      },
      {
        title: "Homeowner Acquisition Assets & SOPs",
        badge: "Core",
        bullets: [
          "Proven targeting and prospecting docs to identify the right homeowner segments and reach them efficiently.",
          "Copy-and-paste outreach systems: email campaign templates, follow-up sequences, and messaging frameworks that convert.",
          "Battle-tested cold call scripts, objection handling, and SOPs so your pipeline becomes repeatable instead of random."
        ]
      },
      {
        title: "VIP events + private gatherings",
        badge: "Core",
        bullets: [
          "Get more out of conferences by attending alongside a vetted peer group you can collaborate with before, during, and after the event.",
          "Member discounts on conferences and retreats, plus HG-only meetups with the right people.",
          "Leave with relationships, partnerships, and playbooks, not swag and business cards."
        ]
      },
      {
        title: "Expert guest speakers",
        badge: "Core",
        bullets: [
          "Operators and specialists who don’t do theory, they bring receipts.",
          "Deep dives on the exact topics that move the needle: revenue, ops, growth, retention.",
          "You get frameworks, templates, and implementation steps, not motivation."
        ]
      },
      {
        title: "Charles’ Notion",
        badge: "Core",
        bullets: [
          "The internal operating system Charles built to scale, turned into your shortcut.",
          "SOPs, scorecards, checklists, and playbooks you can plug into your business immediately.",
          "Stop reinventing every process, adopt what’s proven and move faster with confidence."
        ]
      }
    ]
  },
  {
    name: "Team",
    items: [
      {
        title: "VP of Operations on-staff",
        badge: "Core",
        bullets: [
          "A process, automation, and AI expert focused on removing operational drag and founder bottlenecks.",
          "Pinpoints optimizations across workflows, staffing structure, and your tech stack.",
          "Hands-on support for new integrations and system setups so improvements actually stick."
        ]
      },
      {
        title: "VP of Revenue on-staff",
        badge: "Core",
        bullets: [
          "Industry-leading revenue leadership built for STR operators, disciplined, data-driven, and practical.",
          "Weekly revenue calls to diagnose performance, set priorities, and execute optimizations fast.",
          "Optional analyst support to take over active management when you want it fully handled."
        ]
      },
      {
        title: "Homeowner Acquisition Hours with Charles",
        badge: "Core",
        bullets: [
          "Direct 1-on-1 consulting to workshop initiatives, unblock roadblocks, and sharpen decisions.",
          "High-signal feedback from an operator who’s built the business you’re building.",
          "Leave each session with a clear plan, next steps, and accountable execution."
        ]
      },
      {
        title: "Trained Guest Support Team + General Manager Talent Pool",
        badge: "Add-on",
        bullets: [
          "24/7 hotel-trained guest support team that protects your brand and frees your time.",
          "AI messaging tools to increase speed, consistency, and resolution quality across every conversation.",
          "Access to GM-level operator talent to run day-to-day so you can stay focused on growth."
        ]
      },
      {
        title: "Homeowner SDR Program",
        badge: "Add-on",
        bullets: [
          "A dedicated team of SDRs cold-calling homeowners on your behalf to generate qualified opportunities.",
          "Appointments booked directly into your calendar so you can focus on running high-conversion calls, not chasing leads.",
          "Reclaim your time for the highest-value work: closing owners, improving your pitch, and scaling your portfolio."
        ]
      },
      {
        title: "Active Revenue Management",
        badge: "Add-on",
        bullets: [
          "Get an analyst who implements the VP of Revenue’s strategy directly across your portfolio, not just advice, actual execution.",
          "Spend zero time on pricing and pacing while performance is monitored and optimized continuously.",
          "Most partners see a 10–15% uplift with active revenue management, plus stronger owner confidence through better results."
        ]
      }
    ]
  },
  {
    name: "Collective Brain Product",
    items: [
      {
        title: "CEO Command Dashboard",
        badge: "Core",
        bullets: [
          "Set goals against every core metric and track them in real time, with full visibility for you, your VP of Ops, and Charles.",
          "See exactly where you said you’d be, where you actually are, and the moment you start to slip.",
          "Built-in accountability to hit targets faster, without chasing updates or reports."
        ]
      },
      {
        title: "Community Benchmarks & Leaderboards",
        badge: "Core",
        bullets: [
          "Falling behind on a metric?",
          "Every metric shows the top 3 performing managers in the network, so you know exactly who to reach out to depending on what you’re behind on: growth, retention, reviews, ops, or revenue.",
          "Turn the community into your fastest path back on track."
        ]
      },
      {
        title: "Beautifully branded white label homeowner dashboard",
        badge: "Core",
        bullets: [
          "A beautifully branded homeowner dashboard under your own brand that lets you compete with national players and large franchises with custom owner portals.",
          "Instead of the same off-the-shelf PMS dashboard everyone uses with limited data that creates questions and weak trust, owners see clear performance, market comparisons, and professional reports.",
          "You show up as a professional vacation rental management company, not a co-host, creating higher trust, retention, and referrals."
        ]
      },
      {
        title: "Homeowner journey: signup to onboard to retain to expand",
        badge: "Core",
        bullets: [
          "Manage the entire homeowner lifecycle in one place, from signup to scale.",
          "Send a single link for owners to sign up and accept terms, track onboarding collaboratively, sync directly with your PMS, and push listings automatically to cut onboarding time dramatically.",
          "Post-onboarding, track performance versus expectations so you can predict churn before it happens and share polished owner reports without spending more time."
        ]
      },
      {
        title: "Homeowner sales CRM",
        badge: "Core",
        bullets: [
          "All homeowner leads flow into one place, including directly from your website, so nothing is ever lost.",
          "Track conversion rates, time-to-close, and pipeline performance, and compare your sales metrics against the HostGenius network to know who to learn from when deals slow down.",
          "Charles can support your sales directly, and our cold callers can place qualified leads straight into your CRM."
        ]
      },
      {
        title: "Pro forma tool integrated with PriceLabs and your sales CRM",
        badge: "Core",
        bullets: [
          "Create branded pro formas powered by live PriceLabs data, including real estate analysis.",
          "Send pro formas to homeowners, see when they open and engage, and follow up at the perfect moment.",
          "Instantly stand out versus every other operator in your market."
        ]
      },
      {
        title: "Full accounting and statements software with two-way sync to PMS",
        badge: "Core",
        bullets: [
          "End-to-end accounting with two-way sync to your PMS.",
          "Statements are generated automatically and flow directly into operations, receipt tracking, and cards via Topkey.",
          "No manual statement work and no reconciliation headaches."
        ]
      },
      {
        title: "Real Estate Agent Partner Portal",
        badge: "Coming Soon",
        bullets: [
          "Invite Realtors into a dedicated partner dashboard where they can refer homeowners, track referrals, and receive automated commission payouts.",
          "Agents can submit on-market properties that fit STR investing directly into the homeowner dashboard, and get alerted when owners hit equity milestones and are ready to buy again.",
          "Use this to build deep brokerage partnerships and turn real estate referrals into a major growth channel."
        ]
      }
    ]
  }
];

// Brand Logo Component
const Logo = () => (
  <div className="flex items-center gap-2">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-hg-coral">
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <path d="M22 10V22M10 22V10L10 10.01M10 22L10 16C10 12.6863 12.6863 10 16 10C19.3137 10 22 12.6863 22 16V22" stroke="white" strokeWidth="3.5" strokeLinecap="square" />
    </svg>
    <div className="flex flex-col leading-none justify-center">
      <span className="text-hg-navy font-bold text-xl tracking-tight leading-none lowercase">host</span>
      <span className="text-hg-navy font-bold text-xl tracking-tight leading-none lowercase">genius</span>
    </div>
  </div>
);

type ViewMode = 'calculator' | 'community' | 'dashboard' | 'admin' | 'powerups';

// --- MAIN NAV SIDEBAR ---

const PowerupsView = ({ state, updateState }: { state: CalculatorState, updateState: (s: Partial<CalculatorState>) => void }) => {
  const [activeTab, setActiveTab] = useState<'sdr' | 'revmax' | 'acquisitions' | 'guest'>('sdr');

  // SDR Logic
  // 1 Deal = Avg Annual Rev * Commission
  const sdrDealsPerMonth = state.sdrAppointments * (state.sdrCloseRate / 100);
  const sdrRevPerDeal = state.avgAnnualRevenue * (state.commissionPercent / 100);
  const sdrTotalRevMonthly = (sdrDealsPerMonth * sdrRevPerDeal) / 12;
  const sdrCostPerDeal = 2000;
  const sdrTotalCost = sdrDealsPerMonth * sdrCostPerDeal;
  const sdrNetProfit = sdrTotalRevMonthly - sdrTotalCost; // Note: Rev is recurring, Cost is one-time (CAC). Comparison is tricky but let's show monthly value potential vs CAC.

  // Rev Max Logic
  // Uplift based on total revenue
  const currentTotalAnnualRev = state.listings * state.avgAnnualRevenue;
  const revMaxUpliftAnnual = currentTotalAnnualRev * (state.revMaxLift / 100);
  const revMaxUpliftMonthly = revMaxUpliftAnnual / 12;
  const revMaxCostMonthly = state.listings * 55;
  const revMaxNetMonthly = revMaxUpliftMonthly - revMaxCostMonthly;

  const TABS = [
    { id: 'sdr', label: 'Homeowner SDR' },
    { id: 'revmax', label: 'Revenue Management' },
    { id: 'acquisitions', label: 'Portfolio Acquisitions' },
    { id: 'guest', label: '24/7 Guest Support' }
  ];

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-hg-navy mb-4">Powerups</h1>
        <p className="text-xl text-hg-slate">Supercharge your growth with specialized add-ons.</p>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-hg-navy text-white shadow-lg shadow-hg-navy/20' : 'bg-white text-hg-slate hover:bg-hg-gray/50 hover:text-hg-navy'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] shadow-soft border border-hg-navy/5 min-h-[600px] p-8 md:p-12 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-hg-coral/5 to-hg-teal/5 rounded-full blur-3xl -mr-[100px] -mt-[100px] pointer-events-none"></div>

        {activeTab === 'sdr' && (
          <div className="animate-fade-in grid lg:grid-cols-2 gap-12 relative z-10">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-black text-hg-navy mb-4">Homeowner SDR</h2>
                <p className="text-hg-slate text-lg">We book the appointments. You close the deals. Scale your inventory without the cold calling.</p>
              </div>

              <div className="bg-hg-gray/10 rounded-3xl p-8 border border-hg-navy/5 space-y-6">
                <NumberInput
                  label="Appointments / Month"
                  value={state.sdrAppointments}
                  onChange={(v) => updateState({ sdrAppointments: v })}
                />
                <NumberInput
                  label="Your Close Rate (%)"
                  value={state.sdrCloseRate}
                  onChange={(v) => updateState({ sdrCloseRate: v })}
                  suffix="%"
                />
              </div>
            </div>

            <div className="bg-hg-navy text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-hg-coral rounded-full blur-[80px] opacity-20 -mr-10 -mb-10"></div>

              <div className="relative z-10 space-y-8">
                <div>
                  <div className="text-sm font-bold uppercase tracking-widest text-hg-teal mb-2">Projected Pipeline Value</div>
                  <div className="text-5xl font-black text-white">+{formatCurrency(sdrTotalRevMonthly)}<span className="text-lg text-hg-ivory/60 font-medium">/mo</span></div>
                  <p className="text-hg-ivory/60 mt-2 text-sm">Recurring revenue generated from {sdrDealsPerMonth.toFixed(1)} closed deals per month.</p>
                </div>

                <div className="bg-white/10 rounded-xl p-6 border border-white/5 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-hg-ivory">Acquisition Cost</span>
                    <span className="font-bold text-white uppercase tracking-wider">$2,000 / deal</span>
                  </div>
                  <p className="text-xs text-hg-ivory/50">Pay only for results. Includes lead sourcing, nurturing, and appointment setting.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'revmax' && (
          <div className="animate-fade-in grid lg:grid-cols-2 gap-12 relative z-10">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-black text-hg-navy mb-4">Revenue Management</h2>
                <p className="text-hg-slate text-lg">Expert pricing strategies to squeeze every dollar out of your existing portfolio.</p>
              </div>

              <div className="bg-hg-gray/10 rounded-3xl p-8 border border-hg-navy/5">
                <label className="block text-hg-navy font-bold text-lg mb-4">Revenue Uplift Target</label>
                <div className="flex items-end gap-3 mb-6">
                  <span className="text-5xl font-black text-hg-coral">{state.revMaxLift}%</span>
                  <span className="text-hg-slate font-bold mb-2">Increase</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={state.revMaxLift}
                  onChange={(e) => updateState({ revMaxLift: parseInt(e.target.value) })}
                  className="w-full h-2 bg-hg-navy/10 rounded-lg appearance-none cursor-pointer accent-hg-coral"
                />
                <div className="flex justify-between text-xs font-bold text-hg-slate mt-2 uppercase tracking-wide">
                  <span>1% Conservative</span>
                  <span>20% Aggressive</span>
                </div>
              </div>
            </div>

            <div className="bg-hg-navy text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-hg-teal rounded-full blur-[80px] opacity-20 -mr-10 -mt-10"></div>

              <div className="relative z-10 text-center space-y-8">
                <div>
                  <div className="text-sm font-bold uppercase tracking-widest text-hg-teal mb-2">Monthly Revenue Uplift</div>
                  <div className="text-6xl font-black text-white">+{formatCurrency(revMaxUpliftMonthly)}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="text-xs text-hg-ivory/60 uppercase tracking-wider mb-1">Service Cost</div>
                    <div className="text-xl font-bold text-white">$55<span className="text-sm font-medium text-hg-ivory/60">/door</span></div>
                  </div>
                  <div className="bg-white/20 p-4 rounded-xl border border-white/20">
                    <div className="text-xs text-hg-ivory/80 uppercase tracking-wider mb-1">Net Profit Gain</div>
                    <div className="text-xl font-bold text-hg-teal">+{formatCurrency(revMaxNetMonthly)}<span className="text-sm font-medium text-white/60">/mo</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'acquisitions' || activeTab === 'guest') && (
          <div className="animate-fade-in flex flex-col items-center justify-center h-full min-h-[400px] text-center max-w-lg mx-auto">
            <div className="w-20 h-20 bg-hg-gray/20 rounded-full flex items-center justify-center mb-6 text-hg-slate mb-6">
              <svg className="w-10 h-10 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <h2 className="text-3xl font-black text-hg-navy mb-4">Coming Soon</h2>
            <p className="text-hg-slate text-lg">We are finalizing the framework for {activeTab === 'acquisitions' ? 'large-scale portfolio acquisitions' : '24/7 guest communication support'}. Check back soon for updates.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MainNavigation = ({ currentView, setView, state }: { currentView: ViewMode, setView: (v: ViewMode) => void, state?: CalculatorState }) => {
  return (
    <div className="hidden lg:flex flex-col w-64 bg-hg-navy h-screen fixed left-0 top-0 z-50 shadow-2xl">
      {/* Brand Header */}
      <div className="h-24 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-hg-coral">
            <rect width="32" height="32" rx="8" fill="currentColor" />
            <path d="M22 10V22M10 22V10L10 10.01M10 22L10 16C10 12.6863 12.6863 10 16 10C19.3137 10 22 12.6863 22 16V22" stroke="white" strokeWidth="3.5" strokeLinecap="square" />
          </svg>
          <div className="flex flex-col leading-none justify-center">
            <span className="text-white font-bold text-lg tracking-tight leading-none lowercase">host</span>
            <span className="text-white font-bold text-lg tracking-tight leading-none lowercase">genius</span>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 py-6 px-3 space-y-2">
        {/* COST STACK DISPLAY REMOVED */}

        <button
          onClick={() => setView('calculator')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${currentView === 'calculator' ? 'bg-hg-teal text-white shadow-lg shadow-hg-teal/20' : 'text-hg-ivory/60 hover:bg-white/5 hover:text-white'}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 4h6m-6 4h6M6 7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V7z" />
          </svg>
          <span className="font-bold text-sm tracking-wide">Core Membership</span>
        </button>

        <button
          onClick={() => setView('powerups')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${currentView === 'powerups' ? 'bg-hg-coral text-white shadow-lg shadow-hg-coral/20' : 'text-hg-ivory/60 hover:bg-white/5 hover:text-white'}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="font-bold text-sm tracking-wide">Powerups</span>
        </button>

        {false && (
          <button
            onClick={() => setView('community')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${currentView === 'community' ? 'bg-hg-teal text-white shadow-lg shadow-hg-teal/20' : 'text-hg-ivory/60 hover:bg-white/5 hover:text-white'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="font-bold text-sm tracking-wide">Meet the Community</span>
          </button>
        )}

        {false && (
          <button
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${currentView === 'dashboard' ? 'bg-hg-teal text-white shadow-lg shadow-hg-teal/20' : 'text-hg-ivory/60 hover:bg-white/5 hover:text-white'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="font-bold text-sm tracking-wide">The Dashboard</span>
          </button>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-6 border-t border-white/10">
        <button
          onClick={() => setView('admin')}
          className={`w-full text-left text-xs font-medium transition-colors mb-2 ${currentView === 'admin' ? 'text-hg-teal' : 'text-hg-ivory/20 hover:text-hg-ivory/50'}`}
        >
          Admin Portal
        </button>
        <p className="text-hg-ivory/40 text-xs font-medium">© 2024 HostGenius</p>
      </div>
    </div>
  );
};

// --- ADMIN VIEW COMPONENT ---
const AdminView = ({ onLoad }: { onLoad: (state: CalculatorState) => void }) => {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = () => {
    const db = getAllScenariosFromDb();
    const list = Object.entries(db).map(([id, data]: [string, any]) => ({
      id,
      ...data
    })).sort((a: any, b: any) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
    setScenarios(list);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to permanently delete this scenario?')) {
      deleteScenarioFromDb(id);
      refreshList();
    }
  };

  const handleCopy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}?id=${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="animate-fade-in p-6 lg:p-12 max-w-[1600px] mx-auto min-h-screen">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black text-hg-navy mb-4 tracking-tight">Admin Portal</h1>
          <p className="text-hg-slate text-xl leading-relaxed max-w-2xl">
            Manage saved pricing scenarios and shared links.
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-hg-teal">{scenarios.length}</div>
          <div className="text-xs font-bold text-hg-slate uppercase tracking-wider">Saved Scenarios</div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-hg-navy/5 shadow-soft overflow-hidden">
        {scenarios.length === 0 ? (
          <div className="p-12 text-center text-hg-slate/60 italic">
            No scenarios saved yet. Use the calculator to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-hg-gray/30 text-xs font-bold text-hg-slate uppercase tracking-wider border-b border-hg-navy/5">
                <tr>
                  <th className="p-6 pl-8">Company</th>
                  <th className="p-6">Date Saved</th>
                  <th className="p-6">Portfolio Size</th>
                  <th className="p-6">Revenue Base</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hg-navy/5">
                {scenarios.map((s) => (
                  <tr key={s.id} className="group hover:bg-hg-ivory/50 transition-colors">
                    <td className="p-6 pl-8">
                      <span className="font-bold text-hg-navy text-lg">{s.companyName || s.id}</span>
                    </td>
                    <td className="p-6 text-sm text-hg-slate font-medium">
                      {new Date(s.savedAt).toLocaleDateString()} <span className="text-hg-slate/40">{new Date(s.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className="p-6">
                      <div className="font-bold text-hg-navy">{s.listings} Units</div>
                      {s.newProperties > 0 && <div className="text-xs text-hg-teal font-bold">+ {s.newProperties} Growth</div>}
                    </td>
                    <td className="p-6 text-sm font-medium text-hg-slate">
                      {formatCurrency(s.avgAnnualRevenue)} / door
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end items-center gap-3">
                        <button
                          onClick={() => onLoad(s)}
                          className="px-4 py-2 bg-hg-navy text-white text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-hg-teal transition-colors shadow-lg shadow-hg-navy/10 hover:shadow-hg-teal/20"
                        >
                          Load View
                        </button>
                        <button
                          onClick={(e) => handleCopy(s.id, e)}
                          className={`px-3 py-2 border border-hg-navy/10 rounded-lg text-hg-navy hover:bg-white transition-colors ${copiedId === s.id ? 'bg-green-50 border-green-200 text-green-700' : 'bg-hg-gray/50'}`}
                          title="Copy Link"
                        >
                          {copiedId === s.id ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          )}
                        </button>
                        <button
                          onClick={(e) => handleDelete(s.id, e)}
                          className="px-3 py-2 border border-red-100 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// --- DASHBOARD VIEW COMPONENT ---
type DashboardTab = 'ceo' | 'crm' | 'owner' | 'market';

// Dummy Data for Owner View
const OWNER_PROFILES = [
  {
    id: 'owner_1',
    name: 'Dr. Alex Smith',
    initials: 'AS',
    joined: '2022',
    propCount: 2,
    overallHealth: 98, // Score out of 100
    payout: 12450,
    properties: [
      { id: 1, name: 'Pine Cone Way', actualRev: 82000, projRev: 79000, occupancy: 88, status: 'Exceeding' },
      { id: 2, name: 'Downtown Loft', actualRev: 60500, projRev: 59000, occupancy: 76, status: 'On Track' }
    ]
  },
  {
    id: 'owner_2',
    name: 'InvestCorp LLC',
    initials: 'IC',
    joined: '2021',
    propCount: 12,
    overallHealth: 84, // Alert range
    payout: 85000,
    alertMsg: "Portfolio performing 16% below pro forma. Main driver: 'Ocean Blvd' block maintenance.",
    properties: [
      { id: 3, name: 'Ocean Blvd Block A', actualRev: 120000, projRev: 180000, occupancy: 45, status: 'At Risk' },
      { id: 4, name: 'Sunset Villas', actualRev: 730000, projRev: 830000, occupancy: 62, status: 'Below Target' },
      { id: 5, name: 'Harbor Point #4', actualRev: 45000, projRev: 44000, occupancy: 82, status: 'On Track' }
    ]
  },
  {
    id: 'owner_3',
    name: 'Sarah J.',
    initials: 'SJ',
    joined: '2023',
    propCount: 1,
    overallHealth: 105,
    payout: 8200,
    properties: [
      { id: 6, name: 'Desert Dome', actualRev: 89000, projRev: 65000, occupancy: 92, status: 'Exceeding' }
    ]
  }
];

const DashboardView = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('ceo');
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>(OWNER_PROFILES[0].id);

  const selectedOwner = OWNER_PROFILES.find(o => o.id === selectedOwnerId) || OWNER_PROFILES[0];

  const tabs = [
    { id: 'ceo', label: 'CEO Command' },
    { id: 'crm', label: 'Sales & CRM' },
    { id: 'owner', label: 'Owner Portal' },
    { id: 'market', label: 'Off-Market Deal Flow' },
  ];

  return (
    <div className="animate-fade-in p-6 lg:p-12 max-w-[1600px] mx-auto min-h-screen flex flex-col">
      <div className="mb-10">
        <h1 className="text-4xl lg:text-5xl font-black text-hg-navy mb-4 tracking-tight">The Ecosystem</h1>
        <p className="text-hg-slate text-xl leading-relaxed max-w-2xl">
          More than just a community. A complete operating system for scaling. <br />
          Preview the tools that power the top 1% of operators.
        </p>
      </div>

      {/* Sub Nav */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as DashboardTab)}
            className={`px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider whitespace-nowrap transition-all ${activeTab === tab.id
              ? 'bg-hg-navy text-white shadow-lg shadow-hg-navy/20'
              : 'bg-white text-hg-slate hover:bg-hg-gray hover:text-hg-navy border border-hg-navy/5'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Container */}
      <div className="flex-1 bg-white rounded-[2rem] border border-hg-navy/5 shadow-soft overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-hg-navy via-hg-teal to-hg-coral"></div>

        {/* DASHBOARD CONTENT SWITCHER */}
        <div className="p-8 lg:p-12 h-full overflow-y-auto">

          {/* 1. CEO COMMAND */}
          {activeTab === 'ceo' && (
            <div className="animate-fade-in space-y-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-hg-navy">Performance Pulse</h2>
                <span className="text-xs font-bold uppercase tracking-widest text-hg-slate bg-hg-gray px-3 py-1 rounded">Last 30 Days</span>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 rounded-2xl bg-hg-ivory border border-hg-navy/5">
                  <div className="text-xs font-bold text-hg-slate uppercase tracking-wider mb-2">Portfolio Rev</div>
                  <div className="text-3xl font-black text-hg-navy">$482,590</div>
                  <div className="text-xs font-bold text-hg-teal mt-2">▲ 12% vs last month</div>
                </div>
                <div className="p-6 rounded-2xl bg-hg-ivory border border-hg-navy/5">
                  <div className="text-xs font-bold text-hg-slate uppercase tracking-wider mb-2">Avg Occupancy</div>
                  <div className="text-3xl font-black text-hg-navy">78%</div>
                  <div className="text-xs font-bold text-hg-teal mt-2">▲ 4% vs market</div>
                </div>
                <div className="p-6 rounded-2xl bg-hg-ivory border border-hg-navy/5">
                  <div className="text-xs font-bold text-hg-slate uppercase tracking-wider mb-2">Avg ADR</div>
                  <div className="text-3xl font-black text-hg-navy">$342</div>
                  <div className="text-xs font-bold text-hg-coral mt-2">▼ 2% vs target</div>
                </div>
                <div className="p-6 rounded-2xl bg-hg-ivory border border-hg-navy/5">
                  <div className="text-xs font-bold text-hg-slate uppercase tracking-wider mb-2">Net Income</div>
                  <div className="text-3xl font-black text-hg-navy">$58,210</div>
                  <div className="text-xs font-bold text-hg-teal mt-2">▲ 8% vs last month</div>
                </div>
              </div>

              {/* Department Health */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl border border-hg-navy/5 bg-white shadow-sm">
                  <h3 className="font-bold text-lg text-hg-navy mb-6">Department Health</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-hg-teal"></div>
                        <span className="font-medium text-hg-slate">Operations</span>
                      </div>
                      <span className="font-bold text-hg-navy">98% Clean Rating</span>
                    </div>
                    <div className="w-full bg-hg-gray rounded-full h-2"><div className="bg-hg-teal h-2 rounded-full w-[98%]"></div></div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-hg-teal"></div>
                        <span className="font-medium text-hg-slate">Guest Support</span>
                      </div>
                      <span className="font-bold text-hg-navy">4m Avg Response</span>
                    </div>
                    <div className="w-full bg-hg-gray rounded-full h-2"><div className="bg-hg-teal h-2 rounded-full w-[92%]"></div></div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-hg-coral"></div>
                        <span className="font-medium text-hg-slate">Maintenance</span>
                      </div>
                      <span className="font-bold text-hg-navy">3 Open Tickets (&gt;48h)</span>
                    </div>
                    <div className="w-full bg-hg-gray rounded-full h-2"><div className="bg-hg-coral h-2 rounded-full w-[60%]"></div></div>
                  </div>
                </div>

                <div className="p-8 rounded-3xl bg-hg-navy text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-hg-teal rounded-full opacity-10 blur-3xl -mr-16 -mt-16"></div>
                  <h3 className="font-bold text-lg mb-2 relative z-10">Goals vs Actuals</h3>
                  <p className="text-hg-ivory/60 text-sm mb-6 relative z-10">Q3 2024 Targets</p>

                  <div className="space-y-6 relative z-10">
                    <div>
                      <div className="flex justify-between text-sm font-medium mb-2">
                        <span>Unit Acquisitions</span>
                        <span className="text-hg-teal">8 / 10 Signed</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3"><div className="bg-hg-teal h-3 rounded-full w-[80%] shadow-[0_0_10px_rgba(48,163,181,0.5)]"></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm font-medium mb-2">
                        <span>Direct Booking %</span>
                        <span className="text-hg-coral">18% / 25% Target</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3"><div className="bg-hg-coral h-3 rounded-full w-[72%]"></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. SALES CRM */}
          {activeTab === 'crm' && (
            <div className="animate-fade-in space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pipeline Summary */}
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-black text-hg-navy mb-6">Acquisition Pipeline</h2>
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {[
                      { label: 'Leads', count: 142, val: '$8.2M' },
                      { label: 'Contacted', count: 45, val: '$3.1M' },
                      { label: 'Analysis Sent', count: 12, val: '$950k' },
                      { label: 'Closing', count: 4, val: '$320k' },
                    ].map((stage, i) => (
                      <div key={i} className="min-w-[140px] flex-1 bg-hg-gray/30 p-4 rounded-xl border border-hg-navy/5">
                        <div className="text-xs font-bold text-hg-slate uppercase tracking-wider mb-2">{stage.label}</div>
                        <div className="text-2xl font-black text-hg-navy">{stage.count}</div>
                        <div className="text-xs font-medium text-hg-teal mt-1">Est. {stage.val}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 bg-white border border-hg-navy/10 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-hg-gray/50 text-hg-slate font-bold uppercase tracking-wider text-xs">
                        <tr>
                          <th className="p-4">Property Address</th>
                          <th className="p-4">Owner</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Next Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-hg-navy/5">
                        <tr>
                          <td className="p-4 font-bold text-hg-navy">124 Pine Cone Way</td>
                          <td className="p-4 text-hg-slate">Dr. A. Smith</td>
                          <td className="p-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md font-bold text-xs uppercase">Proposal</span></td>
                          <td className="p-4 text-hg-slate">Follow up: ROI Review (Tue)</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-bold text-hg-navy">88 Ocean Blvd Unit 4</td>
                          <td className="p-4 text-hg-slate">InvestCorp LLC</td>
                          <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-md font-bold text-xs uppercase">Contract Sent</span></td>
                          <td className="p-4 text-hg-slate">Awaiting Signature</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-bold text-hg-navy">The Mountain Loft</td>
                          <td className="p-4 text-hg-slate">Sarah J.</td>
                          <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md font-bold text-xs uppercase">New Lead</span></td>
                          <td className="p-4 text-hg-slate">Send Pro Forma</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Performance Alerts */}
                <div className="bg-hg-coral/5 border border-hg-coral/20 rounded-3xl p-6 h-fit">
                  <div className="flex items-center gap-3 mb-4 text-hg-coral">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <h3 className="font-bold text-lg">Performance Watch</h3>
                  </div>
                  <p className="text-sm text-hg-slate mb-6">Properties performing &gt;15% below Pro Forma projection.</p>

                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-hg-coral/10 shadow-sm">
                      <div className="font-bold text-hg-navy text-sm mb-1">Sunset Villa #4</div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-hg-slate">Actual: <span className="text-hg-navy font-bold">$4,200</span></span>
                        <span className="text-hg-slate">Proj: <span className="text-hg-navy font-bold">$5,500</span></span>
                      </div>
                      <div className="text-xs font-bold text-hg-coral bg-hg-coral/10 px-2 py-1 rounded inline-block">23% Below Target</div>
                      <button className="w-full mt-3 py-2 border border-hg-navy/10 rounded-lg text-xs font-bold text-hg-navy hover:bg-hg-gray transition-colors">Generate Explanation Report</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. OWNER PORTAL */}
          {activeTab === 'owner' && (
            <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Owner List */}
              <div className="lg:col-span-4 space-y-4">
                <h3 className="text-xs font-bold text-hg-slate uppercase tracking-widest px-2">Select Owner View</h3>
                {OWNER_PROFILES.map(owner => (
                  <button
                    key={owner.id}
                    onClick={() => setSelectedOwnerId(owner.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${selectedOwnerId === owner.id
                      ? 'bg-hg-navy text-white border-hg-navy shadow-lg'
                      : 'bg-white border-hg-navy/5 hover:border-hg-navy/20 hover:bg-hg-gray/50'
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${selectedOwnerId === owner.id ? 'bg-hg-teal text-white' : 'bg-hg-gray text-hg-slate'}`}>
                      {owner.initials}
                    </div>
                    <div className="text-left flex-1">
                      <div className={`font-bold ${selectedOwnerId === owner.id ? 'text-white' : 'text-hg-navy'}`}>{owner.name}</div>
                      <div className={`text-xs flex items-center gap-2 ${selectedOwnerId === owner.id ? 'text-hg-ivory/60' : 'text-hg-slate'}`}>
                        {owner.propCount} Properties
                        {owner.overallHealth < 90 && (
                          <span className="inline-block w-2 h-2 rounded-full bg-hg-coral animate-pulse"></span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Right: Detailed Dashboard */}
              <div className="lg:col-span-8 space-y-6">
                {/* Owner Header Stats */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-hg-navy/5 pb-6 gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-2xl font-black text-hg-navy">{selectedOwner.name}</h2>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${selectedOwner.overallHealth >= 90 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        Health Score: {selectedOwner.overallHealth}
                      </span>
                    </div>
                    <p className="text-hg-slate font-medium text-sm">Owner since {selectedOwner.joined}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-hg-slate uppercase tracking-wider mb-1">Current Payout</div>
                    <div className="text-3xl font-black text-hg-teal">{formatCurrency(selectedOwner.payout)}</div>
                  </div>
                </div>

                {/* Alert Banner if Health is Low */}
                {selectedOwner.overallHealth < 90 && (
                  <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <div>
                      <h4 className="text-sm font-bold text-red-800">Performance Alert</h4>
                      <p className="text-xs text-red-700 mt-1">{selectedOwner.alertMsg || "Performance is below projected targets. Review properties below."}</p>
                    </div>
                  </div>
                )}

                {/* Properties Grid */}
                <div className="grid gap-4">
                  {selectedOwner.properties.map(prop => {
                    const percentDiff = ((prop.actualRev - prop.projRev) / prop.projRev) * 100;
                    const isPositive = percentDiff >= 0;

                    return (
                      <div key={prop.id} className="bg-white rounded-xl border border-hg-navy/10 p-5 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-hg-navy">{prop.name}</h3>
                          <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${prop.status === 'Exceeding' ? 'bg-green-100 text-green-700' :
                            prop.status === 'On Track' ? 'bg-blue-100 text-blue-700' :
                              'bg-red-100 text-red-700'
                            }`}>{prop.status}</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-hg-slate text-xs uppercase font-bold mb-1">Actual Rev</div>
                            <div className="font-black text-hg-navy">{formatCurrency(prop.actualRev)}</div>
                          </div>
                          <div>
                            <div className="text-hg-slate text-xs uppercase font-bold mb-1">Pro Forma</div>
                            <div className="font-bold text-hg-slate">{formatCurrency(prop.projRev)}</div>
                          </div>
                          <div>
                            <div className="text-hg-slate text-xs uppercase font-bold mb-1">Variance</div>
                            <div className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                              {isPositive ? '+' : ''}{percentDiff.toFixed(1)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-hg-slate text-xs uppercase font-bold mb-1">Occupancy</div>
                            <div className="font-bold text-hg-navy">{prop.occupancy}%</div>
                          </div>
                        </div>

                        {/* Progress Bar Visual */}
                        <div className="mt-4 pt-4 border-t border-hg-navy/5">
                          <div className="flex justify-between text-xs text-hg-slate mb-1">
                            <span>Performance to Projection</span>
                            <span>{Math.min(100 + percentDiff, 100).toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-hg-gray h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isPositive ? 'bg-hg-teal' : 'bg-hg-coral'}`}
                              style={{ width: `${Math.min(100 + percentDiff, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-gradient-to-r from-hg-teal/10 to-transparent p-6 rounded-2xl border border-hg-teal/20 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-hg-navy text-lg mb-1">Your Portfolio Equity</h4>
                    <p className="text-sm text-hg-slate">Est. Value: <span className="font-bold text-hg-navy">$1.8M</span> (+$120k since purchase)</p>
                  </div>
                  <button className="bg-white text-hg-teal font-bold px-4 py-2 rounded-lg border border-hg-teal/20 hover:bg-hg-teal hover:text-white transition-colors text-sm">See Refinance Options</button>
                </div>
              </div>
            </div>
          )}

          {/* 4. MARKETPLACE */}
          {activeTab === 'market' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-2xl font-black text-hg-navy mb-2">Off-Market Deal Flow</h2>
                  <p className="text-hg-slate">Exclusive STR opportunities vetted by the HostGenius network.</p>
                </div>
                <button className="bg-hg-navy text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-hg-teal transition-colors">List a Property</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80', title: 'The Coastal A-Frame', loc: 'Oregon Coast', price: '$850,000', yield: '14%', badge: 'Pocket Listing' },
                  { img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80', title: 'Modern Desert Oasis', loc: 'Joshua Tree, CA', price: '$625,000', yield: '11.5%', badge: 'Verified Ops' },
                  { img: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80', title: 'Lakefront Lodge', loc: 'Whitefish, MT', price: '$1.2M', yield: '18%', badge: 'Turnkey' },
                ].map((item, i) => (
                  <div key={i} className="group bg-white rounded-3xl border border-hg-navy/5 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 left-4 bg-hg-navy/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                        {item.badge}
                      </div>
                      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-hg-navy font-bold px-3 py-1 rounded-lg shadow-sm">
                        {item.price}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-hg-navy mb-1">{item.title}</h3>
                      <p className="text-hg-slate text-sm mb-4">{item.loc}</p>

                      <div className="flex gap-4 border-t border-hg-navy/5 pt-4">
                        <div>
                          <div className="text-[10px] font-bold text-hg-slate uppercase tracking-wider">Proj. Yield</div>
                          <div className="text-xl font-black text-hg-teal">{item.yield}</div>
                        </div>
                        <div className="pl-4 border-l border-hg-navy/5">
                          <div className="text-[10px] font-bold text-hg-slate uppercase tracking-wider">Est. Revenue</div>
                          <div className="text-xl font-black text-hg-navy">$124k<span className="text-sm text-hg-slate/60 font-medium">/yr</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// --- COMMUNITY VIEW COMPONENT (MASTER-DETAIL) ---
const CommunityView = () => {
  const [activeCase, setActiveCase] = useState<CaseStudy>(COMMUNITY_CASES[0]);

  return (
    <div className="animate-fade-in p-6 lg:p-12 max-w-[1600px] mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl lg:text-5xl font-black text-hg-navy mb-4 tracking-tight">The HostGenius Community</h1>
        <p className="text-hg-slate text-xl leading-relaxed max-w-2xl">Real operators. Real numbers. Real results. <br /> See how your peers are scaling with the partnership.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        {/* Left Column: List (Span 4) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-bold text-hg-slate uppercase tracking-widest mb-4 px-2">Success Stories</h3>
          {COMMUNITY_CASES.map((study) => (
            <button
              key={study.id}
              onClick={() => setActiveCase(study)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 group relative overflow-hidden ${activeCase.id === study.id
                ? 'bg-white border-hg-teal shadow-lg shadow-hg-teal/10 scale-[1.02]'
                : 'bg-white border-transparent hover:border-hg-navy/10 hover:bg-hg-gray/50'
                }`}
            >
              {activeCase.id === study.id && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-hg-teal"></div>}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${activeCase.id === study.id ? 'bg-hg-navy text-white' : 'bg-hg-gray text-hg-slate'}`}>
                  {study.name.charAt(0)}
                </div>
                <div>
                  <div className={`font-bold text-lg leading-tight ${activeCase.id === study.id ? 'text-hg-navy' : 'text-hg-slate group-hover:text-hg-navy'}`}>{study.name}</div>
                  <div className="text-xs font-medium text-hg-slate/60 mt-1">{study.role} • {study.market}</div>
                </div>
              </div>
            </button>
          ))}


        </div>

        {/* Right Column: Detail (Span 8) */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[2.5rem] p-2 shadow-soft border border-hg-navy/5 h-full">
            <div className="h-full flex flex-col">
              {/* Video Placeholder */}
              <div className="relative aspect-video bg-hg-navy rounded-[2rem] overflow-hidden group cursor-pointer mb-8 shrink-0">
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
                {/* Placeholder Background/Poster */}
                <div className="absolute inset-0 bg-gradient-to-tr from-hg-navy to-hg-teal/50 opacity-50 z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <span className="text-white font-black text-9xl tracking-tighter mix-blend-overlay">HG</span>
                </div>
                <div className="absolute bottom-6 left-6 z-20">
                  <div className="inline-block px-3 py-1 bg-hg-coral text-white text-[10px] font-bold uppercase tracking-widest rounded mb-2">Case Study</div>
                  <h2 className="text-white font-bold text-2xl">{activeCase.title}</h2>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 lg:px-8 pb-8 flex-1">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {activeCase.stats.map((stat, idx) => (
                    <div key={idx} className="bg-hg-gray/30 p-4 rounded-xl text-center border border-hg-navy/5">
                      <div className="text-hg-teal font-black text-2xl mb-1">{stat.value}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-hg-slate">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="prose prose-lg text-hg-slate mb-8">
                  <h3 className="text-hg-navy font-bold text-xl mb-2">The Challenge & Solution</h3>
                  <p className="leading-relaxed text-base">{activeCase.story}</p>
                </div>

                <div className="bg-hg-ivory p-6 rounded-2xl border-l-4 border-hg-coral italic text-hg-navy text-lg font-medium leading-relaxed">
                  "{activeCase.quote}"
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- CALCULATOR TAB COMPONENTS ---

const TabSnapshot = ({ state, updateState }: { state: CalculatorState; updateState: (s: Partial<CalculatorState>) => void }) => {
  const updateTaskHours = (id: string, hours: number) => {
    const newTasks = state.opsTasks.map(t => t.id === id ? { ...t, hours } : t);
    updateState({ opsTasks: newTasks });
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-3xl font-black text-hg-navy mb-4">Portfolio Snapshot</h2>
        <p className="text-hg-slate text-lg">Let's start with your current numbers to establish a baseline.</p>
      </div>

      <div className="mb-8">
        <TextInput
          label="Company"
          value={state.companyName}
          onChange={(val) => updateState({ companyName: val })}
          placeholder="Enter company name..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <NumberInput
          label="Current Listings"
          value={state.listings}
          onChange={(val) => updateState({ listings: val })}
          min={1}
        />
        <NumberInput
          label="Avg. Annual Revenue / Door"
          value={state.avgAnnualRevenue}
          onChange={(val) => updateState({ avgAnnualRevenue: val })}
          prefix="$"
        />
        <NumberInput
          label="Management Commission"
          value={state.commissionPercent}
          onChange={(val) => updateState({ commissionPercent: val })}
          suffix="%"
          min={0}
          max={100}
        />
      </div>

      {/* SECTION 2: TIME (Moved from Tech Stack) */}
      <div className="pt-8 border-t border-hg-navy/5">
        <h2 className="text-3xl font-black text-hg-navy mb-4">Operational Efficiency</h2>
        <p className="text-hg-slate text-lg mb-8">How many hours per week do you spend on these tasks?</p>

        <div className="bg-hg-gray/20 p-6 rounded-3xl border border-hg-navy/5 space-y-6">
          {OPS_TASK_LIST.map(task => {
            const userTask = state.opsTasks.find(t => t.id === task.id) || { id: task.id, hours: 0 };
            return (
              <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="font-bold text-hg-navy">{task.name}</div>
                  <div className="text-xs text-hg-slate font-bold uppercase tracking-wider">{task.category}</div>
                </div>
                <div className="w-full sm:w-32">
                  <NumberInput
                    label="Hours/Week"
                    value={userTask.hours}
                    onChange={(val) => updateTaskHours(task.id, val)}
                    suffix="h"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const TabWhatYouGet = ({ state, updateState }: { state: CalculatorState; updateState: (s: Partial<CalculatorState>) => void }) => {
  // Calculations for "Your Numbers" preview
  const savingsResult = calculateToolSavings(1, state.tools, state.customTools);
  const growthResult = calculateGrowthUpside(state.newProperties, state.avgAnnualRevenue, state.commissionPercent);

  // Total projected value (Growth Only for now as per Summary logic)
  const totalMonthlyValue = growthResult.monthlyNetProfit;

  return (
    <div className="animate-fade-in space-y-20">
      {/* SECTION 1: HERO */}
      <div className="relative rounded-[3rem] overflow-hidden bg-hg-navy text-white p-10 md:p-16 text-center shadow-2xl border border-white/5 group">
        {/* Dynamic Backgrounds */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0B354E] via-hg-navy to-hg-navy opacity-80"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-hg-teal/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-hg-coral/10 rounded-full blur-[100px] animate-pulse delay-700"></div>

        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-12">
          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-xs font-bold tracking-widest uppercase text-hg-teal mb-4 shadow-sm">
              The Partnership
            </div>
            <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tight drop-shadow-sm">
              HostGenius is the <span className="text-hg-teal">execution-first</span> private network for boutique STR operators.
            </h2>
            <p className="text-xl md:text-2xl text-hg-ivory/80 leading-relaxed max-w-2xl mx-auto font-light">
              Most groups share ideas. We turn ideas into <span className="text-white font-medium">implementation</span>, <span className="text-white font-medium">systems</span>, and <span className="text-white font-medium">measurable outcomes</span>.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/5 inline-block text-left mx-auto">
            <ul className="space-y-5">
              {[
                "Execution beats information. We help you install the playbooks, not just talk about them.",
                "Operate like a CEO: dashboards, targets, accountability, and leverage.",
                "Turn 5-year goals into 2-year goals with compounding systems and shared leverage."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-hg-ivory/90 text-lg">
                  <div className="mt-1 p-1 bg-hg-teal/20 rounded-full">
                    <svg className="w-4 h-4 text-hg-teal shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 pt-4 text-left">
            {[
              { title: "Owner Operating System", body: "One place for owner performance, retention risk, and growth levers." },
              { title: "Private Network", body: "Operators sharing what’s working right now, with proof and benchmarks." },
              { title: "Elite Services", body: "VP-level Ops and Revenue Management aligned to your targets." }
            ].map((card, i) => (
              <div key={i} className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:translate-y-[-4px] transition-transform duration-300 shadow-lg hover:shadow-xl hover:border-hg-teal/30 group/card">
                <h4 className="font-bold text-hg-teal text-sm uppercase tracking-wide mb-3 group-hover/card:text-white transition-colors">{card.title}</h4>
                <p className="text-sm text-hg-ivory/70 leading-relaxed font-light">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: PROBLEMS */}
      <div className="bg-hg-ivory rounded-[3rem] p-10 md:p-16 border border-hg-navy/5">
        <h3 className="text-center text-3xl md:text-4xl font-black text-hg-navy mb-16 tracking-tight">The Problems We Solve</h3>
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {[
            { title: "Owner growth is slow and inconsistent", icon: "📉", looks: "New owners come from luck, referrals, or sporadic marketing.", costs: "Hard to forecast growth. Hard to build a sellable asset. Hard to step away." },
            { title: "You’re stuck in the business", icon: "⚙️", looks: "You’re too busy getting your hands dirty with daily tasks that don’t drive growth.", costs: "No time to build systems, lead a team, or make real CEO-level decisions." },
            { title: "Too many roles, not enough specialists", icon: "🤹", looks: "Pricing, CX, ops, hiring, homeowner comms, financials, sales, marketing.", costs: "You either guess, or you learn the hard way and pay for it in churn and margin." },
            { title: "You need to level up your room", icon: "🚀", looks: "You can’t ask friends or family how to scale a vacation rental business.", costs: "Staying the smartest person in the room caps your growth." }
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-[2rem] p-8 border border-hg-navy/5 shadow-lg hover:shadow-2xl hover:shadow-hg-navy/10 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-hg-teal/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-5xl mb-6 bg-hg-navy/5 w-20 h-20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">{card.icon}</div>
              <h4 className="text-2xl font-bold text-hg-navy mb-8 group-hover:text-hg-teal transition-colors">{card.title}</h4>

              <div className="grid gap-6">
                <div className="relative pl-6 border-l-2 border-hg-navy/10 group-hover:border-hg-navy/30 transition-colors">
                  <div className="text-xs font-bold text-hg-slate uppercase tracking-wider mb-2">What it looks like</div>
                  <p className="text-hg-navy/80 font-medium leading-relaxed">{card.looks}</p>
                </div>
                <div className="relative pl-6 border-l-2 border-hg-coral/20 group-hover:border-hg-coral/50 transition-colors">
                  <div className="text-xs font-bold text-hg-coral uppercase tracking-wider mb-2">What it costs you</div>
                  <p className="text-hg-navy/80 font-medium leading-relaxed">{card.costs}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-hg-slate font-bold mt-12 uppercase tracking-widest text-sm opacity-60">The fastest path is being a small fish in a big room.</p>
      </div>

      {/* SECTION 3: HOW IT WORKS */}
      <div className="relative overflow-hidden bg-hg-navy text-white rounded-[3rem] p-10 md:p-20 border border-white/5 shadow-2xl isolate">
        {/* Background Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#114b6e] via-hg-navy to-hg-navy opacity-60"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

        <div className="relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-black text-white mb-6">How It Works</h3>
            <p className="text-hg-ivory/60 text-lg max-w-xl mx-auto">A simple, repeatable process to transform your operation.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative max-w-5xl mx-auto">
            {/* Visual Connector */}
            <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-hg-teal/30 to-transparent z-0"></div>

            {[
              { title: "Set the scoreboard", body: "Define goals, install tracking, identify bottlenecks." },
              { title: "Install systems", body: "Deploy playbooks across ops, owner retention, and growth." },
              { title: "Compound results", body: "Weekly momentum plus community benchmarks and expert oversight." }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-full bg-hg-navy border-4 border-hg-teal/20 text-white flex items-center justify-center font-black text-2xl shadow-[0_0_30px_rgba(45,212,191,0.15)] mb-8 z-10 group-hover:scale-110 group-hover:border-hg-teal transition-all duration-300">
                  <span className="text-hg-teal group-hover:text-white transition-colors">{i + 1}</span>
                </div>
                <h5 className="font-bold text-white text-2xl mb-4 group-hover:text-hg-teal transition-colors">{step.title}</h5>
                <p className="text-hg-ivory/60 leading-relaxed max-w-xs">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: HOW WE HELP (Split & Refined) */}
      <div className="bg-hg-teal/5 rounded-[3rem] p-10 md:p-14 border border-hg-teal/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-hg-teal/10 rounded-full blur-[100px]"></div>
        <div className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-3xl md:text-4xl font-black text-hg-navy mb-4">How we help you hit your goals</h3>
            <p className="text-lg text-hg-slate">We combine your data, community benchmarks, and fractional executive horsepower so you execute faster.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {[
              { title: "Data, numbers, and clear targets", bullets: ["Retention, margin, and time scoreboard.", "Know exactly what moves the needle."] },
              { title: "Collective intelligence that compounds", bullets: ["Insights you can’t find on YouTube.", "Direct access to top operators."] },
              { title: "VP Ops + VP Revenue Management", bullets: ["Data-driven planning and outcomes.", "SOPs, cadence, and accountability."] },
              { title: "Economies of scale", bullets: ["Collective buying power.", "Better vendors, better pricing, less waste."] }
            ].map((pillar, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-hg-navy/5 hover:shadow-md transition-shadow group">
                <h4 className="text-xl font-bold text-hg-teal mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-hg-teal/10 flex items-center justify-center text-hg-teal group-hover:bg-hg-teal group-hover:text-white transition-colors shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  </span>
                  {pillar.title}
                </h4>
                <div className="space-y-3 pl-[52px]">
                  {pillar.bullets.map((b, bi) => (
                    <p key={bi} className="text-hg-slate text-sm leading-relaxed relative flex items-start gap-2">
                      <span className="text-hg-teal mt-1.5 w-1.5 h-1.5 rounded-full bg-hg-teal/40 shrink-0"></span>
                      {b}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 5: AUDIENCE (The Invitation) */}
      <div className="relative rounded-[2.5rem] p-[3px] bg-gradient-to-r from-hg-teal via-hg-navy to-hg-teal overflow-hidden">
        <div className="bg-white rounded-[2.3rem] p-10 md:p-14 text-center relative overflow-hidden">
          {/* Decorative */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-hg-teal/5 to-transparent"></div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <h4 className="font-bold text-hg-teal uppercase tracking-widest mb-8 text-sm">The Invitation</h4>
            <h3 className="text-3xl md:text-5xl font-black text-hg-navy mb-12">This is for you if...</h3>

            <div className="grid md:grid-cols-3 gap-6 text-left">
              {[
                "You want predictable owner growth, not luck.",
                "You want to step into CEO mode and build a real business asset.",
                "You want to be surrounded by operators who are ahead of you."
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-hg-ivory/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-hg-navy text-white flex items-center justify-center shrink-0 mb-6 shadow-xl shadow-hg-navy/10">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-hg-navy font-bold text-lg leading-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TabGrowth = ({ state, updateState, effectiveCostPerDoor = 65 }: { state: CalculatorState; updateState: (s: Partial<CalculatorState>) => void, effectiveCostPerDoor?: number }) => {
  const result = calculateGrowthUpside(state.newProperties, state.avgAnnualRevenue, state.commissionPercent, effectiveCostPerDoor);

  const isNetProfitFromTech = effectiveCostPerDoor < 0; // If negative cost, we are making money just by joining

  return (
    <div className="animate-fade-in space-y-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Left: Input */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-black text-hg-navy mb-4">Portfolio Growth</h2>
            <p className="text-hg-slate text-lg mb-8">See how adding new properties impacts your bottom line with HostGenius.</p>

            <div className="bg-hg-navy/5 rounded-3xl p-8 border border-hg-navy/10">
              <label className="block text-hg-navy font-bold text-lg mb-4">New Properties on HostGenius</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => updateState({ newProperties: Math.max(0, state.newProperties - 1) })}
                  className="w-12 h-12 rounded-xl bg-white border border-hg-navy/10 flex items-center justify-center text-hg-navy hover:bg-hg-coral hover:text-white transition-colors text-2xl font-bold pb-1 shadow-sm"
                >−</button>
                <div className="flex-1 bg-white border border-hg-navy/10 rounded-xl h-12 flex items-center justify-center font-black text-2xl text-hg-navy shadow-inner shadow-black/5">
                  {state.newProperties}
                </div>
                <button
                  onClick={() => updateState({ newProperties: state.newProperties + 1 })}
                  className="w-12 h-12 rounded-xl bg-white border border-hg-navy/10 flex items-center justify-center text-hg-navy hover:bg-hg-teal hover:text-white transition-colors text-2xl font-bold pb-1 shadow-sm"
                >+</button>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={state.newProperties}
                onChange={(e) => updateState({ newProperties: parseInt(e.target.value) })}
                className="w-full mt-6 h-2 bg-hg-navy/10 rounded-lg appearance-none cursor-pointer accent-hg-teal"
              />
              <div className="flex justify-between text-xs font-bold text-hg-slate mt-2 uppercase tracking-wide">
                <span>0</span>
                <span>50 Properties</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-hg-navy/10 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-hg-slate font-medium">Avg Annual Revenue</span>
              <span className="font-bold text-hg-navy">{formatCurrency(state.avgAnnualRevenue)}/unit</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-hg-slate font-medium">Commission Rate</span>
              <span className="font-bold text-hg-navy">{state.commissionPercent}%</span>
            </div>
          </div>
        </div>

        {/* Right: Results Card */}
        <div className="bg-hg-navy text-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full">
          <div className="absolute top-0 right-0 w-80 h-80 bg-hg-teal rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-hg-coral rounded-full blur-[80px] opacity-10 -ml-10 -mb-10"></div>

          <div className="relative z-10 space-y-8">
            <div>
              <h3 className="text-hg-teal font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-hg-teal rounded-full"></span>
                Growth Potential
              </h3>

              <div className="space-y-2">
                <div className="text-5xl md:text-6xl font-black text-white tracking-tight leading-none">
                  +{formatCurrency(result.monthlyRevenue)}
                </div>
                <div className="text-hg-ivory/60 font-medium text-lg">New Management Revenue / Month</div>
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-white/10">
              <div className="flex justify-between items-center text-lg">
                <span className="text-hg-ivory/80">{isNetProfitFromTech ? 'Revenue Captured by Savings' : 'Membership Fee'}</span>
                <span className={`font-bold ${isNetProfitFromTech ? 'text-green-400' : 'text-hg-coral'}`}>
                  {isNetProfitFromTech ? '+' : '-'}{formatCurrency(Math.abs(state.newProperties * effectiveCostPerDoor))}/mo
                </span>
              </div>

              <div className="flex justify-between items-end bg-white/10 p-4 rounded-xl border border-white/5">
                <div>
                  <div className="text-sm text-hg-ivory/80 font-medium mb-1">Total Monthly Net Profit</div>
                  <div className="text-3xl font-black text-white">{formatCurrency(result.monthlyNetProfit)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-hg-teal font-bold mb-1">Annual Value</div>
                  <div className="text-xl font-bold text-hg-teal">+{formatCurrency(result.annualNetProfit)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TabMembership = ({ updateState }: { updateState: (s: Partial<CalculatorState>) => void }) => {
  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-3xl font-black text-hg-navy mb-4">The Investment</h2>
        <p className="text-hg-slate text-lg">Simple, flat pricing designed for scale. No hidden revenue shares on your growth.</p>
      </div>

      <div className="bg-hg-navy text-white p-10 rounded-[2.5rem] relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-hg-teal rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>

        <h3 className="text-hg-teal font-bold text-xl uppercase tracking-widest mb-4">All-Inclusive Membership</h3>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-6xl sm:text-8xl font-black">$65</span>
          <div className="text-left leading-tight opacity-60">
            <div className="font-bold">per door</div>
            <div className="font-bold">per month</div>
          </div>
        </div>
        <p className="max-w-md mx-auto text-hg-ivory/60 text-lg mb-8">Includes the Mastermind, VP of Ops, VP of Revenue, and the entire tech stack discount network.</p>

        <div className="inline-block bg-white/10 backdrop-blur-md rounded-xl px-6 py-3 border border-white/10">
          <span className="font-bold text-white">Compare to: </span>
          <span className="text-hg-ivory/60 line-through mr-2">$120-$150</span>
          <span className="text-white">standard fragmented tech stack cost</span>
        </div>
      </div>
    </div>
  );
};

const TabTech = ({ state, updateState }: { state: CalculatorState; updateState: (s: Partial<CalculatorState>) => void }) => {
  const toggleTool = (targetId: string, isEnabled: boolean) => {
    let toolFound = false;
    const newTools = state.tools.map(t => {
      if (t.id === targetId) {
        toolFound = true;
        return { ...t, enabled: isEnabled, costPerDoor: isEnabled ? (t.costPerDoor || 0) : 0 };
      }
      return t;
    });

    if (!toolFound) {
      // If tool wasn't in state (e.g. from old saved state), add it now
      newTools.push({ id: targetId, enabled: isEnabled, costPerDoor: 0, quantity: 0 });
    }

    updateState({ tools: newTools });
  };

  const updateToolCost = (id: string, cost: number) => {
    const newTools = state.tools.map(t => t.id === id ? { ...t, costPerDoor: cost } : t);
    updateState({ tools: newTools });
  };



  const [newCustomToolName, setNewCustomToolName] = useState('');
  const [newCustomToolCost, setNewCustomToolCost] = useState('');
  const [newCustomToolReplacement, setNewCustomToolReplacement] = useState('');

  const addCustomTool = () => {
    if (!newCustomToolName || !newCustomToolCost) return;

    const newTool: CustomTool = {
      id: 'custom_' + Math.random().toString(36).substr(2, 9),
      name: newCustomToolName,
      costPerDoor: parseFloat(newCustomToolCost),
      replacedById: newCustomToolReplacement
    };

    updateState({ customTools: [...(state.customTools || []), newTool] });
    setNewCustomToolName('');
    setNewCustomToolCost('');
    setNewCustomToolReplacement('');
  };

  const removeCustomTool = (id: string) => {
    updateState({ customTools: (state.customTools || []).filter(t => t.id !== id) });
  };

  const BASE_HG_COST = 65;
  const activeTools = state.tools.filter(t => t.enabled);
  // Calculate savings per door (passing 1 listing to get the unit value)
  // Include custom tools
  const savingsResult = calculateToolSavings(1, state.tools, state.customTools);
  const totalSavings = savingsResult.monthly;
  const netImpact = totalSavings - BASE_HG_COST;

  const displayTotalSavings = totalSavings.toLocaleString('en-US', { maximumFractionDigits: 2 });

  // Format Net Impact 
  // If positive (Savings > Cost): Show "+$XX" in Green
  // If negative (Cost > Savings): Show "$XX" (No minus) in White
  const isProfit = netImpact > 0;
  // Note: We use Math.ceil or similar if we want nice numbers, but keeping precision for now. 
  // Actually usually we want 2 decimals or 0 depending on preference. sticking to 2.
  const displayNetImpactValue = (isProfit ? '+' : '') + '$' + Math.abs(netImpact).toLocaleString('en-US', { maximumFractionDigits: 2 });

  return (
    <div className="animate-fade-in space-y-12">
      {/* SECTION 1: TECH */}
      <div>
        <h2 className="text-3xl font-black text-hg-navy mb-4">Tech Consolidation</h2>
        <p className="text-hg-slate text-lg mb-8">Select the tools you currently pay for separately. Watch your effective cost drop.</p>

        {/* Effective Cost Card */}
        <div className="bg-hg-navy rounded-3xl p-6 md:p-8 overflow-hidden text-white shadow-xl mb-8 sticky top-0 z-30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-hg-teal rounded-full blur-3xl opacity-10 -mr-20 -mt-20"></div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 text-hg-teal shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-hg-ivory/60 mb-1">{isProfit ? 'HostGenius Net Impact' : 'HostGenius Net Cost'}</div>
                <div className="flex items-baseline gap-3">
                  <span className={`text-hg-coral/60 line-through text-2xl font-bold decoration-2 ${totalSavings > 0 ? 'inline-block' : 'hidden'}`}>${BASE_HG_COST}</span>
                  <span className={`text-5xl font-black ${isProfit ? 'text-hg-teal' : 'text-white'}`}>{displayNetImpactValue}</span>
                  <span className="text-lg text-hg-ivory/60 font-medium self-end mb-1">/door</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center w-full md:w-auto min-w-[160px]">
              <div className="text-[10px] font-bold uppercase tracking-widest text-hg-teal mb-1">Total Savings</div>
              <div className="text-3xl font-black text-hg-teal">${displayTotalSavings}<span className="text-sm font-medium text-hg-teal/60">/door</span></div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 mb-8">
          {TOOLS_LIST
            .filter(t => !t.linkedTo) // Only render root tools first
            .map(tool => {
              const userTool = state.tools.find(t => t.id === tool.id) || { id: tool.id, enabled: false, costPerDoor: 0 };

              // Find children
              const children = TOOLS_LIST.filter(sub => sub.linkedTo === tool.id);

              return (
                <div key={tool.id} className={`rounded-xl border transition-all overflow-hidden ${userTool.enabled ? 'bg-hg-navy/5 border-hg-navy/30' : 'bg-white border-hg-navy/5'}`}>
                  {/* MAIN TOOL ROW */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4">
                    <div className="flex items-center gap-4 flex-1 w-full">
                      <input
                        type="checkbox"
                        checked={userTool.enabled}
                        onChange={(e) => toggleTool(tool.id, e.target.checked)}
                        className="w-6 h-6 rounded border-gray-300 text-hg-navy focus:ring-hg-teal"
                      />
                      <div>
                        <div className="font-bold text-hg-navy">{tool.name}</div>
                        <div className="text-xs text-hg-slate">{tool.description}</div>
                      </div>
                    </div>

                    {userTool.enabled && (
                      <div className="w-full sm:w-48 animate-fade-in">
                        <NumberInput
                          label="Current Cost/Door"
                          value={userTool.costPerDoor}
                          onChange={(val) => updateToolCost(tool.id, val)}
                          prefix="$"
                        />
                      </div>
                    )}
                  </div>

                  {/* SUB TOOLS (Conditional) */}
                  {userTool.enabled && children.length > 0 && (
                    <div className="bg-hg-navy/5 border-t border-hg-navy/10 p-4 pl-8 sm:pl-16 space-y-4">
                      {children.map(child => {
                        const userChild = state.tools.find(t => t.id === child.id) || { id: child.id, enabled: false, costPerDoor: 0, quantity: 0 };

                        return (
                          <div key={child.id} className="animate-fade-in">
                            <div className="flex items-center gap-3 mb-3">
                              <input
                                type="checkbox"
                                checked={userChild.enabled}
                                onChange={(e) => toggleTool(child.id, e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-hg-teal focus:ring-hg-teal"
                              />
                              <span className="font-bold text-sm text-hg-navy">{child.name}</span>
                            </div>

                            {userChild.enabled && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-8">
                                <NumberInput
                                  label={child.isPercentage ? `Your Rate (%)` : `Your Cost / ${child.unitLabel || 'Unit'}`}
                                  value={userChild.costPerDoor} // Reusing costPerDoor field for "Cost" or "Rate"
                                  onChange={(val) => updateToolCost(child.id, val)}
                                  prefix={child.isPercentage ? undefined : "$"}
                                  suffix={child.isPercentage ? "%" : undefined}
                                />
                                <NumberInput
                                  label={child.quantityLabel || 'Quantity'}
                                  value={userChild.quantity || 0}
                                  onChange={(val) => {
                                    const newTools = state.tools.map(t => t.id === child.id ? { ...t, quantity: val } : t);
                                    updateState({ tools: newTools });
                                  }}
                                  prefix={child.subType === 'percentage_volume' ? '$' : undefined}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* CUSTOM TOOLS SECTION */}
        <div className="bg-white border-2 border-dashed border-hg-navy/10 rounded-xl p-6">
          <h3 className="font-bold text-hg-navy mb-4">Add Custom Tool/Service</h3>

          {/* Custom Tools List */}
          {(state.customTools || []).map(tool => (
            <div key={tool.id} className="flex flex-col sm:flex-row items-center gap-4 mb-4 bg-hg-gray/10 p-4 rounded-lg">
              <div className="flex-1 font-bold text-hg-navy">{tool.name}</div>
              <div className="font-medium text-hg-slate">${tool.costPerDoor}/door</div>
              <div className="text-sm text-hg-slate">
                Replaced by: <span className="font-bold text-hg-teal">{TOOLS_LIST.find(t => t.id === tool.replacedById)?.name || 'HostGenius'}</span>
              </div>
              <button onClick={() => removeCustomTool(tool.id)} className="text-red-400 hover:text-red-600 font-bold text-sm">Remove</button>
            </div>
          ))}

          {/* Add New */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-hg-slate uppercase mb-1">Tool Name</label>
              <input
                type="text"
                className="w-full p-3 bg-hg-gray/10 rounded-lg border border-transparent focus:bg-white focus:border-hg-teal outline-none transition-all"
                placeholder="e.g. NoiseAware"
                value={newCustomToolName}
                onChange={(e) => setNewCustomToolName(e.target.value)}
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-hg-slate uppercase mb-1">Cost / Door</label>
              <input
                type="number"
                className="w-full p-3 bg-hg-gray/10 rounded-lg border border-transparent focus:bg-white focus:border-hg-teal outline-none transition-all"
                placeholder="0.00"
                value={newCustomToolCost}
                onChange={(e) => setNewCustomToolCost(e.target.value)}
                min="0"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-hg-slate uppercase mb-1">Replaced By</label>
              <select
                className="w-full p-3 bg-hg-gray/10 rounded-lg border border-transparent focus:bg-white focus:border-hg-teal outline-none transition-all text-sm appearance-none"
                value={newCustomToolReplacement}
                onChange={(e) => setNewCustomToolReplacement(e.target.value)}
              >
                <option value="">Select HG Tool...</option>
                {TOOLS_LIST.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-1">
              <button
                onClick={addCustomTool}
                disabled={!newCustomToolName || !newCustomToolCost}
                className="w-full p-3 bg-hg-navy text-white font-bold rounded-lg disabled:opacity-50 hover:bg-hg-teal transition-colors"
              >
                Add Tool
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>



  );
};

const TabSummary = ({ state }: { state: CalculatorState }) => {
  const hgCost = calculateHGCost(state.listings);
  const toolSavings = calculateToolSavings(state.listings, state.tools, state.customTools);
  const growth = calculateGrowthUpside(state.newProperties, state.avgAnnualRevenue, state.commissionPercent);

  // Calculate total positive value (Growth only now)
  const totalValueMonthly = growth.monthlyNetProfit;

  // Effective HG Cost (after tech savings)
  const effectiveMonthlyCost = hgCost.monthly - toolSavings.monthly;

  // Net Impact: Growth Profit - Effective HG Cost
  const netMonthlyImpact = totalValueMonthly - effectiveMonthlyCost;
  const netAnnualImpact = netMonthlyImpact * 12;

  // Determining if it's a Net Cost or Net Gain
  const isNetGain = netMonthlyImpact >= 0;

  return (
    <div className="animate-fade-in space-y-10">
      <div>
        <h2 className="text-4xl font-black text-hg-navy mb-4">Your Partnership Blueprint</h2>
        <p className="text-hg-slate text-lg">A full breakdown of your current portfolio, costs, and the projected impact of joining HostGenius.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left Col: The Investment & Current State */}
        <div className="space-y-6">
          <div className="bg-white border border-hg-navy/10 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-hg-navy mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-hg-slate" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              Current Portfolio
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-hg-navy/5">
                <span className="text-hg-slate">Listings</span>
                <span className="font-bold text-hg-navy text-xl">{state.listings}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-hg-navy/5">
                <span className="text-hg-slate">Avg Annual Rev/Door</span>
                <span className="font-bold text-hg-navy">{formatCurrency(state.avgAnnualRevenue)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-hg-navy/5">
                <span className="text-hg-slate">Management Commission</span>
                <span className="font-bold text-hg-navy">{state.commissionPercent}%</span>
              </div>
            </div>
          </div>

          <div className="bg-hg-navy text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-hg-teal rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
            <h3 className="text-xl font-bold mb-6 text-hg-teal">HostGenius Investment</h3>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center">
                <span className="text-hg-ivory/80">Membership Fee</span>
                <span className="font-bold text-white uppercase tracking-wider text-xs">$65/door/mo</span>
              </div>
              <div className="flex justify-between items-center text-hg-teal">
                <span className="text-sm font-medium">Tech Savings Offset</span>
                <span className="font-bold text-xs uppercase tracking-wider">-${Math.round(toolSavings.monthly / state.listings)}/door/mo</span>
              </div>
              <div className="flex justify-between items-end border-t border-white/10 pt-4">
                <span className="font-bold text-lg">Effective Monthly Cost</span>
                <span className="font-black text-3xl text-white">{formatCurrency(effectiveMonthlyCost)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: The Returns & Net Impact */}
        <div className="space-y-6">
          <div className="bg-hg-teal/5 border border-hg-teal/20 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-hg-navy mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-hg-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              Projected Returns
            </h3>

            <div className="space-y-4">

              <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-hg-navy/5 shadow-sm">
                <div>
                  <div className="font-bold text-hg-navy">Growth Upside</div>
                  <div className="text-xs text-hg-slate">New net profit from {state.newProperties} units</div>
                </div>
                <span className="font-black text-hg-teal text-xl">+{formatCurrency(growth.monthlyNetProfit)}<span className="text-xs text-hg-slate font-normal">/mo</span></span>
              </div>

              <div className="flex justify-between items-center pt-2 px-2">
                <span className="font-bold text-hg-slate uppercase text-xs tracking-wider">Total Monthly Value</span>
                <span className="font-black text-2xl text-hg-teal">+{formatCurrency(totalValueMonthly)}</span>
              </div>
            </div>
          </div>

          {/* NET IMPACT CARD */}
          <div className={`rounded-3xl p-8 border-2 shadow-sm ${isNetGain ? 'bg-green-50 border-green-200' : 'bg-hg-gray/50 border-hg-navy/10'}`}>
            <h3 className="text-sm font-bold text-hg-slate uppercase tracking-widest mb-2">Net Financial Impact</h3>

            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className={`text-5xl font-black ${isNetGain ? 'text-green-600' : 'text-hg-navy'}`}>
                  {isNetGain ? '+' : ''}{formatCurrency(netMonthlyImpact)}
                </span>
                <span className="text-hg-slate font-bold">/ month</span>
              </div>
              <p className="text-sm text-hg-slate mt-2">
                {isNetGain
                  ? "The system pays for itself + generates profit."
                  : "Actual net cost after savings & growth."}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200/50 flex justify-between items-center">
              <span className="text-hg-slate font-medium">Annualized Impact</span>
              <span className={`font-black text-xl ${isNetGain ? 'text-green-700' : 'text-hg-navy'}`}>
                {isNetGain ? '+' : ''}{formatCurrency(netAnnualImpact)} / yr
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const App = () => {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);
  const [currentView, setCurrentView] = useState<ViewMode>('calculator');
  const [mounted, setMounted] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showShareToast, setShowShareToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // 1. Try URL first (Database ID priority via utils)
    const urlState = decompressStateFromUrl();
    if (urlState) {
      setState(prev => ({ ...prev, ...urlState }));
    } else {
      // 2. Fallback to LocalStorage
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const mergedState = { ...INITIAL_STATE, ...parsed, currentTab: 0 };
          if (!mergedState.opsTasks || mergedState.opsTasks.length === 0) {
            mergedState.opsTasks = INITIAL_STATE.opsTasks;
          }
          setState(mergedState);
        } catch (e) {
          console.error("Failed to parse saved state");
        }
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, mounted]);

  const updateState = (updates: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...updates }));
    setShareUrl(''); // Reset share URL when data changes
  };

  const handleShare = () => {
    setIsSaving(true);
    // Simulate API network delay
    setTimeout(() => {
      const scenarioId = saveScenarioToDb(state);
      const url = `${window.location.origin}${window.location.pathname}?id=${scenarioId}`;

      setShareUrl(url);
      navigator.clipboard.writeText(url);

      // Update URL without reloading
      window.history.replaceState(null, '', url);

      setIsSaving(false);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }, 600);
  };

  const handleAdminLoad = (loadedState: CalculatorState) => {
    setState(loadedState);
    setCurrentView('calculator');
  };

  const reset = () => {
    if (confirm("Are you sure you want to reset all data?")) {
      setState(INITIAL_STATE);
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  if (!mounted) return null;

  // Calculate Effective Cost for Global Use (Growth Tab needs it)
  // Re-using logic: Savings = calculateToolSavings(1 listing). Monthly total.
  const savingsResult = calculateToolSavings(1, state.tools, state.customTools);
  const effectiveCostPerDoor = Math.max(0, 65 - savingsResult.monthly);
  // Wait, user request: "Any savings beyond $65 results in additional revenue."
  // So effective cost CAN be negative.
  // Example: Savings $80. Cost 65. Effective = 65 - 80 = -15.
  const realEffectiveCostPerDoor = 65 - savingsResult.monthly;

  // Tabs Reordered: Snapshot -> What You Get -> Membership -> Tech Stack -> Growth -> Summary
  // Wait, request: "Move Growth to after TechStack"
  // Order: 
  // 0: Snapshot
  // 1: What You Get
  // 2: Membership (Previously 3)
  // 3: Tech Stack (Previously 4)
  // 4: Growth (Previously 2 - Moved Here)
  // 5: Summary
  const TABS = ['Snapshot', 'What You Get', 'HG Membership', 'Tech Stack', 'Growth', 'Summary'];

  return (
    <div className="min-h-screen bg-hg-ivory font-sans selection:bg-hg-coral selection:text-white flex relative overflow-hidden">
      {/* Toast Notification */}
      <div className={`fixed top-8 right-8 bg-hg-navy text-white px-6 py-3 rounded-full shadow-xl z-[60] transition-all duration-300 pointer-events-none flex items-center gap-2 ${showShareToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <svg className="w-5 h-5 text-hg-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        <span className="font-bold">Scenario saved & link copied!</span>
      </div>

      {/* Main Left Navigation */}
      <MainNavigation currentView={currentView} setView={setCurrentView} state={state} />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 relative flex flex-col h-screen overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230B354E' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>

        {/* Calculator Header (Only show in Calculator View) */}
        {currentView === 'calculator' && (
          <header className="bg-white/90 border-b border-hg-navy/5 sticky top-0 z-40 no-print backdrop-blur-xl shrink-0">
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Mobile Menu Button Placeholder (Visible only on mobile) */}
                <div className="lg:hidden">
                  {/* In a real app, this would toggle mobile menu */}
                  <svg className="w-6 h-6 text-hg-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </div>
                <h1 className="text-sm font-bold text-hg-slate tracking-widest uppercase hidden sm:block">Partnership Calculator</h1>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={handleShare} disabled={isSaving} className="text-xs font-bold uppercase tracking-wider text-hg-navy hover:text-hg-teal transition-colors px-4 py-2 bg-hg-gray/50 hover:bg-hg-navy/5 rounded-lg flex items-center gap-2">
                  {isSaving ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  )}
                  {isSaving ? 'Saving...' : 'Save Scenario'}
                </button>
                <button onClick={reset} className="text-xs font-bold uppercase tracking-wider text-hg-slate hover:text-hg-coral transition-colors px-4 py-2 hover:bg-hg-gray/50 rounded-lg">
                  Reset
                </button>
              </div>
            </div>
          </header>
        )}

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto z-10">

          {currentView === 'community' && <CommunityView />}
          {currentView === 'powerups' && <PowerupsView state={state} updateState={updateState} />}
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'admin' && <AdminView onLoad={handleAdminLoad} />}

          {currentView === 'calculator' && (
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="lg:flex gap-8">
                <div className="flex-1 w-full min-w-0">

                  {/* Tab Navigation */}
                  <div className="mb-8 overflow-x-auto no-print pb-2">
                    <nav className="flex p-1.5 bg-white border border-hg-navy/5 rounded-2xl shadow-sm min-w-max">
                      {TABS.map((tab, idx) => {
                        const isActive = state.currentTab === idx;
                        return (
                          <button
                            key={tab}
                            onClick={() => updateState({ currentTab: idx })}
                            className={`
                               relative flex-1 py-4 px-6 sm:px-8 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-3
                               ${isActive
                                ? 'bg-hg-navy text-white shadow-lg shadow-hg-navy/20 translate-y-0'
                                : 'text-hg-slate hover:bg-hg-gray/50 hover:text-hg-navy'
                              }
                             `}
                          >
                            <span className={`text-xs font-black uppercase tracking-wider py-1 px-2 rounded-md ${isActive ? 'bg-white/10 text-hg-teal' : 'bg-hg-navy/5 text-hg-slate/50'}`}>
                              Step 0{idx + 1}
                            </span>
                            {tab}
                          </button>
                        );
                      })}
                    </nav>
                  </div>

                  {/* Content Card container */}
                  <div className="bg-white rounded-[2rem] shadow-soft border border-hg-navy/5 min-h-[600px] flex flex-col">
                    {/* Decorative Gradient Bar */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-hg-navy via-hg-teal to-hg-coral rounded-t-[2rem]"></div>

                    <div className="flex-1 p-6 sm:p-10">
                      {state.currentTab === 0 && <TabSnapshot state={state} updateState={updateState} />}
                      {state.currentTab === 1 && <TabWhatYouGet state={state} updateState={updateState} />}
                      {state.currentTab === 2 && <TabMembership updateState={updateState} />}
                      {state.currentTab === 3 && <TabTech state={state} updateState={updateState} />}
                      {state.currentTab === 4 && <TabGrowth state={state} updateState={updateState} effectiveCostPerDoor={realEffectiveCostPerDoor} />}
                      {state.currentTab === 5 && <TabSummary state={state} />}
                    </div>

                    {/* Footer Navigation */}
                    <div className="bg-hg-ivory px-8 py-6 border-t border-hg-navy/5 flex justify-between items-center no-print">
                      <button
                        disabled={state.currentTab === 0}
                        onClick={() => updateState({ currentTab: Math.max(0, state.currentTab - 1) })}
                        className={`text-sm font-bold uppercase tracking-wider transition-colors ${state.currentTab === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-hg-slate hover:text-hg-navy'}`}
                      >
                        ← Back
                      </button>

                      {state.currentTab < 5 ? (
                        <button
                          onClick={() => updateState({ currentTab: Math.min(5, state.currentTab + 1) })}
                          className="group bg-hg-navy text-white pl-8 pr-6 py-4 rounded-2xl font-bold text-lg hover:bg-hg-teal transition-all shadow-xl shadow-hg-navy/10 hover:shadow-hg-teal/20 flex items-center gap-3 transform hover:-translate-y-0.5"
                        >
                          Next Step
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => window.print()}
                          className="bg-hg-coral text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-red-500 transition-all shadow-xl shadow-hg-coral/20 flex items-center gap-3 transform hover:-translate-y-0.5"
                        >
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download Report
                        </button>
                      )}
                    </div>
                  </div>

                </div>

                {/* Sidebar (Right) - Removed as per request */}
                {/* {state.currentTab >= 4 && <SummarySidebar state={state} />} */}
              </div>
            </div>
          )}

          {/* Mobile Footer for Navigation (If sidebar is hidden on mobile) - Simplified for this layout */}
          <div className="lg:hidden h-20"></div>
        </div>

        {/* Mobile Nav Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-hg-navy border-t border-white/10 z-50 flex justify-around p-2">
          <button onClick={() => setCurrentView('calculator')} className={`flex flex-col items-center p-2 rounded-lg ${currentView === 'calculator' ? 'text-hg-teal' : 'text-white/60'}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 4h6m-6 4h6M6 7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V7z" /></svg>
            <span className="text-[10px] font-bold mt-1">Calculator</span>
          </button>
          <button onClick={() => setCurrentView('community')} className={`flex flex-col items-center p-2 rounded-lg ${currentView === 'community' ? 'text-hg-teal' : 'text-white/60'}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span className="text-[10px] font-bold mt-1">Community</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;