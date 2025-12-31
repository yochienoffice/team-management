type AuthenticationRequest = {
  email: string;
  password: string;
};

type AuthenticationResponse = {
  token: string;
  message: string;
};

type RegisterRequest = {
  restaurantId: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

type User = {
  id?: number;
  number: number;
  name: string;
  identity: string;
  birthday: string;
  role?: UserRole;
  displaySeq: number;
};

type Team = {
  id: number;
  name: string;
  description?: string;
  notes?: string;
};

type Stats = {
  id?: number;
  gameId?: number;
  playerId?: number;
  pa: number;
  atBats: number;
  hits: number;
  rbis: number;
  runs: number;
  strikeouts: number;
  walks: number;
  doubles: number;
  triples: number;
  homeruns: number;
  notes?: string;
  name?: string;
  number?: number;
  doublePlays?: number;
  sacrifices?: number;
};

type RankCardProps = {
  title: string;
  description?: string;
  data: Array<RankData>;
  className?: string;
};

type GameCardProps = {
  game: Game;
  team: Team;
  league?: Schedule;
  className?: string;
};

type RankData = {
  name: string;
  value: string | number;
};

type Schedule = {
  id: number;
  name: string;
  season: string;
  startDate: string;
  endDate: string;
  notes?: string;
};

type Game = {
  id: number;
  leagueId: number;
  date: Date;
  location: string;
  opponent: string;
  isHome: boolean;
  score: number;
  opponentScore: number;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
};

type Lineup = { 
  name: string;
  position?: string;
  number: number;
};

type Route = {
  name: string;
  url?: string;
  icon?: any;
  submenu?: Route[];
  collapsible?: boolean;
};

type TimeRange = {
  weekDay: DayOfWeek;
  min: string;
  max: string;
};

type HsTimePickerRef = {
  resetTime: (value: string) => void;
};

type PlayerSimple = {
  number: number;
  displayName: string;
  birthDate: string;
};
