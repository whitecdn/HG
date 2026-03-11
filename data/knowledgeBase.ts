export interface KnowledgeItem {
    id: string;
    headline: string;
    bullets: { label?: string; text: string }[];
    talkTrack: string;
}

export interface KnowledgeCategoryData {
    id: string;
    title: string;
    items: KnowledgeItem[];
}

export const KNOWLEDGE_BASE: Record<string, KnowledgeCategoryData> = {
    "Founder Architectures": {
        id: "founder-architectures",
        title: "Module 1: The Four Founder Architectures (The \"Who\")",
        items: [
            {
                id: "legacy-brokerage-manager",
                headline: "The Legacy Brokerage Manager (Realtor/Broker)",
                bullets: [
                    { label: "The Context", text: "Licensed realtors or brokers managing properties to keep a \"leash\" on clients for future buy/sell transactions. Often view management as a low-margin \"babysitting\" job." },
                    { label: "The Logic", text: "Charles flips the perspective from \"burden\" to \"funnel.\" By professionalizing the management side, they protect future commissions." },
                    { label: "The Multiplier Math", text: "In a 25-unit portfolio, statistically 2–3 owners will transact annually. In a $1M market, a 3% commission is $30k/deal. 3 deals ($90k) + management fees ($60k) = $150k/year revenue funnel." }
                ],
                talkTrack: "Most realtors we work with feel like management is just a babysitting job. Charles shows them how to turn a small 25-unit portfolio into a $150k/year high-margin funnel for their brokerage by capturing the transaction side. Want to see how we track those equity milestones?"
            },
            {
                id: "operator-bottleneck",
                headline: "The \"Operator-Bottleneck\" (Solo-Preneur)",
                bullets: [
                    { label: "The Context", text: "Managing 15–30 units solo. They are the \"Hero\" who handles guest support, cleaning coordination, and accounting. Typically \"Side-Hustlers\" or young founders." },
                    { label: "The Logic", text: "Every new unit signed makes their life worse. They have reached \"Maximum Chaos.\" The network provides the \"Leadership Layer\" to replace the founder in daily ops." },
                    { label: "The 30-Day Absence Test", text: "Charles asks: \"Can you leave for 30 days in high season without the business breaking?\" If no, they own a job, not a business." }
                ],
                talkTrack: "Are you at the point where signing a new homeowner actually makes you anxious because you're already drowning? Charles has a '30-Day Test' to see if you're building a business or just a 24/7 job. Most founders we talk to are actually scared to leave for a weekend. We help you move from 'backup delivery driver' to actual CEO."
            },
            {
                id: "high-volume-scaler",
                headline: "The High-Volume Market Scaler",
                bullets: [
                    { label: "The Context", text: "Managing 50–100+ units. Often former corporate employees (AvantStay, Vacasa). Growing fast (100%+ YoY), but systems are \"leaky\" and standards slipping." },
                    { label: "The Logic", text: "They are \"Scaling the Mess.\" At 50 units, the \"Boutique\" feel breaks. Without enterprise systems, they risk a brand collapse." },
                    { label: "The Ego Reset", text: "Charles frames their 100-unit goal as \"two months of my time.\" He resets the power dynamic by positioning the network's VP of Ops to install \"Scale-Proof\" infrastructure." }
                ],
                talkTrack: "You're growing at a massive clip, which is great, but we find that most boutique brands break at 50 units. Our VP of Ops scaled Zeus to 5,000 listings—he helps founders like you build the systems now so you can hit 100 units without losing your 4.9-star rating."
            },
            {
                id: "boutique-white-glove",
                headline: "The Boutique White-Glove Operator",
                bullets: [
                    { label: "The Context", text: "Niche operators in luxury markets (Muskoka, 30A). Have A-list clients and hate \"Automation\" because they think it feels \"cheap.\"" },
                    { label: "The Logic", text: "Physically exhausted by concierge work. Charles reframes tech as \"Reliability,\" not \"Robots.\"" },
                    { label: "The Experiential Arms Race", text: "Using AI (Conduit) to handle administrative slop (WiFi codes, check-ins) gives the founder 20+ hours a week to focus on hyper-luxury guest touches (e.g., Polaroid Camera Strategy)." }
                ],
                talkTrack: "You've built an incredible high-touch brand, but you're still the one driving toilet paper to properties when someone calls out sick. Charles shows white-glove operators how to use tech to handle the 'slop' so you can spend your time on the high-end guest experience. Want to see how we automate the boring stuff without losing the luxury feel?"
            }
        ]
    },
    "Tactical Battle Cards": {
        id: "tactical-battle-cards",
        title: "Module 2: The \"Net-Zero\" Technical Battle Cards",
        items: [
            {
                id: "tech-stack-margin-capture",
                headline: "The Tech Stack Margin Capture",
                bullets: [
                    { label: "The Math", text: "Retail vs. Network Rates." },
                    { label: "Guesty/Hostaway", text: "We pay ~$12 vs Retail ~$35. (Savings: ~$23/listing)." },
                    { label: "PriceLabs", text: "We pay ~$5 vs Retail ~$10. (Savings: ~$5/listing)." },
                    { label: "Breezeway", text: "We pay $3.49 vs Retail ~$12. (Savings: ~$8.51/listing)." },
                    { label: "Enso Connect", text: "We pay $5 vs Retail ~$12. (Savings: ~$7/listing)." },
                    { label: "ConduitAI", text: "We pay $6 vs Retail ~$12. (Savings: ~$6/listing)." },
                    { label: "SuiteOp", text: "We pay $8 vs Retail ~$15. (Savings: ~$7/listing)." },
                    { label: "Total Savings", text: "Can exceed ~$50+ per listing, per month. For a 30-unit manager, this is $1,500+/mo in savings." }
                ],
                talkTrack: "We aren't tech resellers, but because we have 1,700 units in the network, we get Guesty and PriceLabs for about 70% less than you do. We usually find enough savings in your current software bill to pay for the entire network. It’s essentially a net-zero cost for you."
            },
            {
                id: "damage-waiver-profit-center",
                headline: "The Damage Waiver Profit Center",
                bullets: [
                    { label: "The Logic", text: "Stop using security deposits (guest friction) or basic insurance (pure cost). Build a \"found money\" revenue stream." },
                    { label: "The Math", text: "Charge every guest a mandatory $40 \"Peace of Mind\" fee. Pay the Network Rate to the provider (GuestyShield/Truvi) of $15. Keep the $25 margin." },
                    { label: "The Impact", text: "25 units x 30 bookings/year x $25 margin = $18,750 in pure profit." }
                ],
                talkTrack: "Are you still chasing guests for security deposits? Charles has a 'Damage Waiver' hack that generates about $18,000 a year in pure 'found money' for our members. It more than pays for the network membership on its own."
            },
            {
                id: "guesty-pay-vs-stripe",
                headline: "Guesty Pay vs. Stripe",
                bullets: [
                    { label: "The Logic", text: "Processors eat margins. Large networks command better rates." },
                    { label: "The Math", text: "Retail Stripe is 2.9% + $0.30. Guesty Pay (Network Rate) is 2.6%." },
                    { label: "The Impact", text: "On $2M in annual volume, that 0.3% delta is $6,000/year in bottom-line profit." }
                ],
                talkTrack: "Are you still paying 2.9% on Stripe? Because we're a high-volume group, we get Guesty Pay for 2.6%. For a business your size, that 0.3% difference is about $6,000 a year in free cash. Would you rather that money stay in your pocket or go to Stripe?"
            }
        ]
    },
    "Market Goldmines & Growth": {
        id: "market-goldmines-growth",
        title: "Module 3: Tactical Growth \"Goldmines\"",
        items: [
            {
                id: "vacasa-escape-play",
                headline: "The Vacasa/Evolve \"Escape\" Play",
                bullets: [
                    { label: "The Context", text: "Corporate giants like Vacasa are in a \"Death Spiral\" (~30% owner churn). Owners feel like an account number." },
                    { label: "The Play", text: "Charles provides the skip-traced list of Vacasa owners in the prospect's backyard. Pitch \"Local Stewardship\" vs. \"Corporate Neglect.\"" }
                ],
                talkTrack: "There are 183 Vacasa owners in your zip code right now looking for a local 'Boutique' manager because they feel ignored. We have that list and the script to get them on your calendar. Want to see how many are in your area?"
            },
            {
                id: "immigrant-entrepreneur",
                headline: "The \"Immigrant Entrepreneur\" Cleaning Model",
                bullets: [
                    { label: "The Problem", text: "Reliability. 12 out of 15 hourly staff interviews no-show." },
                    { label: "The Move", text: "Stop hiring employees. Source a boutique cleaning company owner. Give them exclusive rights + a $2,500/mo retainer to act as your GM." },
                    { label: "The Deal", text: "They get a stable $100k business; you get a partner who handles all the drama because they own the profit." }
                ],
                talkTrack: "Are you still babysitting cleaners who ghost you? Charles uses a 'Partner-Owner' model where the cleaning company owner acts as your GM. They handle the drama because they own the profit. It's how he scaled to 160 units while living in Argentina. Want the hiring framework?"
            },
            {
                id: "review-extortion-honeypot",
                headline: "The Review Extortion \"Honeypot\"",
                bullets: [
                    { label: "The Problem", text: "Guest blackmail for refunds." },
                    { label: "The Script", text: "Bait the guest into saying the threat in the Airbnb app: \"Just to be clear, if I give you this $500 refund, you will not leave a negative review?\"" },
                    { label: "The Win", text: "Once they say \"Yes,\" it is a violation of Airbnb's \"Extortion Policy.\" The review is now 100% removable." }
                ],
                talkTrack: "How do you handle guests who hold your 5-star rating hostage for a refund? Charles has a specific 'Honeypot Script' that gets those reviews deleted by Airbnb every single time. Want the script?"
            }
        ]
    },
    "Hyper-Local Battle Cards": {
        id: "hyper-local-battle-cards",
        title: "Module 4: Hyper-Local Regulatory Playbooks",
        items: [
            {
                id: "muskoka-playbook",
                headline: "Muskoka (Ontario): The \"Boathouse\" Battle",
                bullets: [
                    { label: "The Context", text: "Local townships classify boathouses as secondary dwellings to ban rentals." },
                    { label: "The Tactic", text: "Use \"Private Collection\" marketing to repeat guests to bypass public OTA scrutiny." }
                ],
                talkTrack: "We help Muskoka operators navigate rigorous township regulations by moving bookings off public OTAs and into private, direct collections."
            },
            {
                id: "philadelphia-playbook",
                headline: "Philadelphia: Zoning/Crime Resilience",
                bullets: [
                    { label: "The Context", text: "Regulations are strict (~$8k licensing fees)." },
                    { label: "The Tactic", text: "Pivot to \"Mid-Term Rentals\" (30+ days) to bypass STR licensing and zoning inspections." }
                ],
                talkTrack: "For urban mainland markets like Philadelphia, we install the playbook to transition high-risk STRs into stable, license-free Mid-Term corporate housing."
            },
            {
                id: "myrtle-beach-playbook",
                headline: "Myrtle Beach: Extreme Seasonality",
                bullets: [
                    { label: "The Context", text: "ADRs drop to 1/10th in winter." },
                    { label: "The Tactic", text: "Use the \"Revenue Management Audit\" to show owners that high occupancy in winter is a failure, not a win." }
                ],
                talkTrack: "If you're booking up in the winter at $80/night, you're ruining the asset. We show your owners why extreme seasonality requires protective pricing."
            },
            {
                id: "portland-playbook",
                headline: "Portland/Mt. Hood: Corporate Churn",
                bullets: [
                    { label: "The Context", text: "Vacasa and Meredith Lodging dominate but are failing." },
                    { label: "The Tactic", text: "Target these 183+ units for immediate \"Boutique\" conversion." }
                ],
                talkTrack: "There are currently over 183 Vacasa owners feeling neglected in your backyard. We provide the extraction script to convert them."
            }
        ]
    },
    "Objection Handling & Tactics": {
        id: "objection-handling-tactics",
        title: "Module 5: Objection Handling (The Charles Philosophy)",
        items: [
            {
                id: "too-small",
                headline: "Objection: \"I'm too small for this (7-10 units).\"",
                bullets: [
                    { label: "The Counter", text: "\"Small-to-big-fast is our specialty. You're currently turning down $250k in revenue because you're scared of a $650/mo membership. That is the most expensive fear in your life.\"" }
                ],
                talkTrack: "\"Small-to-big-fast is our specialty. You're currently turning down $250k in revenue because you're scared of a $650/mo membership. That is the most expensive fear in your life.\""
            },
            {
                id: "cold-calling-failed",
                headline: "Objection: \"I've tried cold calling and it failed.\"",
                bullets: [
                    { label: "The Counter", text: "\"You were calling the wrong list. Don't call LTR owners; that's a furniture pitch. Call the 'Corporate Churn' (Evolve/Vacasa). They are already in the game and losing money today. That's a 15-minute close.\"" }
                ],
                talkTrack: "\"You were calling the wrong list. Don't call LTR owners; that's a furniture pitch. Call the 'Corporate Churn' (Evolve/Vacasa). They are already in the game and losing money today. That's a 15-minute close.\""
            },
            {
                id: "scared-to-switch",
                headline: "Objection: \"I'm scared to switch my PMS/Tech stack.\"",
                bullets: [
                    { label: "The Counter", text: "\"Don't swap. We aren't tech resellers. Keep your current account; we just put our card down on the backend to give you our 90% discount. No migration needed.\"" }
                ],
                talkTrack: "\"Don't swap. We aren't tech resellers. Keep your current account; we just put our card down on the backend to give you our 90% discount. No migration needed.\""
            },
            {
                id: "not-the-owner",
                headline: "Objection: \"I'm not the owner (I'm the Firewall).\"",
                bullets: [
                    { label: "The Counter", text: "\"I usually only talk to owners, but if you're the one in the weeds of software and ops, you're the one who needs this more. If I can show you how to save the owner $1k/mo and buy back 20 hours of your own time, will you put me on the calendar with them?\"" }
                ],
                talkTrack: "\"I usually only talk to owners, but if you're the one in the weeds of software and ops, you're the one who needs this more. If I can show you how to save the owner $1k/mo and buy back 20 hours of your own time, will you put me on the calendar with them?\""
            }
        ]
    },
    "Community Members": {
        id: "community-members",
        title: "Community Members: Market Partners",
        items: [
            {
                id: "margin-squeezed-scaler",
                headline: "The Margin-Squeezed Scaler",
                bullets: [
                    { label: "The Concept", text: "High-volume operators (50+ units) actively acquiring market share on thin 10-15% margins (e.g., Rise Co-Host, Apek Rentals)." },
                    { label: "The Charles Technique", text: "Pitch fractionalized payroll and scalability. \"You scale top-line revenue; we absorb the operational drag.\"" },
                    { label: "The \"War Room\" Data", text: "Linear payroll growth eats their margins. White-labeled 24/7 support decouples employee count from portfolio size." }
                ],
                talkTrack: "You're adding doors fast, but your margins are shrinking because every 15 units means hiring another employee. We aren't tech resellers; we are your external CEO office. We install fractionalized, white-labeled support so you can scale top-line revenue without absorbing the operational drag."
            },
            {
                id: "owner-obsessed-boutique",
                headline: "The Owner-Obsessed Boutique",
                bullets: [
                    { label: "The Concept", text: "Low-volume, ultra-luxury operators prioritizing high-net-worth investor relationships (e.g., Allura Homes, Harmonized Getaways)." },
                    { label: "The Charles Technique", text: "Take a consultative asset-manager approach. Pitch deploying branded owner dashboards to ensure transparency." },
                    { label: "The \"War Room\" Data", text: "They lack enterprise IT budgets but must project institutional sophistication to prevent affluent client churn." }
                ],
                talkTrack: "You've built your reputation on white-glove service, but high-net-worth owners expect institutional-level transparency that boutiques often can't afford to build. We aren't tech resellers; we are your external CEO office. We deploy branded, enterprise-grade owner dashboards so you project sophistication and prevent affluent client churn."
            },
            {
                id: "hybrid-arbitrager",
                headline: "The Hybrid Arbitrager",
                bullets: [
                    { label: "The Concept", text: "Operators hedging volatility by combining mid-term corporate housing with short-term (e.g., Turnkey Partners, House of Living)." },
                    { label: "The Charles Technique", text: "Pivot to B2B capabilities, background checks, and automated middleware to resolve their disjointed software friction." },
                    { label: "The \"War Room\" Data", text: "Running short-term (AirBnb) + long-term (AppFolio) side-by-side causes intense multi-platform accounting breakdowns." }
                ],
                talkTrack: "Running short-term and long-term models side-by-side usually means a nightmare of dual-entry and broken multi-platform accounting. We aren't tech resellers; we are your external CEO office. We pivot your stack into automated B2B middleware that completely resolves that disjointed software friction."
            },
            {
                id: "legacy-brokerage",
                headline: "The Legacy Brokerage",
                bullets: [
                    { label: "The Concept", text: "Family-owned heritage firms relying on localized trust and traditional real estate (e.g., SeaMaine VR, Valley Peak)." },
                    { label: "The Charles Technique", text: "Position our technology as an existential defense mechanism against out-of-state, tech-native competitors." },
                    { label: "The \"War Room\" Data", text: "They struggle with severe technological latency and fear complex software migrations for older on-the-ground staff." }
                ],
                talkTrack: "Your firm has built decades of trust, but those out-of-state, tech-native competitors are trying to buy their way into your market. We aren't tech resellers; we are your external CEO office. We install our tech stack as a defense mechanism—without forcing your legacy staff into a painful software migration."
            },
            {
                id: "experiential-arms-race",
                headline: "The Experiential Arms Race",
                bullets: [
                    { label: "The Concept", text: "Firms shifting from basic lodging to hyper-niche lifestyle brands and massive venues (e.g., StayPropr, Lodgewell)." },
                    { label: "The Charles Technique", text: "Highlight the astronomical logistical burden of complex amenities like digital plunge pools and 250+ guest event spaces." },
                    { label: "The \"War Room\" Data", text: "A guest can no longer just be handed a key; troubleshooting luxury features requires custom-trained, 24/7 technical support." }
                ],
                talkTrack: "Hosting massive venues or managing complex amenities like digital plunge pools isn't just handing over a key—it's a massive logistical burden. We aren't tech resellers; we are your external CEO office. We provide custom-trained, 24/7 technical support for high-end features so your team isn't drowning in troubleshooting calls."
            }
        ]
    }
};
