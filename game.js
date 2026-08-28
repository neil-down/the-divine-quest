// The Divine Quest - Core Game Engine
class DivineQuest {
    constructor() {
        this.playerStats = {
            faith: 50,
            wisdom: 50,
            compassion: 50
        };
        
        this.currentChapter = 0;
        this.currentScene = 0;
        this.gameState = 'playing';
        this.choices = [];
        this.earnedAchievements = new Set();
        
        this.routeMap = {
            "0-0-0": 1,
            "0-0-1": 2,
            "0-0-2": 3,
            "1-0-0": 2,
            "1-0-1": 3,
            "1-0-2": 8,
            "2-0-0": 13,
            "2-0-1": 4,
            "2-0-2": 4,
            "3-0-0": 14,
            "3-0-1": 4,
            "3-0-2": 4,
            "4-0-0": 5,
            "4-0-1": 5,
            "4-0-2": 15,
            "5-0-0": 6,
            "5-0-1": 11,
            "5-0-2": 6,
            "6-0-0": 7,
            "6-0-1": 9,
            "6-0-2": 7,
            "7-0-0": 10,
            "7-0-1": 0,
            "7-0-2": 0,
            "8-0-0": 5,
            "8-0-1": 4,
            "8-0-2": 12,
            "9-0-0": 4,
            "9-0-1": 5,
            "9-0-2": 7,
            "10-0-0": 0,
            "10-0-1": 1,
            "10-0-2": 11,
            "11-0-0": 0,
            "11-0-1": 2,
            "11-0-2": 3,
            "12-0-0": 1,
            "12-0-1": 4,
            "12-0-2": 6,
            "13-0-0": 14,
            "13-0-1": 15,
            "13-0-2": 13,
            "14-0-0": 15,
            "14-0-1": 13,
            "14-0-2": 13,
            "15-0-0": 11,
            "15-0-1": 12,
            "15-0-2": 13
        };
        
        this.wisdomQuotes = [
            "The fear of the LORD is the beginning of wisdom, and knowledge of the Holy One is understanding. (Proverbs 9:10)",
            "Trust in the LORD with all your heart and lean not on your own understanding. (Proverbs 3:5)",
            "Your word is a lamp for my feet, a light on my path. (Psalm 119:105)",
            "Faith is the assurance of things hoped for, the conviction of things not seen. (Hebrews 11:1)",
            "Love your neighbor as yourself. (Matthew 22:39)",
            "Be still, and know that I am God. (Psalm 46:10)",
            "The prayer of a righteous person is powerful and effective. (James 5:16)",
            "Do not be conformed to this world, but be transformed by the renewal of your mind. (Romans 12:2)",
            "For God gave us a spirit not of fear but of power and love and self-control. (2 Timothy 1:7)",
            "Christ died for our sins according to the Scriptures, was buried, and was raised on the third day. (1 Corinthians 15:3-4)",
            "Jesus answered, 'Everyone who drinks this water will be thirsty again, but whoever drinks the water I give them will never thirst. Indeed, the water I give them will become in them a spring of water welling up to eternal life.' (John 4:13-14)"
        ];
        
        this.scriptures = [
            {
                text: "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God.",
                reference: "Ephesians 2:8"
            },
            {
                text: "All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness.",
                reference: "2 Timothy 3:16"
            },
            {
                text: "Jesus Christ is the same yesterday and today and forever.",
                reference: "Hebrews 13:8"
            },
            {
                text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
                reference: "John 3:16"
            },
            {
                text: "I am the way, and the truth, and the life. No one comes to the Father except through me.",
                reference: "John 14:6"
            },
            {
                text: "For all have sinned and fall short of the glory of God.",
                reference: "Romans 3:23"
            },
            {
                text: "But God shows his love for us in that while we were still sinners, Christ died for us.",
                reference: "Romans 5:8"
            },
            {
                text: "If we confess our sins, he is faithful and just to forgive us our sins and to cleanse us from all unrighteousness.",
                reference: "1 John 1:9"
            },
            {
                text: "For the wages of sin is death, but the free gift of God is eternal life in Christ Jesus our Lord.",
                reference: "Romans 6:23"
            },
            {
                text: "Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.",
                reference: "2 Corinthians 5:17"
            }
        ];
        
        this.storyChapters = [
            {
                title: "The Crossroads of Grace",
                scenes: [
                    {
                        text: "You stand at the crossroads of God's grace, where His divine providence guides your path. The Holy Scriptures speak of a journey of faith—not of works, but of understanding God's sovereign grace. Before you lies a path that will test not just your beliefs, but your understanding of Christ's redemptive work. Suddenly, the ground trembles as three divine portals materialize before you, each radiating different colors of sacred light.",
                        choices: [
                            {
                                text: "The Path of Faith",
                                description: "Step through the golden portal of trusting in Christ's finished work on the cross.",
                                effects: { faith: 15, wisdom: 5, compassion: 10 },
                                nextChapter: 1,
                                special: "portal_gold"
                            },
                            {
                                text: "The Path of Scripture", 
                                description: "Enter the blue portal of studying God's Word and sound doctrine.",
                                effects: { faith: 5, wisdom: 15, compassion: 5 },
                                nextChapter: 2,
                                special: "portal_blue"
                            },
                            {
                                text: "The Path of Service",
                                description: "Walk through the green portal of serving others in Christ's love.",
                                effects: { faith: 10, wisdom: 5, compassion: 15 },
                                nextChapter: 3,
                                special: "portal_green"
                            }
                        ]
                    }
                ]
            },
            {
                title: "The Garden of Prayer",
                scenes: [
                    {
                        text: "You find yourself in a sacred garden where every leaf whispers God's truth. The air is thick with the presence of the Holy Spirit. A wise pastor sits beneath an ancient tree, their eyes holding the depth of years spent studying God's Word and shepherding His flock.",
                        choices: [
                            {
                                text: "Join in corporate prayer",
                                description: "Gather with the pastor in prayer, seeking God's will through intercession.",
                                effects: { faith: 10, wisdom: 10, compassion: 5 },
                                nextChapter: 2
                            },
                            {
                                text: "Study the Scriptures together",
                                description: "Open the Bible with the pastor to understand sound doctrine and God's revelation.",
                                effects: { faith: 5, wisdom: 15, compassion: 0 },
                                nextChapter: 3
                            },
                            {
                                text: "Practice biblical fellowship",
                                description: "Serve alongside the pastor in ministering to others through Christ's love.",
                                effects: { faith: 5, wisdom: 5, compassion: 15 },
                                nextChapter: 4
                            }
                        ]
                    }
                ]
            },
            {
                title: "The Library of God's Word",
                scenes: [
                    {
                        text: "Before you stands the sacred library, containing the complete canon of Scripture and the writings of the Reformers. The books glow with the light of divine inspiration, and you can hear the collective wisdom of God's people throughout the ages. A guardian appears, holding a key that can unlock any biblical truth you seek.",
                        choices: [
                            {
                                text: "Study the Old Testament",
                                description: "Delve into the Law and Prophets that point forward to Christ's coming.",
                                effects: { faith: 15, wisdom: 10, compassion: 0 },
                                nextChapter: 4
                            },
                            {
                                text: "Read the New Testament",
                                description: "Explore the Gospels and Epistles that reveal Christ's redemptive work.",
                                effects: { faith: 0, wisdom: 20, compassion: 5 },
                                nextChapter: 4
                            },
                            {
                                text: "Examine the Reformation writings",
                                description: "Learn from Luther, Calvin, and other Reformers who recovered biblical truth.",
                                effects: { faith: 10, wisdom: 5, compassion: 10 },
                                nextChapter: 4
                            }
                        ]
                    }
                ]
            },
            {
                title: "The Mission Field",
                scenes: [
                    {
                        text: "You arrive at a village where the need for the Gospel is great, yet so is the hope found in Christ. The people here face spiritual darkness, but they also possess the capacity for faith in God's grace. Their prayers rise like incense to the throne of grace.",
                        choices: [
                            {
                                text: "Preach the Gospel",
                                description: "Share the good news of Jesus Christ and His salvation.",
                                effects: { faith: 20, wisdom: 5, compassion: 5 },
                                nextChapter: 4
                            },
                            {
                                text: "Teach sound doctrine",
                                description: "Instruct the people in biblical truth and Reformed theology.",
                                effects: { faith: 5, wisdom: 10, compassion: 10 },
                                nextChapter: 4
                            },
                            {
                                text: "Demonstrate Christ's love",
                                description: "Serve the community through practical acts of Christian charity.",
                                effects: { faith: 5, wisdom: 5, compassion: 20 },
                                nextChapter: 4
                            }
                        ]
                    }
                ]
            },
            {
                title: "The Glory of God",
                scenes: [
                    {
                        text: "You have climbed the mountain of understanding and now stand at its summit. Here, the boundaries between earth and heaven dissolve in the light of God's glory. The divine presence is not something you seek anymore—it is someone you know in Christ Jesus. All your previous choices have led to this moment of worship and adoration.",
                        choices: [
                            {
                                text: "Worship in spirit and truth",
                                description: "Surrender completely to God, worshiping Him as revealed in Scripture.",
                                effects: { faith: 25, wisdom: 25, compassion: 25 },
                                nextChapter: 5
                            },
                            {
                                text: "Serve as Christ's ambassador",
                                description: "Return to the world as an ambassador for Christ, sharing the Gospel.",
                                effects: { faith: 15, wisdom: 15, compassion: 35 },
                                nextChapter: 5
                            },
                            {
                                text: "Glorify God in all things",
                                description: "Live your life to bring glory to God in every thought, word, and deed.",
                                effects: { faith: 20, wisdom: 20, compassion: 20 },
                                nextChapter: 5
                            }
                        ]
                    }
                ]
            },
            {
                title: "The Christian Life",
                scenes: [
                    {
                        text: "Your journey has transformed you through God's grace. You understand now that theology is not about having all the answers, but about living faithfully according to God's Word. Knowing Christ is not a destination to be reached, but a relationship to be nurtured daily. As you reflect on your path, you realize that every choice, every struggle, and every moment of doubt was part of God's sovereign plan to draw you closer to Himself.",
                        scripture: true,
                        choices: [
                            {
                                text: "Continue in grace",
                                description: "With renewed faith, continue walking in God's grace each day.",
                                effects: { faith: 10, wisdom: 10, compassion: 10 },
                                nextChapter: 0
                            },
                            {
                                text: "Share the Gospel",
                                description: "Tell others about Christ's love and the salvation found in Him.",
                                effects: { faith: 5, wisdom: 15, compassion: 10 },
                                nextChapter: 0
                            },
                            {
                                text: "Live for God's glory",
                                description: "Devote your life to bringing glory to God in all things.",
                                effects: { faith: 15, wisdom: 10, compassion: 5 },
                                nextChapter: 0
                            }
                        ]
                    }
                ]
            },
            {
                title: "The Well of Living Water",
                scenes: [
                    {
                        text: "You come to a well outside a bustling town, the same well where Jesus once sat weary from His journey. A woman arrives to draw water, and in the quiet of the moment you sense the invitation: to drink of the water that quenches all thirst. The sun hangs low, and the air hums with the promise of living water—the grace that flows from Christ to all who would receive it.",
                        choices: [
                            {
                                text: "Drink deeply of the living water",
                                description: "Receive the grace of Christ that satisfies the soul forever.",
                                effects: { faith: 10, wisdom: 5, compassion: 5 },
                                nextChapter: 0
                            },
                            {
                                text: "Listen to the stranger's teaching",
                                description: "Sit in humility and learn from the wisdom being shared.",
                                effects: { faith: 5, wisdom: 10, compassion: 5 },
                                nextChapter: 0
                            },
                            {
                                text: "Share your water with someone nearby",
                                description: "Demonstrate Christ's love through practical generosity.",
                                effects: { faith: 5, wisdom: 5, compassion: 10 },
                                nextChapter: 0
                            }
                        ]
                    }
                ]
            },
            {
                title: "The Upper Room",
                scenes: [
                    {
                        text: "You enter the upper room where the early disciples gathered after Christ's ascension. The atmosphere is thick with prayer and expectation. Suddenly, a sound like a rushing wind fills the place, and the Spirit descends upon everyone present. Tongues of flame rest on each head, and the community is transformed—afraid no longer, but bold in love. The body of Christ comes alive in a new way.",
                        choices: [
                            {
                                text: "Pray and wait for the Spirit",
                                description: "Join in persistent prayer, surrendering to the Spirit's timing.",
                                effects: { faith: 10, wisdom: 5, compassion: 10 },
                                nextChapter: 10
                            },
                            {
                                text: "Teach the gathered crowd",
                                description: "Boldly proclaim the truth of Christ to all who are listening.",
                                effects: { faith: 5, wisdom: 10, compassion: 5 },
                                nextChapter: 0
                            },
                            {
                                text: "Break bread in fellowship",
                                description: "Share a meal in unity, remembering Christ's sacrifice together.",
                                effects: { faith: 5, wisdom: 5, compassion: 10 },
                                nextChapter: 0
                            }
                        ]
                    }
                ]
            },
            {
                title: "The Valley of Doubt",
                scenes: [
                    {
                        text: "The path leads you into a shadowed valley where every step feels heavy with uncertainty. The air is cool and still, and for a moment it seems as though God has hidden His face. Yet even here, the Reformers taught, grace abounds. A narrow stream runs through the valley floor, and faint light breaks through the clouds above. You realize that doubt is not the opposite of faith—it is the terrain where faith learns to walk by trust, not by sight.",
                        choices: [
                            {
                                text: "Cry out to God in honesty",
                                description: "Pour out your doubt before the Lord, trusting that He hears even the faintest whisper.",
                                effects: { faith: 15, wisdom: 10, compassion: 5 },
                                nextChapter: 4
                            },
                            {
                                text: "Search for answers in Scripture",
                                description: "Open the Word to find the promises that hold firm when feelings fade.",
                                effects: { faith: 5, wisdom: 20, compassion: 0 },
                                nextChapter: 2
                            },
                            {
                                text: "Wait in silence before the Lord",
                                description: "Sit quietly and let God renew your strength as you rest in His presence.",
                                effects: { faith: 10, wisdom: 5, compassion: 10 },
                                nextChapter: 5
                            }
                        ]
                    }
                ]
            },
            {
                title: "The Warfare of Prayer",
                scenes: [
                    {
                        text: "A spiritual battle unfolds around you, visible now only to the eyes of faith. The enemy schemes, but the Lord Jesus has already won the victory. You are called not to retreat, but to stand in the authority of Christ and pray with perseverance. The air thrums with sacred energy, and the saints of old stand beside you, interceding without ceasing.",
                        choices: [
                            {
                                text: "Put on the full armor of God",
                                description: "Clothe yourself in truth, righteousness, faith, and the Word of God.",
                                effects: { faith: 20, wisdom: 5, compassion: 5 },
                                nextChapter: 4
                            },
                            {
                                text: "Intercede for others in prayer",
                                description: "Lift up the needs of the world, standing in the gap through persistent prayer.",
                                effects: { faith: 10, wisdom: 10, compassion: 20 },
                                nextChapter: 6
                            },
                            {
                                text: "Stand firm in the authority of Christ",
                                description: "Exercise the authority of Jesus' name over every scheme of darkness.",
                                effects: { faith: 15, wisdom: 15, compassion: 10 },
                                nextChapter: 7
                            }
                        ]
                    }
                ]
            },
            {
                title: "The Hope of Glory",
                scenes: [
                    {
                        text: "The veil between earth and heaven grows thin, and you glimpse the glory that awaits all who are in Christ. The scene exceeds every earthly joy, yet it is not a distant fantasy—it is the promised inheritance sealed by the blood of Jesus. Every trial of this present age is being woven into a crown of glory that will never fade. Your heart leaps with a hope that does not disappoint because the love of God has been poured out through the Holy Spirit.",
                        choices: [
                            {
                                text: "Worship the risen Christ",
                                description: "Fall before the Lord in adoration, for He is worthy of all praise.",
                                effects: { faith: 15, wisdom: 10, compassion: 15 },
                                nextChapter: 5
                            },
                            {
                                text: "Share the hope of glory with others",
                                description: "Tell the world about the living hope found in Christ's resurrection.",
                                effects: { faith: 10, wisdom: 5, compassion: 20 },
                                nextChapter: 3
                            },
                            {
                                text: "Live in light of eternity",
                                description: "Return to your journey with renewed purpose, keeping your eyes on the prize.",
                                effects: { faith: 10, wisdom: 15, compassion: 5 },
                                nextChapter: 0
                            }
                        ]
                    }
                ]
            },
            {
                title: "The Communion of Saints",
                scenes: [
                    {
                        text: "In the communion of saints you find you are not alone on the pilgrim way. The cloud of witnesses — patriarchs, prophets, apostles, and martyrs — surrounds you, cheering you onward. Yet the Roman church had blurred this fellowship with the idolatry of Mariolatry and saint-veneration, exalting creatures above the Creator. You recall the Reformed conviction that Christ alone is the mediator, and that we honor the saints by imitating their faith, not by praying to them. The unity of the body of Christ transcends time and tongue, bound by one Spirit and one hope.",
                        choices: [
                            {
                                text: "Honor the saints by imitating their faith",
                                description: "Their lives point beyond themselves to Christ, the alone mediator.",
                                effects: { faith: 15, wisdom: 15, compassion: 5 },
                                nextChapter: 0
                            },
                            {
                                text: "Rejoice in the unity of the body of Christ",
                                description: "Many members, one Spirit, one hope — the church catholic and reformed.",
                                effects: { faith: 10, wisdom: 10, compassion: 20 },
                                nextChapter: 2
                            },
                            {
                                text: "Press on toward the prize in Christ",
                                description: "Forgetting what lies behind, straining forward to what lies ahead.",
                                effects: { faith: 12, wisdom: 12, compassion: 8 },
                                nextChapter: 3
                            }
                        ]
                    }
                ]
            },
            {
                title: "The New Heavens and New Earth",
                scenes: [
                    {
                        text: "The vision swells to its culmination: behold, the dwelling place of God is with man, and He will dwell with them. The new heavens and the new earth, where righteousness dwells, replace the old that passed away with its groaning. The Reformed hope is not escape from creation but its renewal — the creation liberated from bondage to corruption into the freedom of the glory of the children of God. You see that the quest was never mere moral striving but union with Christ, from whom all grace flows and to whom all glory returns. With joy you surrender the journey into His hands, knowing the Author and Finisher of faith completes what He began.",
                        choices: [
                            {
                                text: "Rest in the finished work of Christ",
                                description: "It is by grace you have been saved, through faith — not of yourselves.",
                                effects: { faith: 20, wisdom: 10, compassion: 10 },
                                nextChapter: 1
                            },
                            {
                                text: "Feed His sheep in the renewed world",
                                description: "Love one another as He has loved you, bearing the image of the city to come.",
                                effects: { faith: 10, wisdom: 10, compassion: 25 },
                                nextChapter: 4
                            },
                            {
                                text: "Begin the quest anew in gratitude",
                                description: "The old has passed away; behold, all things are made new.",
                                effects: { faith: 15, wisdom: 15, compassion: 15 },
                                nextChapter: 6
                            }
                        ]
                    }
                ]
            },
            {
                title: "The Reformation",
                scenes: [
                    {
                        text: "The cry of the Reformation echoes through the centuries: Sola Fide, Sola Scriptura, Solus Christus, Sola Gratia, Soli Deo Gloria. You stand in Wittenberg as the truth of God's Word is recovered from centuries of human tradition. The five solae shine like beacons — justification by faith alone, Scripture alone as the final authority, Christ alone as the mediator, grace alone as the means of salvation, and glory to God alone as the ultimate end. The air crackles with the power of the Gospel restored, and you realize that the Reformers did not invent new doctrine but unearthed the ancient faith buried beneath layers of ecclesiastical corruption.",
                        choices: [
                            {
                                text: "Stand upon Sola Scriptura",
                                description: "Receive the Word of God alone as your supreme authority, rejecting all human traditions that contradict Scripture.",
                                effects: { faith: 15, wisdom: 20, compassion: 5 },
                                nextChapter: 14
                            },
                            {
                                text: "Embrace Sola Fide",
                                description: "Rest in the blessed truth that you are justified by faith alone in Christ alone, not by any work of your own.",
                                effects: { faith: 25, wisdom: 5, compassion: 10 },
                                nextChapter: 15
                            },
                            {
                                text: "Live for Soli Deo Gloria",
                                description: "Dedicate every thought, word, and deed to the glory of God alone, the ultimate end of all things.",
                                effects: { faith: 10, wisdom: 10, compassion: 20 },
                                nextChapter: 0
                            }
                        ]
                    }
                ]
            },
            {
                title: "The Church Fathers",
                scenes: [
                    {
                        text: "The ancient witnesses surround you: Athanasius, who championed the full deity of Christ against Arianism; Augustine, who confessed the grace of God in his own heart and formulated the doctrines of original sin and irresistible grace; Irenaeus, who defended the faith once for all delivered to the saints against Gnostic heresy; and the Council of Chalcedon, which declared Christ to be one person in two natures, without confusion, without change, without division, without separation. Their writings are not equal to Scripture, yet they shine as faithful lamps that illuminate the biblical text. You see that the Reformed faith is not a novelty but the ancient catholic faith recovered and purified.",
                        choices: [
                            {
                                text: "Defend the deity of Christ with Athanasius",
                                description: "Stand firm for the full divinity of the Son against every reduction of His glory.",
                                effects: { faith: 20, wisdom: 10, compassion: 5 },
                                nextChapter: 13
                            },
                            {
                                text: "Confess grace with Augustine",
                                description: "Admit your dependence on God's sovereign grace, as Augustine did in his Confessions.",
                                effects: { faith: 15, wisdom: 15, compassion: 10 },
                                nextChapter: 15
                            },
                            {
                                text: "Contend for the faith once delivered",
                                description: "Follow Irenaeus in guarding the apostolic teaching against every false philosophy.",
                                effects: { faith: 10, wisdom: 20, compassion: 5 },
                                nextChapter: 11
                            }
                        ]
                    }
                ]
            },
            {
                title: "Perseverance & Glory",
                scenes: [
                    {
                        text: "The final chapter of the pilgrimage unfolds: the saints persevere not by their own grip but by the power of God who keeps them. The New Heavens and New Earth descend as the final dwelling place of God with man, where every tear is wiped away and death is no more. The consummation of all things arrives — not as an escape from creation but as its redemption, when the whole groaning world is liberated into the freedom of the glory of the children of God. You understand now that the Reformed hope is not pie in the sky but the renewal of all things in Christ, who is the Alpha and the Omega, the Beginning and the End.",
                        choices: [
                            {
                                text: "Persevere in the power of the Spirit",
                                description: "Trust that He who began a good work in you will carry it on to completion until the day of Christ Jesus.",
                                effects: { faith: 25, wisdom: 5, compassion: 10 },
                                nextChapter: 12
                            },
                            {
                                text: "Anticipate the New Heavens & New Earth",
                                description: "Set your hope fully on the grace to be revealed when the heavens are renewed and all things are made new.",
                                effects: { faith: 10, wisdom: 20, compassion: 10 },
                                nextChapter: 0
                            },
                            {
                                text: "Surrender to the consummation",
                                description: "Yield the final chapter of your story into the hands of the Author and Finisher of faith.",
                                effects: { faith: 10, wisdom: 10, compassion: 25 },
                                nextChapter: 5
                            }
                        ]
                    }
                ]
            }
        ];
        
        this.init();
    }
    
    init() {
        this.updateStats();
        this.updateWisdomQuote();
        this.goToChapter(0, 0);
        this.startWisdomRotation();
    }
    
    updateStats() {
        // Update stat displays
        document.getElementById('faith').textContent = this.playerStats.faith;
        document.getElementById('wisdom').textContent = this.playerStats.wisdom;
        document.getElementById('compassion').textContent = this.playerStats.compassion;
        
        document.getElementById('faith-text').textContent = `${this.playerStats.faith}/100`;
        document.getElementById('wisdom-text').textContent = `${this.playerStats.wisdom}/100`;
        document.getElementById('compassion-text').textContent = `${this.playerStats.compassion}/100`;
        
        // Update progress bars
        document.querySelector('.faith-bar').style.width = `${this.playerStats.faith}%`;
        document.querySelector('.wisdom-bar').style.width = `${this.playerStats.wisdom}%`;
        document.querySelector('.compassion-bar').style.width = `${this.playerStats.compassion}%`;
        
        // Check for achievements
        this.checkAchievements();
        document.dispatchEvent(new CustomEvent('statsChanged'));
    }
    
    updateWisdomQuote() {
        const randomQuote = this.wisdomQuotes[Math.floor(Math.random() * this.wisdomQuotes.length)];
        document.getElementById('wisdom-quote').textContent = `"${randomQuote}"`;
    }
    
    startWisdomRotation() {
        setInterval(() => {
            this.updateWisdomQuote();
        }, 10000);
    }
    
    goToChapter(index, scene = 0) {
        if (index >= this.storyChapters.length) {
            index = 0;
        }

        this.currentChapter = index;
        this.currentScene = scene;

        this.loadChapter(index, scene);

        document.dispatchEvent(new CustomEvent('chapterChanged', {
            detail: { chapter: index, scene: scene }
        }));
    }

    loadChapter(chapterIndex, sceneIndex = 0) {
        if (chapterIndex >= this.storyChapters.length) {
            chapterIndex = 0;
        }
        
        this.currentChapter = chapterIndex;
        this.currentScene = sceneIndex;
        
        const chapter = this.storyChapters[chapterIndex];
        const scene = chapter.scenes[sceneIndex];
        
        // Update story
        document.querySelector('#story-container h2').textContent = window.I18N ? window.I18N.t(chapter.title) : chapter.title;
        document.getElementById('story-text').innerHTML = `<p class="mb-4">${window.I18N ? window.I18N.t(scene.text) : scene.text}</p>`;
        
        // Update choices
        const choicesContainer = document.getElementById('choices-container');
        choicesContainer.innerHTML = '';
        
        scene.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-button w-full text-left p-4 rounded-lg border border-yellow-500 border-opacity-30 hover:border-opacity-60';
            button.onclick = () => this.makeChoice(index);
            
            const icon = this.getChoiceIcon(choice.text);
            
            const choiceText = window.I18N ? window.I18N.t(choice.text) : choice.text;
            const choiceDesc = window.I18N ? window.I18N.t(choice.description) : choice.description;
            button.innerHTML = `
                <div class="flex items-center">
                    <i class="fas ${icon} text-yellow-500 mr-3"></i>
                    <div>
                        <h4 class="font-semibold text-white">${choiceText}</h4>
                        <p class="text-sm text-gray-300">${choiceDesc}</p>
                    </div>
                </div>
            `;
            
            choicesContainer.appendChild(button);
        });
        
        // Show scripture if applicable
        const scriptureContainer = document.getElementById('scripture-container');
        if (scene.scripture) {
            const randomScripture = this.scriptures[Math.floor(Math.random() * this.scriptures.length)];
            document.getElementById('scripture-text').textContent = window.I18N ? window.I18N.t(randomScripture.text) : randomScripture.text;
            document.getElementById('scripture-reference').textContent = window.I18N ? window.I18N.t(randomScripture.reference) : randomScripture.reference;
            scriptureContainer.classList.remove('hidden');
        } else {
            scriptureContainer.classList.add('hidden');
        }
    }
    
    getChoiceIcon(choiceText) {
        if (choiceText.toLowerCase().includes('devotion') || choiceText.toLowerCase().includes('prayer') || choiceText.toLowerCase().includes('faith')) {
            return 'fa-pray';
        } else if (choiceText.toLowerCase().includes('wisdom') || choiceText.toLowerCase().includes('study') || choiceText.toLowerCase().includes('book')) {
            return 'fa-brain';
        } else if (choiceText.toLowerCase().includes('compassion') || choiceText.toLowerCase().includes('service') || choiceText.toLowerCase().includes('care')) {
            return 'fa-heart';
        } else if (choiceText.toLowerCase().includes('meditation') || choiceText.toLowerCase().includes('contemplation')) {
            return 'fa-spa';
        } else if (choiceText.toLowerCase().includes('debate') || choiceText.toLowerCase().includes('question')) {
            return 'fa-comments';
        } else {
            return 'fa-star';
        }
    }
    
    makeChoice(choiceIndex) {
        const chapter = this.storyChapters[this.currentChapter];
        const scene = chapter.scenes[this.currentScene];
        const choice = scene.choices[choiceIndex];
        
        // Add special effects for portal choices
        if (choice.special) {
            this.triggerSpecialEffect(choice.special);
        }
        
        // Apply effects with visual feedback
        this.animateStatChange(choice.effects);
        
        setTimeout(() => {
            this.playerStats.faith = Math.min(100, Math.max(0, this.playerStats.faith + choice.effects.faith));
            this.playerStats.wisdom = Math.min(100, Math.max(0, this.playerStats.wisdom + choice.effects.wisdom));
            this.playerStats.compassion = Math.min(100, Math.max(0, this.playerStats.compassion + choice.effects.compassion));
            
            // Store choice
            this.choices.push({
                chapter: this.currentChapter,
                scene: this.currentScene,
                choice: choiceIndex,
                text: choice.text
            });
            
            // Update display
            this.updateStats();
            
            // Load next chapter via routeMap
            setTimeout(() => {
                const nextChapter = this.routeMap[`${this.currentChapter}-${this.currentScene}-${choiceIndex}`];
                this.goToChapter(nextChapter, 0);
            }, 500);
        }, 300);
    }
    
    checkAchievements() {
        // Check for balanced stats
        if (this.playerStats.faith >= 80 && this.playerStats.wisdom >= 80 && this.playerStats.compassion >= 80) {
            this.showAchievement(
                window.I18N ? window.I18N.t('Enlightened Master') : 'Enlightened Master',
                window.I18N ? window.I18N.t('You have achieved perfect balance in faith, wisdom, and compassion!') : 'You have achieved perfect balance in faith, wisdom, and compassion!'
            );
        }
        
        // Check for faith-focused
        if (this.playerStats.faith >= 90) {
            this.showAchievement(
                window.I18N ? window.I18N.t('True Believer') : 'True Believer',
                window.I18N ? window.I18N.t('Your faith shines as a beacon for others!') : 'Your faith shines as a beacon for others!'
            );
        }
        
        // Check for wisdom-focused
        if (this.playerStats.wisdom >= 90) {
            this.showAchievement(
                window.I18N ? window.I18N.t('Divine Scholar') : 'Divine Scholar',
                window.I18N ? window.I18N.t('You have unlocked profound theological understanding!') : 'You have unlocked profound theological understanding!'
            );
        }
        
        // Check for compassion-focused
        if (this.playerStats.compassion >= 90) {
            this.showAchievement(
                window.I18N ? window.I18N.t('Compassionate Heart') : 'Compassionate Heart',
                window.I18N ? window.I18N.t('Your love transforms the world around you!') : 'Your love transforms the world around you!'
            );
        }
    }
    
    showAchievement(title, description) {
        // Deduplicate: only show each achievement once per playthrough
        if (this.earnedAchievements.has(title)) return;
        this.earnedAchievements.add(title);
        // Create enhanced achievement notification with animation
        const achievement = document.createElement('div');
        achievement.className = 'fixed top-20 right-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-white p-6 rounded-xl shadow-2xl z-50 max-w-sm transform translate-x-full transition-transform duration-500';
        achievement.innerHTML = `
            <div class="flex items-center space-x-4">
                <div class="text-4xl animate-pulse">🏆</div>
                <div>
                    <h4 class="font-bold text-lg">${title}</h4>
                    <p class="text-sm opacity-90">${description}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(achievement);
        
        // Slide in animation
        setTimeout(() => {
            achievement.classList.remove('translate-x-full');
            achievement.classList.add('translate-x-0');
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            achievement.classList.add('translate-x-full');
            setTimeout(() => {
                achievement.remove();
            }, 500);
        }, 4000);
    }
    
    triggerSpecialEffect(effectType) {
        const body = document.body;
        
        switch(effectType) {
            case 'portal_gold':
                body.style.background = 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)';
                this.createPortalEffect('gold');
                break;
            case 'portal_blue':
                body.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)';
                this.createPortalEffect('blue');
                break;
            case 'portal_green':
                body.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)';
                this.createPortalEffect('green');
                break;
        }
        
        // Reset background after 2 seconds
        setTimeout(() => {
            body.style.background = 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)';
        }, 2000);
    }
    
    createPortalEffect(color) {
        const portal = document.createElement('div');
        portal.className = 'fixed inset-0 pointer-events-none z-40';
        portal.innerHTML = `
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-96 h-96 rounded-full animate-ping" style="background: radial-gradient(circle, ${color === 'gold' ? 'rgba(251, 191, 36, 0.3)' : color === 'blue' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'}, transparent);"></div>
                <div class="absolute w-64 h-64 rounded-full animate-pulse" style="background: radial-gradient(circle, ${color === 'gold' ? 'rgba(251, 191, 36, 0.5)' : color === 'blue' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(16, 185, 129, 0.5)'}, transparent);"></div>
            </div>
        `;
        
        document.body.appendChild(portal);
        
        setTimeout(() => {
            portal.remove();
        }, 2000);
    }
    
    animateStatChange(effects) {
        // Create floating stat indicators
        Object.entries(effects).forEach(([stat, value]) => {
            if (value > 0) {
                const indicator = document.createElement('div');
                indicator.className = 'fixed bottom-20 right-10 text-2xl font-bold z-50 animate-bounce';
                indicator.style.color = stat === 'faith' ? '#3b82f6' : stat === 'wisdom' ? '#f59e0b' : '#10b981';
                indicator.textContent = `+${value} ${stat.charAt(0).toUpperCase() + stat.slice(1)}`;
                
                document.body.appendChild(indicator);
                
                setTimeout(() => {
                    indicator.remove();
                }, 2000);
            }
        });
    }
    
    saveGame() {
        const saveData = {
            playerStats: this.playerStats,
            currentChapter: this.currentChapter,
            currentScene: this.currentScene,
            choices: this.choices,
            timestamp: new Date().toISOString(),
            meta: window.progressionSystem ? {
                playerLevel: window.progressionSystem.playerLevel,
                experience: window.progressionSystem.experience,
                gracePoints: window.progressionSystem.gracePoints,
                achievements: Array.from(window.progressionSystem.achievementsUnlocked || []),
                purchasedPerks: Array.from(window.progressionSystem.purchasedPerks || []),
                skills: window.progressionSystem.unlocks.skills
            } : null
        };

        localStorage.setItem('divineQuestSave', JSON.stringify(saveData));
        this.showAchievement(
            window.I18N ? window.I18N.t('Game Saved') : 'Game Saved',
            window.I18N ? window.I18N.t('Your spiritual journey has been preserved!') : 'Your spiritual journey has been preserved!'
        );
    }

    loadGame() {
        const saveData = localStorage.getItem('divineQuestSave');
        if (saveData) {
            const data = JSON.parse(saveData);
            this.playerStats = data.playerStats;
            this.currentChapter = data.currentChapter;
            this.currentScene = data.currentScene;
            this.choices = data.choices || [];

            // Restore meta-progression so achievements/grace-points persist
            if (data.meta && window.progressionSystem) {
                const ps = window.progressionSystem;
                ps.playerLevel = data.meta.playerLevel || 1;
                ps.experience = data.meta.experience || 0;
                ps.gracePoints = data.meta.gracePoints || 0;
                ps.achievementsUnlocked = new Set(data.meta.achievements || []);
                ps.purchasedPerks = new Set(data.meta.purchasedPerks || []);
                if (Array.isArray(data.meta.skills)) {
                    data.meta.skills.forEach(id => ps.unlocks.skills.includes(id) || ps.unlocks.skills.push(id));
                }
                ps.updateLevelDisplay();
            }

            this.updateStats();
            this.goToChapter(this.currentChapter, this.currentScene);

            this.showAchievement(
                window.I18N ? window.I18N.t('Game Loaded') : 'Game Loaded',
                window.I18N ? window.I18N.t('Your spiritual journey continues!') : 'Your spiritual journey continues!'
            );
        }
    }
    
    resetGame() {
        this.playerStats = { faith: 50, wisdom: 50, compassion: 50 };
        this.currentChapter = 0;
        this.currentScene = 0;
        this.choices = [];
        
        this.updateStats();
        this.goToChapter(0, 0);
        
        localStorage.removeItem('divineQuestSave');
        this.showAchievement(
            window.I18N ? window.I18N.t('New Journey') : 'New Journey',
            window.I18N ? window.I18N.t('Your spiritual quest begins anew!') : 'Your spiritual quest begins anew!'
        );
    }
}

// Global game instance
let game;

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    game = new DivineQuest();
    window.game = game;
    // Re-render on-screen narrative when language changes
    document.addEventListener('languageChanged', () => {
        if (game && typeof game.loadChapter === 'function') {
            game.loadChapter(game.currentChapter, game.currentScene);
        }
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            game.saveGame();
        } else if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            game.loadGame();
        } else if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            game.resetGame();
        }
    });
    
    // Check for saved game
    const saveData = localStorage.getItem('divineQuestSave');
    if (saveData) {
        setTimeout(() => {
            if (confirm('A saved game was found. Would you like to continue your spiritual journey?')) {
                game.loadGame();
            }
        }, 1000);
    }
});

// Global function for button clicks
function makeChoice(choiceIndex) {
    game.makeChoice(choiceIndex);
}
