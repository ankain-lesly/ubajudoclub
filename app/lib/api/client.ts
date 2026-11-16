/**
 * Skeleton data/auth client.
 *
 * Every call resolves with empty data (or
 * throws `NotImplementedError` for auth mutations) so the UI renders without
 * a backend. Replace the bodies with real API calls later; call sites do not
 * need to change.
 */

export class NotImplementedError extends Error {
  constructor(what: string) {
    super(`${what} is not implemented yet (no backend configured).`);
    this.name = "NotImplementedError";
  }
}

export interface ListOptions {
  sort?: string;
  limit?: number;
}

export interface Page<T> {
  items: T[];
}

export interface EntityApi<T = any> {
  list(options?: ListOptions): Promise<Page<T>>;
  filter(query?: Record<string, unknown>, options?: ListOptions): Promise<Page<T>>;
  get(id: string): Promise<T>;
  create(data: Partial<T> & Record<string, unknown>): Promise<T>;
  update(id: string, data: Partial<T> & Record<string, unknown>): Promise<T>;
  delete(id: string): Promise<void>;
}

// TODO: wire a real backend. Reads return nothing; writes are not implemented.
const createEntity = <T = any>(name: string): EntityApi<T> => ({
  list: async () => ({ items: [] }),
  filter: async () => ({ items: [] }),
  get: async (id) => {
    throw new Error(`${name} "${id}" not found`);
  },
  create: async () => {
    throw new NotImplementedError(`${name}.create`);
  },
  update: async () => {
    throw new NotImplementedError(`${name}.update`);
  },
  delete: async () => {
    throw new NotImplementedError(`${name}.delete`);
  },
});

const notImplemented = (what: string) => async (..._args: unknown[]) => {
  throw new NotImplementedError(what);
};

export const api = {
  entities: {
    ClubEvent: createEntity("ClubEvent"),
    Member: createEntity("Member"),
    TrainingSession: createEntity("TrainingSession"),
    Attendance: createEntity("Attendance"),
    Promotion: createEntity("Promotion"),
    JoinRequest: createEntity("JoinRequest"),
  },
  auth: {
    me: async () => {
      throw new Error("Not authenticated");
    },
    register: notImplemented("auth.register"),
    verifyOtp: notImplemented("auth.verifyOtp"),
    resendOtp: notImplemented("auth.resendOtp"),
    resetPasswordRequest: notImplemented("auth.resetPasswordRequest"),
    resetPassword: notImplemented("auth.resetPassword"),
    loginViaEmailPassword: notImplemented("auth.login"),
    setToken: (_token: string) => {},
    logout: async (_redirectTo?: string) => {},
  },
  functions: {
    invoke: async (_name: string, _payload?: unknown): Promise<{ data: unknown }> => ({
      data: null,
    }),
  },
};
