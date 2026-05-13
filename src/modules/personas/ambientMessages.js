const { PERSONAS } = require('../../config/personas');

const AMBIENT_POOLS = {
  Valheim: [
    '*caws softly* The mist parts for those who prove worthy.',
    'A drake circles the mountain. Business as usual.',
    'The elder tree groans. It has seen this before.',
    'Shadows move in the black forest. Probably just a greyling.',
    'The wind carries the scent of honey and iron.',
    '*tilts head* Someone left a portal open again.',
    'A fine day to sail. If the serpent permits.',
    'The swamp is damp tonight. As it always is.',
    '*preens feathers* Mead halls echo with tales of your deeds.',
    'The mountains grow colder. Trolls grow bolder.',
  ],
  'Project Zomboid': [
    'This is a test of the Emergency Broadcast System. Just kidding. There is no system.',
    'Static. Silence. The helicopter grows faint.',
    'Weather report: Overcast with a chance of moans.',
    'Signal check. If you can hear this, stay indoors.',
    '*crackle* Day 73. Someone raided the gun store. Again.',
    'Transmission: The mall is not safe. It was never safe.',
    '*faint radio hum* A generator sputters somewhere in Muldraugh.',
    'Word on the air: XP multiplier still set to real life.',
    'Battery low. Conserve your energy. And your bullets.',
    'Repeat broadcast: Check your windows. Check your doors. Check your six.',
  ],
  ICARUS: [
    'Orbital scan complete. Still no sign of exotics in your quadrant.',
    'Atmospheric pressure nominal. Your suffering is within expected parameters.',
    'Drop pod telemetry: You are exactly where you deserve to be.',
    'Life support holding. Mostly.',
    'ProTip from HQ: The local fauna does not care about your mission.',
    'Solar flare forecast: Mild. Probably.',
    'Inventory sync lag detected. No, that worm *is* actually that big.',
    'Weather advisory: Storms are coming. They are always coming.',
    '*crackling comms* Your insurance does not cover bear attacks.',
    'Orbital reminder: Deep breaths. CO2 scrubbers are optional.',
  ],
  Windrose: [
    'Aye, the wind fills the sails and the rum fills the cups.',
    'The Kraken sleeps today. Let us not wake it.',
    '*taps barrel* Fresh grog in the galley. First come first served.',
    'Land ho! ... False alarm. Just a very large turtle.',
    'The map says X marks the spot. The map is a liar.',
    'Arr, someone left the anchor up again.',
    'Fair winds and following seas. Or whatever passes for fair around here.',
    'The crew mutinied over the dinner menu. Again.',
    'A fine haul today. Mostly splinters and soggy biscuits.',
    '*polishes spyglass* Adventure waits for no scallywag.',
  ],
  Minecraft: [
    'Another quiet day in the blocky realm. Creepers disagree.',
    'Redstone torch flickers. Your contraption will definitely work this time.',
    '*places flower* The world could use more beauty.',
    'A creeper hisses in the distance. Just a reminder.',
    'The sun rises. The zombies sizzle. Balance is restored.',
    'Someone left a single block of dirt in the nether portal room.',
    '*chisels block* Every masterpiece starts with a single stone.',
    'Your bed is missing. It is now a wandering trader.',
    'The sheep regrew its wool. The cycle continues.',
    'Tip: Do not dig straight down. You will not. But you will.',
  ],
  '7 Days to Die': [
    'Blood moon HUD warning: T-minus 6 days. Start panicking.',
    '*static* Horde night prep reminder: More bullets. More spikes. More prayers.',
    'Structural integrity: Questionable. Just like your build plan.',
    'Zed activity elevated in the wasteland. As if it is ever low.',
    'Day 14. Your base is still standing. Mostly.',
    'Radiated zed spotted. That is a "nope" from Bunker Broadcast.',
    'Airdrop inbound. The local zeds are also invited.',
    'You hear a faint buzzing. Screamers are looking for friends.',
    'Tool durability: Critical. You were warned.',
    '*crackle* The trader is out of ammo. Again. Good luck.',
  ],
};

function pickMessage(game) {
  const pool = AMBIENT_POOLS[game];
  if (!pool || pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getPersonaForGame(game) {
  return PERSONAS[game] || null;
}

module.exports = { pickMessage, getPersonaForGame, AMBIENT_POOLS };
