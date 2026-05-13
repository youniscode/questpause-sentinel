const TRIGGER_MAP = {
  Valheim: {
    keywords: ['troll', 'ward', 'boss', 'raid', 'portal', 'base'],
    replies: {
      troll: [
        'The troll has submitted another aggressive building inspection. Your walls did not pass.',
        'A troll has filed a complaint about your roof. It was too roof-like.',
        'The local troll union has declared your base a public project. You are now the project.',
      ],
      ward: [
        'Your ward is working. Unfortunately, so is everything else.',
        'The ward glows confidently. It has no idea what it is protecting.',
        'A ward only keeps things out if you remember to build walls too. Just saying.',
      ],
      boss: [
        'The boss is coming. Have you considered running in the opposite direction?',
        'A boss has been sighted. Recommending emergency pants.',
        'The elders say the boss can be defeated. The elders are often wrong.',
      ],
      raid: [
        'A raid approaches. The greydwarves have formed a committee.',
        'The ground shakes. Probably the greydwarves arguing about battle formations.',
        'Raid incoming. Your base will either hold or become a crater. Exciting.',
      ],
      portal: [
        'The portal is connected. No one checked where to.',
        'You step through the portal. The other side is slightly more on fire.',
        'Portal established. Destination: vaguely where you wanted to go.',
      ],
      base: [
        'Your base is a statement. The statement is: "I tried."',
        'The base is functional. The word "functional" is doing a lot of work here.',
        'A fine base. The fine is 50 stones for improper roofing.',
      ],
    },
  },
  'Project Zomboid': {
    keywords: ['bite', 'bitten', 'zombie', 'car crash', 'loot', 'horde'],
    replies: {
      bite: [
        'That bite is not ideal, survivor. Try not to panic loudly. It attracts both zombies and bad decisions.',
        'A bite has been reported. The recommended treatment is acceptance.',
        'Bite detected. The good news is you will not worry about groceries anymore.',
      ],
      bitten: [
        'If you have been bitten, please scream quietly. We are trying to sleep.',
        'Bitten. The window for denial is closing rapidly.',
        'Knox Radio reminds you: being bitten is just a personality change.',
      ],
      zombie: [
        'There is a zombie outside. It was also inside yesterday. It did not knock.',
        'Zombie spotted. They are not here to borrow sugar.',
        'The zombie is not lost. It knows exactly where you are.',
      ],
      'car crash': [
        'A car crash has been reported. The zombie at the wheel did not survive. Again.',
        'Car crash. The vehicle is now a stationary object with strong opinions about trees.',
        'You crashed the car. It is now a very heavy chair.',
      ],
      loot: [
        'Loot found. It is a single spoon. The spoon has seen things.',
        'You found loot. It is slightly worse than what you already have.',
        'Loot acquired: one half-eaten bag of chips and existential dread.',
      ],
      horde: [
        'A horde is approaching. They are not here for the cuisine.',
        'Horde detected. The recommended countermeasure is running. Running well.',
        'The horde has formed a line. They are not waiting for tickets.',
      ],
    },
  },
  ICARUS: {
    keywords: ['bear', 'wolf', 'storm', 'prospect', 'mission', 'drop'],
    replies: {
      bear: [
        'The bear has completed its objective. Recommend armor, distance, and fewer negotiations with wildlife.',
        'A bear has been spotted. It is not interested in trade agreements.',
        'The bear was not scared by your torch. Bears have strong opinions about fire.',
      ],
      wolf: [
        'Wolf pack on approach. They are not here for the scenery.',
        'A wolf has joined the party. It was not invited.',
        'The wolves are coordinating. That is the scary part.',
      ],
      storm: [
        'Storm incoming. The weather has decided you are the problem today.',
        'A storm is approaching. Your shelter is a suggestion to the wind.',
        'Storm warning. The local wildlife is also looking for shelter. Good luck.',
      ],
      prospect: [
        'Prospect started. The objective is vague. The danger is not.',
        'New prospect logged. Mission: survive. Reward: continuing to survive.',
        'Prospect accepted. Success is optional. Death is not.',
      ],
      mission: [
        'Mission parameters unclear. Recommend pointing at the horizon and going.',
        'Mission brief: go somewhere dangerous, do something risky, return if possible.',
        'Your mission is simple. That is what they said before everything caught fire.',
      ],
      drop: [
        'Drop pod deployed. Landing zone is approximately where you were aiming.',
        'Drop complete. The ground was less forgiving than expected.',
        'You have landed. The local wildlife is already scheduling your departure.',
      ],
    },
  },
  Windrose: {
    keywords: ['ship', 'loot', 'treasure', 'crew', 'pirate', 'trade'],
    replies: {
      ship: [
        'The ship is still floating. That counts as a good day.',
        'Your ship has been spotted. By everyone. Including the kraken.',
        'A fine vessel. It only leaks a little. Mostly in the parts below water.',
      ],
      loot: [
        'If the loot is missing, it was either stolen, misplaced, or promoted to treasure.',
        'Loot acquired. The previous owners no longer need it. They are very dead.',
        'That is not loot. That is someone else problem in a box.',
      ],
      treasure: [
        'Treasure found. It is mostly maps to other treasure you will also find.',
        'The treasure was exactly where you left it. Sadly, someone else left it there too.',
        'Treasure chest opened. Contents: dreams and a single gold coin.',
      ],
      crew: [
        'The crew is muttering. That is either a mutiny or a review of last nights tavern.',
        'Crew morale is stable. That means no one has quit in the last hour.',
        'Your crew is loyal. Loyal until a better ship sails by.',
      ],
      pirate: [
        'A pirate approaches. They are not here for the fishing.',
        'Pirate ship on the horizon. They are waving. With swords.',
        'The pirate demands your cargo. Recommend giving them something. Anything.',
      ],
      trade: [
        'Trade route established. The other party is also interested in not fighting.',
        'A trade has been completed. Both parties left slightly unhappy. That is a deal.',
        'Trade offer received. They want your goods. You want their goods. Negotiations begin.',
      ],
    },
  },
  Minecraft: {
    keywords: ['creeper', 'diamond', 'nether', 'village', 'base', 'lava'],
    replies: {
      creeper: [
        'The creeper has approved an unexpected renovation. No permits were filed.',
        'A creeper has been spotted. It is very excited to meet your building.',
        'The creeper hisses. It is giving feedback on your architectural choices.',
      ],
      diamond: [
        'Diamond found. Your inventory now contains responsibility.',
        'You found a diamond. The local creepers have taken notice.',
        'A diamond has been unearthed. The ground is already planning its replacement.',
      ],
      nether: [
        'The Nether awaits. It is hot, angry, and full of things that do not like you.',
        'Entering the Nether. The temperature is best described as "regrettable."',
        'The Nether is a lovely place if you enjoy lava, fire, and immediate danger.',
      ],
      village: [
        'A village has been located. The villagers are already discussing your prices.',
        'Village found. Population: several. Friendliness: negotiable.',
        'The villagers are trading. They want your entire inventory for one emerald.',
      ],
      base: [
        'Your base is impressive. The creepers agree. They want a tour.',
        'A fine base. The torch budget alone funds entire ecosystems.',
        'The base is secure. Mostly. The dark corners are still voting.',
      ],
      lava: [
        'Lava detected. Your building plans may need revision.',
        'That lava is not decorative. It is a health and safety violation.',
        'Lava pool found. Your inventory of buckets is suddenly very relevant.',
      ],
    },
  },
  '7 Days to Die': {
    keywords: ['horde', 'blood moon', 'ammo', 'base', 'zombie', 'loot'],
    replies: {
      horde: [
        'Horde night is coming. Your walls have been informed. They are nervous.',
        'A horde is forming. They are not coming for the barbecue.',
        'The horde approaches. Your base will either hold or become a memory.',
      ],
      'blood moon': [
        'Blood moon rising. The zombies are also rising. Coincidence? Probably not.',
        'The blood moon triggers. The undead have marked their calendars.',
        'Blood moon detected. It is going to be a long night. And a short base.',
      ],
      ammo: [
        'Ammo reserves are low. Recommended backup plan: arrows, panic, and blaming logistics.',
        'You are low on ammo. The horde finds this information encouraging.',
        'Ammo count critical. Recommend melee. The melee also costs health.',
      ],
      base: [
        'Your base has been inspected by the horde. The review is pending.',
        'The base is fortified. The question is fortified against what. The answer is everything.',
        'Base status: standing. For now. The horde is taking notes.',
      ],
      zombie: [
        'Zombie detected. It does not care about your day.',
        'A zombie is at the door. It forgot to knock again.',
        'Zombie spotted. It is not lost. It knows exactly where you sleep.',
      ],
      loot: [
        'Loot found. It is a single bullet. One. Single. Bullet.',
        'You searched the container. It contained dirt and disappointment.',
        'Loot acquired: one quality item and seven pieces of garbage. As expected.',
      ],
    },
  },
};

module.exports = { TRIGGER_MAP };
