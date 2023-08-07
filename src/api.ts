import * as api from "jenkins-api";

const jenkins = (username: string, token: string, url: string) => {
  const instance = api.init(`http://${username}:${token}@${url}`);

  const getLastBuildInfo = async (job: string) => {
    return new Promise((resolve, reject) => {
      instance.last_build_info(job, { depth: 1 }, function (err: Error, data: JSON) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  };

  const getConsoleOutput = async (job: string, buildNumber: number) => {
    return new Promise((resolve, reject) => {
      instance.console_output(job, buildNumber, { depth: 1 }, function (err: Error, data: JSON) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  };

  return {
    instance,
    getLastBuildInfo,
    getConsoleOutput,
  };
};

export default jenkins;
