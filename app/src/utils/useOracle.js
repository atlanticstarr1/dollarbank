import { drizzleReactHooks } from "drizzle-react";

const useOracle = () => {
  const { useCacheCall, useCacheSend } = drizzleReactHooks.useDrizzle();
  let value = 0;
  let success = false;
  const read = useCacheCall("Lighthouse", "peekData");
  if (read) {
    value = read.v;
    success = read.b;
  }
  const write = useCacheSend("Lighthouse", "write");
  const changeSearcher = useCacheSend("Lighthouse", "changeSearcher");

  return { value, success, write, changeSearcher };
};

export default useOracle;
