export type User = {
  username: string;
  userRole: string;
  userId: string;
};
export type Team = {
  isInBO: boolean;
  sensorId: string;
  teamName: string;
  members: User[];
};

export type Teams = {
  [teamId: string]: Team;
};
