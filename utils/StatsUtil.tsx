export const calculateAVG = (stats: Stats[]) => {
  const atBats = stats.reduce((sum, stat) => sum + stat.atBats, 0);
  const hits = stats.reduce((sum, stat) => sum + stat.hits, 0);
  const doubles = stats.reduce((sum, stat) => sum + stat.doubles, 0);
  const triples = stats.reduce((sum, stat) => sum + stat.triples, 0);
  const homeruns = stats.reduce((sum, stat) => sum + stat.homeruns, 0);

  const totalHits = hits + doubles + triples + homeruns;

  return atBats > 0 ? (totalHits / atBats).toFixed(3) : "0.000";
};

// 計算方式: (安打數 + 四壞數) / 打席數
export const calculateOBP = (stats: Stats[]) => {
  const pa = stats.reduce((sum, stat) => sum + stat.pa, 0);
  const hits = stats.reduce((sum, stat) => sum + stat.hits, 0);
  const doubles = stats.reduce((sum, stat) => sum + stat.doubles, 0);
  const triples = stats.reduce((sum, stat) => sum + stat.triples, 0);
  const homeruns = stats.reduce((sum, stat) => sum + stat.homeruns, 0);
  const walks = stats.reduce((sum, stat) => sum + stat.walks, 0);
  const totalHits = hits + doubles + triples + homeruns;
  return pa > 0 ? ((totalHits + walks) / pa).toFixed(3) : "0.000";
};

// 計算方式: OPS=OBP+SLG;
export const calculateOPS = (stats: Stats[]) => {
  const obp = parseFloat(calculateOBP(stats));
  const slg = parseFloat(calculateSLG(stats));
  return (obp + slg).toFixed(3);
};

// SLG = (1B+2*2B+3*3B+4*HR)/AB
export const calculateSLG = (stats: Stats[]) => {
  const atBats = stats.reduce((sum, stat) => sum + stat.atBats, 0);
  const hits = stats.reduce((sum, stat) => sum + stat.hits, 0);
  const doubles = stats.reduce((sum, stat) => sum + stat.doubles, 0);
  const triples = stats.reduce((sum, stat) => sum + stat.triples, 0);
  const homeruns = stats.reduce((sum, stat) => sum + stat.homeruns, 0);
  const totalBaseHits = hits + doubles * 2 + triples * 3 + homeruns * 4;

  return atBats > 0 ? (totalBaseHits / atBats).toFixed(3) : "0.000";
};