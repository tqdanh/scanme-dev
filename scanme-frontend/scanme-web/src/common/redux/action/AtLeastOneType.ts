export type AtLeastOne<T, U = {[F in keyof T]: Pick<T, F> }> = Partial<T> & U[keyof U];
