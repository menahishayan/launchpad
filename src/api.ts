import * as api from "jenkins-api";
import { TJobInfo } from "./jobInfoType";
import { TCreateBuildWithParams } from "./utils";

function wrapper<T = object>(instance: ReturnType<typeof api.init>, fn: string, params: (string | number)[] = [], extraProps = {}) {
  return new Promise<T>((resolve, reject) => {
    instance[fn](...params, { depth: 1, extraProps }, function (err: Error, data: T) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

const jenkins = (username: string, token: string, url: string) => {
  const instance = api.init(`http://${username}:${token}@${url}`);

  return {
    instance,
    getLastBuildInfo: (job: string) => wrapper(instance, "last_build_info", [job]),
    getBuildInfo: (job: string, buildNumber: number) => wrapper(instance, "build_info", [job, buildNumber]),
    getConsoleOutput: (job: string, buildNumber: number) => wrapper(instance, "console_output", [job, buildNumber]),
    getJobInfo: (job: string) => wrapper<TJobInfo>(instance, "job_info", [job]),
    getAllViews: () => wrapper(instance, "all_views"),
    showCurrentQueue: () => wrapper(instance, "job_info", [], { token }),
    createBuildWithParams: (job: string, params: any) => wrapper<TCreateBuildWithParams>(instance, "build_with_params", [job], { token, ...params }),
  };
};

export default jenkins;
