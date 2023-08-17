export type TJenkinsJobs = {
  name: string;
  params: {
    [x: string]: any;
  };
};

export type TConfig = {
  jenkins: {
    url: string;
    jobs: TJenkinsJobs[];
  };
};

export type TCreateBuildWithParams = {
  body: string;
  location: string;
  statusCode: number;
  queueId: number;
};