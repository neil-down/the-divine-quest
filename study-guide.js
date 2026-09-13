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
                title: "The Christian Life",
                questions: [
                    "What does it mean that theology is for living, not merely for knowing?",
                    "How do grace, gratitude, and obedience fit together in the daily Christian walk?",
                    "Why does the game present 'continue,' 'share,' and 'glorify' as three facets of one life rather than three separate endings?"
                ],
                commentary: "This chapter gathers the whole journey into a single conviction: knowing Christ is a relationship to be nurtured daily, not a destination to be reached. The three closing choices mirror the three portals of the opening—grace received, gospel shared, glory pursued—showing that the Christian life is faith working through love in ordinary time. Reformed theology calls this sanctification by gratitude: because God has already accepted us in Christ, obedience becomes joy rather than bargain. Paul urges believers to walk in Christ just as they received Him—rooted, built up, established. Doubts faced, battles prayed, and glimpses of glory all serve this end: a life where every choice, struggle, and moment of rest belongs to God's sovereign plan to draw His people closer to Himself.",
                scripture: { reference: "Colossians 2:6-7", text: "Therefore, as you received Christ Jesus the Lord, so walk in him, rooted and built up in him and established in the faith, just as you were taught, abounding in thanksgiving." }
            },
            6: {
                title: "The Well of Living Water",
                questions: [
                    "Why does Jesus offer 'living water' to a Samaritan woman—an outsider by every social measure?",
                    "What does it mean that grace satisfies 'forever' rather than merely relieving temporary thirst?",
                    "How do the three responses—drink, listen, share—model receiving, learning, and giving?"
                ],
                commentary: "The well recalls John 4, where Christ meets the Samaritan woman in her ordinary thirst and exposes her deeper one. Living water is the Spirit Himself, given through Christ, welling up to eternal life. Note the order the game preserves: first drink deeply—grace must be received before it can be shared; then listen in humility—disciples sit before they stand; then share with a neighbor—grace received becomes grace extended. Reformed theology sees here effectual calling in miniature: Christ seeks, convicts, and satisfies, and the sinner who came alone leaves as a witness to the town. No one is beyond the reach of the well.",
                scripture: { reference: "John 4:14", text: "Whoever drinks of the water that I will give him will never be thirsty again. The water that I will give him will become in him a spring of water welling up to eternal life." }
            },
            7: {
                title: "The Upper Room",
                questions: [
                    "Why did the disciples have to wait in prayer before the Spirit came—could the mission have begun without Pentecost?",
                    "How does the Spirit turn fear into boldness, as the scene of 'tongues of flame' depicts?",
                    "What do praying, proclaiming, and breaking bread together teach about the Spirit's ordinary work in the church?"
                ],
                commentary: "The upper room is Pentecost: the ascended Christ pours out the promised Spirit, and a frightened band becomes a bold church. The rushing wind and tongues of flame are not decoration; they mark the arrival of the age of the Spirit, in which God dwells not merely among His people but within them. The game's three responses trace Acts faithfully: persistent prayer that waits on God's timing, bold proclamation that announces Christ, and table fellowship that remembers His death. Reformed theology insists the same Spirit who fell at Pentecost ordinarily works through these same means—Word, prayer, and sacrament—so that every Lord's Day is a small upper room where Christ builds His church.",
                scripture: { reference: "Acts 1:8", text: "But you will receive power when the Holy Spirit has come upon you, and you will be my witnesses in Jerusalem and in all Judea and Samaria, and to the end of the age." }
            },
            8: {
                title: window.I18N.t("The Valley of Doubt"),
                questions: [
                    "Is doubt the opposite of faith, or can it be the terrain where faith learns to walk?",
                    "What do the psalms of lament teach about bringing honest questions to God?",
                    "Why do the game's paths lead back to Scripture, worship, and rest rather than to immediate answers?"
                ],
                commentary: window.I18N.t("The valley names an experience every believer knows: the sense that God has hidden His face. Scripture does not rebuke this honesty—it canonizes it; nearly a third of the psalms are laments. The Reformers taught that faith is not the absence of questions but trust in the dark: walking by faith, not by sight. Notice where each choice leads: crying out ends in worship, searching the Word ends in wisdom, waiting in silence ends in renewed pilgrimage. Doubt addressed to God becomes prayer; doubt nursed alone becomes despair. The narrow stream through the valley floor is grace itself—small, steady, and sufficient until the light breaks."),
                scripture: { reference: "2 Corinthians 5:7", text: "For we walk by faith, not by sight." }
            },
            9: {
                title: window.I18N.t("The Warfare of Prayer"),
                questions: [
                    "If Christ has already won the victory, why must believers still 'stand' and 'wrestle' in prayer?",
                    "What is the 'full armor of God,' and why is every piece defensive except one?",
                    "How does interceding for others turn spiritual warfare from anxiety into love?"
                ],
                commentary: window.I18N.t("This chapter confesses the already-but-not-yet of redemption: the decisive battle is won at the cross, yet skirmishes continue until Christ returns. Paul's armor in Ephesians 6 is telling—truth, righteousness, gospel-readiness, faith, salvation, and the Word—equipment for standing firm, not for anxious striving. Prayer is the battlefield posture: intercession wields Christ's finished victory on behalf of others, and authority in His name is exercised, never presumed. The saints of old surrounding the player picture the cloud of witnesses—not mediators, but encouragers. Reformed theology holds both truths together: Satan is a defeated foe, and prayer is the ordained means by which God applies that defeat in time."),
                scripture: { reference: "Ephesians 6:11", text: "Put on the whole armor of God, that you may be able to stand against the schemes of the devil." }
            },
            10: {
                title: window.I18N.t("The Hope of Glory"),
                questions: [
                    "What is the difference between worldly optimism and the Christian 'hope that does not disappoint'?",
                    "How does a future inheritance change present suffering?",
                    "Why do the game's responses pair worship and witness—adoration of Christ and proclamation to the world?"
                ],
                commentary: window.I18N.t("Hope here is not wishful thinking but the assured inheritance sealed by Christ's blood and resurrection. Peter calls it a living hope; Paul says suffering produces endurance, endurance produces character, and character produces a hope that does not put us to shame, because God's love is poured into our hearts through the Spirit. The veil grows thin in this chapter because glory is not distant compensation for a wasted life—it is the revealed meaning of the life already being lived. Worship answers what witness announces: the risen Christ is worthy, and the world must hear it. To live in light of eternity is not to despise the present but to weigh it rightly—every trial woven into an unfading crown."),
                scripture: { reference: "Romans 8:18", text: "For I consider that the sufferings of this present time are not worth comparing with the glory that is to be revealed to us." }
            },
            11: {
                title: window.I18N.t("The Communion of Saints"),
                questions: [
                    "Who belongs to the 'communion of saints,' and why does the game include patriarchs, prophets, apostles, and martyrs?",
                    "What is the Reformed objection to praying to saints, and how should believers properly honor them?",
                    "How does the unity of Christ's body across time and tongue comfort a lonely pilgrim?"
                ],
                commentary: window.I18N.t("The communion of saints is the whole company of the elect in every age—militant on earth, triumphant in heaven—united to one Head by one Spirit. Hebrews pictures them as a cloud of witnesses cheering the pilgrim on. The chapter also issues the Reformed warning: Rome blurred this fellowship by invoking saints as mediators, but Scripture names one mediator between God and men, the man Christ Jesus. We honor the saints the biblical way—by imitating their faith, not by praying to them. Their lives point beyond themselves to Christ. For the lonely believer, this doctrine is pure comfort: no pilgrim ever walks alone; the same Spirit who sustained the martyrs dwells in every ordinary saint today."),
                scripture: { reference: "1 Timothy 2:5", text: "For there is one God, and there is one mediator between God and men, the man Christ Jesus." }
            },
            12: {
                title: window.I18N.t("The New Heavens and New Earth"),
                questions: [
                    "Why is the Christian hope the renewal of creation rather than escape from it?",
                    "What does it mean that 'the dwelling place of God is with man'?",
                    "How does the quest's end—union with Christ—reframe everything the player did to get here?"
                ],
                commentary: window.I18N.t("The vision reaches its biblical culmination: not disembodied escape but a new heaven and new earth where righteousness dwells. Peter promises it; John beholds it; Paul says creation itself will be liberated from bondage into the freedom of the glory of God's children. The Reformed hope is cosmic because the curse was cosmic—Christ redeems the world He made. 'Behold, the dwelling place of God is with man' reverses Eden's exile: God with us, tears wiped away, death undone. The chapter's closing insight is the game's thesis: the quest was never moral striving but union with Christ, from whom all grace flows and to whom all glory returns. The Author and Finisher completes what He began."),
                scripture: { reference: "2 Peter 3:13", text: "But according to his promise we are waiting for new heavens and a new earth in which righteousness dwells." }
            },
            13: {
                title: window.I18N.t("The Reformation"),
                questions: [
                    "What are the five solas, and why did the Reformers consider each one non-negotiable?",
                    "Did the Reformers invent new doctrine, or recover something older—and why does that matter?",
                    "How do the game's three responses—Scripture, faith, glory—summarize the whole Reformation?"
                ],
                commentary: window.I18N.t("Wittenberg recovered what human tradition had buried: Scripture alone as supreme authority, faith alone as the instrument of justification, Christ alone as mediator, grace alone as the ground of salvation, glory to God alone as the end of all things. The chapter rightly stresses recovery over invention—the Reformers unearthed the ancient apostolic faith, appealing over medieval accretions to the Word itself. Sola Scriptura guards the other solas: take it away and tradition, reason, or experience quietly become co-authorities. The three closing choices preach the Reformation in miniature: submit every tradition to the Word, rest from self-justifying works, and aim the whole of life at God's glory."),
                scripture: { reference: "Romans 1:17", text: "For in it the righteousness of God is revealed from faith for faith, as it is written, 'The righteous shall live by faith.'" }
            },
            14: {
                title: window.I18N.t("The Church Fathers"),
                questions: [
                    "Why should Reformed believers—committed to Scripture alone—still read Athanasius, Augustine, and Irenaeus?",
                    "What did Athanasius defend at Nicaea, and why did the deity of Christ hang in the balance?",
                    "How does Augustine's Confessions illustrate the doctrines of grace the Reformation later recovered?"
                ],
                commentary: window.I18N.t("Sola Scriptura never meant Scripture in isolation. The fathers are faithful lamps, not rival lights: Athanasius contending that the Son is consubstantial with the Father, without whom no atonement of infinite worth is possible; Augustine confessing that grace precedes, enables, and completes every human turning, laying the rails the Reformers would run on; Irenaeus guarding the apostolic deposit against Gnostic novelty, modeling the call to contend for the faith once delivered. Chalcedon's formula—one person in two natures, without confusion, change, division, or separation—remains the church's grammar for speaking of Christ. The Reformed faith is not a sixteenth-century novelty but the ancient catholic faith, purified."),
                scripture: { reference: "Jude 3", text: "Beloved, although I was very eager to write to you about our common salvation, I found it necessary to write appealing to you to contend for the faith that was once for all delivered to the saints." }
            },
            15: {
                title: window.I18N.t("Perseverance & Glory"),
                questions: [
                    "What keeps the saints persevering—their grip on God, or His grip on them?",
                    "How does Paul's 'golden chain' move from foreknowledge to glorification without a broken link?",
                    "Why does the game end with surrender rather than achievement?"
                ],
                commentary: window.I18N.t("The final chapter confesses the keeping power of God: those He calls, He preserves. Perseverance is not the saints' tenacity but the Shepherd's grip—no one snatches His sheep from His hand, and the good work begun is carried to completion. Paul's golden chain runs unbroken from foreknowledge to predestination to calling to justification to glorification, every link forged by God. So the quest ends not with a trophy but with surrender: yielding the story into the hands of its Author and Finisher. The consummation is not escape from creation but its liberation—the groaning world set free into the glory of God's children, every tear wiped away, Christ all in all."),
                scripture: { reference: "Jude 24-25", text: "Now to him who is able to keep you from stumbling and to present you blameless before the presence of his glory with great joy, to the only God, our Savior, through Jesus Christ our Lord, be glory, majesty, dominion, and authority, before all time and now and forever. Amen." }
            },
            16: {
                title: window.I18N.t("Justification"),
                questions: [
                    "Why does Reformed theology describe justification as a 'forensic' act rather than a process of moral improvement?",
                    "What is the difference between Christ's righteousness being 'imputed' to us versus being 'infused' into us?",
                    "How does the doctrine of 'solus Christus' protect the gospel from works-righteousness?"
                ],
                commentary: window.I18N.t("Justification is God's gracious act of declaring a sinner righteous in His sight, not on the basis of any works or inherent righteousness in the believer, but solely on account of the imputed righteousness of Jesus Christ. The Reformers contrasted this with the Roman view, which understood justification as an internal transformation making one objectively righteous. For Calvin and Luther, justification is a legal verdict: God the Judge acquits the guilty and credits the perfect obedience and sacrificial merit of Christ to the believer's account. This righteousness is imputed, not infused—counted as belonging to the believer even though it is not his own. Faith alone receives this gift; faith is not a work that earns justification, but the empty hand that embraces Christ. Because justification rests entirely on Christ, it is once-for-all and unchanging. A justified believer is still a sinner, yet in Christ he is fully accepted. The covenant theologian sees justification as the great blessing of the covenant of grace, administered in every age by promise and type, fulfilled in Christ, and received by faith alone."),
                scripture: { reference: "2 Corinthians 5:21", text: "For our sake he made him to be sin who knew no sin, so that in him we might become the righteousness of God." }
            },
            17: {
                title: window.I18N.t("The Church (Ecclesiology)"),
                questions: [
                    "Why is the church called the 'visible' and 'invisible' church, and how does this distinction help Christians today?",
                    "What does it mean that the church is both a 'holy' fellowship and a 'mixed' assembly of believers and unbelievers?",
                    "How should the Reformed doctrine of the marks of the church shape our commitment to faithful preaching and sound discipline?"
                ],
                commentary: window.I18N.t("The church is the covenant community purchased by Christ's blood, called out of the world to worship, grow, and bear witness. Reformed theology distinguishes between the invisible church—the whole company of the elect known perfectly only to God—and the visible church—the gathered assembly of professing believers and their children, in which the Word is truly preached, the sacraments rightly administered, and discipline faithfully exercised. The visible church will always be mixed: some members are genuine believers, others are merely external participants. Yet the Reformers rejected both sectarian perfectionism and lax indifference: the church is called to be holy, to receive all who profess faith, and yet not to pretend that every baptized person is necessarily regenerate. The Belgic Confession and Westminster Confession identify the marks of the true church as the pure preaching of the gospel, the right administration of the sacraments, and the faithful exercise of church discipline. These marks protect the church from both barren formalism and subjective enthusiasm, keeping her rooted in Christ alone. Membership in the church is not optional; it is the ordinary means by which Christ nourishes His people."),
                scripture: { reference: "Hebrews 10:24-25", text: "And let us consider how to stir up one another to love and good works, not neglecting to meet together, as is the habit of some, but encouraging one another, and all the more as you see the Day drawing near." }
            },
            18: {
                title: window.I18N.t("Eschatology"),
                questions: [
                    "How does the Reformed view of the 'already/not yet' kingdom affect how Christians live between Christ's first and second coming?",
                    "What does it mean that Christ will physically return to judge the living and the dead, and why does this give hope?",
                    "How should the hope of resurrection and new creation shape our care for the physical world and bodies?"
                ],
                commentary: window.I18N.t("Eschatology is the study of last things, and Reformed theology embraces a robust, biblical hope anchored in the return of Christ. The kingdom of God has been inaugurated in Christ's first coming but has not yet been consummated; believers live in the 'already/not yet' tension, enjoying the benefits of salvation now while awaiting its full realization when Christ returns. Reformed orthodoxy rejects both utopian optimism that the world will gradually perfect itself and pessimistic escapism that despises the present creation. Instead, it teaches that Christ will bodily return, raise the dead, judge the world in righteousness, and establish the new heavens and new earth—a renewed, physical, everlasting realm where righteousness dwells. The resurrection of the body is central: Christianity is not the escape of the soul from matter, but the redemption of the whole person and the renewal of the whole creation. This hope does not paralyze but energizes the believer, pressing toward holiness, missions, and faithful stewardship of all God has made. The Heidelberg Catechism closes with the comfort of resurrection life, and the Westminster Confession confesses a general resurrection of both the just and the unjust."),
                scripture: { reference: "1 Thessalonians 4:16-17", text: "For the Lord himself will descend from heaven with a cry of command, with the voice of an archangel, and with the sound of the trumpet of God. And the dead in Christ will rise first. Then we who are alive, who are left, will be caught up together with them in the clouds to meet the Lord in the air, and so we will always be with the Lord." }
            },
            19: {
                title: window.I18N.t("Total Depravity"),
                questions: [
                    "What does 'total depravity' mean, and how is it different from saying every person is as bad as they could possibly be?",
                    "If human nature is fallen in every part, what hope is there for any person to seek God?",
                    "How does the doctrine of total depravity make grace not only helpful but absolutely necessary?"
                ],
                commentary: window.I18N.t("Total depravity is the first head of the TULIP summary of Reformed soteriology. It does not teach that every human is as wicked as possible, but that sin has corrupted every part of human nature—mind, will, affections, and conscience—so that no one seeks God by nature (Romans 3:10-12). The will is not neutral but in bondage to sin; left to himself, a person chooses according to his fallen desires. This is why Reformed theology insists that salvation must be monergistic in its inception: the initiative is entirely God's. The Spirit must regenerate the dead heart before anyone can respond in faith (John 6:44, 65). Total depravity magnifies grace: if the saved were in any part the authors of their own deliverance, they could boast; but since all are equally lost, the rescue of any is sheer mercy. Calvin grounded this in Augustine's anti-Pelagian writings, and the Canons of Dort affirm that 'there is left in man since the fall, no spark of true saving light.' The doctrine is humbling but hopeful: the worse the disease, the greater the Physician."),
                scripture: { reference: "Romans 3:10-12", text: "as it is written: 'None is righteous, no, not one; no one understands; no one seeks for God. All have turned aside; together they have become worthless; no one does good, not even one.'" }
            },
            20: {
                title: window.I18N.t("Unconditional Election"),
                questions: [
                    "Why does Reformed theology describe God's election as 'unconditional' rather than based on foreseen faith or merit?",
                    "Does election undermine evangelism and prayer, or does it ground them in God's sovereign purpose?",
                    "How can a believer find comfort—not anxiety—in the doctrine that God chose His people before the foundation of the world?"
                ],
                commentary: window.I18N.t("Unconditional election teaches that from before the foundation of the world, God freely and sovereignly chose a people for Himself in Christ, not on the basis of any foreseen faith, merit, or good in them, but according to the good pleasure of His will (Ephesians 1:4-5). The Reformed confession rejects the view that God elects because He foresaw who would believe; that would make the ultimate cause of salvation reside in man rather than God, and grace would no longer be grace. Election is grounded in God's loving, wise, and secret decree, revealed and applied through the gospel. Far from discouraging evangelism, this doctrine fuels it: the apostle who most taught election was also the apostle to the Gentiles, for he knew the Elector delights to gather His sheep through the preaching of the word. Election is a comfort, not a terror: those whom God predestined He also called, justified, and will glorify (Romans 8:29-30). The believer's perseverance rests not on the strength of his own resolving but on the immutability of God's counsel."),
                scripture: { reference: "Ephesians 1:4-5", text: "even as he chose us in him before the foundation of the world, that we should be holy and blameless before him. In love he predestined us for adoption to himself as sons through Jesus Christ, according to the purpose of his will" }
            },
            21: {
                title: window.I18N.t("The Law and the Gospel"),
                questions: [
                    "What is the difference between the moral, civil, and ceremonial law, and which continues to bind the conscience today?",
                    "How does confusing law and gospel distort both the message of free grace and the call to holy living?",
                    "In what three uses does Reformed theology say the law serves the believer and the church?"
                ],
                commentary: window.I18N.t("The distinction between law and gospel is, in Luther's words, the sum of all Christian doctrine. The law commands and condemns; the gospel promises and gives. Reformed covenant theology has historically distinguished three uses of the law: the civil use, restraining sin in society; the pedagogical (or elenctic) use, convicting sinners and driving them to Christ; and the normative (or third) use, guiding the grateful believer in sanctification. The moral law, summed in the Ten Commandments and reaffirmed by Christ, remains the abiding rule of life; the ceremonial and civil aspects of the Mosaic code found their fulfillment in Christ and are no longer binding as covenant obligations. The gospel does not abolish the law's authority but fulfills it, so that believers, freed from the law as a covenant of works, now delight in it as the pattern of grateful obedience. The Heidelberg Catechism asks, 'Since then we are delivered from the law, can it no longer accuse us?' and answers that the law still shows us our sin and the holiness God requires—yet our acceptance before God rests solely on Christ's obedience, not ours."),
                scripture: { reference: "Galatians 3:24-25", text: "So then, the law was our guardian until Christ came, in order that we might be justified by faith. But now that faith has come, we are no longer under a guardian." }
            },
            22: {
                title: window.I18N.t("Union with Christ"),
                questions: [
                    "Why do Reformed theologians call 'union with Christ' the fountain from which all other benefits of salvation flow?",
                    "How does being 'in Christ' connect justification, adoption, sanctification, and glorification into one reality?",
                    "What does it mean practically to live each day 'rooted' in this union rather than striving to earn what is already ours?"
                ],
                commentary: window.I18N.t("Union with Christ is the central, organizing blessing of salvation: all the benefits of redemption—justification, adoption, sanctification, and glorification—are ours only because we are united to the risen and ascended Christ by the Spirit (John 15:1-5; Romans 6:1-11). Calvin called it the sum of all blessings, and modern Reformed theology (following him and later writers such as John Murray and Sinclair Ferguson) emphasizes that we must not treat the ordo salutis as a ladder of separate steps but as dimensions of one shared life. Because Christ lived, died, and rose, those in Him have died to sin's dominion and been raised to newness of life; His righteousness is theirs by imputation, His death theirs by identification, His resurrection theirs by power. This truth guards against both legalism (trying to earn what is already given) and antinomianism (forgetting that grace teaches us to say no to sin). Living 'in Christ' means the Christian life is not the sinner's lonely climb to God but the Spirit's continual drawing of the elect into the fellowship of the Son with the Father."),
                scripture: { reference: "Romans 6:5", text: "For if we have been united with him in a death like his, we shall certainly be united with him in a resurrection like his." }
            },
            23: {
                title: window.I18N.t("The Two Kingdoms"),
                questions: [
                    "What does the Reformed 'two kingdoms' (or twofold government) doctrine say about how Christ rules the church and the civil order?",
                    "How can Christians be wholly devoted to Christ while also honoring earthly authorities and engaging culture?",
                    "Why does this doctrine protect both the church from becoming a political lobby and the state from claiming the soul?"
                ],
                commentary: window.I18N.t("The two-kingdoms doctrine, recovered by Luther and refined in Reformed political theology, teaches that God governs the world through two distinct but overlapping spheres: the spiritual kingdom, exercised by the Word and Spirit through the church, and the civil kingdom, exercised by magistrates through law and sword. Both are ordained by God, yet they have different means, ends, and limits. The church's weapons are spiritual, not coercive; the state's mandate is to preserve outward order, justice, and the common good, not to save souls. This distinction protects the conscience: Christ is Lord of both kingdoms, but He rules the church by grace and the state by common grace. It prevents the church from becoming a political machine and the state from claiming religious authority. Reformed believers therefore engage culture, politics, and vocation with diligence and gratitude, recognizing that all legitimate authority is delegated, and that the civil magistrate remains under the King of kings. The Two Kingdoms view is not withdrawal from the world but a clear-eyed pursuit of faithful presence in every God-ordained sphere."),
                scripture: { reference: "Romans 13:1", text: "Let every person be subject to the governing authorities. For there is no authority except from God, and those that exist have been instituted by God." }
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
        this.browseIndex = 0; // start browsing at the first topic
        this.renderContent(0);

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

        // When opened during a specific chapter, prefer that topic; otherwise browse all topics.
        const keys = Object.keys(this.content).map(Number).sort((a, b) => a - b);
        if (typeof this.browseIndex !== 'number' || this.browseIndex < 0 || this.browseIndex >= keys.length) {
            this.browseIndex = keys.indexOf(chapterIndex);
            if (this.browseIndex < 0) this.browseIndex = 0;
        }
        const topicKey = keys[this.browseIndex];
        const data = this.content[topicKey];
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
                <header class="flex items-center justify-between">
                    <div>
                        <h3 class="text-xl font-bold text-indigo-200 mb-1">${this.escapeHtml(data.title)}</h3>
                        <div class="h-1 w-16 bg-indigo-600 rounded-full"></div>
                    </div>
                    <span class="text-xs text-slate-500 font-mono">${this.browseIndex + 1}/${keys.length}</span>
                </header>

                <div class="flex items-center gap-2">
                    <button id="study-prev" class="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-xs" ${this.browseIndex === 0 ? 'disabled style="opacity:.4"' : ''}>← Prev</button>
                    <button id="study-next" class="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-xs" ${this.browseIndex === keys.length - 1 ? 'disabled style="opacity:.4"' : ''}>Next →</button>
                    <button id="study-this-chapter" class="ml-auto bg-indigo-800 hover:bg-indigo-700 text-indigo-100 px-3 py-1 rounded text-xs">Jump to current chapter</button>
                </div>

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

        const prev = contentArea.querySelector('#study-prev');
        const next = contentArea.querySelector('#study-next');
        const jump = contentArea.querySelector('#study-this-chapter');
        if (prev) prev.addEventListener('click', () => { this.browseIndex = Math.max(0, this.browseIndex - 1); this.renderContent(this.lastChapter); });
        if (next) next.addEventListener('click', () => { this.browseIndex = Math.min(keys.length - 1, this.browseIndex + 1); this.renderContent(this.lastChapter); });
        if (jump) jump.addEventListener('click', () => { this.browseIndex = keys.indexOf(this.lastChapter); if (this.browseIndex < 0) this.browseIndex = 0; this.renderContent(this.lastChapter); });
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
