export const getNodeEnv = () => process.env.NODE_ENV as string
export const setNodeEnv = (env: string): void => {
  process.env.NODE_ENV = env
}
