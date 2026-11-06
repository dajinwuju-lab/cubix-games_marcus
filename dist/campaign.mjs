export const MAX_UPGRADE=6;
export const enemyTypes=[
 {name:'Flu virus',color:0xb4d058,hp:32,speed:2.2,ability:'dash',tip:'Rushes forward after a warning flash.'},
 {name:'Acid bacterium',color:0xe49e64,hp:40,speed:1.6,ability:'spit',tip:'Fires acid at your last position.'},
 {name:'Plague bacterium',color:0x9b78cd,hp:48,speed:1.8,ability:'poison',tip:'Leaves toxic pools. Keep moving.'},
 {name:'Cancer cell',color:0xde79ab,hp:60,speed:1.3,ability:'split',tip:'Divides once into two smaller cancer cells.'},
 {name:'Armored bacterium',color:0x74afbb,hp:70,speed:1.2,ability:'armor',tip:'Its shell absorbs 35% of antibody damage.'},
 {name:'Parasite',color:0xe1ba6b,hp:45,speed:2.6,ability:'leech',tip:'Heals itself when it touches you.'},
 {name:'Fungal spore',color:0xe5b8da,hp:38,speed:1.5,ability:'burst',tip:'Shoots spores in every direction.'},
 {name:'Rhinovirus',color:0x89d9aa,hp:24,speed:3.2,ability:'swarm',tip:'Small, quick, and hard to outrun.'}
];
const raw=[
 ['Lungs','The first breath','Flu Overlord',0x274d48,[0,7,1],'air'],
 ['Gut','Restore the balance','Gut Goliath',0x4d4233,[1,5,2],'acid'],
 ['Heart','Defend the heartbeat','Viral Core',0x4b3042,[0,4,7],'pulse'],
 ['Liver','The filter under siege','Toxin Titan',0x594037,[2,3,4],'toxin'],
 ['Kidneys','Clean the stream','Crystal Crusher',0x493a58,[4,1,5],'current'],
 ['Brain','Protect the command center','Neural Invader',0x3f455e,[0,3,6],'pulse'],
 ['Stomach','Into the acid','Acid Monarch',0x4c5232,[1,5,4],'acid'],
 ['Pancreas','A delicate balance','Sugar Stalker',0x57483a,[3,1,7],'toxin'],
 ['Spleen','Blood patrol','Scarlet Reaper',0x523440,[2,4,5],'pulse'],
 ['Skin','Hold the outer wall','Spore Colossus',0x5d4e43,[6,1,3],'toxin'],
 ['Bladder','Clear the reservoir','Reservoir Warden',0x3b5260,[1,4,5],'current'],
 ['Gallbladder','Bile basin','Bile Behemoth',0x465635,[4,2,1],'acid'],
 ['Eyes','Keep the light','Prism Parasite',0x375660,[5,0,6],'pulse'],
 ['Ears','Sound the alarm','Echo Ravager',0x514858,[1,6,7],'pulse'],
 ['Nose','Guard the gateway','Rhinovirus Regent',0x4b5950,[7,0,6],'air'],
 ['Mouth','First line of defense','Biofilm Baron',0x57444b,[1,6,4],'acid'],
 ['Esophagus','The narrow passage','Tunnel Tyrant',0x52444a,[6,3,5],'current'],
 ['Trachea','Clear the windpipe','Airway Annihilator',0x315450,[0,7,2],'air'],
 ['Thyroid','Protect the signals','Hormone Hijacker',0x4b485f,[3,4,0],'pulse'],
 ['Thymus','Training ground','T-cell Trickster',0x355b51,[2,0,4],'toxin'],
 ['Appendix','A hidden outpost','Appendix Abomination',0x514936,[1,5,2],'acid'],
 ['Bone marrow','Cell factory','Marrow Menace',0x5a3e47,[3,4,2],'pulse'],
 ['Lymph nodes','The immune crossroads','Plague Sovereign',0x355746,[2,6,3],'toxin'],
 ['Adrenal glands','Adrenaline rush','Adrenal Ambusher',0x5c4e33,[7,5,0],'current'],
 ['Pituitary gland','The master signals','Signal Saboteur',0x474561,[3,0,4],'pulse'],
 ['Pineal gland','The night watch','Midnight Mold',0x353e59,[6,5,3],'toxin'],
 ['Salivary glands','Flush the invaders','Saliva Swarm',0x3e5856,[1,7,6],'current'],
 ['Reproductive organs','Protect new beginnings','Mutation Monarch',0x544253,[3,4,5],'pulse'],
 ['Blood vessels','Whole-body patrol','Bloodstream Blight',0x58373c,[2,0,7],'current'],
 ['Whole-body finale','One body. One last stand.','Pandemic Prime',0x343c53,[0,1,2,3,4,5,6,7],'toxin']
];
export const levels=raw.map(([name,sub,boss,color,enemies,hazard],i)=>({name,sub,boss,color,enemies,hazard,waves:i<10?6:i<20?7:8,brief:`${sub}. Face ${enemyTypes[enemies[0]].name.toLowerCase()} attacks, survive ${i<10?6:i<20?7:8} waves, and defeat ${boss}.`}));
export function normalizeSave(raw={}){const clamp=(n,max)=>Math.min(max,Math.max(0,Number.isFinite(n)?Math.floor(n):0));const saved={organelles:Array.from({length:2},(_,i)=>clamp(raw?.organelles?.[i],MAX_UPGRADE)),reserve:clamp(raw?.reserve,1e9),dnaGrowth:clamp(raw?.dnaGrowth,24),dna:clamp(raw?.dna,1e9),unlocked:clamp(raw?.unlocked,levels.length-1),up:Array.from({length:4},(_,i)=>clamp(raw?.up?.[i],MAX_UPGRADE))};syncDnaGrowth(saved);return saved}
export const upgradeCost=level=>75+level*75;
export function buyUpgrade(s,i){if(!Number.isInteger(i)||i<0||i>=4||s.up[i]>=MAX_UPGRADE||s.dna<upgradeCost(s.up[i]))return false;s.dna-=upgradeCost(s.up[i]);s.up[i]++;refillDNA(s);return true}
export function createUpgradeNotifier(){const seen=new Set();return s=>{let fresh=false;s.up.forEach((lv,i)=>{const k=i+':'+lv;if(lv<MAX_UPGRADE&&s.dna>=upgradeCost(lv)&&!seen.has(k)){seen.add(k);fresh=true}});return fresh}}
export function waveSpec(stage,wave){const final=wave===levels[stage].waves,mini=wave===3;const scale=1+stage*.085;return {rank:final?'boss':mini?'mini':'normal',health:Math.round((final?500:mini?240:36)*scale),count:final?5:mini?6:Math.min(15,6+wave+Math.floor(stage/5)),scale}}

export function syncDnaGrowth(s){const completed=s.up.reduce((a,b)=>a+b,0);const ready=s.up.some(lv=>lv<MAX_UPGRADE&&s.dna>=upgradeCost(lv));s.dnaGrowth=Math.max(s.dnaGrowth||0,Math.min(24,completed+(ready?1:0)));return s.dnaGrowth}

export const cellCapacity=s=>600+300*(s.organelles?.[0]||0);
export const movementSpeed=s=>Math.round((7+.7*(s.organelles?.[1]||0))*10)/10;
export function refillDNA(s){const amount=Math.min(Math.max(0,cellCapacity(s)-s.dna),s.reserve||0);s.dna+=amount;s.reserve=(s.reserve||0)-amount;return amount}
export function awardDNA(s,amount){const value=Math.max(0,Math.floor(amount));const stored=Math.min(value,Math.max(0,cellCapacity(s)-s.dna));s.dna+=stored;s.reserve=(s.reserve||0)+value-stored;return stored}
export function buyOrganelle(s,i){if(!Array.isArray(s.organelles)||!Number.isInteger(i)||i<0||i>1||s.organelles[i]>=MAX_UPGRADE)return false;const cost=upgradeCost(s.organelles[i]);if(s.dna<cost)return false;s.dna-=cost;s.organelles[i]++;refillDNA(s);return true}
