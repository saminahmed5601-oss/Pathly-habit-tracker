export interface MemeItem {
  id: string;
  title: string;
  category: 'Cats & Pets' | '3 AM Brain' | 'Chad & Lore' | 'Classic Internet' | 'Relatable Habits';
  imageUrl: string;
  fallbackEmoji: string;
  caption: string;
  soundType: 'vine_boom' | 'pop' | 'airhorn' | 'bruh' | 'sad_trombone' | 'mario_coin' | 'level_up' | 'fanfare' | 'rickroll' | 'leo_laugh' | 'pedro' | 'emotional_damage';
  soundLabel: string;
  likes: number;
}

export const MEMES_COLLECTION: MemeItem[] = [
  {
    "id": "rickroll-legendary",
    "title": "Never Gonna Give You Up (Rickroll)",
    "category": "Chad & Lore",
    "imageUrl": "https://i.imgflip.com/46e43q.png",
    "fallbackEmoji": "🕺",
    "caption": "Never gonna give your streak up! Never gonna let your habits down! 🕺✨",
    "soundType": "rickroll",
    "soundLabel": "Never Gonna Give You Up 🕺",
    "likes": 99999
  },
  {
    "id": "meme-181913649",
    "title": "Drake Hotline Bling",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/30b1gx.jpg",
    "fallbackEmoji": "🕺",
    "caption": "❌ Starting the 5-minute task. ✅ Cleaning the entire room and desktop folders for 3 hours.",
    "soundType": "pop",
    "soundLabel": "Drake Pop 🍬",
    "likes": 19729
  },
  {
    "id": "meme-87743020",
    "title": "Two Buttons",
    "category": "Relatable Habits",
    "imageUrl": "https://i.imgflip.com/1g8my4.jpg",
    "fallbackEmoji": "🔴",
    "caption": "Button 1: Do 15 minutes of deep focus. Button 2: Stare at the wall with intense guilt.",
    "soundType": "bruh",
    "soundLabel": "Sweating Bruh 🗿",
    "likes": 32403
  },
  {
    "id": "meme-112126428",
    "title": "Distracted Boyfriend",
    "category": "3 AM Brain",
    "imageUrl": "https://i.imgflip.com/1ur9b0.jpg",
    "fallbackEmoji": "👀",
    "caption": "Me ignoring my urgent high-priority mission to research random Wikipedia articles.",
    "soundType": "vine_boom",
    "soundLabel": "Distraction Boom 💥",
    "likes": 20429
  },
  {
    "id": "meme-222403160",
    "title": "Bernie I Am Once Again Asking For Your Support",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/3oevdk.jpg",
    "fallbackEmoji": "🧤",
    "caption": "I am once again asking you to close YouTube and start your daily focus dial.",
    "soundType": "mario_coin",
    "soundLabel": "Bernie Coin 🪙",
    "likes": 38751
  },
  {
    "id": "meme-217743513",
    "title": "UNO Draw 25 Cards",
    "category": "Relatable Habits",
    "imageUrl": "https://i.imgflip.com/3lmzyx.jpg",
    "fallbackEmoji": "🃏",
    "caption": "\"Do 20 minutes of cardio or draw 25 cards.\" *Draws 25 cards with intense eye contact*.",
    "soundType": "bruh",
    "soundLabel": "Draw 25 Bruh 🗿",
    "likes": 38138
  },
  {
    "id": "meme-124822590",
    "title": "Left Exit 12 Off Ramp",
    "category": "3 AM Brain",
    "imageUrl": "https://i.imgflip.com/22bdq6.jpg",
    "fallbackEmoji": "🚗",
    "caption": "Straight: Finish 1 priority task. Sharp Exit: Learn random programming language until 4 AM.",
    "soundType": "airhorn",
    "soundLabel": "Drift Airhorn 📢",
    "likes": 35679
  },
  {
    "id": "meme-252600902",
    "title": "Always Has Been",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/46e43q.png",
    "fallbackEmoji": "👨‍🚀",
    "caption": "\"Wait, the secret to productivity is just starting for 2 minutes?\" \"Always has been.\"",
    "soundType": "level_up",
    "soundLabel": "Truth Chime 🚀",
    "likes": 19188
  },
  {
    "id": "meme-322841258",
    "title": "Anakin Padme 4 Panel",
    "category": "Chad & Lore",
    "imageUrl": "https://i.imgflip.com/5c7lwq.png",
    "fallbackEmoji": "🚀",
    "caption": "Padme: \"You're going to finish your priority missions today, right?\" Anakin: *Smiles silently*.",
    "soundType": "vine_boom",
    "soundLabel": "Padme Boom 💥",
    "likes": 37202
  },
  {
    "id": "meme-135256802",
    "title": "Epic Handshake",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/28j0te.jpg",
    "fallbackEmoji": "🤝",
    "caption": "Me and my last braincell agreeing to finish the task 5 minutes before deadline.",
    "soundType": "fanfare",
    "soundLabel": "Handshake Fanfare 🎺",
    "likes": 17361
  },
  {
    "id": "meme-131087935",
    "title": "Running Away Balloon",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/261o3j.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Drinking 1 glass of water after 6 iced coffees. HEALF: STONKS ↗️",
    "soundType": "pedro",
    "soundLabel": "Pedro Pedro 🦝",
    "likes": 24833
  },
  {
    "id": "meme-131940431",
    "title": "Gru's Plan",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/26jxvz.jpg",
    "fallbackEmoji": "📋",
    "caption": "1. Wake up early. 2. Brew fresh coffee. 3. Scroll memes for 4 hours. 4. Wait, what?",
    "soundType": "sad_trombone",
    "soundLabel": "Gru Trombone 🎺",
    "likes": 17237
  },
  {
    "id": "meme-4087833",
    "title": "Waiting Skeleton",
    "category": "Relatable Habits",
    "imageUrl": "https://i.imgflip.com/2fm6x.jpg",
    "fallbackEmoji": "💀",
    "caption": "Waiting for motivation to arrive naturally instead of just setting the 25m focus timer.",
    "soundType": "sad_trombone",
    "soundLabel": "Waiting Trombone 🎺",
    "likes": 34299
  },
  {
    "id": "meme-80707627",
    "title": "Sad Pablo Escobar",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/1c1uej.jpg",
    "fallbackEmoji": "🪑",
    "caption": "Sitting quietly when all your daily missions are crushed and you have nothing to worry about.",
    "soundType": "mario_coin",
    "soundLabel": "Zen Pablo Coin 🪙",
    "likes": 18001
  },
  {
    "id": "meme-129242436",
    "title": "Change My Mind",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/24y43o.jpg",
    "fallbackEmoji": "☕",
    "caption": "A 25-minute uninterrupted timer is more effective than 4 hours of multitasking. Change my mind.",
    "soundType": "mario_coin",
    "soundLabel": "Change My Mind 🪙",
    "likes": 21913
  },
  {
    "id": "meme-97984",
    "title": "Disaster Girl",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/23ls.jpg",
    "fallbackEmoji": "🔥",
    "caption": "Watching my responsibilities pile up while I customize my dark mode theme.",
    "soundType": "vine_boom",
    "soundLabel": "Disaster Boom 💥",
    "likes": 17270
  },
  {
    "id": "meme-309868304",
    "title": "Trade Offer",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/54hjww.jpg",
    "fallbackEmoji": "🤝",
    "caption": "I receive: 25 minutes of your focus. You receive: +50 XP and a clean conscience.",
    "soundType": "mario_coin",
    "soundLabel": "Trade Coin 🪙",
    "likes": 27607
  },
  {
    "id": "meme-224015000",
    "title": "Bernie Sanders Once Again Asking",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/3pdf2w.png",
    "fallbackEmoji": "🎭",
    "caption": "Unbothered. Moisturized. In my lane. Focusing for 25 minutes straight.",
    "soundType": "sad_trombone",
    "soundLabel": "Sad Trombone 🎺",
    "likes": 27242
  },
  {
    "id": "meme-161865971",
    "title": "Marked Safe From",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/2odckz.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Drinking 1 glass of water after 6 iced coffees. HEALF: STONKS ↗️",
    "soundType": "level_up",
    "soundLabel": "Level Up 🚀",
    "likes": 18302
  },
  {
    "id": "meme-101470",
    "title": "Ancient Aliens",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/26am.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Yes, I finished all priority missions and drank 2L of water today.",
    "soundType": "fanfare",
    "soundLabel": "Fanfare 🎺",
    "likes": 12902
  },
  {
    "id": "meme-124055727",
    "title": "Y'all Got Any More Of That",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/21uy0f.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Gentlemen, it is with great pleasure to inform you today's missions are crushed.",
    "soundType": "rickroll",
    "soundLabel": "Rickroll 🕺",
    "likes": 21575
  },
  {
    "id": "meme-91538330",
    "title": "X, X Everywhere",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/1ihzfe.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Submitting the assignment at 11:59:59 PM with 0.1% mental energy remaining.",
    "soundType": "leo_laugh",
    "soundLabel": "Leo Laugh 🍷",
    "likes": 19762
  },
  {
    "id": "meme-438680",
    "title": "Batman Slapping Robin",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/9ehk.jpg",
    "fallbackEmoji": "🎭",
    "caption": "When Pathly asks if I completed my evening reflection at 11:58 PM.",
    "soundType": "pedro",
    "soundLabel": "Pedro Pedro 🦝",
    "likes": 13759
  },
  {
    "id": "meme-102156234",
    "title": "Mocking Spongebob",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/1otk96.jpg",
    "fallbackEmoji": "🧽",
    "caption": "\"YoU nEeD a 12-sTeP mOrNiNg rOuTiNe\" — Just drink water and do 15m focus.",
    "soundType": "bruh",
    "soundLabel": "Mocking Bruh 🗿",
    "likes": 17000
  },
  {
    "id": "meme-61579",
    "title": "One Does Not Simply",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/1bij.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Me checking off 3 easy tasks in 30 seconds to get the dopamine rolling.",
    "soundType": "vine_boom",
    "soundLabel": "Vine Boom 💥",
    "likes": 28629
  },
  {
    "id": "meme-79132341",
    "title": "Bike Fall",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/1b42wl.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Unbothered. Moisturized. In my lane. Focusing for 25 minutes straight.",
    "soundType": "airhorn",
    "soundLabel": "Speed Airhorn 📢",
    "likes": 27114
  },
  {
    "id": "meme-188390779",
    "title": "Woman Yelling At Cat",
    "category": "Cats & Pets",
    "imageUrl": "https://i.imgflip.com/345v97.jpg",
    "fallbackEmoji": "🥗",
    "caption": "Me: \"Why did I accomplish nothing today?\" My to-do list: \"You didn't open me.\"",
    "soundType": "bruh",
    "soundLabel": "Cat Bruh 🗿",
    "likes": 15921
  },
  {
    "id": "meme-100777631",
    "title": "Is This A Pigeon",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/1o00in.jpg",
    "fallbackEmoji": "🦋",
    "caption": "Opens social media for 2 hours -> \"Is this high productivity flow state?\"",
    "soundType": "bruh",
    "soundLabel": "Pigeon Bruh 🗿",
    "likes": 29275
  },
  {
    "id": "meme-505705955",
    "title": "Absolute Cinema",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/8d317n.png",
    "fallbackEmoji": "🎭",
    "caption": "Gentlemen, it is with great pleasure to inform you today's missions are crushed.",
    "soundType": "bruh",
    "soundLabel": "Bruh Synth 🗿",
    "likes": 20015
  },
  {
    "id": "meme-177682295",
    "title": "You Guys are Getting Paid",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/2xscjb.png",
    "fallbackEmoji": "🎭",
    "caption": "Submitting the assignment at 11:59:59 PM with 0.1% mental energy remaining.",
    "soundType": "sad_trombone",
    "soundLabel": "Sad Trombone 🎺",
    "likes": 12154
  },
  {
    "id": "meme-427308417",
    "title": "0 days without (Lenny, Simpsons)",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/72epa9.png",
    "fallbackEmoji": "🎭",
    "caption": "When Pathly asks if I completed my evening reflection at 11:58 PM.",
    "soundType": "level_up",
    "soundLabel": "Level Up 🚀",
    "likes": 15951
  },
  {
    "id": "meme-180190441",
    "title": "They're The Same Picture",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/2za3u1.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Setting a 25-minute dial and entering absolute deep work flow state.",
    "soundType": "fanfare",
    "soundLabel": "Fanfare 🎺",
    "likes": 20526
  },
  {
    "id": "meme-93895088",
    "title": "Expanding Brain",
    "category": "3 AM Brain",
    "imageUrl": "https://i.imgflip.com/1jwhww.jpg",
    "fallbackEmoji": "🌌",
    "caption": "Tier 1: Sticky note. Tier 2: Pomodoro. Tier 3: Pathly Pet. Tier 4: Cosmic Enlightenment.",
    "soundType": "level_up",
    "soundLabel": "Cosmic Chime 🚀",
    "likes": 18379
  },
  {
    "id": "meme-252758727",
    "title": "Mother Ignoring Kid Drowning In A Pool",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/46hhvr.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Unbothered. Moisturized. In my lane. Focusing for 25 minutes straight.",
    "soundType": "leo_laugh",
    "soundLabel": "Leo Laugh 🍷",
    "likes": 20929
  },
  {
    "id": "meme-178591752",
    "title": "Tuxedo Winnie The Pooh",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/2ybua0.png",
    "fallbackEmoji": "🎭",
    "caption": "Drinking 1 glass of water after 6 iced coffees. HEALF: STONKS ↗️",
    "soundType": "pedro",
    "soundLabel": "Pedro Pedro 🦝",
    "likes": 10494
  },
  {
    "id": "meme-3218037",
    "title": "This Is Where I'd Put My Trophy If I Had One",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/1wz1x.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Yes, I finished all priority missions and drank 2L of water today.",
    "soundType": "emotional_damage",
    "soundLabel": "Emotional Damage 🩴",
    "likes": 28702
  },
  {
    "id": "meme-67452763",
    "title": "Squidward window",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/145qvv.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Gentlemen, it is with great pleasure to inform you today's missions are crushed.",
    "soundType": "vine_boom",
    "soundLabel": "Vine Boom 💥",
    "likes": 22466
  },
  {
    "id": "meme-247375501",
    "title": "Buff Doge vs. Cheems",
    "category": "Cats & Pets",
    "imageUrl": "https://i.imgflip.com/43a45p.png",
    "fallbackEmoji": "🐕",
    "caption": "Me at 2 AM: \"Tomorrow I conquer the universe.\" Me at 2 PM: \"Scared of opening email.\"",
    "soundType": "vine_boom",
    "soundLabel": "Doge Boom 💥",
    "likes": 31689
  },
  {
    "id": "meme-370867422",
    "title": "Megamind peeking",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/64sz4u.png",
    "fallbackEmoji": "🎭",
    "caption": "When Pathly asks if I completed my evening reflection at 11:58 PM.",
    "soundType": "pop",
    "soundLabel": "Pop Pop Pop 🍬",
    "likes": 11537
  },
  {
    "id": "meme-28251713",
    "title": "Oprah You Get A",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/gtj5t.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Setting a 25-minute dial and entering absolute deep work flow state.",
    "soundType": "mario_coin",
    "soundLabel": "Mario Coin 🪙",
    "likes": 13269
  },
  {
    "id": "meme-55311130",
    "title": "This Is Fine",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/wxica.jpg",
    "fallbackEmoji": "🐶",
    "caption": "27 unfinished tasks due in 2 hours... \"This is fine. Tactical nap time.\"",
    "soundType": "sad_trombone",
    "soundLabel": "This Is Fine 🎺",
    "likes": 32566
  },
  {
    "id": "meme-316466202",
    "title": "where monkey",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/58eyvu.png",
    "fallbackEmoji": "🎭",
    "caption": "Unbothered. Moisturized. In my lane. Focusing for 25 minutes straight.",
    "soundType": "sad_trombone",
    "soundLabel": "Sad Trombone 🎺",
    "likes": 15241
  },
  {
    "id": "meme-110163934",
    "title": "I Bet He's Thinking About Other Women",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/1tl71a.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Drinking 1 glass of water after 6 iced coffees. HEALF: STONKS ↗️",
    "soundType": "level_up",
    "soundLabel": "Level Up 🚀",
    "likes": 23018
  },
  {
    "id": "meme-533936279",
    "title": "Bell Curve",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/8tw3vb.png",
    "fallbackEmoji": "🎭",
    "caption": "Yes, I finished all priority missions and drank 2L of water today.",
    "soundType": "fanfare",
    "soundLabel": "Fanfare 🎺",
    "likes": 10561
  },
  {
    "id": "meme-77045868",
    "title": "Pawn Stars Best I Can Do",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/19vcz0.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Gentlemen, it is with great pleasure to inform you today's missions are crushed.",
    "soundType": "rickroll",
    "soundLabel": "Rickroll 🕺",
    "likes": 28727
  },
  {
    "id": "meme-195515965",
    "title": "Clown Applying Makeup",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/38el31.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Submitting the assignment at 11:59:59 PM with 0.1% mental energy remaining.",
    "soundType": "leo_laugh",
    "soundLabel": "Leo Laugh 🍷",
    "likes": 10466
  },
  {
    "id": "meme-171305372",
    "title": "Soldier protecting sleeping child",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/2tzo2k.jpg",
    "fallbackEmoji": "🎭",
    "caption": "When Pathly asks if I completed my evening reflection at 11:58 PM.",
    "soundType": "pedro",
    "soundLabel": "Pedro Pedro 🦝",
    "likes": 10481
  },
  {
    "id": "meme-284929871",
    "title": "They don't know",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/4pn1an.png",
    "fallbackEmoji": "🎭",
    "caption": "Setting a 25-minute dial and entering absolute deep work flow state.",
    "soundType": "emotional_damage",
    "soundLabel": "Emotional Damage 🩴",
    "likes": 28331
  },
  {
    "id": "meme-206151308",
    "title": "Spider Man Triple",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/3eqjd8.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Me checking off 3 easy tasks in 30 seconds to get the dopamine rolling.",
    "soundType": "vine_boom",
    "soundLabel": "Vine Boom 💥",
    "likes": 16886
  },
  {
    "id": "meme-354700819",
    "title": "Two guys on a bus",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/5v6gwj.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Unbothered. Moisturized. In my lane. Focusing for 25 minutes straight.",
    "soundType": "airhorn",
    "soundLabel": "Speed Airhorn 📢",
    "likes": 27113
  },
  {
    "id": "meme-148909805",
    "title": "Monkey Puppet",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/2gnnjh.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Drinking 1 glass of water after 6 iced coffees. HEALF: STONKS ↗️",
    "soundType": "pop",
    "soundLabel": "Pop Pop Pop 🍬",
    "likes": 28931
  },
  {
    "id": "meme-208915813",
    "title": "George Bush 9/11",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/3gdsh1.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Yes, I finished all priority missions and drank 2L of water today.",
    "soundType": "mario_coin",
    "soundLabel": "Mario Coin 🪙",
    "likes": 10464
  },
  {
    "id": "meme-137501417",
    "title": "Friendship ended",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/29v4rt.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Gentlemen, it is with great pleasure to inform you today's missions are crushed.",
    "soundType": "bruh",
    "soundLabel": "Bruh Synth 🗿",
    "likes": 21565
  },
  {
    "id": "meme-163573",
    "title": "Imagination Spongebob",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/3i7p.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Submitting the assignment at 11:59:59 PM with 0.1% mental energy remaining.",
    "soundType": "sad_trombone",
    "soundLabel": "Sad Trombone 🎺",
    "likes": 12380
  },
  {
    "id": "meme-89370399",
    "title": "Roll Safe Think About It",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/1h7in3.jpg",
    "fallbackEmoji": "🎭",
    "caption": "When Pathly asks if I completed my evening reflection at 11:58 PM.",
    "soundType": "level_up",
    "soundLabel": "Level Up 🚀",
    "likes": 25419
  },
  {
    "id": "meme-1035805",
    "title": "Boardroom Meeting Suggestion",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/m78d.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Setting a 25-minute dial and entering absolute deep work flow state.",
    "soundType": "fanfare",
    "soundLabel": "Fanfare 🎺",
    "likes": 21176
  },
  {
    "id": "meme-27813981",
    "title": "Hide the Pain Harold",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/gk5el.jpg",
    "fallbackEmoji": "😬",
    "caption": "Smiling through the pain of doing 10 pushups for the first time in 6 months.",
    "soundType": "bruh",
    "soundLabel": "Harold Bruh 🗿",
    "likes": 30022
  },
  {
    "id": "meme-216523697",
    "title": "All My Homies Hate",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/3kwur5.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Unbothered. Moisturized. In my lane. Focusing for 25 minutes straight.",
    "soundType": "leo_laugh",
    "soundLabel": "Leo Laugh 🍷",
    "likes": 10628
  },
  {
    "id": "meme-84341851",
    "title": "Evil Kermit",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/1e7ql7.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Drinking 1 glass of water after 6 iced coffees. HEALF: STONKS ↗️",
    "soundType": "pedro",
    "soundLabel": "Pedro Pedro 🦝",
    "likes": 10204
  },
  {
    "id": "meme-99683372",
    "title": "Sleeping Shaq",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/1nck6k.jpg",
    "fallbackEmoji": "👀",
    "caption": "Doing real chores: I sleep. Grinding XP for the pixel companion pet: REAL SH*T.",
    "soundType": "vine_boom",
    "soundLabel": "Shaq Boom 💥",
    "likes": 23919
  },
  {
    "id": "meme-119215120",
    "title": "Types of Headaches meme",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/1yz6z4.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Gentlemen, it is with great pleasure to inform you today's missions are crushed.",
    "soundType": "vine_boom",
    "soundLabel": "Vine Boom 💥",
    "likes": 17188
  },
  {
    "id": "meme-61556",
    "title": "Grandma Finds The Internet",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/1bhw.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Submitting the assignment at 11:59:59 PM with 0.1% mental energy remaining.",
    "soundType": "airhorn",
    "soundLabel": "Speed Airhorn 📢",
    "likes": 10767
  },
  {
    "id": "meme-371619279",
    "title": "Megamind no bitches",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/65939r.jpg",
    "fallbackEmoji": "🔵",
    "caption": "No completed missions? No deep focus? No streak shields?",
    "soundType": "vine_boom",
    "soundLabel": "Megamind Boom 💥",
    "likes": 17363
  },
  {
    "id": "meme-166969924",
    "title": "Flex Tape",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/2reqtg.png",
    "fallbackEmoji": "🎭",
    "caption": "Setting a 25-minute dial and entering absolute deep work flow state.",
    "soundType": "mario_coin",
    "soundLabel": "Mario Coin 🪙",
    "likes": 24229
  },
  {
    "id": "meme-133946291",
    "title": "You know, I'm something of a scientist myself",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/27qxmb.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Me checking off 3 easy tasks in 30 seconds to get the dopamine rolling.",
    "soundType": "bruh",
    "soundLabel": "Bruh Synth 🗿",
    "likes": 12751
  },
  {
    "id": "meme-224514655",
    "title": "Anime Girl Hiding from Terminator",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/3po4m7.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Unbothered. Moisturized. In my lane. Focusing for 25 minutes straight.",
    "soundType": "sad_trombone",
    "soundLabel": "Sad Trombone 🎺",
    "likes": 25137
  },
  {
    "id": "meme-114585149",
    "title": "Inhaling Seagull",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/1w7ygt.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Drinking 1 glass of water after 6 iced coffees. HEALF: STONKS ↗️",
    "soundType": "level_up",
    "soundLabel": "Level Up 🚀",
    "likes": 26370
  },
  {
    "id": "meme-247113703",
    "title": "A train hitting a school bus",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/434i5j.png",
    "fallbackEmoji": "🎭",
    "caption": "Yes, I finished all priority missions and drank 2L of water today.",
    "soundType": "fanfare",
    "soundLabel": "Fanfare 🎺",
    "likes": 27787
  },
  {
    "id": "meme-234202281",
    "title": "AJ Styles & Undertaker",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/3vfrmx.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Gentlemen, it is with great pleasure to inform you today's missions are crushed.",
    "soundType": "rickroll",
    "soundLabel": "Rickroll 🕺",
    "likes": 28177
  },
  {
    "id": "meme-187102311",
    "title": "Three-headed Dragon",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/33e92f.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Submitting the assignment at 11:59:59 PM with 0.1% mental energy remaining.",
    "soundType": "leo_laugh",
    "soundLabel": "Leo Laugh 🍷",
    "likes": 20054
  },
  {
    "id": "meme-221578498",
    "title": "Grant Gustin over grave",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/3nx72a.png",
    "fallbackEmoji": "🎭",
    "caption": "When Pathly asks if I completed my evening reflection at 11:58 PM.",
    "soundType": "pedro",
    "soundLabel": "Pedro Pedro 🦝",
    "likes": 21597
  },
  {
    "id": "meme-142009471",
    "title": "is this butterfly",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/2cjr7j.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Setting a 25-minute dial and entering absolute deep work flow state.",
    "soundType": "emotional_damage",
    "soundLabel": "Emotional Damage 🩴",
    "likes": 17739
  },
  {
    "id": "meme-129315248",
    "title": "No - Yes",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/24zoa8.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Me checking off 3 easy tasks in 30 seconds to get the dopamine rolling.",
    "soundType": "vine_boom",
    "soundLabel": "Vine Boom 💥",
    "likes": 18961
  },
  {
    "id": "meme-110133729",
    "title": "spiderman pointing at spiderman",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/1tkjq9.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Unbothered. Moisturized. In my lane. Focusing for 25 minutes straight.",
    "soundType": "airhorn",
    "soundLabel": "Speed Airhorn 📢",
    "likes": 23581
  },
  {
    "id": "meme-155067746",
    "title": "Surprised Pikachu",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/2kbn1e.jpg",
    "fallbackEmoji": "⚡",
    "caption": "Procrastinates for 6 hours -> Realizes assignment is due -> Surprised Pikachu face.",
    "soundType": "vine_boom",
    "soundLabel": "Pikachu Boom 💥",
    "likes": 29838
  },
  {
    "id": "meme-145139900",
    "title": "Scooby doo mask reveal",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/2eeunw.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Yes, I finished all priority missions and drank 2L of water today.",
    "soundType": "mario_coin",
    "soundLabel": "Mario Coin 🪙",
    "likes": 21578
  },
  {
    "id": "meme-101956210",
    "title": "Whisper and Goosebumps",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/1op9wy.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Gentlemen, it is with great pleasure to inform you today's missions are crushed.",
    "soundType": "bruh",
    "soundLabel": "Bruh Synth 🗿",
    "likes": 23742
  },
  {
    "id": "meme-119139145",
    "title": "Blank Nut Button",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/1yxkcp.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Submitting the assignment at 11:59:59 PM with 0.1% mental energy remaining.",
    "soundType": "sad_trombone",
    "soundLabel": "Sad Trombone 🎺",
    "likes": 29553
  },
  {
    "id": "meme-226297822",
    "title": "Panik Kalm Panik",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/3qqcim.png",
    "fallbackEmoji": "🎭",
    "caption": "When Pathly asks if I completed my evening reflection at 11:58 PM.",
    "soundType": "level_up",
    "soundLabel": "Level Up 🚀",
    "likes": 20775
  },
  {
    "id": "meme-61520",
    "title": "Futurama Fry",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/1bgw.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Setting a 25-minute dial and entering absolute deep work flow state.",
    "soundType": "fanfare",
    "soundLabel": "Fanfare 🎺",
    "likes": 19969
  },
  {
    "id": "meme-162372564",
    "title": "Domino Effect",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/2oo7h0.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Me checking off 3 easy tasks in 30 seconds to get the dopamine rolling.",
    "soundType": "rickroll",
    "soundLabel": "Rickroll 🕺",
    "likes": 26592
  },
  {
    "id": "meme-259237855",
    "title": "Laughing Leo",
    "category": "Chad & Lore",
    "imageUrl": "https://i.imgflip.com/4acd7j.png",
    "fallbackEmoji": "🍷",
    "caption": "Watching everyone else panic on Sunday night when all your Pathly tasks are completed.",
    "soundType": "leo_laugh",
    "soundLabel": "Leo Laugh 🍷",
    "likes": 32590
  },
  {
    "id": "meme-135678846",
    "title": "Who Killed Hannibal",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/28s2gu.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Drinking 1 glass of water after 6 iced coffees. HEALF: STONKS ↗️",
    "soundType": "pedro",
    "soundLabel": "Pedro Pedro 🦝",
    "likes": 27537
  },
  {
    "id": "meme-309668311",
    "title": "Two Paths",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/54d9lj.png",
    "fallbackEmoji": "🎭",
    "caption": "Yes, I finished all priority missions and drank 2L of water today.",
    "soundType": "emotional_damage",
    "soundLabel": "Emotional Damage 🩴",
    "likes": 25089
  },
  {
    "id": "meme-29562797",
    "title": "I'm The Captain Now",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/hlmst.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Gentlemen, it is with great pleasure to inform you today's missions are crushed.",
    "soundType": "vine_boom",
    "soundLabel": "Vine Boom 💥",
    "likes": 24260
  },
  {
    "id": "meme-101288",
    "title": "Third World Skeptical Kid",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/265k.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Submitting the assignment at 11:59:59 PM with 0.1% mental energy remaining.",
    "soundType": "airhorn",
    "soundLabel": "Speed Airhorn 📢",
    "likes": 14116
  },
  {
    "id": "meme-72525473",
    "title": "say the line bart! simpsons",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/176h0h.jpg",
    "fallbackEmoji": "🎭",
    "caption": "When Pathly asks if I completed my evening reflection at 11:58 PM.",
    "soundType": "pop",
    "soundLabel": "Pop Pop Pop 🍬",
    "likes": 25598
  },
  {
    "id": "meme-14371066",
    "title": "Star Wars Yoda",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/8k0sa.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Setting a 25-minute dial and entering absolute deep work flow state.",
    "soundType": "mario_coin",
    "soundLabel": "Mario Coin 🪙",
    "likes": 20922
  },
  {
    "id": "meme-91998305",
    "title": "Drake Blank",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/1iruch.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Me checking off 3 easy tasks in 30 seconds to get the dopamine rolling.",
    "soundType": "bruh",
    "soundLabel": "Bruh Synth 🗿",
    "likes": 16938
  },
  {
    "id": "meme-29617627",
    "title": "Look At Me",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/hmt3v.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Unbothered. Moisturized. In my lane. Focusing for 25 minutes straight.",
    "soundType": "sad_trombone",
    "soundLabel": "Sad Trombone 🎺",
    "likes": 25253
  },
  {
    "id": "meme-92084495",
    "title": "Charlie Conspiracy (Always Sunny in Philidelphia)",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/1itoun.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Drinking 1 glass of water after 6 iced coffees. HEALF: STONKS ↗️",
    "soundType": "level_up",
    "soundLabel": "Level Up 🚀",
    "likes": 15417
  },
  {
    "id": "meme-91545132",
    "title": "Trump Bill Signing",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/1ii4oc.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Yes, I finished all priority missions and drank 2L of water today.",
    "soundType": "fanfare",
    "soundLabel": "Fanfare 🎺",
    "likes": 22546
  },
  {
    "id": "meme-360597639",
    "title": "whe i'm in a competition and my opponent is",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/5youx3.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Gentlemen, it is with great pleasure to inform you today's missions are crushed.",
    "soundType": "rickroll",
    "soundLabel": "Rickroll 🕺",
    "likes": 13681
  },
  {
    "id": "meme-104893621",
    "title": "Grim Reaper Knocking Door",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/1qg8fp.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Submitting the assignment at 11:59:59 PM with 0.1% mental energy remaining.",
    "soundType": "leo_laugh",
    "soundLabel": "Leo Laugh 🍷",
    "likes": 27921
  },
  {
    "id": "meme-101716",
    "title": "Yo Dawg Heard You",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/26hg.jpg",
    "fallbackEmoji": "🎭",
    "caption": "When Pathly asks if I completed my evening reflection at 11:58 PM.",
    "soundType": "pedro",
    "soundLabel": "Pedro Pedro 🦝",
    "likes": 22101
  },
  {
    "id": "meme-342785297",
    "title": "Gus Fring we are not the same",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/5o32tt.png",
    "fallbackEmoji": "🎭",
    "caption": "Setting a 25-minute dial and entering absolute deep work flow state.",
    "soundType": "emotional_damage",
    "soundLabel": "Emotional Damage 🩴",
    "likes": 10424
  },
  {
    "id": "meme-123999232",
    "title": "The Scroll Of Truth",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/21tqf4.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Me checking off 3 easy tasks in 30 seconds to get the dopamine rolling.",
    "soundType": "vine_boom",
    "soundLabel": "Vine Boom 💥",
    "likes": 11502
  },
  {
    "id": "meme-20007896",
    "title": "c'mon do something",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/bwu6w.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Unbothered. Moisturized. In my lane. Focusing for 25 minutes straight.",
    "soundType": "airhorn",
    "soundLabel": "Speed Airhorn 📢",
    "likes": 17659
  },
  {
    "id": "meme-249257686",
    "title": "Bugs bunny communist",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/44eggm.png",
    "fallbackEmoji": "🎭",
    "caption": "Drinking 1 glass of water after 6 iced coffees. HEALF: STONKS ↗️",
    "soundType": "pop",
    "soundLabel": "Pop Pop Pop 🍬",
    "likes": 20781
  },
  {
    "id": "meme-5496396",
    "title": "Leonardo Dicaprio Cheers",
    "category": "Chad & Lore",
    "imageUrl": "https://i.imgflip.com/39t1o.jpg",
    "fallbackEmoji": "🍷",
    "caption": "Cheers to completing 1 focus session and treating yourself to an 8-hour nap.",
    "soundType": "leo_laugh",
    "soundLabel": "Leo Cheers 🍷",
    "likes": 16059
  },
  {
    "id": "meme-50421420",
    "title": "Disappointed Black Guy",
    "category": "Classic Internet",
    "imageUrl": "https://i.imgflip.com/u0pf0.jpg",
    "fallbackEmoji": "🎭",
    "caption": "Gentlemen, it is with great pleasure to inform you today's missions are crushed.",
    "soundType": "bruh",
    "soundLabel": "Bruh Synth 🗿",
    "likes": 13584
  }
];

export function getRandomMeme(currentId?: string): MemeItem {
  let index = Math.floor(Math.random() * MEMES_COLLECTION.length);
  
  if (currentId && MEMES_COLLECTION.length > 1) {
    while (MEMES_COLLECTION[index].id === currentId) {
      index = Math.floor(Math.random() * MEMES_COLLECTION.length);
    }
  }
  
  return MEMES_COLLECTION[index];
}
