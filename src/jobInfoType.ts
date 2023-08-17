export type TJobInfo = {
  _class: string;
  actions: TJobInfoAction[];
  description: string;
  displayName: string;
  displayNameOrNull: null;
  fullDisplayName: string;
  fullName: string;
  name: string;
  url: string;
  buildable: boolean;
  builds: Build[];
  color: string;
  firstBuild: Build;
  healthReport: HealthReport[];
  inQueue: boolean;
  keepDependencies: boolean;
  lastBuild: LastBuild;
  lastCompletedBuild: LastBuild;
  lastFailedBuild: null;
  lastStableBuild: LastBuild;
  lastSuccessfulBuild: LastBuild;
  lastUnstableBuild: null;
  lastUnsuccessfulBuild: null;
  nextBuildNumber: number;
  property: Property[];
  queueItem: null;
  concurrentBuild: boolean;
  resumeBlocked: boolean;
};

export type TJobInfoAction = {
  _class?: string;
  jobConfigHistory?: any[];
  displayUrl?: string;
  stores?: Stores;
};

export type Stores = {};

export type Build = {
  _class: {
    [x: string]: string;
  };
  actions: FirstBuildAction[];
  artifacts: any[];
  building: boolean;
  description: string;
  displayName: string;
  duration: number;
  estimatedDuration: number;
  executor: null;
  fullDisplayName: string;
  id: string;
  keepLog: boolean;
  number: number;
  queueId: number;
  result: string;
  timestamp: number;
  url: string;
  changeSets: any[];
  culprits: any[];
  inProgress: boolean;
  nextBuild: PreviousBuildClass | null;
  previousBuild: PreviousBuildClass | null;
};

export type FirstBuildAction = {
  _class?: string;
  parameters?: Parameter[];
  causes?: PurpleCause[];
  blockedDurationMillis?: number;
  blockedTimeMillis?: number;
  buildableDurationMillis?: number;
  buildableTimeMillis?: number;
  buildingDurationMillis?: number;
  executingTimeMillis?: number;
  executorUtilization?: number;
  subTaskCount?: number;
  waitingDurationMillis?: number;
  waitingTimeMillis?: number;
  buildsByBranchName?: BuildsByBranchName;
  lastBuiltRevision?: LastBuiltRevision;
  remoteUrls?: string[];
  scmName?: string;
};

export type BuildsByBranchName = {
  [x: string]: RefsRemotesOriginAzure;
};

export type RefsRemotesOriginAzure = {
  _class: any;
  buildNumber: number;
  buildResult: null;
  marked: LastBuiltRevision;
  revision: LastBuiltRevision;
};

export type LastBuiltRevision = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  SHA1: string;
  branch: Branch[];
};

export type Branch = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  SHA1: string;
  name: string;
};

export type PurpleCause = {
  _class: string;
  shortDescription: string;
  userId?: string;
  userName?: string;
  upstreamBuild?: number;
  upstreamProject?: string;
  upstreamUrl?: string;
};

export type Parameter = {
  _class: string;
  name: string;
  value: boolean | string;
};

export type PreviousBuildClass = {
  number: number;
  url: string;
};

export type HealthReport = {
  description: string;
  iconClassName: string;
  iconUrl: string;
  score: number;
};

export type LastBuild = {
  _class: {
    [x: string]: string;
  };
  actions: LastBuildAction[];
  artifacts: any[];
  building: boolean;
  description: string;
  displayName: string;
  duration: number;
  estimatedDuration: number;
  executor: null;
  fullDisplayName: string;
  id: string;
  keepLog: boolean;
  number: number;
  queueId: number;
  result: string;
  timestamp: number;
  url: string;
  changeSets: any[];
  culprits: any[];
  inProgress: boolean;
  nextBuild: null;
  previousBuild: PreviousBuildClass;
};

export type LastBuildAction = {
  _class?: string;
  parameters?: Parameter[];
  causes?: FluffyCause[];
  blockedDurationMillis?: number;
  blockedTimeMillis?: number;
  buildableDurationMillis?: number;
  buildableTimeMillis?: number;
  buildingDurationMillis?: number;
  executingTimeMillis?: number;
  executorUtilization?: number;
  subTaskCount?: number;
  waitingDurationMillis?: number;
  waitingTimeMillis?: number;
  buildsByBranchName?: BuildsByBranchName;
  lastBuiltRevision?: LastBuiltRevision;
  remoteUrls?: string[];
  scmName?: string;
};

export type FluffyCause = {
  _class: string;
  shortDescription: string;
  userId: string;
  userName: string;
};

export type Property = {
  _class: string;
  parameterDefinitions?: ParameterDefinition[];
};

export type ParameterDefinition = {
  _class: string;
  defaultParameterValue: Parameter;
  description: string;
  name: string;
  type: string;
  choices?: string[];
};
