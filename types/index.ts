export interface Team {
  TeamName: string;
  password?: string;
  leaderName?: string;
  score: number;
  registered: boolean;
  isActive?: boolean;
  lastActive?: Date;
  deviceId?: string;
}

export interface ActiveSession {
  teamName: string;
  deviceId: string;
  password?: string;
  loginTime: Date;
  logoutTime?: Date;
  score: number;
  round: number;
  currentQIndex: number;
  answeredInR1: number[];
  tabSwitches: number;
  active: boolean;
  isFinished?: boolean;
  isRound1Completed?: boolean;
}

export interface EventSettings {
  round1Enabled: boolean;
  globalTimerActive: boolean;
  globalTimeLeft: number;
  timerEndTime: number | null;
}

export type ViewState = 
  | "role-selection" 
  | "student-login" 
  | "admin-login" 
  | "game" 
  | "admin-dashboard";
