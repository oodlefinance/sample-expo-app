function ensureEnvVar(envVarName: string) {
  if (!process.env[envVarName]) {
    throw new Error(`Env var ${envVarName} not set`);
  }

  return process.env[envVarName];
}

export const OMDB_API_KEY = ensureEnvVar("EXPO_PUBLIC_OMDB_API_KEY");
