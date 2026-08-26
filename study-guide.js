// Study Guide Panel for The Divine Quest
// Self-injected educational extension

class StudyGuide {
    constructor() {
        this.panel = null;
        this.button = null;
        this.pollInterval = null;
        this.lastChapter = -1;
        this.isOpen = false;

        this.content = {
            0: {
                title: "The Crossroads of Grace",
                questions: [
                    "What does it mean to stand at a 'crossroads of grace' in your own spiritual journey?",
                    "How do the three portals (Faith, Scripture, Service) represent different yet complementary aspects of the Christian life?",
                    "Why might God allow multiple valid paths that all lead to deeper relationship with Him?"
                ],
                commentary: "The opening of the game places the player at a crossroads—a biblical motif rich with meaning. Joshua's 'choose ye this day' (Joshua 24:15) echoes here. Grace is not merely a moment of decision but an ongoing posture. The three paths reflect the biblical call to trust in Christ's work (faith), know Him through His Word (scripture), and love others (service). None is superior; together they form a holistic walk. Reformed theology reminds us that even our ability to choose is itself a gift of prevenient grace, inviting humility rather than boasting.",
                scripture: { reference: "Ephesians 2:8-10", text: "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast. For we are his workmanship, created in Christ Jesus for good works, which God prepared beforehand, that we should walk in them." }
            },
            1: {
                title: "The Garden of Prayer",
                questions: [
                    "How does corporate prayer differ from private prayer, and why does the game present both as valuable?",
                    "What might the 'sacred garden' symbolize about the environment needed for deep communion with God?",
                    "How can studying Scripture and prayer work together in a believer's spiritual formation?"
                ],
                commentary: "Gardens in Scripture are places of encounter—from Eden to Gethsemane. The garden here represents a cultivated space where God's presence is tangible. Prayer is both a gift and a discipline: a gift because the Spirit intercedes for us (Romans 8:26), and a discipline because Jesus 'often withdrew to lonely places and prayed' (Luke 5:16). The wise pastor embodies the communion of saints, reminding us that we grow best in community. Sound doctrine (studying Scripture) fuels prayer, preventing it from becoming mere sentiment.",
                scripture: { reference: "Philippians 4:6-7", text: "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus." }
            },
            2: {
                title: "The Library of God's Word",
                questions: [
                    "Why is the Old Testament still essential for Christian formation, even after the coming of Christ?",
                    "How do the Reformation writings help modern believers avoid theological error?",
                    "What does it mean that Scripture 'glows with the light of divine inspiration'?"
                ],
                commentary: "The library is a metaphor for the canon—the 'deposit of faith' handed down through generations. The Reformers recovered the principle of sola Scriptura, not as a rejection of tradition, but as a return to the supreme authority of God's revealed Word. The Old Testament points forward (types, prophecies), the New Testament looks back (fulfillment in Christ), and the Reformers remind us that the Spirit continues to illumine the text for every generation. Studying all three is like having a complete map: the terrain of promise, the terrain of fulfillment, and the terrain of faithful interpretation.",
                scripture: { reference: "2 Timothy 3:14-17", text: "But as for you, continue in what you have learned and have firmly believed, knowing from whom you learned it and how from childhood you have been acquainted with the sacred writings, which are able to make you wise for salvation through faith in Christ Jesus. All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness." }
            },
            3: {
                title: "The Mission Field",
                questions: [
                    "How does preaching the Gospel differ from demonstrating Christ's love through service? Are both necessary?",
                    "What does it mean that a village can possess 'the capacity for faith in God's grace' even in spiritual darkness?",
                    "How should sound doctrine shape the way believers engage in missions and charity?"
                ],
                commentary: "The mission field bridges personal piety and public witness. James 2:17 warns that faith without works is dead, while Romans 10:14 insists that faith comes by hearing the Word. The game's three paths—preaching, teaching, serving—mirror the holistic nature of Christ's own ministry: He proclaimed the Kingdom, taught the crowds, and fed the hungry. The 'capacity for faith' reminds us of common grace: even in darkness, people bear God's image and can respond to the light. Sound doctrine guards against empty activism and shallow proclamation alike, ensuring that love and truth are never separated.",
                scripture: { reference: "Matthew 28:18-20", text: "And Jesus came and said to them, 'All authority in heaven and on earth has been given to me. Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all that I have commanded you. And behold, I am with you always, to the end of the age.'" }
            },
            4: {
                title: "The Glory of God",
                questions: [
                    "What is the difference between 'seeking' God's presence and 'knowing' Him personally in Christ?",
                    "How do all previous choices in the game culminate in this moment of worship?",
                    "What does Reformed theology mean when it says the chief end of man is to glorify God and enjoy Him forever?"
                ],
                commentary: "The summit of the mountain is the traditional locus of divine revelation—Moses on Sinai, the Transfiguration. Here, knowing God is not an intellectual achievement but a relational reality: 'it is someone you know in Christ Jesus.' The Westminster Shorter Catechism captures this: man's chief end is to glorify God and enjoy Him forever. The previous chapters were preparation; worship is the destination. Yet even worship is grace-enabled. As Augustine prayed, 'You have made us for yourself, and our heart is restless until it rests in you.' The game's stat boost of 25 across the board reflects the completeness of this consummation.",
                scripture: { reference: " Revelation 21:3-4", text: "And I heard a loud voice from the throne saying, 'Behold, the dwelling place of God is with man. He will dwell with them, and they will be his people, and God himself will be with them as their God. He will wipe away every tear from their eyes, and death shall be no more, neither shall there be mourning, nor crying, nor pain anymore, for the former things have passed away.'" }
            },
            5: {
                title: "The Refiner's Fire",
                questions: [
                    "How does suffering refine faith rather than destroy it?",
                    "What biblical examples show God using trials to deepen trust and character?",
                    "How can a believer distinguish between God's loving discipline and random suffering?"
                ],
                commentary: "Trials are the refiner's fire, burning away dross to reveal gold. Peter writes that suffering tests the genuineness of faith (1 Peter 1:7). The game's imagery of fire echoes Malachi's purification and the refining work of the Holy Spirit. Importantly, Reformed theology rejects the idea that suffering is always punishment for sin. Rather, it is a means of sanctification—God in His sovereignty brings good from evil (Genesis 50:20). The Refiner's Fire chapter teaches that endurance is not passive resignation but active trust in a sovereign, loving God.",
                scripture: { reference: "1 Peter 1:6-7", text: "In this you rejoice, though now for a little while, if necessary, you have been grieved by various trials, so that the tested genuineness of your faith—more precious than gold that perishes though it is tested by fire—may be found to result in praise and glory and honor at the revelation of Jesus Christ." }
            },
            6: {
                title: "The Community of Believers",
                questions: [
                    "Why is the Church called the 'body of Christ' and how does that shape our relationships?",
                    "How do spiritual gifts contribute to the health and mission of the church?",
                    "What does biblical fellowship look like when it is genuinely centered on Christ?"
                ],
                commentary: "The Church is not an optional accessory to faith; it is the very Bride of Christ, the new covenant community. Paul's body metaphor (1 Corinthians 12) underscores diversity and interdependence: each member has a role, and all are necessary. The game's emphasis on compassion reflects the communal ethic of the early church in Acts 2:44-47. Fellowship is not mere socializing but a shared participation in the divine life, nourished by Word and sacrament. A Christianity that thrives in isolation is, paradoxically, a weakened Christianity—because God designed us for mutual edification.",
                scripture: { reference: "Acts 2:42-47", text: "And they devoted themselves to the apostles' teaching and the fellowship, to the breaking of bread and the prayers. And awe came upon every soul, and many wonders and signs were being done through the apostles. And all who believed were together and had all things in common. And they were selling their possessions and belongings and distributing the proceeds to all, as any had need. And day by day, as they spent much time together in the temple, and breaking bread in their homes, they received their food with glad and generous hearts, praising God and having favor with all the people." }
            },
            7: {
                title: "The New Creation",
                questions: [
                    "How does the hope of the new creation affect how Christians live in the present age?",
                    "What does it mean that 'the former things have passed away'?",
                    "How can we live now as citizens of heaven while remaining engaged in earthly life?"
                ],
                commentary: "The game concludes where Scripture concludes: not with destruction, but with renewal. The new creation is not a replacement of earth but its redemption—a new heaven and a new earth where righteousness dwells (2 Peter 3:13). This eschatological hope does not encourage escapism; instead, it energizes faithful presence in the world. As Augustine noted, we are pilgrims on the way to our true homeland. The 'keys' in the game's earlier chapters find their fulfillment in the new Jerusalem, where the King Himself shepherds His people. Every act of love, every deed of mercy, echoes forward into the age to come.",
                scripture: { reference: "Revelation 21:5-6", text: "And he who was seated on the throne said, 'Behold, I am making all things new.' Also he said, 'Write this down, for these words are trustworthy and true.' And he said to me, 'It is done! I am the Alpha and the Omega, the beginning and the end. To the thirsty I will give from the spring of the water of life without payment.'" }
            }
        };

        this.bindMethods();
        this.init();
    }

    bindMethods() {
        this.openPanel = this.openPanel.bind(this);
        this.closePanel = this.closePanel.bind(this);
        this.handleChapterChanged = this.handleChapterChanged.bind(this);
        this.startPolling = this.startPolling.bind(this);
        this.stopPolling = this.stopPolling.bind(this);
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onReady());
        } else {
            this.onReady();
        }
    }

    onReady() {
        this.injectButton();
        this.setupEventListeners();
    }

    injectButton() {
        if (!document.body) return;

        this.button = document.createElement('button');
        this.button.id = 'study-guide-btn';
        this.button.innerHTML = '📖 Study';
        this.button.setAttribute('aria-label', 'Open Study Guide');
        this.button.setAttribute('type', 'button');

        // Base styles + Tailwind classes
        this.button.className = 'fixed bottom-6 left-6 z-40 bg-indigo-700 hover:bg-indigo-600 text-white font-bold py-3 px-5 rounded-full shadow-lg transition-colors duration-200 text-lg';

        this.button.addEventListener('click', () => {
            if (this.isOpen) {
                this.closePanel();
            } else {
                this.openPanel();
            }
        });

        document.body.appendChild(this.button);
    }

    setupEventListeners() {
        // Listen for game's custom chapterChanged event if it exists
        document.addEventListener('chapterChanged', this.handleChapterChanged);
    }

    getCurrentChapter() {
        if (typeof window !== 'undefined' && window.game && typeof window.game.currentChapter === 'number') {
            return window.game.currentChapter;
        }
        return 0;
    }

    handleChapterChanged(event) {
        if (this.isOpen && event && typeof event.detail === 'number') {
            this.renderContent(event.detail);
        }
    }

    startPolling() {
        this.stopPolling();
        this.pollInterval = setInterval(() => {
            const chapter = this.getCurrentChapter();
            if (chapter !== this.lastChapter) {
                this.lastChapter = chapter;
                this.renderContent(chapter);
            }
        }, 2000);
    }

    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    }

    createPanel() {
        if (this.panel) return this.panel;

        const overlay = document.createElement('div');
        overlay.id = 'study-guide-overlay';
        overlay.className = 'fixed inset-0 z-50 hidden';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Study Guide Panel');

        const panel = document.createElement('div');
        panel.id = 'study-guide-panel';
        panel.className = 'absolute bottom-24 left-6 w-96 max-h-[80vh] bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col';

        // Header
        const header = document.createElement('div');
        header.className = 'flex items-center justify-between px-5 py-4 bg-slate-800 border-b border-slate-700';
        header.innerHTML = `
            <h2 class="text-lg font-bold text-indigo-300 flex items-center gap-2">
                <span>📖</span> Study Guide
            </h2>
            <button id="study-guide-close" class="text-slate-400 hover:text-white transition-colors p-1 rounded" aria-label="Close Study Guide">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        `;

        // Content area
        const content = document.createElement('div');
        content.id = 'study-guide-content';
        content.className = 'p-5 overflow-y-auto text-sm leading-relaxed space-y-5';

        // Scrollbar styling
        content.style.scrollbarWidth = 'thin';
        content.style.scrollbarColor = '#475569 #1e293b';

        panel.appendChild(header);
        panel.appendChild(content);
        overlay.appendChild(panel);

        // Close handlers
        const closeBtn = header.querySelector('#study-guide-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', this.closePanel);
        }

        // Close on overlay click (outside panel)
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closePanel();
            }
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closePanel();
            }
        });

        this.panel = overlay;
        return this.panel;
    }

    openPanel() {
        if (this.isOpen) return;

        this.isOpen = true;
        this.panel = this.createPanel();
        document.body.appendChild(this.panel);

        // Reset chapter tracking and render
        this.lastChapter = this.getCurrentChapter();
        this.renderContent(this.lastChapter);

        // Show overlay
        requestAnimationFrame(() => {
            this.panel.classList.remove('hidden');
        });

        // Start polling for chapter changes while open
        this.startPolling();
    }

    closePanel() {
        if (!this.isOpen || !this.panel) return;

        this.isOpen = false;
        this.panel.classList.add('hidden');
        this.stopPolling();

        // Remove overlay from DOM after transition
        setTimeout(() => {
            if (this.panel && this.panel.parentNode) {
                this.panel.parentNode.removeChild(this.panel);
            }
            this.panel = null;
        }, 200);
    }

    renderContent(chapterIndex) {
        if (!this.panel) return;

        const contentArea = this.panel.querySelector('#study-guide-content');
        if (!contentArea) return;

        const data = this.content[chapterIndex];
        if (!data) {
            contentArea.innerHTML = `
                <p class="text-slate-400 italic">Study guide content for this chapter is not yet available.</p>
            `;
            return;
        }

        const questionsHtml = data.questions.map((q, i) => `
            <li class="flex gap-3">
                <span class="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-900/50 text-indigo-300 text-xs flex items-center justify-center font-bold mt-0.5">${i + 1}</span>
                <span class="text-slate-200">${this.escapeHtml(q)}</span>
            </li>
        `).join('');

        contentArea.innerHTML = `
            <section class="space-y-4">
                <header>
                    <h3 class="text-xl font-bold text-indigo-200 mb-1">${this.escapeHtml(data.title)}</h3>
                    <div class="h-1 w-16 bg-indigo-600 rounded-full"></div>
                </header>

                <section>
                    <h4 class="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Discussion Questions</h4>
                    <ul class="space-y-3 list-none p-0 m-0">${questionsHtml}</ul>
                </section>

                <section class="bg-slate-800/50 rounded-lg p-4 border border-slate-700/60">
                    <h4 class="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Theological Commentary</h4>
                    <p class="text-slate-300 italic">${this.escapeHtml(data.commentary)}</p>
                </section>

                <section class="bg-indigo-950/40 rounded-lg p-4 border border-indigo-800/50">
                    <h4 class="text-xs uppercase tracking-wider text-indigo-400 font-semibold mb-2">Key Scripture</h4>
                    <blockquote class="text-indigo-100 not-italic border-l-2 border-indigo-500 pl-3">
                        <p class="text-sm leading-relaxed mb-2">"${this.escapeHtml(data.scripture.text)}"</p>
                        <footer class="text-xs text-indigo-300 font-semibold">— ${this.escapeHtml(data.scripture.reference)}</footer>
                    </blockquote>
                </section>
            </section>
        `;
    }

    escapeHtml(str) {
        if (typeof str !== 'string') return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    destroy() {
        this.closePanel();
        this.stopPolling();
        document.removeEventListener('chapterChanged', this.handleChapterChanged);
        if (this.button && this.button.parentNode) {
            this.button.parentNode.removeChild(this.button);
        }
        this.button = null;
        this.panel = null;
    }
}

// Auto-initialize on DOMContentLoaded
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.studyGuide = new StudyGuide();
        });
    } else {
        window.studyGuide = new StudyGuide();
    }
}
