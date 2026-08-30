<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PromptForge - Premium Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        display: ['Outfit', 'sans-serif'],
                    },
                    colors: {
                        brand: { 
                            50: '#eef2ff', 100: '#e0e7ff', 500: '#6366f1', 
                            600: '#4f46e5', 700: '#4338ca', 900: '#312e81' 
                        },
                        accent: { 400: '#fbbf24', 500: '#f59e0b' }
                    }
                }
            }
        }
    </script>
    <style>
        .view { display: none; animation: fadeIn 0.3s ease-in-out; }
        .view.active { display: block; }
        .step { display: none; }
        .step.active { display: block; animation: slideIn 0.3s ease-out; }
        .nav-link.active { color: #4f46e5; font-weight: 600; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes drawerIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes drawerOut { from { transform: translateX(0); } to { transform: translateX(100%); } }

        .ambient-glow {
            background: 
                radial-gradient(circle at top left, rgba(56, 189, 248, 0.12), transparent 45%),
                radial-gradient(circle at top right, rgba(99, 102, 241, 0.12), transparent 45%),
                radial-gradient(circle at bottom left, rgba(99, 102, 241, 0.12), transparent 45%),
                radial-gradient(circle at bottom right, rgba(56, 189, 248, 0.12), transparent 45%);
        }

        /* AI Coach Drawer */
        #coach-drawer {
            transform: translateX(100%);
            transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        #coach-drawer.open {
            transform: translateX(0);
        }
        #coach-overlay {
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }
        #coach-overlay.open {
            opacity: 1;
            pointer-events: auto;
        }

        /* Chat message animations */
        .chat-msg { animation: slideIn 0.25s ease-out; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans antialiased">

    <!-- Navigation -->
    <header class="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div class="flex items-center gap-2.5 cursor-pointer group" onclick="showView('landing')">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                </div>
                <span class="font-display font-bold text-xl tracking-tight text-slate-900">PromptForge</span>
            </div>
            <nav class="flex items-center gap-6 text-sm">
                <button onclick="showView('landing')" class="nav-link active hover:text-brand-600 transition">Home</button>
                <button onclick="showView('wizard')" class="nav-link hover:text-brand-600 transition">Wizard</button>
                <button onclick="showView('improve')" class="nav-link hover:text-brand-600 transition">Improve</button>
                <button onclick="showView('sandbox')" class="nav-link hover:text-brand-600 transition">Sandbox</button>
                <button onclick="showView('pricing')" class="nav-link hover:text-brand-600 transition">Pricing</button>
                <button class="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium shadow-sm">Sign in</button>
            </nav>
        </div>
    </header>

    <!-- AI Coach Overlay (click to close) -->
    <div id="coach-overlay" class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onclick="closeCoach()"></div>

    <!-- AI Coach Drawer (slides in from right) -->
    <aside id="coach-drawer" class="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col" data-testid="coach-drawer">
        <!-- Drawer Header -->
        <div class="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-brand-50 to-purple-50">
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center text-white">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                </div>
                <div>
                    <h3 class="font-display font-semibold text-slate-900">Prompt Coach</h3>
                    <p class="text-xs text-slate-500" id="coach-context">Ready to help</p>
                </div>
            </div>
            <button onclick="closeCoach()" class="w-8 h-8 rounded-lg hover:bg-white/80 flex items-center justify-center text-slate-400 hover:text-slate-600 transition" data-testid="btn-close-coach">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>

        <!-- Chat Messages Area -->
        <div id="coach-messages" class="flex-1 overflow-y-auto p-5 space-y-4">
            <!-- Initial greeting (changes based on context) -->
            <div class="chat-msg">
                <div class="flex gap-2.5">
                    <div class="w-7 h-7 rounded-full bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">AI</div>
                    <div class="bg-slate-50 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-700 max-w-[85%]" id="coach-greeting">
                        Hi! I'm your Prompt Coach. Ask me anything about building AI prompts, choosing the right AI, or what PromptForge can do for you.
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Suggestion Chips -->
        <div class="px-5 pb-3 flex flex-wrap gap-2" id="coach-chips">
            <button onclick="sendCoachQuestion('What is a prompt?')" class="text-xs px-3 py-1.5 rounded-full border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 transition">What is a prompt?</button>
            <button onclick="sendCoachQuestion('Which AI is best for coding?')" class="text-xs px-3 py-1.5 rounded-full border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 transition">Best AI for coding?</button>
            <button onclick="sendCoachQuestion('Can I use this for marketing?')" class="text-xs px-3 py-1.5 rounded-full border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 transition">Good for marketing?</button>
        </div>

        <!-- Chat Input -->
        <div class="p-4 border-t border-slate-100">
            <div class="flex gap-2">
                <input type="text" id="coach-input" class="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none" placeholder="Ask a question..." onkeypress="if(event.key==='Enter')sendCoachInput()">
                <button onclick="sendCoachInput()" class="w-10 h-10 bg-brand-600 rounded-xl hover:bg-brand-700 transition flex items-center justify-center text-white" data-testid="btn-coach-send">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                </button>
            </div>
        </div>
    </aside>

    <main class="flex-1">
        
        <!-- VIEW 1: LANDING PAGE -->
        <section id="view-landing" class="view active ambient-glow">
            <div class="max-w-4xl mx-auto px-4 pt-24 pb-16 text-center space-y-8">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold border border-brand-100">
                    <span class="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span> Now supporting Claude, Gemini & ChatGPT
                </div>
                <h1 class="text-5xl md:text-6xl font-display font-bold tracking-tight text-slate-900 leading-[1.1]">
                    Build AI prompts that <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">actually work</span>
                </h1>
                <p class="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Answer a few plain-language questions. Get three optimized prompts plus a clear explanation of why each one is effective.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <button onclick="showView('wizard')" class="px-8 py-3.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition font-medium shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5">Start building — free</button>
                    <button onclick="showView('improve')" class="px-8 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition font-medium">Improve existing prompt</button>
                </div>

                <!-- AI Coach Trigger on Landing Page (subtle, secondary) -->
                <p class="text-sm text-slate-500 mt-2">
                    No account required until you want to save work.
                </p>
                <button onclick="openCoach('landing')" class="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1.5 mx-auto mt-1 transition group" data-testid="btn-coach-landing">
                    <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                    Not sure where to start? Ask the Prompt Coach
                </button>
            </div>

            <div class="max-w-5xl mx-auto px-4 pb-24 grid md:grid-cols-3 gap-6">
                <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                    <div class="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                    </div>
                    <h2 class="font-display font-semibold text-lg mb-2">Guided, not overwhelming</h2>
                    <p class="text-sm text-slate-600">A short wizard asks only what is needed. You can go back anytime.</p>
                </div>
                <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                    <div class="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                    <h2 class="font-display font-semibold text-lg mb-2">Three options, not one guess</h2>
                    <p class="text-sm text-slate-600">Essential, Comprehensive, and Structured variants — optimized for your AI.</p>
                </div>
                <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                    <div class="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                    </div>
                    <h2 class="font-display font-semibold text-lg mb-2">Plain-language "why"</h2>
                    <p class="text-sm text-slate-600">Every prompt comes with a beginner explanation and technical breakdown.</p>
                </div>
            </div>
        </section>

        <!-- VIEW 2: WIZARD -->
        <section id="view-wizard" class="view">
            <div class="max-w-2xl mx-auto p-6 pt-12">
                <div class="flex justify-between items-center mb-2">
                    <h1 class="text-3xl font-display font-bold">Create a prompt</h1>
                    <!-- AI Coach Trigger in Wizard (subtle) -->
                    <button onclick="openCoach('wizard')" class="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1 transition group" data-testid="btn-coach-wizard">
                        <svg class="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                        Ask the Coach
                    </button>
                </div>
                <p class="text-slate-600 mb-8">Let's build your perfect prompt in 3 quick steps.</p>
                
                <div class="w-full bg-slate-200 rounded-full h-1.5 mb-10">
                    <div id="progress-bar" class="bg-gradient-to-r from-brand-600 to-purple-600 h-1.5 rounded-full transition-all duration-500" style="width: 33%"></div>
                </div>

                <!-- Step 1 -->
                <div id="step-1" class="step active bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-6">
                    <div class="flex items-center justify-between mb-2">
                        <h2 class="text-xl font-display font-semibold">What are you building?</h2>
                        <button onclick="openCoach('step1')" class="text-brand-500 hover:text-brand-700 transition" title="Need help? Ask the Coach" data-testid="sparkle-step1">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"></path></svg>
                        </button>
                    </div>
                    <p class="text-slate-500 mb-4 text-sm">Describe your project or task in plain language.</p>
                    <textarea class="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none h-32 text-sm" placeholder="e.g., A web app that helps freelancers track invoices..."></textarea>
                </div>

                <!-- Step 2 -->
                <div id="step-2" class="step bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-6">
                    <div class="flex items-center justify-between mb-2">
                        <h2 class="text-xl font-display font-semibold">Who is this for?</h2>
                        <button onclick="openCoach('step2')" class="text-brand-500 hover:text-brand-700 transition" title="Need help? Ask the Coach" data-testid="sparkle-step2">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"></path></svg>
                        </button>
                    </div>
                    <p class="text-slate-500 mb-4 text-sm">Define your target audience and primary goal.</p>
                    <div class="space-y-4">
                        <input type="text" class="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm" placeholder="Target audience (e.g., beginner developers)">
                        <input type="text" class="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm" placeholder="Primary goal (e.g., generate clean code)">
                    </div>
                </div>

                <!-- Step 3 -->
                <div id="step-3" class="step bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-6">
                    <div class="flex items-center justify-between mb-2">
                        <h2 class="text-xl font-display font-semibold">Tech & AI Preferences</h2>
                        <button onclick="openCoach('step3')" class="text-brand-500 hover:text-brand-700 transition" title="Need help? Ask the Coach" data-testid="sparkle-step3">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"></path></svg>
                        </button>
                    </div>
                    <p class="text-slate-500 mb-4 text-sm">Which AI should this prompt be optimized for?</p>
                    <div class="flex flex-wrap gap-2 mb-6">
                        <button class="px-4 py-2 rounded-full border-2 border-brand-600 bg-brand-50 text-brand-700 font-medium transition">ChatGPT</button>
                        <button class="px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition">Claude</button>
                        <button class="px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition">Gemini</button>
                    </div>
                    <input type="text" class="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm" placeholder="Tech stack (optional)">
                </div>

                <div class="flex justify-between pt-4">
                    <button id="btn-back" onclick="changeStep(-1)" class="px-5 py-2.5 text-slate-600 hover:text-slate-900 font-medium disabled:opacity-0 transition" disabled>Back</button>
                    <button id="btn-next" onclick="changeStep(1)" class="px-6 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition font-medium shadow-md shadow-brand-500/20">Next</button>
                </div>
            </div>
        </section>

        <!-- VIEW 3: RESULTS -->
        <section id="view-results" class="view">
            <div class="max-w-3xl mx-auto p-6 pt-12 space-y-6">
                <div class="flex flex-wrap justify-between items-center gap-3">
                    <div>
                        <h2 class="text-2xl font-display font-bold">Your Optimized Prompts</h2>
                        <p class="text-sm text-slate-500">Generated for ChatGPT</p>
                    </div>
                    <button onclick="showView('sandbox')" class="text-sm text-brand-600 hover:text-brand-700 font-medium underline underline-offset-4">Compare in Sandbox</button>
                </div>

                <div id="card-1" class="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition">
                    <div class="flex justify-between items-start mb-4 gap-3">
                        <div>
                            <span class="inline-block px-2.5 py-1 text-xs font-bold bg-brand-50 text-brand-700 rounded-lg mb-1 border border-brand-100">ESSENTIAL</span>
                            <p class="text-xs text-slate-500 font-medium uppercase tracking-wide">Optimized for: ChatGPT</p>
                        </div>
                        <div class="flex gap-2">
                            <button class="text-xs px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium">Edit</button>
                            <button class="text-xs px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium">Copy</button>
                        </div>
                    </div>
                    <pre id="prompt-text-1" class="bg-slate-50 p-4 rounded-xl text-sm whitespace-pre-wrap font-mono border border-slate-100 mb-4 text-slate-700">Act as a Senior React Developer. Write a clean, functional component for a freelance invoice dashboard. Use Tailwind CSS for styling and ensure mobile responsiveness.</pre>
                    
                    <button onclick="refinePrompt(1)" id="btn-refine-1" class="mb-4 text-xs px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium flex items-center gap-2">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        Refine this version
                    </button>

                    <div>
                        <button onclick="document.getElementById('breakdown-1').classList.toggle('hidden')" class="text-sm text-brand-600 hover:text-brand-700 font-medium 