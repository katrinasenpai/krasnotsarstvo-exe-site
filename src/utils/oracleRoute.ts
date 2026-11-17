const importOracle = () => import('../components/BookOraclePage');
let oracleModule: ReturnType<typeof importOracle> | undefined;

export function preloadOracle() {
  oracleModule ??= importOracle().catch((error) => {
    oracleModule = undefined;
    throw error;
  });
  return oracleModule;
}
