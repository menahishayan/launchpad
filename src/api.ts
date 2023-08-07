import * as api from "jenkins-api";

const wrapper = (instance: ReturnType<typeof api.init>, fn: string, params = [], extraProps = {}) => {
  return new Promise((resolve, reject) => {
    instance[fn](...params, { depth: 1, extraProps }, function (err: Error, data: JSON) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

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

  const getBuildInfo = async (job: string, buildNumber: number) => {
    return new Promise((resolve, reject) => {
      instance.build_info(job, buildNumber, { depth: 1 }, function (err: Error, data: JSON) {
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

  const getJobInfo = async (job: string) => {
    return new Promise((resolve, reject) => {
      instance.job_info(job, { depth: 1 }, function (err: Error, data: JSON) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  };

  const showCurrentQueue = async () => {
    return new Promise((resolve, reject) => {
      instance.queue({ token }, function (err: Error, data: JSON) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  };

  const getAllViews = async () => {
    return new Promise((resolve, reject) => {
      instance.all_views({ depth: 1 }, function (err: Error, data: JSON) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  };

  const createBuildWithParams = async (job: string, params: JSON) => {
    return new Promise((resolve, reject) => {
      instance.build_with_params(job, { depth: 1, token, ...params }, function (err: Error, data: JSON) {
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
    getBuildInfo,
    getConsoleOutput,
    createBuildWithParams,
    getJobInfo,
    showCurrentQueue,
    getAllViews,
  };
};

export default jenkins;
