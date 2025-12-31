export const calculateAVG = (stats: Stats[], numOfRank: number) => {
  const sortedStats = stats
    .sort((s1, s2) => (s2.hits + s2.doubles + s2.triples + s2.homeruns) / s2.atBats - (s1.hits + s1.doubles + s1.triples + s1.homeruns) / s1.atBats)
    .slice(0, 5);
  let rankList: RankData[] = [];

  sortedStats.forEach((stat) => {
    rankList.push({
      name: stat.name as string,
      value: ((stat.hits + stat.doubles + stat.triples + stat.homeruns) / stat.atBats).toFixed(3),
    });
  });

  return rankList;
};

export const calculateHits = (stats: Stats[], numOfRank: number) => {
  const sortedStats = stats
    .sort((s1, s2) => (s2.hits + s2.doubles + s2.triples + s2.homeruns) - (s1.hits + s1.doubles + s1.triples + s1.homeruns))
    .slice(0, 5);
  let rankList: RankData[] = [];

  sortedStats.forEach((stat) => {
    rankList.push({
      name: stat.name as string,
      value: (stat.hits + stat.doubles + stat.triples + stat.homeruns).toFixed(0),
    });
  });

  return rankList;
};

export const calculateStats = (stats: Stats[], numOfRank: number, key: keyof Stats) => {
  const sortedStats = stats
    .sort((s1, s2) => s2[key] - s1[key])
    .slice(0, numOfRank);
  let rankList: RankData[] = [];

  sortedStats.forEach((stat) => {
    rankList.push({
      name: stat.name as string,
      value: key === "obp" || key === "ops" ? stat[key].toFixed(3) : stat[key],
    });
  });

  return rankList;
};