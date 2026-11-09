
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model AuditRun
 * 
 */
export type AuditRun = $Result.DefaultSelection<Prisma.$AuditRunPayload>
/**
 * Model PredictRun
 * 
 */
export type PredictRun = $Result.DefaultSelection<Prisma.$PredictRunPayload>
/**
 * Model ValidateRun
 * 
 */
export type ValidateRun = $Result.DefaultSelection<Prisma.$ValidateRunPayload>
/**
 * Model ServiceRequest
 * 
 */
export type ServiceRequest = $Result.DefaultSelection<Prisma.$ServiceRequestPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>
/**
 * Model ApiKey
 * 
 */
export type ApiKey = $Result.DefaultSelection<Prisma.$ApiKeyPayload>
/**
 * Model BatchJob
 * 
 */
export type BatchJob = $Result.DefaultSelection<Prisma.$BatchJobPayload>
/**
 * Model IntegrationConfig
 * 
 */
export type IntegrationConfig = $Result.DefaultSelection<Prisma.$IntegrationConfigPayload>
/**
 * Model WebhookEvent
 * 
 */
export type WebhookEvent = $Result.DefaultSelection<Prisma.$WebhookEventPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Organization
 * 
 */
export type Organization = $Result.DefaultSelection<Prisma.$OrganizationPayload>
/**
 * Model Membership
 * 
 */
export type Membership = $Result.DefaultSelection<Prisma.$MembershipPayload>
/**
 * Model BillingSubscription
 * 
 */
export type BillingSubscription = $Result.DefaultSelection<Prisma.$BillingSubscriptionPayload>
/**
 * Model BillingInvoice
 * 
 */
export type BillingInvoice = $Result.DefaultSelection<Prisma.$BillingInvoicePayload>
/**
 * Model BillingEvent
 * 
 */
export type BillingEvent = $Result.DefaultSelection<Prisma.$BillingEventPayload>
/**
 * Model MetricSample
 * 
 */
export type MetricSample = $Result.DefaultSelection<Prisma.$MetricSamplePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more AuditRuns
 * const auditRuns = await prisma.auditRun.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more AuditRuns
   * const auditRuns = await prisma.auditRun.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.auditRun`: Exposes CRUD operations for the **AuditRun** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditRuns
    * const auditRuns = await prisma.auditRun.findMany()
    * ```
    */
  get auditRun(): Prisma.AuditRunDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.predictRun`: Exposes CRUD operations for the **PredictRun** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PredictRuns
    * const predictRuns = await prisma.predictRun.findMany()
    * ```
    */
  get predictRun(): Prisma.PredictRunDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.validateRun`: Exposes CRUD operations for the **ValidateRun** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ValidateRuns
    * const validateRuns = await prisma.validateRun.findMany()
    * ```
    */
  get validateRun(): Prisma.ValidateRunDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.serviceRequest`: Exposes CRUD operations for the **ServiceRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ServiceRequests
    * const serviceRequests = await prisma.serviceRequest.findMany()
    * ```
    */
  get serviceRequest(): Prisma.ServiceRequestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.apiKey`: Exposes CRUD operations for the **ApiKey** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ApiKeys
    * const apiKeys = await prisma.apiKey.findMany()
    * ```
    */
  get apiKey(): Prisma.ApiKeyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.batchJob`: Exposes CRUD operations for the **BatchJob** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BatchJobs
    * const batchJobs = await prisma.batchJob.findMany()
    * ```
    */
  get batchJob(): Prisma.BatchJobDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.integrationConfig`: Exposes CRUD operations for the **IntegrationConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more IntegrationConfigs
    * const integrationConfigs = await prisma.integrationConfig.findMany()
    * ```
    */
  get integrationConfig(): Prisma.IntegrationConfigDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.webhookEvent`: Exposes CRUD operations for the **WebhookEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WebhookEvents
    * const webhookEvents = await prisma.webhookEvent.findMany()
    * ```
    */
  get webhookEvent(): Prisma.WebhookEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.organization`: Exposes CRUD operations for the **Organization** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Organizations
    * const organizations = await prisma.organization.findMany()
    * ```
    */
  get organization(): Prisma.OrganizationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.membership`: Exposes CRUD operations for the **Membership** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Memberships
    * const memberships = await prisma.membership.findMany()
    * ```
    */
  get membership(): Prisma.MembershipDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.billingSubscription`: Exposes CRUD operations for the **BillingSubscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BillingSubscriptions
    * const billingSubscriptions = await prisma.billingSubscription.findMany()
    * ```
    */
  get billingSubscription(): Prisma.BillingSubscriptionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.billingInvoice`: Exposes CRUD operations for the **BillingInvoice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BillingInvoices
    * const billingInvoices = await prisma.billingInvoice.findMany()
    * ```
    */
  get billingInvoice(): Prisma.BillingInvoiceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.billingEvent`: Exposes CRUD operations for the **BillingEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BillingEvents
    * const billingEvents = await prisma.billingEvent.findMany()
    * ```
    */
  get billingEvent(): Prisma.BillingEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.metricSample`: Exposes CRUD operations for the **MetricSample** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MetricSamples
    * const metricSamples = await prisma.metricSample.findMany()
    * ```
    */
  get metricSample(): Prisma.MetricSampleDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    AuditRun: 'AuditRun',
    PredictRun: 'PredictRun',
    ValidateRun: 'ValidateRun',
    ServiceRequest: 'ServiceRequest',
    AuditLog: 'AuditLog',
    ApiKey: 'ApiKey',
    BatchJob: 'BatchJob',
    IntegrationConfig: 'IntegrationConfig',
    WebhookEvent: 'WebhookEvent',
    User: 'User',
    Session: 'Session',
    Organization: 'Organization',
    Membership: 'Membership',
    BillingSubscription: 'BillingSubscription',
    BillingInvoice: 'BillingInvoice',
    BillingEvent: 'BillingEvent',
    MetricSample: 'MetricSample'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "auditRun" | "predictRun" | "validateRun" | "serviceRequest" | "auditLog" | "apiKey" | "batchJob" | "integrationConfig" | "webhookEvent" | "user" | "session" | "organization" | "membership" | "billingSubscription" | "billingInvoice" | "billingEvent" | "metricSample"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      AuditRun: {
        payload: Prisma.$AuditRunPayload<ExtArgs>
        fields: Prisma.AuditRunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditRunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditRunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditRunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditRunPayload>
          }
          findFirst: {
            args: Prisma.AuditRunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditRunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditRunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditRunPayload>
          }
          findMany: {
            args: Prisma.AuditRunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditRunPayload>[]
          }
          create: {
            args: Prisma.AuditRunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditRunPayload>
          }
          createMany: {
            args: Prisma.AuditRunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditRunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditRunPayload>[]
          }
          delete: {
            args: Prisma.AuditRunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditRunPayload>
          }
          update: {
            args: Prisma.AuditRunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditRunPayload>
          }
          deleteMany: {
            args: Prisma.AuditRunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditRunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditRunUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditRunPayload>[]
          }
          upsert: {
            args: Prisma.AuditRunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditRunPayload>
          }
          aggregate: {
            args: Prisma.AuditRunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditRun>
          }
          groupBy: {
            args: Prisma.AuditRunGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditRunGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditRunCountArgs<ExtArgs>
            result: $Utils.Optional<AuditRunCountAggregateOutputType> | number
          }
        }
      }
      PredictRun: {
        payload: Prisma.$PredictRunPayload<ExtArgs>
        fields: Prisma.PredictRunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PredictRunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictRunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PredictRunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictRunPayload>
          }
          findFirst: {
            args: Prisma.PredictRunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictRunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PredictRunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictRunPayload>
          }
          findMany: {
            args: Prisma.PredictRunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictRunPayload>[]
          }
          create: {
            args: Prisma.PredictRunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictRunPayload>
          }
          createMany: {
            args: Prisma.PredictRunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PredictRunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictRunPayload>[]
          }
          delete: {
            args: Prisma.PredictRunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictRunPayload>
          }
          update: {
            args: Prisma.PredictRunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictRunPayload>
          }
          deleteMany: {
            args: Prisma.PredictRunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PredictRunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PredictRunUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictRunPayload>[]
          }
          upsert: {
            args: Prisma.PredictRunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PredictRunPayload>
          }
          aggregate: {
            args: Prisma.PredictRunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePredictRun>
          }
          groupBy: {
            args: Prisma.PredictRunGroupByArgs<ExtArgs>
            result: $Utils.Optional<PredictRunGroupByOutputType>[]
          }
          count: {
            args: Prisma.PredictRunCountArgs<ExtArgs>
            result: $Utils.Optional<PredictRunCountAggregateOutputType> | number
          }
        }
      }
      ValidateRun: {
        payload: Prisma.$ValidateRunPayload<ExtArgs>
        fields: Prisma.ValidateRunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ValidateRunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidateRunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ValidateRunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidateRunPayload>
          }
          findFirst: {
            args: Prisma.ValidateRunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidateRunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ValidateRunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidateRunPayload>
          }
          findMany: {
            args: Prisma.ValidateRunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidateRunPayload>[]
          }
          create: {
            args: Prisma.ValidateRunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidateRunPayload>
          }
          createMany: {
            args: Prisma.ValidateRunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ValidateRunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidateRunPayload>[]
          }
          delete: {
            args: Prisma.ValidateRunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidateRunPayload>
          }
          update: {
            args: Prisma.ValidateRunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidateRunPayload>
          }
          deleteMany: {
            args: Prisma.ValidateRunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ValidateRunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ValidateRunUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidateRunPayload>[]
          }
          upsert: {
            args: Prisma.ValidateRunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ValidateRunPayload>
          }
          aggregate: {
            args: Prisma.ValidateRunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateValidateRun>
          }
          groupBy: {
            args: Prisma.ValidateRunGroupByArgs<ExtArgs>
            result: $Utils.Optional<ValidateRunGroupByOutputType>[]
          }
          count: {
            args: Prisma.ValidateRunCountArgs<ExtArgs>
            result: $Utils.Optional<ValidateRunCountAggregateOutputType> | number
          }
        }
      }
      ServiceRequest: {
        payload: Prisma.$ServiceRequestPayload<ExtArgs>
        fields: Prisma.ServiceRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ServiceRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ServiceRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceRequestPayload>
          }
          findFirst: {
            args: Prisma.ServiceRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ServiceRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceRequestPayload>
          }
          findMany: {
            args: Prisma.ServiceRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceRequestPayload>[]
          }
          create: {
            args: Prisma.ServiceRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceRequestPayload>
          }
          createMany: {
            args: Prisma.ServiceRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ServiceRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceRequestPayload>[]
          }
          delete: {
            args: Prisma.ServiceRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceRequestPayload>
          }
          update: {
            args: Prisma.ServiceRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceRequestPayload>
          }
          deleteMany: {
            args: Prisma.ServiceRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ServiceRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ServiceRequestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceRequestPayload>[]
          }
          upsert: {
            args: Prisma.ServiceRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceRequestPayload>
          }
          aggregate: {
            args: Prisma.ServiceRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateServiceRequest>
          }
          groupBy: {
            args: Prisma.ServiceRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<ServiceRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.ServiceRequestCountArgs<ExtArgs>
            result: $Utils.Optional<ServiceRequestCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
      ApiKey: {
        payload: Prisma.$ApiKeyPayload<ExtArgs>
        fields: Prisma.ApiKeyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ApiKeyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ApiKeyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          findFirst: {
            args: Prisma.ApiKeyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ApiKeyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          findMany: {
            args: Prisma.ApiKeyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>[]
          }
          create: {
            args: Prisma.ApiKeyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          createMany: {
            args: Prisma.ApiKeyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ApiKeyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>[]
          }
          delete: {
            args: Prisma.ApiKeyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          update: {
            args: Prisma.ApiKeyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          deleteMany: {
            args: Prisma.ApiKeyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ApiKeyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ApiKeyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>[]
          }
          upsert: {
            args: Prisma.ApiKeyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiKeyPayload>
          }
          aggregate: {
            args: Prisma.ApiKeyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApiKey>
          }
          groupBy: {
            args: Prisma.ApiKeyGroupByArgs<ExtArgs>
            result: $Utils.Optional<ApiKeyGroupByOutputType>[]
          }
          count: {
            args: Prisma.ApiKeyCountArgs<ExtArgs>
            result: $Utils.Optional<ApiKeyCountAggregateOutputType> | number
          }
        }
      }
      BatchJob: {
        payload: Prisma.$BatchJobPayload<ExtArgs>
        fields: Prisma.BatchJobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BatchJobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchJobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BatchJobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchJobPayload>
          }
          findFirst: {
            args: Prisma.BatchJobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchJobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BatchJobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchJobPayload>
          }
          findMany: {
            args: Prisma.BatchJobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchJobPayload>[]
          }
          create: {
            args: Prisma.BatchJobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchJobPayload>
          }
          createMany: {
            args: Prisma.BatchJobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BatchJobCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchJobPayload>[]
          }
          delete: {
            args: Prisma.BatchJobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchJobPayload>
          }
          update: {
            args: Prisma.BatchJobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchJobPayload>
          }
          deleteMany: {
            args: Prisma.BatchJobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BatchJobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BatchJobUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchJobPayload>[]
          }
          upsert: {
            args: Prisma.BatchJobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchJobPayload>
          }
          aggregate: {
            args: Prisma.BatchJobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBatchJob>
          }
          groupBy: {
            args: Prisma.BatchJobGroupByArgs<ExtArgs>
            result: $Utils.Optional<BatchJobGroupByOutputType>[]
          }
          count: {
            args: Prisma.BatchJobCountArgs<ExtArgs>
            result: $Utils.Optional<BatchJobCountAggregateOutputType> | number
          }
        }
      }
      IntegrationConfig: {
        payload: Prisma.$IntegrationConfigPayload<ExtArgs>
        fields: Prisma.IntegrationConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IntegrationConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IntegrationConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationConfigPayload>
          }
          findFirst: {
            args: Prisma.IntegrationConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IntegrationConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationConfigPayload>
          }
          findMany: {
            args: Prisma.IntegrationConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationConfigPayload>[]
          }
          create: {
            args: Prisma.IntegrationConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationConfigPayload>
          }
          createMany: {
            args: Prisma.IntegrationConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IntegrationConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationConfigPayload>[]
          }
          delete: {
            args: Prisma.IntegrationConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationConfigPayload>
          }
          update: {
            args: Prisma.IntegrationConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationConfigPayload>
          }
          deleteMany: {
            args: Prisma.IntegrationConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IntegrationConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.IntegrationConfigUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationConfigPayload>[]
          }
          upsert: {
            args: Prisma.IntegrationConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IntegrationConfigPayload>
          }
          aggregate: {
            args: Prisma.IntegrationConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIntegrationConfig>
          }
          groupBy: {
            args: Prisma.IntegrationConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<IntegrationConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.IntegrationConfigCountArgs<ExtArgs>
            result: $Utils.Optional<IntegrationConfigCountAggregateOutputType> | number
          }
        }
      }
      WebhookEvent: {
        payload: Prisma.$WebhookEventPayload<ExtArgs>
        fields: Prisma.WebhookEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WebhookEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WebhookEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookEventPayload>
          }
          findFirst: {
            args: Prisma.WebhookEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WebhookEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookEventPayload>
          }
          findMany: {
            args: Prisma.WebhookEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookEventPayload>[]
          }
          create: {
            args: Prisma.WebhookEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookEventPayload>
          }
          createMany: {
            args: Prisma.WebhookEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WebhookEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookEventPayload>[]
          }
          delete: {
            args: Prisma.WebhookEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookEventPayload>
          }
          update: {
            args: Prisma.WebhookEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookEventPayload>
          }
          deleteMany: {
            args: Prisma.WebhookEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WebhookEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WebhookEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookEventPayload>[]
          }
          upsert: {
            args: Prisma.WebhookEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookEventPayload>
          }
          aggregate: {
            args: Prisma.WebhookEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWebhookEvent>
          }
          groupBy: {
            args: Prisma.WebhookEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<WebhookEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.WebhookEventCountArgs<ExtArgs>
            result: $Utils.Optional<WebhookEventCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      Organization: {
        payload: Prisma.$OrganizationPayload<ExtArgs>
        fields: Prisma.OrganizationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrganizationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrganizationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          findFirst: {
            args: Prisma.OrganizationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrganizationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          findMany: {
            args: Prisma.OrganizationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>[]
          }
          create: {
            args: Prisma.OrganizationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          createMany: {
            args: Prisma.OrganizationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrganizationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>[]
          }
          delete: {
            args: Prisma.OrganizationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          update: {
            args: Prisma.OrganizationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          deleteMany: {
            args: Prisma.OrganizationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrganizationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrganizationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>[]
          }
          upsert: {
            args: Prisma.OrganizationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          aggregate: {
            args: Prisma.OrganizationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrganization>
          }
          groupBy: {
            args: Prisma.OrganizationGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrganizationGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrganizationCountArgs<ExtArgs>
            result: $Utils.Optional<OrganizationCountAggregateOutputType> | number
          }
        }
      }
      Membership: {
        payload: Prisma.$MembershipPayload<ExtArgs>
        fields: Prisma.MembershipFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MembershipFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MembershipFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>
          }
          findFirst: {
            args: Prisma.MembershipFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MembershipFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>
          }
          findMany: {
            args: Prisma.MembershipFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>[]
          }
          create: {
            args: Prisma.MembershipCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>
          }
          createMany: {
            args: Prisma.MembershipCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MembershipCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>[]
          }
          delete: {
            args: Prisma.MembershipDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>
          }
          update: {
            args: Prisma.MembershipUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>
          }
          deleteMany: {
            args: Prisma.MembershipDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MembershipUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MembershipUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>[]
          }
          upsert: {
            args: Prisma.MembershipUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembershipPayload>
          }
          aggregate: {
            args: Prisma.MembershipAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMembership>
          }
          groupBy: {
            args: Prisma.MembershipGroupByArgs<ExtArgs>
            result: $Utils.Optional<MembershipGroupByOutputType>[]
          }
          count: {
            args: Prisma.MembershipCountArgs<ExtArgs>
            result: $Utils.Optional<MembershipCountAggregateOutputType> | number
          }
        }
      }
      BillingSubscription: {
        payload: Prisma.$BillingSubscriptionPayload<ExtArgs>
        fields: Prisma.BillingSubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BillingSubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingSubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BillingSubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingSubscriptionPayload>
          }
          findFirst: {
            args: Prisma.BillingSubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingSubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BillingSubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingSubscriptionPayload>
          }
          findMany: {
            args: Prisma.BillingSubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingSubscriptionPayload>[]
          }
          create: {
            args: Prisma.BillingSubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingSubscriptionPayload>
          }
          createMany: {
            args: Prisma.BillingSubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BillingSubscriptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingSubscriptionPayload>[]
          }
          delete: {
            args: Prisma.BillingSubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingSubscriptionPayload>
          }
          update: {
            args: Prisma.BillingSubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingSubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.BillingSubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BillingSubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BillingSubscriptionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingSubscriptionPayload>[]
          }
          upsert: {
            args: Prisma.BillingSubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingSubscriptionPayload>
          }
          aggregate: {
            args: Prisma.BillingSubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBillingSubscription>
          }
          groupBy: {
            args: Prisma.BillingSubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<BillingSubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.BillingSubscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<BillingSubscriptionCountAggregateOutputType> | number
          }
        }
      }
      BillingInvoice: {
        payload: Prisma.$BillingInvoicePayload<ExtArgs>
        fields: Prisma.BillingInvoiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BillingInvoiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BillingInvoiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>
          }
          findFirst: {
            args: Prisma.BillingInvoiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BillingInvoiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>
          }
          findMany: {
            args: Prisma.BillingInvoiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>[]
          }
          create: {
            args: Prisma.BillingInvoiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>
          }
          createMany: {
            args: Prisma.BillingInvoiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BillingInvoiceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>[]
          }
          delete: {
            args: Prisma.BillingInvoiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>
          }
          update: {
            args: Prisma.BillingInvoiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>
          }
          deleteMany: {
            args: Prisma.BillingInvoiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BillingInvoiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BillingInvoiceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>[]
          }
          upsert: {
            args: Prisma.BillingInvoiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>
          }
          aggregate: {
            args: Prisma.BillingInvoiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBillingInvoice>
          }
          groupBy: {
            args: Prisma.BillingInvoiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<BillingInvoiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.BillingInvoiceCountArgs<ExtArgs>
            result: $Utils.Optional<BillingInvoiceCountAggregateOutputType> | number
          }
        }
      }
      BillingEvent: {
        payload: Prisma.$BillingEventPayload<ExtArgs>
        fields: Prisma.BillingEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BillingEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BillingEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingEventPayload>
          }
          findFirst: {
            args: Prisma.BillingEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BillingEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingEventPayload>
          }
          findMany: {
            args: Prisma.BillingEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingEventPayload>[]
          }
          create: {
            args: Prisma.BillingEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingEventPayload>
          }
          createMany: {
            args: Prisma.BillingEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BillingEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingEventPayload>[]
          }
          delete: {
            args: Prisma.BillingEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingEventPayload>
          }
          update: {
            args: Prisma.BillingEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingEventPayload>
          }
          deleteMany: {
            args: Prisma.BillingEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BillingEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BillingEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingEventPayload>[]
          }
          upsert: {
            args: Prisma.BillingEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingEventPayload>
          }
          aggregate: {
            args: Prisma.BillingEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBillingEvent>
          }
          groupBy: {
            args: Prisma.BillingEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<BillingEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.BillingEventCountArgs<ExtArgs>
            result: $Utils.Optional<BillingEventCountAggregateOutputType> | number
          }
        }
      }
      MetricSample: {
        payload: Prisma.$MetricSamplePayload<ExtArgs>
        fields: Prisma.MetricSampleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MetricSampleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricSamplePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MetricSampleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricSamplePayload>
          }
          findFirst: {
            args: Prisma.MetricSampleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricSamplePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MetricSampleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricSamplePayload>
          }
          findMany: {
            args: Prisma.MetricSampleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricSamplePayload>[]
          }
          create: {
            args: Prisma.MetricSampleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricSamplePayload>
          }
          createMany: {
            args: Prisma.MetricSampleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MetricSampleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricSamplePayload>[]
          }
          delete: {
            args: Prisma.MetricSampleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricSamplePayload>
          }
          update: {
            args: Prisma.MetricSampleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricSamplePayload>
          }
          deleteMany: {
            args: Prisma.MetricSampleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MetricSampleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MetricSampleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricSamplePayload>[]
          }
          upsert: {
            args: Prisma.MetricSampleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricSamplePayload>
          }
          aggregate: {
            args: Prisma.MetricSampleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMetricSample>
          }
          groupBy: {
            args: Prisma.MetricSampleGroupByArgs<ExtArgs>
            result: $Utils.Optional<MetricSampleGroupByOutputType>[]
          }
          count: {
            args: Prisma.MetricSampleCountArgs<ExtArgs>
            result: $Utils.Optional<MetricSampleCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    auditRun?: AuditRunOmit
    predictRun?: PredictRunOmit
    validateRun?: ValidateRunOmit
    serviceRequest?: ServiceRequestOmit
    auditLog?: AuditLogOmit
    apiKey?: ApiKeyOmit
    batchJob?: BatchJobOmit
    integrationConfig?: IntegrationConfigOmit
    webhookEvent?: WebhookEventOmit
    user?: UserOmit
    session?: SessionOmit
    organization?: OrganizationOmit
    membership?: MembershipOmit
    billingSubscription?: BillingSubscriptionOmit
    billingInvoice?: BillingInvoiceOmit
    billingEvent?: BillingEventOmit
    metricSample?: MetricSampleOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    memberships: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    memberships?: boolean | UserCountOutputTypeCountMembershipsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMembershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MembershipWhereInput
  }


  /**
   * Count Type OrganizationCountOutputType
   */

  export type OrganizationCountOutputType = {
    memberships: number
  }

  export type OrganizationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    memberships?: boolean | OrganizationCountOutputTypeCountMembershipsArgs
  }

  // Custom InputTypes
  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationCountOutputType
     */
    select?: OrganizationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeCountMembershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MembershipWhereInput
  }


  /**
   * Models
   */

  /**
   * Model AuditRun
   */

  export type AggregateAuditRun = {
    _count: AuditRunCountAggregateOutputType | null
    _avg: AuditRunAvgAggregateOutputType | null
    _sum: AuditRunSumAggregateOutputType | null
    _min: AuditRunMinAggregateOutputType | null
    _max: AuditRunMaxAggregateOutputType | null
  }

  export type AuditRunAvgAggregateOutputType = {
    nLabelled: number | null
  }

  export type AuditRunSumAggregateOutputType = {
    nLabelled: number | null
  }

  export type AuditRunMinAggregateOutputType = {
    id: string | null
    organizationId: string | null
    source: string | null
    drug: string | null
    verdict: string | null
    nLabelled: number | null
    summary: string | null
    input: string | null
    results: string | null
    createdAt: Date | null
  }

  export type AuditRunMaxAggregateOutputType = {
    id: string | null
    organizationId: string | null
    source: string | null
    drug: string | null
    verdict: string | null
    nLabelled: number | null
    summary: string | null
    input: string | null
    results: string | null
    createdAt: Date | null
  }

  export type AuditRunCountAggregateOutputType = {
    id: number
    organizationId: number
    source: number
    drug: number
    verdict: number
    nLabelled: number
    summary: number
    input: number
    results: number
    createdAt: number
    _all: number
  }


  export type AuditRunAvgAggregateInputType = {
    nLabelled?: true
  }

  export type AuditRunSumAggregateInputType = {
    nLabelled?: true
  }

  export type AuditRunMinAggregateInputType = {
    id?: true
    organizationId?: true
    source?: true
    drug?: true
    verdict?: true
    nLabelled?: true
    summary?: true
    input?: true
    results?: true
    createdAt?: true
  }

  export type AuditRunMaxAggregateInputType = {
    id?: true
    organizationId?: true
    source?: true
    drug?: true
    verdict?: true
    nLabelled?: true
    summary?: true
    input?: true
    results?: true
    createdAt?: true
  }

  export type AuditRunCountAggregateInputType = {
    id?: true
    organizationId?: true
    source?: true
    drug?: true
    verdict?: true
    nLabelled?: true
    summary?: true
    input?: true
    results?: true
    createdAt?: true
    _all?: true
  }

  export type AuditRunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditRun to aggregate.
     */
    where?: AuditRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditRuns to fetch.
     */
    orderBy?: AuditRunOrderByWithRelationInput | AuditRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditRuns
    **/
    _count?: true | AuditRunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AuditRunAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AuditRunSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditRunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditRunMaxAggregateInputType
  }

  export type GetAuditRunAggregateType<T extends AuditRunAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditRun[P]>
      : GetScalarType<T[P], AggregateAuditRun[P]>
  }




  export type AuditRunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditRunWhereInput
    orderBy?: AuditRunOrderByWithAggregationInput | AuditRunOrderByWithAggregationInput[]
    by: AuditRunScalarFieldEnum[] | AuditRunScalarFieldEnum
    having?: AuditRunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditRunCountAggregateInputType | true
    _avg?: AuditRunAvgAggregateInputType
    _sum?: AuditRunSumAggregateInputType
    _min?: AuditRunMinAggregateInputType
    _max?: AuditRunMaxAggregateInputType
  }

  export type AuditRunGroupByOutputType = {
    id: string
    organizationId: string | null
    source: string
    drug: string
    verdict: string
    nLabelled: number
    summary: string
    input: string
    results: string
    createdAt: Date
    _count: AuditRunCountAggregateOutputType | null
    _avg: AuditRunAvgAggregateOutputType | null
    _sum: AuditRunSumAggregateOutputType | null
    _min: AuditRunMinAggregateOutputType | null
    _max: AuditRunMaxAggregateOutputType | null
  }

  type GetAuditRunGroupByPayload<T extends AuditRunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditRunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditRunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditRunGroupByOutputType[P]>
            : GetScalarType<T[P], AuditRunGroupByOutputType[P]>
        }
      >
    >


  export type AuditRunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    source?: boolean
    drug?: boolean
    verdict?: boolean
    nLabelled?: boolean
    summary?: boolean
    input?: boolean
    results?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditRun"]>

  export type AuditRunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    source?: boolean
    drug?: boolean
    verdict?: boolean
    nLabelled?: boolean
    summary?: boolean
    input?: boolean
    results?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditRun"]>

  export type AuditRunSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    source?: boolean
    drug?: boolean
    verdict?: boolean
    nLabelled?: boolean
    summary?: boolean
    input?: boolean
    results?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditRun"]>

  export type AuditRunSelectScalar = {
    id?: boolean
    organizationId?: boolean
    source?: boolean
    drug?: boolean
    verdict?: boolean
    nLabelled?: boolean
    summary?: boolean
    input?: boolean
    results?: boolean
    createdAt?: boolean
  }

  export type AuditRunOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "organizationId" | "source" | "drug" | "verdict" | "nLabelled" | "summary" | "input" | "results" | "createdAt", ExtArgs["result"]["auditRun"]>

  export type $AuditRunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditRun"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      organizationId: string | null
      source: string
      drug: string
      verdict: string
      nLabelled: number
      summary: string
      input: string
      results: string
      createdAt: Date
    }, ExtArgs["result"]["auditRun"]>
    composites: {}
  }

  type AuditRunGetPayload<S extends boolean | null | undefined | AuditRunDefaultArgs> = $Result.GetResult<Prisma.$AuditRunPayload, S>

  type AuditRunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditRunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditRunCountAggregateInputType | true
    }

  export interface AuditRunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditRun'], meta: { name: 'AuditRun' } }
    /**
     * Find zero or one AuditRun that matches the filter.
     * @param {AuditRunFindUniqueArgs} args - Arguments to find a AuditRun
     * @example
     * // Get one AuditRun
     * const auditRun = await prisma.auditRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditRunFindUniqueArgs>(args: SelectSubset<T, AuditRunFindUniqueArgs<ExtArgs>>): Prisma__AuditRunClient<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditRun that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditRunFindUniqueOrThrowArgs} args - Arguments to find a AuditRun
     * @example
     * // Get one AuditRun
     * const auditRun = await prisma.auditRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditRunFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditRunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditRunClient<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditRunFindFirstArgs} args - Arguments to find a AuditRun
     * @example
     * // Get one AuditRun
     * const auditRun = await prisma.auditRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditRunFindFirstArgs>(args?: SelectSubset<T, AuditRunFindFirstArgs<ExtArgs>>): Prisma__AuditRunClient<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditRunFindFirstOrThrowArgs} args - Arguments to find a AuditRun
     * @example
     * // Get one AuditRun
     * const auditRun = await prisma.auditRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditRunFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditRunFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditRunClient<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditRuns
     * const auditRuns = await prisma.auditRun.findMany()
     * 
     * // Get first 10 AuditRuns
     * const auditRuns = await prisma.auditRun.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditRunWithIdOnly = await prisma.auditRun.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditRunFindManyArgs>(args?: SelectSubset<T, AuditRunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditRun.
     * @param {AuditRunCreateArgs} args - Arguments to create a AuditRun.
     * @example
     * // Create one AuditRun
     * const AuditRun = await prisma.auditRun.create({
     *   data: {
     *     // ... data to create a AuditRun
     *   }
     * })
     * 
     */
    create<T extends AuditRunCreateArgs>(args: SelectSubset<T, AuditRunCreateArgs<ExtArgs>>): Prisma__AuditRunClient<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditRuns.
     * @param {AuditRunCreateManyArgs} args - Arguments to create many AuditRuns.
     * @example
     * // Create many AuditRuns
     * const auditRun = await prisma.auditRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditRunCreateManyArgs>(args?: SelectSubset<T, AuditRunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditRuns and returns the data saved in the database.
     * @param {AuditRunCreateManyAndReturnArgs} args - Arguments to create many AuditRuns.
     * @example
     * // Create many AuditRuns
     * const auditRun = await prisma.auditRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditRuns and only return the `id`
     * const auditRunWithIdOnly = await prisma.auditRun.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditRunCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditRunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditRun.
     * @param {AuditRunDeleteArgs} args - Arguments to delete one AuditRun.
     * @example
     * // Delete one AuditRun
     * const AuditRun = await prisma.auditRun.delete({
     *   where: {
     *     // ... filter to delete one AuditRun
     *   }
     * })
     * 
     */
    delete<T extends AuditRunDeleteArgs>(args: SelectSubset<T, AuditRunDeleteArgs<ExtArgs>>): Prisma__AuditRunClient<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditRun.
     * @param {AuditRunUpdateArgs} args - Arguments to update one AuditRun.
     * @example
     * // Update one AuditRun
     * const auditRun = await prisma.auditRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditRunUpdateArgs>(args: SelectSubset<T, AuditRunUpdateArgs<ExtArgs>>): Prisma__AuditRunClient<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditRuns.
     * @param {AuditRunDeleteManyArgs} args - Arguments to filter AuditRuns to delete.
     * @example
     * // Delete a few AuditRuns
     * const { count } = await prisma.auditRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditRunDeleteManyArgs>(args?: SelectSubset<T, AuditRunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditRuns
     * const auditRun = await prisma.auditRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditRunUpdateManyArgs>(args: SelectSubset<T, AuditRunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditRuns and returns the data updated in the database.
     * @param {AuditRunUpdateManyAndReturnArgs} args - Arguments to update many AuditRuns.
     * @example
     * // Update many AuditRuns
     * const auditRun = await prisma.auditRun.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditRuns and only return the `id`
     * const auditRunWithIdOnly = await prisma.auditRun.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditRunUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditRunUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditRun.
     * @param {AuditRunUpsertArgs} args - Arguments to update or create a AuditRun.
     * @example
     * // Update or create a AuditRun
     * const auditRun = await prisma.auditRun.upsert({
     *   create: {
     *     // ... data to create a AuditRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditRun we want to update
     *   }
     * })
     */
    upsert<T extends AuditRunUpsertArgs>(args: SelectSubset<T, AuditRunUpsertArgs<ExtArgs>>): Prisma__AuditRunClient<$Result.GetResult<Prisma.$AuditRunPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditRunCountArgs} args - Arguments to filter AuditRuns to count.
     * @example
     * // Count the number of AuditRuns
     * const count = await prisma.auditRun.count({
     *   where: {
     *     // ... the filter for the AuditRuns we want to count
     *   }
     * })
    **/
    count<T extends AuditRunCountArgs>(
      args?: Subset<T, AuditRunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditRunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditRunAggregateArgs>(args: Subset<T, AuditRunAggregateArgs>): Prisma.PrismaPromise<GetAuditRunAggregateType<T>>

    /**
     * Group by AuditRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditRunGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditRunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditRunGroupByArgs['orderBy'] }
        : { orderBy?: AuditRunGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditRunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditRun model
   */
  readonly fields: AuditRunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditRun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditRunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditRun model
   */
  interface AuditRunFieldRefs {
    readonly id: FieldRef<"AuditRun", 'String'>
    readonly organizationId: FieldRef<"AuditRun", 'String'>
    readonly source: FieldRef<"AuditRun", 'String'>
    readonly drug: FieldRef<"AuditRun", 'String'>
    readonly verdict: FieldRef<"AuditRun", 'String'>
    readonly nLabelled: FieldRef<"AuditRun", 'Int'>
    readonly summary: FieldRef<"AuditRun", 'String'>
    readonly input: FieldRef<"AuditRun", 'String'>
    readonly results: FieldRef<"AuditRun", 'String'>
    readonly createdAt: FieldRef<"AuditRun", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditRun findUnique
   */
  export type AuditRunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * Filter, which AuditRun to fetch.
     */
    where: AuditRunWhereUniqueInput
  }

  /**
   * AuditRun findUniqueOrThrow
   */
  export type AuditRunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * Filter, which AuditRun to fetch.
     */
    where: AuditRunWhereUniqueInput
  }

  /**
   * AuditRun findFirst
   */
  export type AuditRunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * Filter, which AuditRun to fetch.
     */
    where?: AuditRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditRuns to fetch.
     */
    orderBy?: AuditRunOrderByWithRelationInput | AuditRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditRuns.
     */
    cursor?: AuditRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditRuns.
     */
    distinct?: AuditRunScalarFieldEnum | AuditRunScalarFieldEnum[]
  }

  /**
   * AuditRun findFirstOrThrow
   */
  export type AuditRunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * Filter, which AuditRun to fetch.
     */
    where?: AuditRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditRuns to fetch.
     */
    orderBy?: AuditRunOrderByWithRelationInput | AuditRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditRuns.
     */
    cursor?: AuditRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditRuns.
     */
    distinct?: AuditRunScalarFieldEnum | AuditRunScalarFieldEnum[]
  }

  /**
   * AuditRun findMany
   */
  export type AuditRunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * Filter, which AuditRuns to fetch.
     */
    where?: AuditRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditRuns to fetch.
     */
    orderBy?: AuditRunOrderByWithRelationInput | AuditRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditRuns.
     */
    cursor?: AuditRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditRuns.
     */
    skip?: number
    distinct?: AuditRunScalarFieldEnum | AuditRunScalarFieldEnum[]
  }

  /**
   * AuditRun create
   */
  export type AuditRunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * The data needed to create a AuditRun.
     */
    data: XOR<AuditRunCreateInput, AuditRunUncheckedCreateInput>
  }

  /**
   * AuditRun createMany
   */
  export type AuditRunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditRuns.
     */
    data: AuditRunCreateManyInput | AuditRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditRun createManyAndReturn
   */
  export type AuditRunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * The data used to create many AuditRuns.
     */
    data: AuditRunCreateManyInput | AuditRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditRun update
   */
  export type AuditRunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * The data needed to update a AuditRun.
     */
    data: XOR<AuditRunUpdateInput, AuditRunUncheckedUpdateInput>
    /**
     * Choose, which AuditRun to update.
     */
    where: AuditRunWhereUniqueInput
  }

  /**
   * AuditRun updateMany
   */
  export type AuditRunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditRuns.
     */
    data: XOR<AuditRunUpdateManyMutationInput, AuditRunUncheckedUpdateManyInput>
    /**
     * Filter which AuditRuns to update
     */
    where?: AuditRunWhereInput
    /**
     * Limit how many AuditRuns to update.
     */
    limit?: number
  }

  /**
   * AuditRun updateManyAndReturn
   */
  export type AuditRunUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * The data used to update AuditRuns.
     */
    data: XOR<AuditRunUpdateManyMutationInput, AuditRunUncheckedUpdateManyInput>
    /**
     * Filter which AuditRuns to update
     */
    where?: AuditRunWhereInput
    /**
     * Limit how many AuditRuns to update.
     */
    limit?: number
  }

  /**
   * AuditRun upsert
   */
  export type AuditRunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * The filter to search for the AuditRun to update in case it exists.
     */
    where: AuditRunWhereUniqueInput
    /**
     * In case the AuditRun found by the `where` argument doesn't exist, create a new AuditRun with this data.
     */
    create: XOR<AuditRunCreateInput, AuditRunUncheckedCreateInput>
    /**
     * In case the AuditRun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditRunUpdateInput, AuditRunUncheckedUpdateInput>
  }

  /**
   * AuditRun delete
   */
  export type AuditRunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
    /**
     * Filter which AuditRun to delete.
     */
    where: AuditRunWhereUniqueInput
  }

  /**
   * AuditRun deleteMany
   */
  export type AuditRunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditRuns to delete
     */
    where?: AuditRunWhereInput
    /**
     * Limit how many AuditRuns to delete.
     */
    limit?: number
  }

  /**
   * AuditRun without action
   */
  export type AuditRunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditRun
     */
    select?: AuditRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditRun
     */
    omit?: AuditRunOmit<ExtArgs> | null
  }


  /**
   * Model PredictRun
   */

  export type AggregatePredictRun = {
    _count: PredictRunCountAggregateOutputType | null
    _avg: PredictRunAvgAggregateOutputType | null
    _sum: PredictRunSumAggregateOutputType | null
    _min: PredictRunMinAggregateOutputType | null
    _max: PredictRunMaxAggregateOutputType | null
  }

  export type PredictRunAvgAggregateOutputType = {
    pR: number | null
  }

  export type PredictRunSumAggregateOutputType = {
    pR: number | null
  }

  export type PredictRunMinAggregateOutputType = {
    id: string | null
    organizationId: string | null
    drug: string | null
    isolate: string | null
    modelType: string | null
    m0Call: string | null
    pR: number | null
    call: string | null
    conformalSet: string | null
    input: string | null
    output: string | null
    createdAt: Date | null
  }

  export type PredictRunMaxAggregateOutputType = {
    id: string | null
    organizationId: string | null
    drug: string | null
    isolate: string | null
    modelType: string | null
    m0Call: string | null
    pR: number | null
    call: string | null
    conformalSet: string | null
    input: string | null
    output: string | null
    createdAt: Date | null
  }

  export type PredictRunCountAggregateOutputType = {
    id: number
    organizationId: number
    drug: number
    isolate: number
    modelType: number
    m0Call: number
    pR: number
    call: number
    conformalSet: number
    input: number
    output: number
    createdAt: number
    _all: number
  }


  export type PredictRunAvgAggregateInputType = {
    pR?: true
  }

  export type PredictRunSumAggregateInputType = {
    pR?: true
  }

  export type PredictRunMinAggregateInputType = {
    id?: true
    organizationId?: true
    drug?: true
    isolate?: true
    modelType?: true
    m0Call?: true
    pR?: true
    call?: true
    conformalSet?: true
    input?: true
    output?: true
    createdAt?: true
  }

  export type PredictRunMaxAggregateInputType = {
    id?: true
    organizationId?: true
    drug?: true
    isolate?: true
    modelType?: true
    m0Call?: true
    pR?: true
    call?: true
    conformalSet?: true
    input?: true
    output?: true
    createdAt?: true
  }

  export type PredictRunCountAggregateInputType = {
    id?: true
    organizationId?: true
    drug?: true
    isolate?: true
    modelType?: true
    m0Call?: true
    pR?: true
    call?: true
    conformalSet?: true
    input?: true
    output?: true
    createdAt?: true
    _all?: true
  }

  export type PredictRunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PredictRun to aggregate.
     */
    where?: PredictRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PredictRuns to fetch.
     */
    orderBy?: PredictRunOrderByWithRelationInput | PredictRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PredictRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PredictRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PredictRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PredictRuns
    **/
    _count?: true | PredictRunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PredictRunAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PredictRunSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PredictRunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PredictRunMaxAggregateInputType
  }

  export type GetPredictRunAggregateType<T extends PredictRunAggregateArgs> = {
        [P in keyof T & keyof AggregatePredictRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePredictRun[P]>
      : GetScalarType<T[P], AggregatePredictRun[P]>
  }




  export type PredictRunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PredictRunWhereInput
    orderBy?: PredictRunOrderByWithAggregationInput | PredictRunOrderByWithAggregationInput[]
    by: PredictRunScalarFieldEnum[] | PredictRunScalarFieldEnum
    having?: PredictRunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PredictRunCountAggregateInputType | true
    _avg?: PredictRunAvgAggregateInputType
    _sum?: PredictRunSumAggregateInputType
    _min?: PredictRunMinAggregateInputType
    _max?: PredictRunMaxAggregateInputType
  }

  export type PredictRunGroupByOutputType = {
    id: string
    organizationId: string | null
    drug: string
    isolate: string | null
    modelType: string
    m0Call: string | null
    pR: number | null
    call: string | null
    conformalSet: string | null
    input: string
    output: string
    createdAt: Date
    _count: PredictRunCountAggregateOutputType | null
    _avg: PredictRunAvgAggregateOutputType | null
    _sum: PredictRunSumAggregateOutputType | null
    _min: PredictRunMinAggregateOutputType | null
    _max: PredictRunMaxAggregateOutputType | null
  }

  type GetPredictRunGroupByPayload<T extends PredictRunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PredictRunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PredictRunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PredictRunGroupByOutputType[P]>
            : GetScalarType<T[P], PredictRunGroupByOutputType[P]>
        }
      >
    >


  export type PredictRunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    drug?: boolean
    isolate?: boolean
    modelType?: boolean
    m0Call?: boolean
    pR?: boolean
    call?: boolean
    conformalSet?: boolean
    input?: boolean
    output?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["predictRun"]>

  export type PredictRunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    drug?: boolean
    isolate?: boolean
    modelType?: boolean
    m0Call?: boolean
    pR?: boolean
    call?: boolean
    conformalSet?: boolean
    input?: boolean
    output?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["predictRun"]>

  export type PredictRunSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    drug?: boolean
    isolate?: boolean
    modelType?: boolean
    m0Call?: boolean
    pR?: boolean
    call?: boolean
    conformalSet?: boolean
    input?: boolean
    output?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["predictRun"]>

  export type PredictRunSelectScalar = {
    id?: boolean
    organizationId?: boolean
    drug?: boolean
    isolate?: boolean
    modelType?: boolean
    m0Call?: boolean
    pR?: boolean
    call?: boolean
    conformalSet?: boolean
    input?: boolean
    output?: boolean
    createdAt?: boolean
  }

  export type PredictRunOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "organizationId" | "drug" | "isolate" | "modelType" | "m0Call" | "pR" | "call" | "conformalSet" | "input" | "output" | "createdAt", ExtArgs["result"]["predictRun"]>

  export type $PredictRunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PredictRun"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      organizationId: string | null
      drug: string
      isolate: string | null
      modelType: string
      m0Call: string | null
      pR: number | null
      call: string | null
      conformalSet: string | null
      input: string
      output: string
      createdAt: Date
    }, ExtArgs["result"]["predictRun"]>
    composites: {}
  }

  type PredictRunGetPayload<S extends boolean | null | undefined | PredictRunDefaultArgs> = $Result.GetResult<Prisma.$PredictRunPayload, S>

  type PredictRunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PredictRunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PredictRunCountAggregateInputType | true
    }

  export interface PredictRunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PredictRun'], meta: { name: 'PredictRun' } }
    /**
     * Find zero or one PredictRun that matches the filter.
     * @param {PredictRunFindUniqueArgs} args - Arguments to find a PredictRun
     * @example
     * // Get one PredictRun
     * const predictRun = await prisma.predictRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PredictRunFindUniqueArgs>(args: SelectSubset<T, PredictRunFindUniqueArgs<ExtArgs>>): Prisma__PredictRunClient<$Result.GetResult<Prisma.$PredictRunPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PredictRun that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PredictRunFindUniqueOrThrowArgs} args - Arguments to find a PredictRun
     * @example
     * // Get one PredictRun
     * const predictRun = await prisma.predictRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PredictRunFindUniqueOrThrowArgs>(args: SelectSubset<T, PredictRunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PredictRunClient<$Result.GetResult<Prisma.$PredictRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PredictRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredictRunFindFirstArgs} args - Arguments to find a PredictRun
     * @example
     * // Get one PredictRun
     * const predictRun = await prisma.predictRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PredictRunFindFirstArgs>(args?: SelectSubset<T, PredictRunFindFirstArgs<ExtArgs>>): Prisma__PredictRunClient<$Result.GetResult<Prisma.$PredictRunPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PredictRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredictRunFindFirstOrThrowArgs} args - Arguments to find a PredictRun
     * @example
     * // Get one PredictRun
     * const predictRun = await prisma.predictRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PredictRunFindFirstOrThrowArgs>(args?: SelectSubset<T, PredictRunFindFirstOrThrowArgs<ExtArgs>>): Prisma__PredictRunClient<$Result.GetResult<Prisma.$PredictRunPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PredictRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredictRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PredictRuns
     * const predictRuns = await prisma.predictRun.findMany()
     * 
     * // Get first 10 PredictRuns
     * const predictRuns = await prisma.predictRun.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const predictRunWithIdOnly = await prisma.predictRun.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PredictRunFindManyArgs>(args?: SelectSubset<T, PredictRunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PredictRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PredictRun.
     * @param {PredictRunCreateArgs} args - Arguments to create a PredictRun.
     * @example
     * // Create one PredictRun
     * const PredictRun = await prisma.predictRun.create({
     *   data: {
     *     // ... data to create a PredictRun
     *   }
     * })
     * 
     */
    create<T extends PredictRunCreateArgs>(args: SelectSubset<T, PredictRunCreateArgs<ExtArgs>>): Prisma__PredictRunClient<$Result.GetResult<Prisma.$PredictRunPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PredictRuns.
     * @param {PredictRunCreateManyArgs} args - Arguments to create many PredictRuns.
     * @example
     * // Create many PredictRuns
     * const predictRun = await prisma.predictRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PredictRunCreateManyArgs>(args?: SelectSubset<T, PredictRunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PredictRuns and returns the data saved in the database.
     * @param {PredictRunCreateManyAndReturnArgs} args - Arguments to create many PredictRuns.
     * @example
     * // Create many PredictRuns
     * const predictRun = await prisma.predictRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PredictRuns and only return the `id`
     * const predictRunWithIdOnly = await prisma.predictRun.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PredictRunCreateManyAndReturnArgs>(args?: SelectSubset<T, PredictRunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PredictRunPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PredictRun.
     * @param {PredictRunDeleteArgs} args - Arguments to delete one PredictRun.
     * @example
     * // Delete one PredictRun
     * const PredictRun = await prisma.predictRun.delete({
     *   where: {
     *     // ... filter to delete one PredictRun
     *   }
     * })
     * 
     */
    delete<T extends PredictRunDeleteArgs>(args: SelectSubset<T, PredictRunDeleteArgs<ExtArgs>>): Prisma__PredictRunClient<$Result.GetResult<Prisma.$PredictRunPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PredictRun.
     * @param {PredictRunUpdateArgs} args - Arguments to update one PredictRun.
     * @example
     * // Update one PredictRun
     * const predictRun = await prisma.predictRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PredictRunUpdateArgs>(args: SelectSubset<T, PredictRunUpdateArgs<ExtArgs>>): Prisma__PredictRunClient<$Result.GetResult<Prisma.$PredictRunPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PredictRuns.
     * @param {PredictRunDeleteManyArgs} args - Arguments to filter PredictRuns to delete.
     * @example
     * // Delete a few PredictRuns
     * const { count } = await prisma.predictRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PredictRunDeleteManyArgs>(args?: SelectSubset<T, PredictRunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PredictRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredictRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PredictRuns
     * const predictRun = await prisma.predictRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PredictRunUpdateManyArgs>(args: SelectSubset<T, PredictRunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PredictRuns and returns the data updated in the database.
     * @param {PredictRunUpdateManyAndReturnArgs} args - Arguments to update many PredictRuns.
     * @example
     * // Update many PredictRuns
     * const predictRun = await prisma.predictRun.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PredictRuns and only return the `id`
     * const predictRunWithIdOnly = await prisma.predictRun.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PredictRunUpdateManyAndReturnArgs>(args: SelectSubset<T, PredictRunUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PredictRunPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PredictRun.
     * @param {PredictRunUpsertArgs} args - Arguments to update or create a PredictRun.
     * @example
     * // Update or create a PredictRun
     * const predictRun = await prisma.predictRun.upsert({
     *   create: {
     *     // ... data to create a PredictRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PredictRun we want to update
     *   }
     * })
     */
    upsert<T extends PredictRunUpsertArgs>(args: SelectSubset<T, PredictRunUpsertArgs<ExtArgs>>): Prisma__PredictRunClient<$Result.GetResult<Prisma.$PredictRunPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PredictRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredictRunCountArgs} args - Arguments to filter PredictRuns to count.
     * @example
     * // Count the number of PredictRuns
     * const count = await prisma.predictRun.count({
     *   where: {
     *     // ... the filter for the PredictRuns we want to count
     *   }
     * })
    **/
    count<T extends PredictRunCountArgs>(
      args?: Subset<T, PredictRunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PredictRunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PredictRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredictRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PredictRunAggregateArgs>(args: Subset<T, PredictRunAggregateArgs>): Prisma.PrismaPromise<GetPredictRunAggregateType<T>>

    /**
     * Group by PredictRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredictRunGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PredictRunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PredictRunGroupByArgs['orderBy'] }
        : { orderBy?: PredictRunGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PredictRunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPredictRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PredictRun model
   */
  readonly fields: PredictRunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PredictRun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PredictRunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PredictRun model
   */
  interface PredictRunFieldRefs {
    readonly id: FieldRef<"PredictRun", 'String'>
    readonly organizationId: FieldRef<"PredictRun", 'String'>
    readonly drug: FieldRef<"PredictRun", 'String'>
    readonly isolate: FieldRef<"PredictRun", 'String'>
    readonly modelType: FieldRef<"PredictRun", 'String'>
    readonly m0Call: FieldRef<"PredictRun", 'String'>
    readonly pR: FieldRef<"PredictRun", 'Float'>
    readonly call: FieldRef<"PredictRun", 'String'>
    readonly conformalSet: FieldRef<"PredictRun", 'String'>
    readonly input: FieldRef<"PredictRun", 'String'>
    readonly output: FieldRef<"PredictRun", 'String'>
    readonly createdAt: FieldRef<"PredictRun", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PredictRun findUnique
   */
  export type PredictRunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredictRun
     */
    select?: PredictRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PredictRun
     */
    omit?: PredictRunOmit<ExtArgs> | null
    /**
     * Filter, which PredictRun to fetch.
     */
    where: PredictRunWhereUniqueInput
  }

  /**
   * PredictRun findUniqueOrThrow
   */
  export type PredictRunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredictRun
     */
    select?: PredictRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PredictRun
     */
    omit?: PredictRunOmit<ExtArgs> | null
    /**
     * Filter, which PredictRun to fetch.
     */
    where: PredictRunWhereUniqueInput
  }

  /**
   * PredictRun findFirst
   */
  export type PredictRunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredictRun
     */
    select?: PredictRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PredictRun
     */
    omit?: PredictRunOmit<ExtArgs> | null
    /**
     * Filter, which PredictRun to fetch.
     */
    where?: PredictRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PredictRuns to fetch.
     */
    orderBy?: PredictRunOrderByWithRelationInput | PredictRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PredictRuns.
     */
    cursor?: PredictRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PredictRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PredictRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PredictRuns.
     */
    distinct?: PredictRunScalarFieldEnum | PredictRunScalarFieldEnum[]
  }

  /**
   * PredictRun findFirstOrThrow
   */
  export type PredictRunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredictRun
     */
    select?: PredictRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PredictRun
     */
    omit?: PredictRunOmit<ExtArgs> | null
    /**
     * Filter, which PredictRun to fetch.
     */
    where?: PredictRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PredictRuns to fetch.
     */
    orderBy?: PredictRunOrderByWithRelationInput | PredictRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PredictRuns.
     */
    cursor?: PredictRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PredictRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PredictRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PredictRuns.
     */
    distinct?: PredictRunScalarFieldEnum | PredictRunScalarFieldEnum[]
  }

  /**
   * PredictRun findMany
   */
  export type PredictRunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredictRun
     */
    select?: PredictRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PredictRun
     */
    omit?: PredictRunOmit<ExtArgs> | null
    /**
     * Filter, which PredictRuns to fetch.
     */
    where?: PredictRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PredictRuns to fetch.
     */
    orderBy?: PredictRunOrderByWithRelationInput | PredictRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PredictRuns.
     */
    cursor?: PredictRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PredictRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PredictRuns.
     */
    skip?: number
    distinct?: PredictRunScalarFieldEnum | PredictRunScalarFieldEnum[]
  }

  /**
   * PredictRun create
   */
  export type PredictRunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredictRun
     */
    select?: PredictRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PredictRun
     */
    omit?: PredictRunOmit<ExtArgs> | null
    /**
     * The data needed to create a PredictRun.
     */
    data: XOR<PredictRunCreateInput, PredictRunUncheckedCreateInput>
  }

  /**
   * PredictRun createMany
   */
  export type PredictRunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PredictRuns.
     */
    data: PredictRunCreateManyInput | PredictRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PredictRun createManyAndReturn
   */
  export type PredictRunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredictRun
     */
    select?: PredictRunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PredictRun
     */
    omit?: PredictRunOmit<ExtArgs> | null
    /**
     * The data used to create many PredictRuns.
     */
    data: PredictRunCreateManyInput | PredictRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PredictRun update
   */
  export type PredictRunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredictRun
     */
    select?: PredictRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PredictRun
     */
    omit?: PredictRunOmit<ExtArgs> | null
    /**
     * The data needed to update a PredictRun.
     */
    data: XOR<PredictRunUpdateInput, PredictRunUncheckedUpdateInput>
    /**
     * Choose, which PredictRun to update.
     */
    where: PredictRunWhereUniqueInput
  }

  /**
   * PredictRun updateMany
   */
  export type PredictRunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PredictRuns.
     */
    data: XOR<PredictRunUpdateManyMutationInput, PredictRunUncheckedUpdateManyInput>
    /**
     * Filter which PredictRuns to update
     */
    where?: PredictRunWhereInput
    /**
     * Limit how many PredictRuns to update.
     */
    limit?: number
  }

  /**
   * PredictRun updateManyAndReturn
   */
  export type PredictRunUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredictRun
     */
    select?: PredictRunSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PredictRun
     */
    omit?: PredictRunOmit<ExtArgs> | null
    /**
     * The data used to update PredictRuns.
     */
    data: XOR<PredictRunUpdateManyMutationInput, PredictRunUncheckedUpdateManyInput>
    /**
     * Filter which PredictRuns to update
     */
    where?: PredictRunWhereInput
    /**
     * Limit how many PredictRuns to update.
     */
    limit?: number
  }

  /**
   * PredictRun upsert
   */
  export type PredictRunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredictRun
     */
    select?: PredictRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PredictRun
     */
    omit?: PredictRunOmit<ExtArgs> | null
    /**
     * The filter to search for the PredictRun to update in case it exists.
     */
    where: PredictRunWhereUniqueInput
    /**
     * In case the PredictRun found by the `where` argument doesn't exist, create a new PredictRun with this data.
     */
    create: XOR<PredictRunCreateInput, PredictRunUncheckedCreateInput>
    /**
     * In case the PredictRun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PredictRunUpdateInput, PredictRunUncheckedUpdateInput>
  }

  /**
   * PredictRun delete
   */
  export type PredictRunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredictRun
     */
    select?: PredictRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PredictRun
     */
    omit?: PredictRunOmit<ExtArgs> | null
    /**
     * Filter which PredictRun to delete.
     */
    where: PredictRunWhereUniqueInput
  }

  /**
   * PredictRun deleteMany
   */
  export type PredictRunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PredictRuns to delete
     */
    where?: PredictRunWhereInput
    /**
     * Limit how many PredictRuns to delete.
     */
    limit?: number
  }

  /**
   * PredictRun without action
   */
  export type PredictRunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredictRun
     */
    select?: PredictRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PredictRun
     */
    omit?: PredictRunOmit<ExtArgs> | null
  }


  /**
   * Model ValidateRun
   */

  export type AggregateValidateRun = {
    _count: ValidateRunCountAggregateOutputType | null
    _avg: ValidateRunAvgAggregateOutputType | null
    _sum: ValidateRunSumAggregateOutputType | null
    _min: ValidateRunMinAggregateOutputType | null
    _max: ValidateRunMaxAggregateOutputType | null
  }

  export type ValidateRunAvgAggregateOutputType = {
    problems: number | null
  }

  export type ValidateRunSumAggregateOutputType = {
    problems: number | null
  }

  export type ValidateRunMinAggregateOutputType = {
    id: string | null
    organizationId: string | null
    drug: string | null
    problems: number | null
    verdict: string | null
    results: string | null
    createdAt: Date | null
  }

  export type ValidateRunMaxAggregateOutputType = {
    id: string | null
    organizationId: string | null
    drug: string | null
    problems: number | null
    verdict: string | null
    results: string | null
    createdAt: Date | null
  }

  export type ValidateRunCountAggregateOutputType = {
    id: number
    organizationId: number
    drug: number
    problems: number
    verdict: number
    results: number
    createdAt: number
    _all: number
  }


  export type ValidateRunAvgAggregateInputType = {
    problems?: true
  }

  export type ValidateRunSumAggregateInputType = {
    problems?: true
  }

  export type ValidateRunMinAggregateInputType = {
    id?: true
    organizationId?: true
    drug?: true
    problems?: true
    verdict?: true
    results?: true
    createdAt?: true
  }

  export type ValidateRunMaxAggregateInputType = {
    id?: true
    organizationId?: true
    drug?: true
    problems?: true
    verdict?: true
    results?: true
    createdAt?: true
  }

  export type ValidateRunCountAggregateInputType = {
    id?: true
    organizationId?: true
    drug?: true
    problems?: true
    verdict?: true
    results?: true
    createdAt?: true
    _all?: true
  }

  export type ValidateRunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ValidateRun to aggregate.
     */
    where?: ValidateRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ValidateRuns to fetch.
     */
    orderBy?: ValidateRunOrderByWithRelationInput | ValidateRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ValidateRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ValidateRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ValidateRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ValidateRuns
    **/
    _count?: true | ValidateRunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ValidateRunAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ValidateRunSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ValidateRunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ValidateRunMaxAggregateInputType
  }

  export type GetValidateRunAggregateType<T extends ValidateRunAggregateArgs> = {
        [P in keyof T & keyof AggregateValidateRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateValidateRun[P]>
      : GetScalarType<T[P], AggregateValidateRun[P]>
  }




  export type ValidateRunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ValidateRunWhereInput
    orderBy?: ValidateRunOrderByWithAggregationInput | ValidateRunOrderByWithAggregationInput[]
    by: ValidateRunScalarFieldEnum[] | ValidateRunScalarFieldEnum
    having?: ValidateRunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ValidateRunCountAggregateInputType | true
    _avg?: ValidateRunAvgAggregateInputType
    _sum?: ValidateRunSumAggregateInputType
    _min?: ValidateRunMinAggregateInputType
    _max?: ValidateRunMaxAggregateInputType
  }

  export type ValidateRunGroupByOutputType = {
    id: string
    organizationId: string | null
    drug: string
    problems: number
    verdict: string
    results: string
    createdAt: Date
    _count: ValidateRunCountAggregateOutputType | null
    _avg: ValidateRunAvgAggregateOutputType | null
    _sum: ValidateRunSumAggregateOutputType | null
    _min: ValidateRunMinAggregateOutputType | null
    _max: ValidateRunMaxAggregateOutputType | null
  }

  type GetValidateRunGroupByPayload<T extends ValidateRunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ValidateRunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ValidateRunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ValidateRunGroupByOutputType[P]>
            : GetScalarType<T[P], ValidateRunGroupByOutputType[P]>
        }
      >
    >


  export type ValidateRunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    drug?: boolean
    problems?: boolean
    verdict?: boolean
    results?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["validateRun"]>

  export type ValidateRunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    drug?: boolean
    problems?: boolean
    verdict?: boolean
    results?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["validateRun"]>

  export type ValidateRunSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    drug?: boolean
    problems?: boolean
    verdict?: boolean
    results?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["validateRun"]>

  export type ValidateRunSelectScalar = {
    id?: boolean
    organizationId?: boolean
    drug?: boolean
    problems?: boolean
    verdict?: boolean
    results?: boolean
    createdAt?: boolean
  }

  export type ValidateRunOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "organizationId" | "drug" | "problems" | "verdict" | "results" | "createdAt", ExtArgs["result"]["validateRun"]>

  export type $ValidateRunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ValidateRun"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      organizationId: string | null
      drug: string
      problems: number
      verdict: string
      results: string
      createdAt: Date
    }, ExtArgs["result"]["validateRun"]>
    composites: {}
  }

  type ValidateRunGetPayload<S extends boolean | null | undefined | ValidateRunDefaultArgs> = $Result.GetResult<Prisma.$ValidateRunPayload, S>

  type ValidateRunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ValidateRunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ValidateRunCountAggregateInputType | true
    }

  export interface ValidateRunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ValidateRun'], meta: { name: 'ValidateRun' } }
    /**
     * Find zero or one ValidateRun that matches the filter.
     * @param {ValidateRunFindUniqueArgs} args - Arguments to find a ValidateRun
     * @example
     * // Get one ValidateRun
     * const validateRun = await prisma.validateRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ValidateRunFindUniqueArgs>(args: SelectSubset<T, ValidateRunFindUniqueArgs<ExtArgs>>): Prisma__ValidateRunClient<$Result.GetResult<Prisma.$ValidateRunPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ValidateRun that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ValidateRunFindUniqueOrThrowArgs} args - Arguments to find a ValidateRun
     * @example
     * // Get one ValidateRun
     * const validateRun = await prisma.validateRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ValidateRunFindUniqueOrThrowArgs>(args: SelectSubset<T, ValidateRunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ValidateRunClient<$Result.GetResult<Prisma.$ValidateRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ValidateRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidateRunFindFirstArgs} args - Arguments to find a ValidateRun
     * @example
     * // Get one ValidateRun
     * const validateRun = await prisma.validateRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ValidateRunFindFirstArgs>(args?: SelectSubset<T, ValidateRunFindFirstArgs<ExtArgs>>): Prisma__ValidateRunClient<$Result.GetResult<Prisma.$ValidateRunPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ValidateRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidateRunFindFirstOrThrowArgs} args - Arguments to find a ValidateRun
     * @example
     * // Get one ValidateRun
     * const validateRun = await prisma.validateRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ValidateRunFindFirstOrThrowArgs>(args?: SelectSubset<T, ValidateRunFindFirstOrThrowArgs<ExtArgs>>): Prisma__ValidateRunClient<$Result.GetResult<Prisma.$ValidateRunPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ValidateRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidateRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ValidateRuns
     * const validateRuns = await prisma.validateRun.findMany()
     * 
     * // Get first 10 ValidateRuns
     * const validateRuns = await prisma.validateRun.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const validateRunWithIdOnly = await prisma.validateRun.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ValidateRunFindManyArgs>(args?: SelectSubset<T, ValidateRunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ValidateRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ValidateRun.
     * @param {ValidateRunCreateArgs} args - Arguments to create a ValidateRun.
     * @example
     * // Create one ValidateRun
     * const ValidateRun = await prisma.validateRun.create({
     *   data: {
     *     // ... data to create a ValidateRun
     *   }
     * })
     * 
     */
    create<T extends ValidateRunCreateArgs>(args: SelectSubset<T, ValidateRunCreateArgs<ExtArgs>>): Prisma__ValidateRunClient<$Result.GetResult<Prisma.$ValidateRunPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ValidateRuns.
     * @param {ValidateRunCreateManyArgs} args - Arguments to create many ValidateRuns.
     * @example
     * // Create many ValidateRuns
     * const validateRun = await prisma.validateRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ValidateRunCreateManyArgs>(args?: SelectSubset<T, ValidateRunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ValidateRuns and returns the data saved in the database.
     * @param {ValidateRunCreateManyAndReturnArgs} args - Arguments to create many ValidateRuns.
     * @example
     * // Create many ValidateRuns
     * const validateRun = await prisma.validateRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ValidateRuns and only return the `id`
     * const validateRunWithIdOnly = await prisma.validateRun.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ValidateRunCreateManyAndReturnArgs>(args?: SelectSubset<T, ValidateRunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ValidateRunPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ValidateRun.
     * @param {ValidateRunDeleteArgs} args - Arguments to delete one ValidateRun.
     * @example
     * // Delete one ValidateRun
     * const ValidateRun = await prisma.validateRun.delete({
     *   where: {
     *     // ... filter to delete one ValidateRun
     *   }
     * })
     * 
     */
    delete<T extends ValidateRunDeleteArgs>(args: SelectSubset<T, ValidateRunDeleteArgs<ExtArgs>>): Prisma__ValidateRunClient<$Result.GetResult<Prisma.$ValidateRunPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ValidateRun.
     * @param {ValidateRunUpdateArgs} args - Arguments to update one ValidateRun.
     * @example
     * // Update one ValidateRun
     * const validateRun = await prisma.validateRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ValidateRunUpdateArgs>(args: SelectSubset<T, ValidateRunUpdateArgs<ExtArgs>>): Prisma__ValidateRunClient<$Result.GetResult<Prisma.$ValidateRunPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ValidateRuns.
     * @param {ValidateRunDeleteManyArgs} args - Arguments to filter ValidateRuns to delete.
     * @example
     * // Delete a few ValidateRuns
     * const { count } = await prisma.validateRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ValidateRunDeleteManyArgs>(args?: SelectSubset<T, ValidateRunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ValidateRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidateRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ValidateRuns
     * const validateRun = await prisma.validateRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ValidateRunUpdateManyArgs>(args: SelectSubset<T, ValidateRunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ValidateRuns and returns the data updated in the database.
     * @param {ValidateRunUpdateManyAndReturnArgs} args - Arguments to update many ValidateRuns.
     * @example
     * // Update many ValidateRuns
     * const validateRun = await prisma.validateRun.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ValidateRuns and only return the `id`
     * const validateRunWithIdOnly = await prisma.validateRun.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ValidateRunUpdateManyAndReturnArgs>(args: SelectSubset<T, ValidateRunUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ValidateRunPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ValidateRun.
     * @param {ValidateRunUpsertArgs} args - Arguments to update or create a ValidateRun.
     * @example
     * // Update or create a ValidateRun
     * const validateRun = await prisma.validateRun.upsert({
     *   create: {
     *     // ... data to create a ValidateRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ValidateRun we want to update
     *   }
     * })
     */
    upsert<T extends ValidateRunUpsertArgs>(args: SelectSubset<T, ValidateRunUpsertArgs<ExtArgs>>): Prisma__ValidateRunClient<$Result.GetResult<Prisma.$ValidateRunPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ValidateRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidateRunCountArgs} args - Arguments to filter ValidateRuns to count.
     * @example
     * // Count the number of ValidateRuns
     * const count = await prisma.validateRun.count({
     *   where: {
     *     // ... the filter for the ValidateRuns we want to count
     *   }
     * })
    **/
    count<T extends ValidateRunCountArgs>(
      args?: Subset<T, ValidateRunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ValidateRunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ValidateRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidateRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ValidateRunAggregateArgs>(args: Subset<T, ValidateRunAggregateArgs>): Prisma.PrismaPromise<GetValidateRunAggregateType<T>>

    /**
     * Group by ValidateRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ValidateRunGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ValidateRunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ValidateRunGroupByArgs['orderBy'] }
        : { orderBy?: ValidateRunGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ValidateRunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetValidateRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ValidateRun model
   */
  readonly fields: ValidateRunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ValidateRun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ValidateRunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ValidateRun model
   */
  interface ValidateRunFieldRefs {
    readonly id: FieldRef<"ValidateRun", 'String'>
    readonly organizationId: FieldRef<"ValidateRun", 'String'>
    readonly drug: FieldRef<"ValidateRun", 'String'>
    readonly problems: FieldRef<"ValidateRun", 'Int'>
    readonly verdict: FieldRef<"ValidateRun", 'String'>
    readonly results: FieldRef<"ValidateRun", 'String'>
    readonly createdAt: FieldRef<"ValidateRun", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ValidateRun findUnique
   */
  export type ValidateRunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidateRun
     */
    select?: ValidateRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ValidateRun
     */
    omit?: ValidateRunOmit<ExtArgs> | null
    /**
     * Filter, which ValidateRun to fetch.
     */
    where: ValidateRunWhereUniqueInput
  }

  /**
   * ValidateRun findUniqueOrThrow
   */
  export type ValidateRunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidateRun
     */
    select?: ValidateRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ValidateRun
     */
    omit?: ValidateRunOmit<ExtArgs> | null
    /**
     * Filter, which ValidateRun to fetch.
     */
    where: ValidateRunWhereUniqueInput
  }

  /**
   * ValidateRun findFirst
   */
  export type ValidateRunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidateRun
     */
    select?: ValidateRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ValidateRun
     */
    omit?: ValidateRunOmit<ExtArgs> | null
    /**
     * Filter, which ValidateRun to fetch.
     */
    where?: ValidateRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ValidateRuns to fetch.
     */
    orderBy?: ValidateRunOrderByWithRelationInput | ValidateRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ValidateRuns.
     */
    cursor?: ValidateRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ValidateRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ValidateRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ValidateRuns.
     */
    distinct?: ValidateRunScalarFieldEnum | ValidateRunScalarFieldEnum[]
  }

  /**
   * ValidateRun findFirstOrThrow
   */
  export type ValidateRunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidateRun
     */
    select?: ValidateRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ValidateRun
     */
    omit?: ValidateRunOmit<ExtArgs> | null
    /**
     * Filter, which ValidateRun to fetch.
     */
    where?: ValidateRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ValidateRuns to fetch.
     */
    orderBy?: ValidateRunOrderByWithRelationInput | ValidateRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ValidateRuns.
     */
    cursor?: ValidateRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ValidateRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ValidateRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ValidateRuns.
     */
    distinct?: ValidateRunScalarFieldEnum | ValidateRunScalarFieldEnum[]
  }

  /**
   * ValidateRun findMany
   */
  export type ValidateRunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidateRun
     */
    select?: ValidateRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ValidateRun
     */
    omit?: ValidateRunOmit<ExtArgs> | null
    /**
     * Filter, which ValidateRuns to fetch.
     */
    where?: ValidateRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ValidateRuns to fetch.
     */
    orderBy?: ValidateRunOrderByWithRelationInput | ValidateRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ValidateRuns.
     */
    cursor?: ValidateRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ValidateRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ValidateRuns.
     */
    skip?: number
    distinct?: ValidateRunScalarFieldEnum | ValidateRunScalarFieldEnum[]
  }

  /**
   * ValidateRun create
   */
  export type ValidateRunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidateRun
     */
    select?: ValidateRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ValidateRun
     */
    omit?: ValidateRunOmit<ExtArgs> | null
    /**
     * The data needed to create a ValidateRun.
     */
    data: XOR<ValidateRunCreateInput, ValidateRunUncheckedCreateInput>
  }

  /**
   * ValidateRun createMany
   */
  export type ValidateRunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ValidateRuns.
     */
    data: ValidateRunCreateManyInput | ValidateRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ValidateRun createManyAndReturn
   */
  export type ValidateRunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidateRun
     */
    select?: ValidateRunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ValidateRun
     */
    omit?: ValidateRunOmit<ExtArgs> | null
    /**
     * The data used to create many ValidateRuns.
     */
    data: ValidateRunCreateManyInput | ValidateRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ValidateRun update
   */
  export type ValidateRunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidateRun
     */
    select?: ValidateRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ValidateRun
     */
    omit?: ValidateRunOmit<ExtArgs> | null
    /**
     * The data needed to update a ValidateRun.
     */
    data: XOR<ValidateRunUpdateInput, ValidateRunUncheckedUpdateInput>
    /**
     * Choose, which ValidateRun to update.
     */
    where: ValidateRunWhereUniqueInput
  }

  /**
   * ValidateRun updateMany
   */
  export type ValidateRunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ValidateRuns.
     */
    data: XOR<ValidateRunUpdateManyMutationInput, ValidateRunUncheckedUpdateManyInput>
    /**
     * Filter which ValidateRuns to update
     */
    where?: ValidateRunWhereInput
    /**
     * Limit how many ValidateRuns to update.
     */
    limit?: number
  }

  /**
   * ValidateRun updateManyAndReturn
   */
  export type ValidateRunUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidateRun
     */
    select?: ValidateRunSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ValidateRun
     */
    omit?: ValidateRunOmit<ExtArgs> | null
    /**
     * The data used to update ValidateRuns.
     */
    data: XOR<ValidateRunUpdateManyMutationInput, ValidateRunUncheckedUpdateManyInput>
    /**
     * Filter which ValidateRuns to update
     */
    where?: ValidateRunWhereInput
    /**
     * Limit how many ValidateRuns to update.
     */
    limit?: number
  }

  /**
   * ValidateRun upsert
   */
  export type ValidateRunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidateRun
     */
    select?: ValidateRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ValidateRun
     */
    omit?: ValidateRunOmit<ExtArgs> | null
    /**
     * The filter to search for the ValidateRun to update in case it exists.
     */
    where: ValidateRunWhereUniqueInput
    /**
     * In case the ValidateRun found by the `where` argument doesn't exist, create a new ValidateRun with this data.
     */
    create: XOR<ValidateRunCreateInput, ValidateRunUncheckedCreateInput>
    /**
     * In case the ValidateRun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ValidateRunUpdateInput, ValidateRunUncheckedUpdateInput>
  }

  /**
   * ValidateRun delete
   */
  export type ValidateRunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidateRun
     */
    select?: ValidateRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ValidateRun
     */
    omit?: ValidateRunOmit<ExtArgs> | null
    /**
     * Filter which ValidateRun to delete.
     */
    where: ValidateRunWhereUniqueInput
  }

  /**
   * ValidateRun deleteMany
   */
  export type ValidateRunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ValidateRuns to delete
     */
    where?: ValidateRunWhereInput
    /**
     * Limit how many ValidateRuns to delete.
     */
    limit?: number
  }

  /**
   * ValidateRun without action
   */
  export type ValidateRunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ValidateRun
     */
    select?: ValidateRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ValidateRun
     */
    omit?: ValidateRunOmit<ExtArgs> | null
  }


  /**
   * Model ServiceRequest
   */

  export type AggregateServiceRequest = {
    _count: ServiceRequestCountAggregateOutputType | null
    _avg: ServiceRequestAvgAggregateOutputType | null
    _sum: ServiceRequestSumAggregateOutputType | null
    _min: ServiceRequestMinAggregateOutputType | null
    _max: ServiceRequestMaxAggregateOutputType | null
  }

  export type ServiceRequestAvgAggregateOutputType = {
    isolates: number | null
  }

  export type ServiceRequestSumAggregateOutputType = {
    isolates: number | null
  }

  export type ServiceRequestMinAggregateOutputType = {
    id: string | null
    organizationId: string | null
    sku: string | null
    name: string | null
    email: string | null
    org: string | null
    isolates: number | null
    message: string | null
    status: string | null
    createdAt: Date | null
  }

  export type ServiceRequestMaxAggregateOutputType = {
    id: string | null
    organizationId: string | null
    sku: string | null
    name: string | null
    email: string | null
    org: string | null
    isolates: number | null
    message: string | null
    status: string | null
    createdAt: Date | null
  }

  export type ServiceRequestCountAggregateOutputType = {
    id: number
    organizationId: number
    sku: number
    name: number
    email: number
    org: number
    isolates: number
    message: number
    status: number
    createdAt: number
    _all: number
  }


  export type ServiceRequestAvgAggregateInputType = {
    isolates?: true
  }

  export type ServiceRequestSumAggregateInputType = {
    isolates?: true
  }

  export type ServiceRequestMinAggregateInputType = {
    id?: true
    organizationId?: true
    sku?: true
    name?: true
    email?: true
    org?: true
    isolates?: true
    message?: true
    status?: true
    createdAt?: true
  }

  export type ServiceRequestMaxAggregateInputType = {
    id?: true
    organizationId?: true
    sku?: true
    name?: true
    email?: true
    org?: true
    isolates?: true
    message?: true
    status?: true
    createdAt?: true
  }

  export type ServiceRequestCountAggregateInputType = {
    id?: true
    organizationId?: true
    sku?: true
    name?: true
    email?: true
    org?: true
    isolates?: true
    message?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type ServiceRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ServiceRequest to aggregate.
     */
    where?: ServiceRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServiceRequests to fetch.
     */
    orderBy?: ServiceRequestOrderByWithRelationInput | ServiceRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ServiceRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServiceRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServiceRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ServiceRequests
    **/
    _count?: true | ServiceRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ServiceRequestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ServiceRequestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ServiceRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ServiceRequestMaxAggregateInputType
  }

  export type GetServiceRequestAggregateType<T extends ServiceRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateServiceRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateServiceRequest[P]>
      : GetScalarType<T[P], AggregateServiceRequest[P]>
  }




  export type ServiceRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ServiceRequestWhereInput
    orderBy?: ServiceRequestOrderByWithAggregationInput | ServiceRequestOrderByWithAggregationInput[]
    by: ServiceRequestScalarFieldEnum[] | ServiceRequestScalarFieldEnum
    having?: ServiceRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ServiceRequestCountAggregateInputType | true
    _avg?: ServiceRequestAvgAggregateInputType
    _sum?: ServiceRequestSumAggregateInputType
    _min?: ServiceRequestMinAggregateInputType
    _max?: ServiceRequestMaxAggregateInputType
  }

  export type ServiceRequestGroupByOutputType = {
    id: string
    organizationId: string | null
    sku: string
    name: string
    email: string
    org: string | null
    isolates: number | null
    message: string | null
    status: string
    createdAt: Date
    _count: ServiceRequestCountAggregateOutputType | null
    _avg: ServiceRequestAvgAggregateOutputType | null
    _sum: ServiceRequestSumAggregateOutputType | null
    _min: ServiceRequestMinAggregateOutputType | null
    _max: ServiceRequestMaxAggregateOutputType | null
  }

  type GetServiceRequestGroupByPayload<T extends ServiceRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ServiceRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ServiceRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ServiceRequestGroupByOutputType[P]>
            : GetScalarType<T[P], ServiceRequestGroupByOutputType[P]>
        }
      >
    >


  export type ServiceRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    sku?: boolean
    name?: boolean
    email?: boolean
    org?: boolean
    isolates?: boolean
    message?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["serviceRequest"]>

  export type ServiceRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    sku?: boolean
    name?: boolean
    email?: boolean
    org?: boolean
    isolates?: boolean
    message?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["serviceRequest"]>

  export type ServiceRequestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    sku?: boolean
    name?: boolean
    email?: boolean
    org?: boolean
    isolates?: boolean
    message?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["serviceRequest"]>

  export type ServiceRequestSelectScalar = {
    id?: boolean
    organizationId?: boolean
    sku?: boolean
    name?: boolean
    email?: boolean
    org?: boolean
    isolates?: boolean
    message?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type ServiceRequestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "organizationId" | "sku" | "name" | "email" | "org" | "isolates" | "message" | "status" | "createdAt", ExtArgs["result"]["serviceRequest"]>

  export type $ServiceRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ServiceRequest"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      organizationId: string | null
      sku: string
      name: string
      email: string
      org: string | null
      isolates: number | null
      message: string | null
      status: string
      createdAt: Date
    }, ExtArgs["result"]["serviceRequest"]>
    composites: {}
  }

  type ServiceRequestGetPayload<S extends boolean | null | undefined | ServiceRequestDefaultArgs> = $Result.GetResult<Prisma.$ServiceRequestPayload, S>

  type ServiceRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ServiceRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ServiceRequestCountAggregateInputType | true
    }

  export interface ServiceRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ServiceRequest'], meta: { name: 'ServiceRequest' } }
    /**
     * Find zero or one ServiceRequest that matches the filter.
     * @param {ServiceRequestFindUniqueArgs} args - Arguments to find a ServiceRequest
     * @example
     * // Get one ServiceRequest
     * const serviceRequest = await prisma.serviceRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ServiceRequestFindUniqueArgs>(args: SelectSubset<T, ServiceRequestFindUniqueArgs<ExtArgs>>): Prisma__ServiceRequestClient<$Result.GetResult<Prisma.$ServiceRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ServiceRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ServiceRequestFindUniqueOrThrowArgs} args - Arguments to find a ServiceRequest
     * @example
     * // Get one ServiceRequest
     * const serviceRequest = await prisma.serviceRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ServiceRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, ServiceRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ServiceRequestClient<$Result.GetResult<Prisma.$ServiceRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ServiceRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceRequestFindFirstArgs} args - Arguments to find a ServiceRequest
     * @example
     * // Get one ServiceRequest
     * const serviceRequest = await prisma.serviceRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ServiceRequestFindFirstArgs>(args?: SelectSubset<T, ServiceRequestFindFirstArgs<ExtArgs>>): Prisma__ServiceRequestClient<$Result.GetResult<Prisma.$ServiceRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ServiceRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceRequestFindFirstOrThrowArgs} args - Arguments to find a ServiceRequest
     * @example
     * // Get one ServiceRequest
     * const serviceRequest = await prisma.serviceRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ServiceRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, ServiceRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__ServiceRequestClient<$Result.GetResult<Prisma.$ServiceRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ServiceRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ServiceRequests
     * const serviceRequests = await prisma.serviceRequest.findMany()
     * 
     * // Get first 10 ServiceRequests
     * const serviceRequests = await prisma.serviceRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const serviceRequestWithIdOnly = await prisma.serviceRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ServiceRequestFindManyArgs>(args?: SelectSubset<T, ServiceRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServiceRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ServiceRequest.
     * @param {ServiceRequestCreateArgs} args - Arguments to create a ServiceRequest.
     * @example
     * // Create one ServiceRequest
     * const ServiceRequest = await prisma.serviceRequest.create({
     *   data: {
     *     // ... data to create a ServiceRequest
     *   }
     * })
     * 
     */
    create<T extends ServiceRequestCreateArgs>(args: SelectSubset<T, ServiceRequestCreateArgs<ExtArgs>>): Prisma__ServiceRequestClient<$Result.GetResult<Prisma.$ServiceRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ServiceRequests.
     * @param {ServiceRequestCreateManyArgs} args - Arguments to create many ServiceRequests.
     * @example
     * // Create many ServiceRequests
     * const serviceRequest = await prisma.serviceRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ServiceRequestCreateManyArgs>(args?: SelectSubset<T, ServiceRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ServiceRequests and returns the data saved in the database.
     * @param {ServiceRequestCreateManyAndReturnArgs} args - Arguments to create many ServiceRequests.
     * @example
     * // Create many ServiceRequests
     * const serviceRequest = await prisma.serviceRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ServiceRequests and only return the `id`
     * const serviceRequestWithIdOnly = await prisma.serviceRequest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ServiceRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, ServiceRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServiceRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ServiceRequest.
     * @param {ServiceRequestDeleteArgs} args - Arguments to delete one ServiceRequest.
     * @example
     * // Delete one ServiceRequest
     * const ServiceRequest = await prisma.serviceRequest.delete({
     *   where: {
     *     // ... filter to delete one ServiceRequest
     *   }
     * })
     * 
     */
    delete<T extends ServiceRequestDeleteArgs>(args: SelectSubset<T, ServiceRequestDeleteArgs<ExtArgs>>): Prisma__ServiceRequestClient<$Result.GetResult<Prisma.$ServiceRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ServiceRequest.
     * @param {ServiceRequestUpdateArgs} args - Arguments to update one ServiceRequest.
     * @example
     * // Update one ServiceRequest
     * const serviceRequest = await prisma.serviceRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ServiceRequestUpdateArgs>(args: SelectSubset<T, ServiceRequestUpdateArgs<ExtArgs>>): Prisma__ServiceRequestClient<$Result.GetResult<Prisma.$ServiceRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ServiceRequests.
     * @param {ServiceRequestDeleteManyArgs} args - Arguments to filter ServiceRequests to delete.
     * @example
     * // Delete a few ServiceRequests
     * const { count } = await prisma.serviceRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ServiceRequestDeleteManyArgs>(args?: SelectSubset<T, ServiceRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ServiceRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ServiceRequests
     * const serviceRequest = await prisma.serviceRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ServiceRequestUpdateManyArgs>(args: SelectSubset<T, ServiceRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ServiceRequests and returns the data updated in the database.
     * @param {ServiceRequestUpdateManyAndReturnArgs} args - Arguments to update many ServiceRequests.
     * @example
     * // Update many ServiceRequests
     * const serviceRequest = await prisma.serviceRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ServiceRequests and only return the `id`
     * const serviceRequestWithIdOnly = await prisma.serviceRequest.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ServiceRequestUpdateManyAndReturnArgs>(args: SelectSubset<T, ServiceRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServiceRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ServiceRequest.
     * @param {ServiceRequestUpsertArgs} args - Arguments to update or create a ServiceRequest.
     * @example
     * // Update or create a ServiceRequest
     * const serviceRequest = await prisma.serviceRequest.upsert({
     *   create: {
     *     // ... data to create a ServiceRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ServiceRequest we want to update
     *   }
     * })
     */
    upsert<T extends ServiceRequestUpsertArgs>(args: SelectSubset<T, ServiceRequestUpsertArgs<ExtArgs>>): Prisma__ServiceRequestClient<$Result.GetResult<Prisma.$ServiceRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ServiceRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceRequestCountArgs} args - Arguments to filter ServiceRequests to count.
     * @example
     * // Count the number of ServiceRequests
     * const count = await prisma.serviceRequest.count({
     *   where: {
     *     // ... the filter for the ServiceRequests we want to count
     *   }
     * })
    **/
    count<T extends ServiceRequestCountArgs>(
      args?: Subset<T, ServiceRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ServiceRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ServiceRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ServiceRequestAggregateArgs>(args: Subset<T, ServiceRequestAggregateArgs>): Prisma.PrismaPromise<GetServiceRequestAggregateType<T>>

    /**
     * Group by ServiceRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ServiceRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ServiceRequestGroupByArgs['orderBy'] }
        : { orderBy?: ServiceRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ServiceRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetServiceRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ServiceRequest model
   */
  readonly fields: ServiceRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ServiceRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ServiceRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ServiceRequest model
   */
  interface ServiceRequestFieldRefs {
    readonly id: FieldRef<"ServiceRequest", 'String'>
    readonly organizationId: FieldRef<"ServiceRequest", 'String'>
    readonly sku: FieldRef<"ServiceRequest", 'String'>
    readonly name: FieldRef<"ServiceRequest", 'String'>
    readonly email: FieldRef<"ServiceRequest", 'String'>
    readonly org: FieldRef<"ServiceRequest", 'String'>
    readonly isolates: FieldRef<"ServiceRequest", 'Int'>
    readonly message: FieldRef<"ServiceRequest", 'String'>
    readonly status: FieldRef<"ServiceRequest", 'String'>
    readonly createdAt: FieldRef<"ServiceRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ServiceRequest findUnique
   */
  export type ServiceRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceRequest
     */
    select?: ServiceRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceRequest
     */
    omit?: ServiceRequestOmit<ExtArgs> | null
    /**
     * Filter, which ServiceRequest to fetch.
     */
    where: ServiceRequestWhereUniqueInput
  }

  /**
   * ServiceRequest findUniqueOrThrow
   */
  export type ServiceRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceRequest
     */
    select?: ServiceRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceRequest
     */
    omit?: ServiceRequestOmit<ExtArgs> | null
    /**
     * Filter, which ServiceRequest to fetch.
     */
    where: ServiceRequestWhereUniqueInput
  }

  /**
   * ServiceRequest findFirst
   */
  export type ServiceRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceRequest
     */
    select?: ServiceRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceRequest
     */
    omit?: ServiceRequestOmit<ExtArgs> | null
    /**
     * Filter, which ServiceRequest to fetch.
     */
    where?: ServiceRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServiceRequests to fetch.
     */
    orderBy?: ServiceRequestOrderByWithRelationInput | ServiceRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ServiceRequests.
     */
    cursor?: ServiceRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServiceRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServiceRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ServiceRequests.
     */
    distinct?: ServiceRequestScalarFieldEnum | ServiceRequestScalarFieldEnum[]
  }

  /**
   * ServiceRequest findFirstOrThrow
   */
  export type ServiceRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceRequest
     */
    select?: ServiceRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceRequest
     */
    omit?: ServiceRequestOmit<ExtArgs> | null
    /**
     * Filter, which ServiceRequest to fetch.
     */
    where?: ServiceRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServiceRequests to fetch.
     */
    orderBy?: ServiceRequestOrderByWithRelationInput | ServiceRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ServiceRequests.
     */
    cursor?: ServiceRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServiceRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServiceRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ServiceRequests.
     */
    distinct?: ServiceRequestScalarFieldEnum | ServiceRequestScalarFieldEnum[]
  }

  /**
   * ServiceRequest findMany
   */
  export type ServiceRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceRequest
     */
    select?: ServiceRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceRequest
     */
    omit?: ServiceRequestOmit<ExtArgs> | null
    /**
     * Filter, which ServiceRequests to fetch.
     */
    where?: ServiceRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServiceRequests to fetch.
     */
    orderBy?: ServiceRequestOrderByWithRelationInput | ServiceRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ServiceRequests.
     */
    cursor?: ServiceRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServiceRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServiceRequests.
     */
    skip?: number
    distinct?: ServiceRequestScalarFieldEnum | ServiceRequestScalarFieldEnum[]
  }

  /**
   * ServiceRequest create
   */
  export type ServiceRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceRequest
     */
    select?: ServiceRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceRequest
     */
    omit?: ServiceRequestOmit<ExtArgs> | null
    /**
     * The data needed to create a ServiceRequest.
     */
    data: XOR<ServiceRequestCreateInput, ServiceRequestUncheckedCreateInput>
  }

  /**
   * ServiceRequest createMany
   */
  export type ServiceRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ServiceRequests.
     */
    data: ServiceRequestCreateManyInput | ServiceRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ServiceRequest createManyAndReturn
   */
  export type ServiceRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceRequest
     */
    select?: ServiceRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceRequest
     */
    omit?: ServiceRequestOmit<ExtArgs> | null
    /**
     * The data used to create many ServiceRequests.
     */
    data: ServiceRequestCreateManyInput | ServiceRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ServiceRequest update
   */
  export type ServiceRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceRequest
     */
    select?: ServiceRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceRequest
     */
    omit?: ServiceRequestOmit<ExtArgs> | null
    /**
     * The data needed to update a ServiceRequest.
     */
    data: XOR<ServiceRequestUpdateInput, ServiceRequestUncheckedUpdateInput>
    /**
     * Choose, which ServiceRequest to update.
     */
    where: ServiceRequestWhereUniqueInput
  }

  /**
   * ServiceRequest updateMany
   */
  export type ServiceRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ServiceRequests.
     */
    data: XOR<ServiceRequestUpdateManyMutationInput, ServiceRequestUncheckedUpdateManyInput>
    /**
     * Filter which ServiceRequests to update
     */
    where?: ServiceRequestWhereInput
    /**
     * Limit how many ServiceRequests to update.
     */
    limit?: number
  }

  /**
   * ServiceRequest updateManyAndReturn
   */
  export type ServiceRequestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceRequest
     */
    select?: ServiceRequestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceRequest
     */
    omit?: ServiceRequestOmit<ExtArgs> | null
    /**
     * The data used to update ServiceRequests.
     */
    data: XOR<ServiceRequestUpdateManyMutationInput, ServiceRequestUncheckedUpdateManyInput>
    /**
     * Filter which ServiceRequests to update
     */
    where?: ServiceRequestWhereInput
    /**
     * Limit how many ServiceRequests to update.
     */
    limit?: number
  }

  /**
   * ServiceRequest upsert
   */
  export type ServiceRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceRequest
     */
    select?: ServiceRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceRequest
     */
    omit?: ServiceRequestOmit<ExtArgs> | null
    /**
     * The filter to search for the ServiceRequest to update in case it exists.
     */
    where: ServiceRequestWhereUniqueInput
    /**
     * In case the ServiceRequest found by the `where` argument doesn't exist, create a new ServiceRequest with this data.
     */
    create: XOR<ServiceRequestCreateInput, ServiceRequestUncheckedCreateInput>
    /**
     * In case the ServiceRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ServiceRequestUpdateInput, ServiceRequestUncheckedUpdateInput>
  }

  /**
   * ServiceRequest delete
   */
  export type ServiceRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceRequest
     */
    select?: ServiceRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceRequest
     */
    omit?: ServiceRequestOmit<ExtArgs> | null
    /**
     * Filter which ServiceRequest to delete.
     */
    where: ServiceRequestWhereUniqueInput
  }

  /**
   * ServiceRequest deleteMany
   */
  export type ServiceRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ServiceRequests to delete
     */
    where?: ServiceRequestWhereInput
    /**
     * Limit how many ServiceRequests to delete.
     */
    limit?: number
  }

  /**
   * ServiceRequest without action
   */
  export type ServiceRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceRequest
     */
    select?: ServiceRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceRequest
     */
    omit?: ServiceRequestOmit<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _avg: AuditLogAvgAggregateOutputType | null
    _sum: AuditLogSumAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogAvgAggregateOutputType = {
    seq: number | null
  }

  export type AuditLogSumAggregateOutputType = {
    seq: number | null
  }

  export type AuditLogMinAggregateOutputType = {
    seq: number | null
    id: string | null
    actor: string | null
    action: string | null
    detail: string | null
    hash: string | null
    prevHash: string | null
    createdAt: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    seq: number | null
    id: string | null
    actor: string | null
    action: string | null
    detail: string | null
    hash: string | null
    prevHash: string | null
    createdAt: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    seq: number
    id: number
    actor: number
    action: number
    detail: number
    hash: number
    prevHash: number
    createdAt: number
    _all: number
  }


  export type AuditLogAvgAggregateInputType = {
    seq?: true
  }

  export type AuditLogSumAggregateInputType = {
    seq?: true
  }

  export type AuditLogMinAggregateInputType = {
    seq?: true
    id?: true
    actor?: true
    action?: true
    detail?: true
    hash?: true
    prevHash?: true
    createdAt?: true
  }

  export type AuditLogMaxAggregateInputType = {
    seq?: true
    id?: true
    actor?: true
    action?: true
    detail?: true
    hash?: true
    prevHash?: true
    createdAt?: true
  }

  export type AuditLogCountAggregateInputType = {
    seq?: true
    id?: true
    actor?: true
    action?: true
    detail?: true
    hash?: true
    prevHash?: true
    createdAt?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AuditLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AuditLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _avg?: AuditLogAvgAggregateInputType
    _sum?: AuditLogSumAggregateInputType
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    seq: number
    id: string
    actor: string
    action: string
    detail: string
    hash: string
    prevHash: string | null
    createdAt: Date
    _count: AuditLogCountAggregateOutputType | null
    _avg: AuditLogAvgAggregateOutputType | null
    _sum: AuditLogSumAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    seq?: boolean
    id?: boolean
    actor?: boolean
    action?: boolean
    detail?: boolean
    hash?: boolean
    prevHash?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    seq?: boolean
    id?: boolean
    actor?: boolean
    action?: boolean
    detail?: boolean
    hash?: boolean
    prevHash?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    seq?: boolean
    id?: boolean
    actor?: boolean
    action?: boolean
    detail?: boolean
    hash?: boolean
    prevHash?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    seq?: boolean
    id?: boolean
    actor?: boolean
    action?: boolean
    detail?: boolean
    hash?: boolean
    prevHash?: boolean
    createdAt?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"seq" | "id" | "actor" | "action" | "detail" | "hash" | "prevHash" | "createdAt", ExtArgs["result"]["auditLog"]>

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      seq: number
      id: string
      actor: string
      action: string
      detail: string
      hash: string
      prevHash: string | null
      createdAt: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `seq`
     * const auditLogWithSeqOnly = await prisma.auditLog.findMany({ select: { seq: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `seq`
     * const auditLogWithSeqOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { seq: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `seq`
     * const auditLogWithSeqOnly = await prisma.auditLog.updateManyAndReturn({
     *   select: { seq: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly seq: FieldRef<"AuditLog", 'Int'>
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly actor: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly detail: FieldRef<"AuditLog", 'String'>
    readonly hash: FieldRef<"AuditLog", 'String'>
    readonly prevHash: FieldRef<"AuditLog", 'String'>
    readonly createdAt: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
  }


  /**
   * Model ApiKey
   */

  export type AggregateApiKey = {
    _count: ApiKeyCountAggregateOutputType | null
    _avg: ApiKeyAvgAggregateOutputType | null
    _sum: ApiKeySumAggregateOutputType | null
    _min: ApiKeyMinAggregateOutputType | null
    _max: ApiKeyMaxAggregateOutputType | null
  }

  export type ApiKeyAvgAggregateOutputType = {
    credits: number | null
  }

  export type ApiKeySumAggregateOutputType = {
    credits: number | null
  }

  export type ApiKeyMinAggregateOutputType = {
    id: string | null
    organizationId: string | null
    label: string | null
    keyPrefix: string | null
    keyHash: string | null
    scope: string | null
    credits: number | null
    lastUsedAt: Date | null
    revokedAt: Date | null
    createdAt: Date | null
  }

  export type ApiKeyMaxAggregateOutputType = {
    id: string | null
    organizationId: string | null
    label: string | null
    keyPrefix: string | null
    keyHash: string | null
    scope: string | null
    credits: number | null
    lastUsedAt: Date | null
    revokedAt: Date | null
    createdAt: Date | null
  }

  export type ApiKeyCountAggregateOutputType = {
    id: number
    organizationId: number
    label: number
    keyPrefix: number
    keyHash: number
    scope: number
    credits: number
    lastUsedAt: number
    revokedAt: number
    createdAt: number
    _all: number
  }


  export type ApiKeyAvgAggregateInputType = {
    credits?: true
  }

  export type ApiKeySumAggregateInputType = {
    credits?: true
  }

  export type ApiKeyMinAggregateInputType = {
    id?: true
    organizationId?: true
    label?: true
    keyPrefix?: true
    keyHash?: true
    scope?: true
    credits?: true
    lastUsedAt?: true
    revokedAt?: true
    createdAt?: true
  }

  export type ApiKeyMaxAggregateInputType = {
    id?: true
    organizationId?: true
    label?: true
    keyPrefix?: true
    keyHash?: true
    scope?: true
    credits?: true
    lastUsedAt?: true
    revokedAt?: true
    createdAt?: true
  }

  export type ApiKeyCountAggregateInputType = {
    id?: true
    organizationId?: true
    label?: true
    keyPrefix?: true
    keyHash?: true
    scope?: true
    credits?: true
    lastUsedAt?: true
    revokedAt?: true
    createdAt?: true
    _all?: true
  }

  export type ApiKeyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApiKey to aggregate.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ApiKeys
    **/
    _count?: true | ApiKeyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ApiKeyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ApiKeySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ApiKeyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ApiKeyMaxAggregateInputType
  }

  export type GetApiKeyAggregateType<T extends ApiKeyAggregateArgs> = {
        [P in keyof T & keyof AggregateApiKey]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApiKey[P]>
      : GetScalarType<T[P], AggregateApiKey[P]>
  }




  export type ApiKeyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApiKeyWhereInput
    orderBy?: ApiKeyOrderByWithAggregationInput | ApiKeyOrderByWithAggregationInput[]
    by: ApiKeyScalarFieldEnum[] | ApiKeyScalarFieldEnum
    having?: ApiKeyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ApiKeyCountAggregateInputType | true
    _avg?: ApiKeyAvgAggregateInputType
    _sum?: ApiKeySumAggregateInputType
    _min?: ApiKeyMinAggregateInputType
    _max?: ApiKeyMaxAggregateInputType
  }

  export type ApiKeyGroupByOutputType = {
    id: string
    organizationId: string | null
    label: string
    keyPrefix: string
    keyHash: string
    scope: string
    credits: number
    lastUsedAt: Date | null
    revokedAt: Date | null
    createdAt: Date
    _count: ApiKeyCountAggregateOutputType | null
    _avg: ApiKeyAvgAggregateOutputType | null
    _sum: ApiKeySumAggregateOutputType | null
    _min: ApiKeyMinAggregateOutputType | null
    _max: ApiKeyMaxAggregateOutputType | null
  }

  type GetApiKeyGroupByPayload<T extends ApiKeyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ApiKeyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ApiKeyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ApiKeyGroupByOutputType[P]>
            : GetScalarType<T[P], ApiKeyGroupByOutputType[P]>
        }
      >
    >


  export type ApiKeySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    label?: boolean
    keyPrefix?: boolean
    keyHash?: boolean
    scope?: boolean
    credits?: boolean
    lastUsedAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["apiKey"]>

  export type ApiKeySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    label?: boolean
    keyPrefix?: boolean
    keyHash?: boolean
    scope?: boolean
    credits?: boolean
    lastUsedAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["apiKey"]>

  export type ApiKeySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    label?: boolean
    keyPrefix?: boolean
    keyHash?: boolean
    scope?: boolean
    credits?: boolean
    lastUsedAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["apiKey"]>

  export type ApiKeySelectScalar = {
    id?: boolean
    organizationId?: boolean
    label?: boolean
    keyPrefix?: boolean
    keyHash?: boolean
    scope?: boolean
    credits?: boolean
    lastUsedAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
  }

  export type ApiKeyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "organizationId" | "label" | "keyPrefix" | "keyHash" | "scope" | "credits" | "lastUsedAt" | "revokedAt" | "createdAt", ExtArgs["result"]["apiKey"]>

  export type $ApiKeyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ApiKey"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      organizationId: string | null
      label: string
      keyPrefix: string
      keyHash: string
      scope: string
      credits: number
      lastUsedAt: Date | null
      revokedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["apiKey"]>
    composites: {}
  }

  type ApiKeyGetPayload<S extends boolean | null | undefined | ApiKeyDefaultArgs> = $Result.GetResult<Prisma.$ApiKeyPayload, S>

  type ApiKeyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ApiKeyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ApiKeyCountAggregateInputType | true
    }

  export interface ApiKeyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ApiKey'], meta: { name: 'ApiKey' } }
    /**
     * Find zero or one ApiKey that matches the filter.
     * @param {ApiKeyFindUniqueArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ApiKeyFindUniqueArgs>(args: SelectSubset<T, ApiKeyFindUniqueArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ApiKey that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ApiKeyFindUniqueOrThrowArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ApiKeyFindUniqueOrThrowArgs>(args: SelectSubset<T, ApiKeyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ApiKey that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyFindFirstArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ApiKeyFindFirstArgs>(args?: SelectSubset<T, ApiKeyFindFirstArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ApiKey that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyFindFirstOrThrowArgs} args - Arguments to find a ApiKey
     * @example
     * // Get one ApiKey
     * const apiKey = await prisma.apiKey.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ApiKeyFindFirstOrThrowArgs>(args?: SelectSubset<T, ApiKeyFindFirstOrThrowArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ApiKeys that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ApiKeys
     * const apiKeys = await prisma.apiKey.findMany()
     * 
     * // Get first 10 ApiKeys
     * const apiKeys = await prisma.apiKey.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const apiKeyWithIdOnly = await prisma.apiKey.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ApiKeyFindManyArgs>(args?: SelectSubset<T, ApiKeyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ApiKey.
     * @param {ApiKeyCreateArgs} args - Arguments to create a ApiKey.
     * @example
     * // Create one ApiKey
     * const ApiKey = await prisma.apiKey.create({
     *   data: {
     *     // ... data to create a ApiKey
     *   }
     * })
     * 
     */
    create<T extends ApiKeyCreateArgs>(args: SelectSubset<T, ApiKeyCreateArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ApiKeys.
     * @param {ApiKeyCreateManyArgs} args - Arguments to create many ApiKeys.
     * @example
     * // Create many ApiKeys
     * const apiKey = await prisma.apiKey.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ApiKeyCreateManyArgs>(args?: SelectSubset<T, ApiKeyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ApiKeys and returns the data saved in the database.
     * @param {ApiKeyCreateManyAndReturnArgs} args - Arguments to create many ApiKeys.
     * @example
     * // Create many ApiKeys
     * const apiKey = await prisma.apiKey.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ApiKeys and only return the `id`
     * const apiKeyWithIdOnly = await prisma.apiKey.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ApiKeyCreateManyAndReturnArgs>(args?: SelectSubset<T, ApiKeyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ApiKey.
     * @param {ApiKeyDeleteArgs} args - Arguments to delete one ApiKey.
     * @example
     * // Delete one ApiKey
     * const ApiKey = await prisma.apiKey.delete({
     *   where: {
     *     // ... filter to delete one ApiKey
     *   }
     * })
     * 
     */
    delete<T extends ApiKeyDeleteArgs>(args: SelectSubset<T, ApiKeyDeleteArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ApiKey.
     * @param {ApiKeyUpdateArgs} args - Arguments to update one ApiKey.
     * @example
     * // Update one ApiKey
     * const apiKey = await prisma.apiKey.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ApiKeyUpdateArgs>(args: SelectSubset<T, ApiKeyUpdateArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ApiKeys.
     * @param {ApiKeyDeleteManyArgs} args - Arguments to filter ApiKeys to delete.
     * @example
     * // Delete a few ApiKeys
     * const { count } = await prisma.apiKey.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ApiKeyDeleteManyArgs>(args?: SelectSubset<T, ApiKeyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ApiKeys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ApiKeys
     * const apiKey = await prisma.apiKey.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ApiKeyUpdateManyArgs>(args: SelectSubset<T, ApiKeyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ApiKeys and returns the data updated in the database.
     * @param {ApiKeyUpdateManyAndReturnArgs} args - Arguments to update many ApiKeys.
     * @example
     * // Update many ApiKeys
     * const apiKey = await prisma.apiKey.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ApiKeys and only return the `id`
     * const apiKeyWithIdOnly = await prisma.apiKey.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ApiKeyUpdateManyAndReturnArgs>(args: SelectSubset<T, ApiKeyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ApiKey.
     * @param {ApiKeyUpsertArgs} args - Arguments to update or create a ApiKey.
     * @example
     * // Update or create a ApiKey
     * const apiKey = await prisma.apiKey.upsert({
     *   create: {
     *     // ... data to create a ApiKey
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ApiKey we want to update
     *   }
     * })
     */
    upsert<T extends ApiKeyUpsertArgs>(args: SelectSubset<T, ApiKeyUpsertArgs<ExtArgs>>): Prisma__ApiKeyClient<$Result.GetResult<Prisma.$ApiKeyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ApiKeys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyCountArgs} args - Arguments to filter ApiKeys to count.
     * @example
     * // Count the number of ApiKeys
     * const count = await prisma.apiKey.count({
     *   where: {
     *     // ... the filter for the ApiKeys we want to count
     *   }
     * })
    **/
    count<T extends ApiKeyCountArgs>(
      args?: Subset<T, ApiKeyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ApiKeyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ApiKey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ApiKeyAggregateArgs>(args: Subset<T, ApiKeyAggregateArgs>): Prisma.PrismaPromise<GetApiKeyAggregateType<T>>

    /**
     * Group by ApiKey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiKeyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ApiKeyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ApiKeyGroupByArgs['orderBy'] }
        : { orderBy?: ApiKeyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ApiKeyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApiKeyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ApiKey model
   */
  readonly fields: ApiKeyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ApiKey.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ApiKeyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ApiKey model
   */
  interface ApiKeyFieldRefs {
    readonly id: FieldRef<"ApiKey", 'String'>
    readonly organizationId: FieldRef<"ApiKey", 'String'>
    readonly label: FieldRef<"ApiKey", 'String'>
    readonly keyPrefix: FieldRef<"ApiKey", 'String'>
    readonly keyHash: FieldRef<"ApiKey", 'String'>
    readonly scope: FieldRef<"ApiKey", 'String'>
    readonly credits: FieldRef<"ApiKey", 'Int'>
    readonly lastUsedAt: FieldRef<"ApiKey", 'DateTime'>
    readonly revokedAt: FieldRef<"ApiKey", 'DateTime'>
    readonly createdAt: FieldRef<"ApiKey", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ApiKey findUnique
   */
  export type ApiKeyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey findUniqueOrThrow
   */
  export type ApiKeyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey findFirst
   */
  export type ApiKeyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApiKeys.
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApiKeys.
     */
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * ApiKey findFirstOrThrow
   */
  export type ApiKeyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Filter, which ApiKey to fetch.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApiKeys.
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApiKeys.
     */
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * ApiKey findMany
   */
  export type ApiKeyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Filter, which ApiKeys to fetch.
     */
    where?: ApiKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiKeys to fetch.
     */
    orderBy?: ApiKeyOrderByWithRelationInput | ApiKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ApiKeys.
     */
    cursor?: ApiKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiKeys.
     */
    skip?: number
    distinct?: ApiKeyScalarFieldEnum | ApiKeyScalarFieldEnum[]
  }

  /**
   * ApiKey create
   */
  export type ApiKeyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * The data needed to create a ApiKey.
     */
    data: XOR<ApiKeyCreateInput, ApiKeyUncheckedCreateInput>
  }

  /**
   * ApiKey createMany
   */
  export type ApiKeyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ApiKeys.
     */
    data: ApiKeyCreateManyInput | ApiKeyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ApiKey createManyAndReturn
   */
  export type ApiKeyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * The data used to create many ApiKeys.
     */
    data: ApiKeyCreateManyInput | ApiKeyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ApiKey update
   */
  export type ApiKeyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * The data needed to update a ApiKey.
     */
    data: XOR<ApiKeyUpdateInput, ApiKeyUncheckedUpdateInput>
    /**
     * Choose, which ApiKey to update.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey updateMany
   */
  export type ApiKeyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ApiKeys.
     */
    data: XOR<ApiKeyUpdateManyMutationInput, ApiKeyUncheckedUpdateManyInput>
    /**
     * Filter which ApiKeys to update
     */
    where?: ApiKeyWhereInput
    /**
     * Limit how many ApiKeys to update.
     */
    limit?: number
  }

  /**
   * ApiKey updateManyAndReturn
   */
  export type ApiKeyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * The data used to update ApiKeys.
     */
    data: XOR<ApiKeyUpdateManyMutationInput, ApiKeyUncheckedUpdateManyInput>
    /**
     * Filter which ApiKeys to update
     */
    where?: ApiKeyWhereInput
    /**
     * Limit how many ApiKeys to update.
     */
    limit?: number
  }

  /**
   * ApiKey upsert
   */
  export type ApiKeyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * The filter to search for the ApiKey to update in case it exists.
     */
    where: ApiKeyWhereUniqueInput
    /**
     * In case the ApiKey found by the `where` argument doesn't exist, create a new ApiKey with this data.
     */
    create: XOR<ApiKeyCreateInput, ApiKeyUncheckedCreateInput>
    /**
     * In case the ApiKey was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ApiKeyUpdateInput, ApiKeyUncheckedUpdateInput>
  }

  /**
   * ApiKey delete
   */
  export type ApiKeyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
    /**
     * Filter which ApiKey to delete.
     */
    where: ApiKeyWhereUniqueInput
  }

  /**
   * ApiKey deleteMany
   */
  export type ApiKeyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApiKeys to delete
     */
    where?: ApiKeyWhereInput
    /**
     * Limit how many ApiKeys to delete.
     */
    limit?: number
  }

  /**
   * ApiKey without action
   */
  export type ApiKeyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiKey
     */
    select?: ApiKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiKey
     */
    omit?: ApiKeyOmit<ExtArgs> | null
  }


  /**
   * Model BatchJob
   */

  export type AggregateBatchJob = {
    _count: BatchJobCountAggregateOutputType | null
    _avg: BatchJobAvgAggregateOutputType | null
    _sum: BatchJobSumAggregateOutputType | null
    _min: BatchJobMinAggregateOutputType | null
    _max: BatchJobMaxAggregateOutputType | null
  }

  export type BatchJobAvgAggregateOutputType = {
    n: number | null
    done: number | null
  }

  export type BatchJobSumAggregateOutputType = {
    n: number | null
    done: number | null
  }

  export type BatchJobMinAggregateOutputType = {
    id: string | null
    organizationId: string | null
    label: string | null
    drug: string | null
    modelType: string | null
    n: number | null
    done: number | null
    status: string | null
    isolates: string | null
    results: string | null
    summary: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BatchJobMaxAggregateOutputType = {
    id: string | null
    organizationId: string | null
    label: string | null
    drug: string | null
    modelType: string | null
    n: number | null
    done: number | null
    status: string | null
    isolates: string | null
    results: string | null
    summary: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BatchJobCountAggregateOutputType = {
    id: number
    organizationId: number
    label: number
    drug: number
    modelType: number
    n: number
    done: number
    status: number
    isolates: number
    results: number
    summary: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BatchJobAvgAggregateInputType = {
    n?: true
    done?: true
  }

  export type BatchJobSumAggregateInputType = {
    n?: true
    done?: true
  }

  export type BatchJobMinAggregateInputType = {
    id?: true
    organizationId?: true
    label?: true
    drug?: true
    modelType?: true
    n?: true
    done?: true
    status?: true
    isolates?: true
    results?: true
    summary?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BatchJobMaxAggregateInputType = {
    id?: true
    organizationId?: true
    label?: true
    drug?: true
    modelType?: true
    n?: true
    done?: true
    status?: true
    isolates?: true
    results?: true
    summary?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BatchJobCountAggregateInputType = {
    id?: true
    organizationId?: true
    label?: true
    drug?: true
    modelType?: true
    n?: true
    done?: true
    status?: true
    isolates?: true
    results?: true
    summary?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BatchJobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BatchJob to aggregate.
     */
    where?: BatchJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BatchJobs to fetch.
     */
    orderBy?: BatchJobOrderByWithRelationInput | BatchJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BatchJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BatchJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BatchJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BatchJobs
    **/
    _count?: true | BatchJobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BatchJobAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BatchJobSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BatchJobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BatchJobMaxAggregateInputType
  }

  export type GetBatchJobAggregateType<T extends BatchJobAggregateArgs> = {
        [P in keyof T & keyof AggregateBatchJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBatchJob[P]>
      : GetScalarType<T[P], AggregateBatchJob[P]>
  }




  export type BatchJobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BatchJobWhereInput
    orderBy?: BatchJobOrderByWithAggregationInput | BatchJobOrderByWithAggregationInput[]
    by: BatchJobScalarFieldEnum[] | BatchJobScalarFieldEnum
    having?: BatchJobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BatchJobCountAggregateInputType | true
    _avg?: BatchJobAvgAggregateInputType
    _sum?: BatchJobSumAggregateInputType
    _min?: BatchJobMinAggregateInputType
    _max?: BatchJobMaxAggregateInputType
  }

  export type BatchJobGroupByOutputType = {
    id: string
    organizationId: string | null
    label: string
    drug: string
    modelType: string
    n: number
    done: number
    status: string
    isolates: string
    results: string
    summary: string | null
    createdAt: Date
    updatedAt: Date
    _count: BatchJobCountAggregateOutputType | null
    _avg: BatchJobAvgAggregateOutputType | null
    _sum: BatchJobSumAggregateOutputType | null
    _min: BatchJobMinAggregateOutputType | null
    _max: BatchJobMaxAggregateOutputType | null
  }

  type GetBatchJobGroupByPayload<T extends BatchJobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BatchJobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BatchJobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BatchJobGroupByOutputType[P]>
            : GetScalarType<T[P], BatchJobGroupByOutputType[P]>
        }
      >
    >


  export type BatchJobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    label?: boolean
    drug?: boolean
    modelType?: boolean
    n?: boolean
    done?: boolean
    status?: boolean
    isolates?: boolean
    results?: boolean
    summary?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["batchJob"]>

  export type BatchJobSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    label?: boolean
    drug?: boolean
    modelType?: boolean
    n?: boolean
    done?: boolean
    status?: boolean
    isolates?: boolean
    results?: boolean
    summary?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["batchJob"]>

  export type BatchJobSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    label?: boolean
    drug?: boolean
    modelType?: boolean
    n?: boolean
    done?: boolean
    status?: boolean
    isolates?: boolean
    results?: boolean
    summary?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["batchJob"]>

  export type BatchJobSelectScalar = {
    id?: boolean
    organizationId?: boolean
    label?: boolean
    drug?: boolean
    modelType?: boolean
    n?: boolean
    done?: boolean
    status?: boolean
    isolates?: boolean
    results?: boolean
    summary?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BatchJobOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "organizationId" | "label" | "drug" | "modelType" | "n" | "done" | "status" | "isolates" | "results" | "summary" | "createdAt" | "updatedAt", ExtArgs["result"]["batchJob"]>

  export type $BatchJobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BatchJob"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      organizationId: string | null
      label: string
      drug: string
      modelType: string
      n: number
      done: number
      status: string
      isolates: string
      results: string
      summary: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["batchJob"]>
    composites: {}
  }

  type BatchJobGetPayload<S extends boolean | null | undefined | BatchJobDefaultArgs> = $Result.GetResult<Prisma.$BatchJobPayload, S>

  type BatchJobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BatchJobFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BatchJobCountAggregateInputType | true
    }

  export interface BatchJobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BatchJob'], meta: { name: 'BatchJob' } }
    /**
     * Find zero or one BatchJob that matches the filter.
     * @param {BatchJobFindUniqueArgs} args - Arguments to find a BatchJob
     * @example
     * // Get one BatchJob
     * const batchJob = await prisma.batchJob.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BatchJobFindUniqueArgs>(args: SelectSubset<T, BatchJobFindUniqueArgs<ExtArgs>>): Prisma__BatchJobClient<$Result.GetResult<Prisma.$BatchJobPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BatchJob that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BatchJobFindUniqueOrThrowArgs} args - Arguments to find a BatchJob
     * @example
     * // Get one BatchJob
     * const batchJob = await prisma.batchJob.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BatchJobFindUniqueOrThrowArgs>(args: SelectSubset<T, BatchJobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BatchJobClient<$Result.GetResult<Prisma.$BatchJobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BatchJob that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchJobFindFirstArgs} args - Arguments to find a BatchJob
     * @example
     * // Get one BatchJob
     * const batchJob = await prisma.batchJob.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BatchJobFindFirstArgs>(args?: SelectSubset<T, BatchJobFindFirstArgs<ExtArgs>>): Prisma__BatchJobClient<$Result.GetResult<Prisma.$BatchJobPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BatchJob that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchJobFindFirstOrThrowArgs} args - Arguments to find a BatchJob
     * @example
     * // Get one BatchJob
     * const batchJob = await prisma.batchJob.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BatchJobFindFirstOrThrowArgs>(args?: SelectSubset<T, BatchJobFindFirstOrThrowArgs<ExtArgs>>): Prisma__BatchJobClient<$Result.GetResult<Prisma.$BatchJobPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BatchJobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchJobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BatchJobs
     * const batchJobs = await prisma.batchJob.findMany()
     * 
     * // Get first 10 BatchJobs
     * const batchJobs = await prisma.batchJob.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const batchJobWithIdOnly = await prisma.batchJob.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BatchJobFindManyArgs>(args?: SelectSubset<T, BatchJobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BatchJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BatchJob.
     * @param {BatchJobCreateArgs} args - Arguments to create a BatchJob.
     * @example
     * // Create one BatchJob
     * const BatchJob = await prisma.batchJob.create({
     *   data: {
     *     // ... data to create a BatchJob
     *   }
     * })
     * 
     */
    create<T extends BatchJobCreateArgs>(args: SelectSubset<T, BatchJobCreateArgs<ExtArgs>>): Prisma__BatchJobClient<$Result.GetResult<Prisma.$BatchJobPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BatchJobs.
     * @param {BatchJobCreateManyArgs} args - Arguments to create many BatchJobs.
     * @example
     * // Create many BatchJobs
     * const batchJob = await prisma.batchJob.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BatchJobCreateManyArgs>(args?: SelectSubset<T, BatchJobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BatchJobs and returns the data saved in the database.
     * @param {BatchJobCreateManyAndReturnArgs} args - Arguments to create many BatchJobs.
     * @example
     * // Create many BatchJobs
     * const batchJob = await prisma.batchJob.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BatchJobs and only return the `id`
     * const batchJobWithIdOnly = await prisma.batchJob.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BatchJobCreateManyAndReturnArgs>(args?: SelectSubset<T, BatchJobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BatchJobPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BatchJob.
     * @param {BatchJobDeleteArgs} args - Arguments to delete one BatchJob.
     * @example
     * // Delete one BatchJob
     * const BatchJob = await prisma.batchJob.delete({
     *   where: {
     *     // ... filter to delete one BatchJob
     *   }
     * })
     * 
     */
    delete<T extends BatchJobDeleteArgs>(args: SelectSubset<T, BatchJobDeleteArgs<ExtArgs>>): Prisma__BatchJobClient<$Result.GetResult<Prisma.$BatchJobPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BatchJob.
     * @param {BatchJobUpdateArgs} args - Arguments to update one BatchJob.
     * @example
     * // Update one BatchJob
     * const batchJob = await prisma.batchJob.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BatchJobUpdateArgs>(args: SelectSubset<T, BatchJobUpdateArgs<ExtArgs>>): Prisma__BatchJobClient<$Result.GetResult<Prisma.$BatchJobPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BatchJobs.
     * @param {BatchJobDeleteManyArgs} args - Arguments to filter BatchJobs to delete.
     * @example
     * // Delete a few BatchJobs
     * const { count } = await prisma.batchJob.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BatchJobDeleteManyArgs>(args?: SelectSubset<T, BatchJobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BatchJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchJobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BatchJobs
     * const batchJob = await prisma.batchJob.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BatchJobUpdateManyArgs>(args: SelectSubset<T, BatchJobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BatchJobs and returns the data updated in the database.
     * @param {BatchJobUpdateManyAndReturnArgs} args - Arguments to update many BatchJobs.
     * @example
     * // Update many BatchJobs
     * const batchJob = await prisma.batchJob.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BatchJobs and only return the `id`
     * const batchJobWithIdOnly = await prisma.batchJob.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BatchJobUpdateManyAndReturnArgs>(args: SelectSubset<T, BatchJobUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BatchJobPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BatchJob.
     * @param {BatchJobUpsertArgs} args - Arguments to update or create a BatchJob.
     * @example
     * // Update or create a BatchJob
     * const batchJob = await prisma.batchJob.upsert({
     *   create: {
     *     // ... data to create a BatchJob
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BatchJob we want to update
     *   }
     * })
     */
    upsert<T extends BatchJobUpsertArgs>(args: SelectSubset<T, BatchJobUpsertArgs<ExtArgs>>): Prisma__BatchJobClient<$Result.GetResult<Prisma.$BatchJobPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BatchJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchJobCountArgs} args - Arguments to filter BatchJobs to count.
     * @example
     * // Count the number of BatchJobs
     * const count = await prisma.batchJob.count({
     *   where: {
     *     // ... the filter for the BatchJobs we want to count
     *   }
     * })
    **/
    count<T extends BatchJobCountArgs>(
      args?: Subset<T, BatchJobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BatchJobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BatchJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchJobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BatchJobAggregateArgs>(args: Subset<T, BatchJobAggregateArgs>): Prisma.PrismaPromise<GetBatchJobAggregateType<T>>

    /**
     * Group by BatchJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchJobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BatchJobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BatchJobGroupByArgs['orderBy'] }
        : { orderBy?: BatchJobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BatchJobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBatchJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BatchJob model
   */
  readonly fields: BatchJobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BatchJob.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BatchJobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BatchJob model
   */
  interface BatchJobFieldRefs {
    readonly id: FieldRef<"BatchJob", 'String'>
    readonly organizationId: FieldRef<"BatchJob", 'String'>
    readonly label: FieldRef<"BatchJob", 'String'>
    readonly drug: FieldRef<"BatchJob", 'String'>
    readonly modelType: FieldRef<"BatchJob", 'String'>
    readonly n: FieldRef<"BatchJob", 'Int'>
    readonly done: FieldRef<"BatchJob", 'Int'>
    readonly status: FieldRef<"BatchJob", 'String'>
    readonly isolates: FieldRef<"BatchJob", 'String'>
    readonly results: FieldRef<"BatchJob", 'String'>
    readonly summary: FieldRef<"BatchJob", 'String'>
    readonly createdAt: FieldRef<"BatchJob", 'DateTime'>
    readonly updatedAt: FieldRef<"BatchJob", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BatchJob findUnique
   */
  export type BatchJobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchJob
     */
    select?: BatchJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchJob
     */
    omit?: BatchJobOmit<ExtArgs> | null
    /**
     * Filter, which BatchJob to fetch.
     */
    where: BatchJobWhereUniqueInput
  }

  /**
   * BatchJob findUniqueOrThrow
   */
  export type BatchJobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchJob
     */
    select?: BatchJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchJob
     */
    omit?: BatchJobOmit<ExtArgs> | null
    /**
     * Filter, which BatchJob to fetch.
     */
    where: BatchJobWhereUniqueInput
  }

  /**
   * BatchJob findFirst
   */
  export type BatchJobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchJob
     */
    select?: BatchJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchJob
     */
    omit?: BatchJobOmit<ExtArgs> | null
    /**
     * Filter, which BatchJob to fetch.
     */
    where?: BatchJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BatchJobs to fetch.
     */
    orderBy?: BatchJobOrderByWithRelationInput | BatchJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BatchJobs.
     */
    cursor?: BatchJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BatchJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BatchJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BatchJobs.
     */
    distinct?: BatchJobScalarFieldEnum | BatchJobScalarFieldEnum[]
  }

  /**
   * BatchJob findFirstOrThrow
   */
  export type BatchJobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchJob
     */
    select?: BatchJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchJob
     */
    omit?: BatchJobOmit<ExtArgs> | null
    /**
     * Filter, which BatchJob to fetch.
     */
    where?: BatchJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BatchJobs to fetch.
     */
    orderBy?: BatchJobOrderByWithRelationInput | BatchJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BatchJobs.
     */
    cursor?: BatchJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BatchJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BatchJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BatchJobs.
     */
    distinct?: BatchJobScalarFieldEnum | BatchJobScalarFieldEnum[]
  }

  /**
   * BatchJob findMany
   */
  export type BatchJobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchJob
     */
    select?: BatchJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchJob
     */
    omit?: BatchJobOmit<ExtArgs> | null
    /**
     * Filter, which BatchJobs to fetch.
     */
    where?: BatchJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BatchJobs to fetch.
     */
    orderBy?: BatchJobOrderByWithRelationInput | BatchJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BatchJobs.
     */
    cursor?: BatchJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BatchJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BatchJobs.
     */
    skip?: number
    distinct?: BatchJobScalarFieldEnum | BatchJobScalarFieldEnum[]
  }

  /**
   * BatchJob create
   */
  export type BatchJobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchJob
     */
    select?: BatchJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchJob
     */
    omit?: BatchJobOmit<ExtArgs> | null
    /**
     * The data needed to create a BatchJob.
     */
    data: XOR<BatchJobCreateInput, BatchJobUncheckedCreateInput>
  }

  /**
   * BatchJob createMany
   */
  export type BatchJobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BatchJobs.
     */
    data: BatchJobCreateManyInput | BatchJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BatchJob createManyAndReturn
   */
  export type BatchJobCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchJob
     */
    select?: BatchJobSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BatchJob
     */
    omit?: BatchJobOmit<ExtArgs> | null
    /**
     * The data used to create many BatchJobs.
     */
    data: BatchJobCreateManyInput | BatchJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BatchJob update
   */
  export type BatchJobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchJob
     */
    select?: BatchJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchJob
     */
    omit?: BatchJobOmit<ExtArgs> | null
    /**
     * The data needed to update a BatchJob.
     */
    data: XOR<BatchJobUpdateInput, BatchJobUncheckedUpdateInput>
    /**
     * Choose, which BatchJob to update.
     */
    where: BatchJobWhereUniqueInput
  }

  /**
   * BatchJob updateMany
   */
  export type BatchJobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BatchJobs.
     */
    data: XOR<BatchJobUpdateManyMutationInput, BatchJobUncheckedUpdateManyInput>
    /**
     * Filter which BatchJobs to update
     */
    where?: BatchJobWhereInput
    /**
     * Limit how many BatchJobs to update.
     */
    limit?: number
  }

  /**
   * BatchJob updateManyAndReturn
   */
  export type BatchJobUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchJob
     */
    select?: BatchJobSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BatchJob
     */
    omit?: BatchJobOmit<ExtArgs> | null
    /**
     * The data used to update BatchJobs.
     */
    data: XOR<BatchJobUpdateManyMutationInput, BatchJobUncheckedUpdateManyInput>
    /**
     * Filter which BatchJobs to update
     */
    where?: BatchJobWhereInput
    /**
     * Limit how many BatchJobs to update.
     */
    limit?: number
  }

  /**
   * BatchJob upsert
   */
  export type BatchJobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchJob
     */
    select?: BatchJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchJob
     */
    omit?: BatchJobOmit<ExtArgs> | null
    /**
     * The filter to search for the BatchJob to update in case it exists.
     */
    where: BatchJobWhereUniqueInput
    /**
     * In case the BatchJob found by the `where` argument doesn't exist, create a new BatchJob with this data.
     */
    create: XOR<BatchJobCreateInput, BatchJobUncheckedCreateInput>
    /**
     * In case the BatchJob was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BatchJobUpdateInput, BatchJobUncheckedUpdateInput>
  }

  /**
   * BatchJob delete
   */
  export type BatchJobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchJob
     */
    select?: BatchJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchJob
     */
    omit?: BatchJobOmit<ExtArgs> | null
    /**
     * Filter which BatchJob to delete.
     */
    where: BatchJobWhereUniqueInput
  }

  /**
   * BatchJob deleteMany
   */
  export type BatchJobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BatchJobs to delete
     */
    where?: BatchJobWhereInput
    /**
     * Limit how many BatchJobs to delete.
     */
    limit?: number
  }

  /**
   * BatchJob without action
   */
  export type BatchJobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchJob
     */
    select?: BatchJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchJob
     */
    omit?: BatchJobOmit<ExtArgs> | null
  }


  /**
   * Model IntegrationConfig
   */

  export type AggregateIntegrationConfig = {
    _count: IntegrationConfigCountAggregateOutputType | null
    _min: IntegrationConfigMinAggregateOutputType | null
    _max: IntegrationConfigMaxAggregateOutputType | null
  }

  export type IntegrationConfigMinAggregateOutputType = {
    id: string | null
    organizationId: string | null
    platform: string | null
    endpointUrl: string | null
    hmacSecret: string | null
    events: string | null
    active: boolean | null
    lastTestedAt: Date | null
    lastTestStatus: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type IntegrationConfigMaxAggregateOutputType = {
    id: string | null
    organizationId: string | null
    platform: string | null
    endpointUrl: string | null
    hmacSecret: string | null
    events: string | null
    active: boolean | null
    lastTestedAt: Date | null
    lastTestStatus: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type IntegrationConfigCountAggregateOutputType = {
    id: number
    organizationId: number
    platform: number
    endpointUrl: number
    hmacSecret: number
    events: number
    active: number
    lastTestedAt: number
    lastTestStatus: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type IntegrationConfigMinAggregateInputType = {
    id?: true
    organizationId?: true
    platform?: true
    endpointUrl?: true
    hmacSecret?: true
    events?: true
    active?: true
    lastTestedAt?: true
    lastTestStatus?: true
    createdAt?: true
    updatedAt?: true
  }

  export type IntegrationConfigMaxAggregateInputType = {
    id?: true
    organizationId?: true
    platform?: true
    endpointUrl?: true
    hmacSecret?: true
    events?: true
    active?: true
    lastTestedAt?: true
    lastTestStatus?: true
    createdAt?: true
    updatedAt?: true
  }

  export type IntegrationConfigCountAggregateInputType = {
    id?: true
    organizationId?: true
    platform?: true
    endpointUrl?: true
    hmacSecret?: true
    events?: true
    active?: true
    lastTestedAt?: true
    lastTestStatus?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type IntegrationConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IntegrationConfig to aggregate.
     */
    where?: IntegrationConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IntegrationConfigs to fetch.
     */
    orderBy?: IntegrationConfigOrderByWithRelationInput | IntegrationConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IntegrationConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IntegrationConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IntegrationConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned IntegrationConfigs
    **/
    _count?: true | IntegrationConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IntegrationConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IntegrationConfigMaxAggregateInputType
  }

  export type GetIntegrationConfigAggregateType<T extends IntegrationConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateIntegrationConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIntegrationConfig[P]>
      : GetScalarType<T[P], AggregateIntegrationConfig[P]>
  }




  export type IntegrationConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IntegrationConfigWhereInput
    orderBy?: IntegrationConfigOrderByWithAggregationInput | IntegrationConfigOrderByWithAggregationInput[]
    by: IntegrationConfigScalarFieldEnum[] | IntegrationConfigScalarFieldEnum
    having?: IntegrationConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IntegrationConfigCountAggregateInputType | true
    _min?: IntegrationConfigMinAggregateInputType
    _max?: IntegrationConfigMaxAggregateInputType
  }

  export type IntegrationConfigGroupByOutputType = {
    id: string
    organizationId: string | null
    platform: string
    endpointUrl: string | null
    hmacSecret: string
    events: string
    active: boolean
    lastTestedAt: Date | null
    lastTestStatus: string | null
    createdAt: Date
    updatedAt: Date
    _count: IntegrationConfigCountAggregateOutputType | null
    _min: IntegrationConfigMinAggregateOutputType | null
    _max: IntegrationConfigMaxAggregateOutputType | null
  }

  type GetIntegrationConfigGroupByPayload<T extends IntegrationConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IntegrationConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IntegrationConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IntegrationConfigGroupByOutputType[P]>
            : GetScalarType<T[P], IntegrationConfigGroupByOutputType[P]>
        }
      >
    >


  export type IntegrationConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    platform?: boolean
    endpointUrl?: boolean
    hmacSecret?: boolean
    events?: boolean
    active?: boolean
    lastTestedAt?: boolean
    lastTestStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["integrationConfig"]>

  export type IntegrationConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    platform?: boolean
    endpointUrl?: boolean
    hmacSecret?: boolean
    events?: boolean
    active?: boolean
    lastTestedAt?: boolean
    lastTestStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["integrationConfig"]>

  export type IntegrationConfigSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    platform?: boolean
    endpointUrl?: boolean
    hmacSecret?: boolean
    events?: boolean
    active?: boolean
    lastTestedAt?: boolean
    lastTestStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["integrationConfig"]>

  export type IntegrationConfigSelectScalar = {
    id?: boolean
    organizationId?: boolean
    platform?: boolean
    endpointUrl?: boolean
    hmacSecret?: boolean
    events?: boolean
    active?: boolean
    lastTestedAt?: boolean
    lastTestStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type IntegrationConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "organizationId" | "platform" | "endpointUrl" | "hmacSecret" | "events" | "active" | "lastTestedAt" | "lastTestStatus" | "createdAt" | "updatedAt", ExtArgs["result"]["integrationConfig"]>

  export type $IntegrationConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "IntegrationConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      organizationId: string | null
      platform: string
      endpointUrl: string | null
      hmacSecret: string
      events: string
      active: boolean
      lastTestedAt: Date | null
      lastTestStatus: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["integrationConfig"]>
    composites: {}
  }

  type IntegrationConfigGetPayload<S extends boolean | null | undefined | IntegrationConfigDefaultArgs> = $Result.GetResult<Prisma.$IntegrationConfigPayload, S>

  type IntegrationConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<IntegrationConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: IntegrationConfigCountAggregateInputType | true
    }

  export interface IntegrationConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['IntegrationConfig'], meta: { name: 'IntegrationConfig' } }
    /**
     * Find zero or one IntegrationConfig that matches the filter.
     * @param {IntegrationConfigFindUniqueArgs} args - Arguments to find a IntegrationConfig
     * @example
     * // Get one IntegrationConfig
     * const integrationConfig = await prisma.integrationConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IntegrationConfigFindUniqueArgs>(args: SelectSubset<T, IntegrationConfigFindUniqueArgs<ExtArgs>>): Prisma__IntegrationConfigClient<$Result.GetResult<Prisma.$IntegrationConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one IntegrationConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IntegrationConfigFindUniqueOrThrowArgs} args - Arguments to find a IntegrationConfig
     * @example
     * // Get one IntegrationConfig
     * const integrationConfig = await prisma.integrationConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IntegrationConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, IntegrationConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IntegrationConfigClient<$Result.GetResult<Prisma.$IntegrationConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IntegrationConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationConfigFindFirstArgs} args - Arguments to find a IntegrationConfig
     * @example
     * // Get one IntegrationConfig
     * const integrationConfig = await prisma.integrationConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IntegrationConfigFindFirstArgs>(args?: SelectSubset<T, IntegrationConfigFindFirstArgs<ExtArgs>>): Prisma__IntegrationConfigClient<$Result.GetResult<Prisma.$IntegrationConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IntegrationConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationConfigFindFirstOrThrowArgs} args - Arguments to find a IntegrationConfig
     * @example
     * // Get one IntegrationConfig
     * const integrationConfig = await prisma.integrationConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IntegrationConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, IntegrationConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__IntegrationConfigClient<$Result.GetResult<Prisma.$IntegrationConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more IntegrationConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IntegrationConfigs
     * const integrationConfigs = await prisma.integrationConfig.findMany()
     * 
     * // Get first 10 IntegrationConfigs
     * const integrationConfigs = await prisma.integrationConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const integrationConfigWithIdOnly = await prisma.integrationConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends IntegrationConfigFindManyArgs>(args?: SelectSubset<T, IntegrationConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IntegrationConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a IntegrationConfig.
     * @param {IntegrationConfigCreateArgs} args - Arguments to create a IntegrationConfig.
     * @example
     * // Create one IntegrationConfig
     * const IntegrationConfig = await prisma.integrationConfig.create({
     *   data: {
     *     // ... data to create a IntegrationConfig
     *   }
     * })
     * 
     */
    create<T extends IntegrationConfigCreateArgs>(args: SelectSubset<T, IntegrationConfigCreateArgs<ExtArgs>>): Prisma__IntegrationConfigClient<$Result.GetResult<Prisma.$IntegrationConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many IntegrationConfigs.
     * @param {IntegrationConfigCreateManyArgs} args - Arguments to create many IntegrationConfigs.
     * @example
     * // Create many IntegrationConfigs
     * const integrationConfig = await prisma.integrationConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IntegrationConfigCreateManyArgs>(args?: SelectSubset<T, IntegrationConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many IntegrationConfigs and returns the data saved in the database.
     * @param {IntegrationConfigCreateManyAndReturnArgs} args - Arguments to create many IntegrationConfigs.
     * @example
     * // Create many IntegrationConfigs
     * const integrationConfig = await prisma.integrationConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many IntegrationConfigs and only return the `id`
     * const integrationConfigWithIdOnly = await prisma.integrationConfig.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IntegrationConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, IntegrationConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IntegrationConfigPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a IntegrationConfig.
     * @param {IntegrationConfigDeleteArgs} args - Arguments to delete one IntegrationConfig.
     * @example
     * // Delete one IntegrationConfig
     * const IntegrationConfig = await prisma.integrationConfig.delete({
     *   where: {
     *     // ... filter to delete one IntegrationConfig
     *   }
     * })
     * 
     */
    delete<T extends IntegrationConfigDeleteArgs>(args: SelectSubset<T, IntegrationConfigDeleteArgs<ExtArgs>>): Prisma__IntegrationConfigClient<$Result.GetResult<Prisma.$IntegrationConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one IntegrationConfig.
     * @param {IntegrationConfigUpdateArgs} args - Arguments to update one IntegrationConfig.
     * @example
     * // Update one IntegrationConfig
     * const integrationConfig = await prisma.integrationConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IntegrationConfigUpdateArgs>(args: SelectSubset<T, IntegrationConfigUpdateArgs<ExtArgs>>): Prisma__IntegrationConfigClient<$Result.GetResult<Prisma.$IntegrationConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more IntegrationConfigs.
     * @param {IntegrationConfigDeleteManyArgs} args - Arguments to filter IntegrationConfigs to delete.
     * @example
     * // Delete a few IntegrationConfigs
     * const { count } = await prisma.integrationConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IntegrationConfigDeleteManyArgs>(args?: SelectSubset<T, IntegrationConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IntegrationConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IntegrationConfigs
     * const integrationConfig = await prisma.integrationConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IntegrationConfigUpdateManyArgs>(args: SelectSubset<T, IntegrationConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IntegrationConfigs and returns the data updated in the database.
     * @param {IntegrationConfigUpdateManyAndReturnArgs} args - Arguments to update many IntegrationConfigs.
     * @example
     * // Update many IntegrationConfigs
     * const integrationConfig = await prisma.integrationConfig.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more IntegrationConfigs and only return the `id`
     * const integrationConfigWithIdOnly = await prisma.integrationConfig.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends IntegrationConfigUpdateManyAndReturnArgs>(args: SelectSubset<T, IntegrationConfigUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IntegrationConfigPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one IntegrationConfig.
     * @param {IntegrationConfigUpsertArgs} args - Arguments to update or create a IntegrationConfig.
     * @example
     * // Update or create a IntegrationConfig
     * const integrationConfig = await prisma.integrationConfig.upsert({
     *   create: {
     *     // ... data to create a IntegrationConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IntegrationConfig we want to update
     *   }
     * })
     */
    upsert<T extends IntegrationConfigUpsertArgs>(args: SelectSubset<T, IntegrationConfigUpsertArgs<ExtArgs>>): Prisma__IntegrationConfigClient<$Result.GetResult<Prisma.$IntegrationConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of IntegrationConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationConfigCountArgs} args - Arguments to filter IntegrationConfigs to count.
     * @example
     * // Count the number of IntegrationConfigs
     * const count = await prisma.integrationConfig.count({
     *   where: {
     *     // ... the filter for the IntegrationConfigs we want to count
     *   }
     * })
    **/
    count<T extends IntegrationConfigCountArgs>(
      args?: Subset<T, IntegrationConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IntegrationConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a IntegrationConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IntegrationConfigAggregateArgs>(args: Subset<T, IntegrationConfigAggregateArgs>): Prisma.PrismaPromise<GetIntegrationConfigAggregateType<T>>

    /**
     * Group by IntegrationConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IntegrationConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends IntegrationConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IntegrationConfigGroupByArgs['orderBy'] }
        : { orderBy?: IntegrationConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, IntegrationConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIntegrationConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the IntegrationConfig model
   */
  readonly fields: IntegrationConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for IntegrationConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IntegrationConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the IntegrationConfig model
   */
  interface IntegrationConfigFieldRefs {
    readonly id: FieldRef<"IntegrationConfig", 'String'>
    readonly organizationId: FieldRef<"IntegrationConfig", 'String'>
    readonly platform: FieldRef<"IntegrationConfig", 'String'>
    readonly endpointUrl: FieldRef<"IntegrationConfig", 'String'>
    readonly hmacSecret: FieldRef<"IntegrationConfig", 'String'>
    readonly events: FieldRef<"IntegrationConfig", 'String'>
    readonly active: FieldRef<"IntegrationConfig", 'Boolean'>
    readonly lastTestedAt: FieldRef<"IntegrationConfig", 'DateTime'>
    readonly lastTestStatus: FieldRef<"IntegrationConfig", 'String'>
    readonly createdAt: FieldRef<"IntegrationConfig", 'DateTime'>
    readonly updatedAt: FieldRef<"IntegrationConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * IntegrationConfig findUnique
   */
  export type IntegrationConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationConfig
     */
    select?: IntegrationConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationConfig
     */
    omit?: IntegrationConfigOmit<ExtArgs> | null
    /**
     * Filter, which IntegrationConfig to fetch.
     */
    where: IntegrationConfigWhereUniqueInput
  }

  /**
   * IntegrationConfig findUniqueOrThrow
   */
  export type IntegrationConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationConfig
     */
    select?: IntegrationConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationConfig
     */
    omit?: IntegrationConfigOmit<ExtArgs> | null
    /**
     * Filter, which IntegrationConfig to fetch.
     */
    where: IntegrationConfigWhereUniqueInput
  }

  /**
   * IntegrationConfig findFirst
   */
  export type IntegrationConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationConfig
     */
    select?: IntegrationConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationConfig
     */
    omit?: IntegrationConfigOmit<ExtArgs> | null
    /**
     * Filter, which IntegrationConfig to fetch.
     */
    where?: IntegrationConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IntegrationConfigs to fetch.
     */
    orderBy?: IntegrationConfigOrderByWithRelationInput | IntegrationConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IntegrationConfigs.
     */
    cursor?: IntegrationConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IntegrationConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IntegrationConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IntegrationConfigs.
     */
    distinct?: IntegrationConfigScalarFieldEnum | IntegrationConfigScalarFieldEnum[]
  }

  /**
   * IntegrationConfig findFirstOrThrow
   */
  export type IntegrationConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationConfig
     */
    select?: IntegrationConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationConfig
     */
    omit?: IntegrationConfigOmit<ExtArgs> | null
    /**
     * Filter, which IntegrationConfig to fetch.
     */
    where?: IntegrationConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IntegrationConfigs to fetch.
     */
    orderBy?: IntegrationConfigOrderByWithRelationInput | IntegrationConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IntegrationConfigs.
     */
    cursor?: IntegrationConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IntegrationConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IntegrationConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IntegrationConfigs.
     */
    distinct?: IntegrationConfigScalarFieldEnum | IntegrationConfigScalarFieldEnum[]
  }

  /**
   * IntegrationConfig findMany
   */
  export type IntegrationConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationConfig
     */
    select?: IntegrationConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationConfig
     */
    omit?: IntegrationConfigOmit<ExtArgs> | null
    /**
     * Filter, which IntegrationConfigs to fetch.
     */
    where?: IntegrationConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IntegrationConfigs to fetch.
     */
    orderBy?: IntegrationConfigOrderByWithRelationInput | IntegrationConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing IntegrationConfigs.
     */
    cursor?: IntegrationConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IntegrationConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IntegrationConfigs.
     */
    skip?: number
    distinct?: IntegrationConfigScalarFieldEnum | IntegrationConfigScalarFieldEnum[]
  }

  /**
   * IntegrationConfig create
   */
  export type IntegrationConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationConfig
     */
    select?: IntegrationConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationConfig
     */
    omit?: IntegrationConfigOmit<ExtArgs> | null
    /**
     * The data needed to create a IntegrationConfig.
     */
    data: XOR<IntegrationConfigCreateInput, IntegrationConfigUncheckedCreateInput>
  }

  /**
   * IntegrationConfig createMany
   */
  export type IntegrationConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many IntegrationConfigs.
     */
    data: IntegrationConfigCreateManyInput | IntegrationConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IntegrationConfig createManyAndReturn
   */
  export type IntegrationConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationConfig
     */
    select?: IntegrationConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationConfig
     */
    omit?: IntegrationConfigOmit<ExtArgs> | null
    /**
     * The data used to create many IntegrationConfigs.
     */
    data: IntegrationConfigCreateManyInput | IntegrationConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IntegrationConfig update
   */
  export type IntegrationConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationConfig
     */
    select?: IntegrationConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationConfig
     */
    omit?: IntegrationConfigOmit<ExtArgs> | null
    /**
     * The data needed to update a IntegrationConfig.
     */
    data: XOR<IntegrationConfigUpdateInput, IntegrationConfigUncheckedUpdateInput>
    /**
     * Choose, which IntegrationConfig to update.
     */
    where: IntegrationConfigWhereUniqueInput
  }

  /**
   * IntegrationConfig updateMany
   */
  export type IntegrationConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update IntegrationConfigs.
     */
    data: XOR<IntegrationConfigUpdateManyMutationInput, IntegrationConfigUncheckedUpdateManyInput>
    /**
     * Filter which IntegrationConfigs to update
     */
    where?: IntegrationConfigWhereInput
    /**
     * Limit how many IntegrationConfigs to update.
     */
    limit?: number
  }

  /**
   * IntegrationConfig updateManyAndReturn
   */
  export type IntegrationConfigUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationConfig
     */
    select?: IntegrationConfigSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationConfig
     */
    omit?: IntegrationConfigOmit<ExtArgs> | null
    /**
     * The data used to update IntegrationConfigs.
     */
    data: XOR<IntegrationConfigUpdateManyMutationInput, IntegrationConfigUncheckedUpdateManyInput>
    /**
     * Filter which IntegrationConfigs to update
     */
    where?: IntegrationConfigWhereInput
    /**
     * Limit how many IntegrationConfigs to update.
     */
    limit?: number
  }

  /**
   * IntegrationConfig upsert
   */
  export type IntegrationConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationConfig
     */
    select?: IntegrationConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationConfig
     */
    omit?: IntegrationConfigOmit<ExtArgs> | null
    /**
     * The filter to search for the IntegrationConfig to update in case it exists.
     */
    where: IntegrationConfigWhereUniqueInput
    /**
     * In case the IntegrationConfig found by the `where` argument doesn't exist, create a new IntegrationConfig with this data.
     */
    create: XOR<IntegrationConfigCreateInput, IntegrationConfigUncheckedCreateInput>
    /**
     * In case the IntegrationConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IntegrationConfigUpdateInput, IntegrationConfigUncheckedUpdateInput>
  }

  /**
   * IntegrationConfig delete
   */
  export type IntegrationConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationConfig
     */
    select?: IntegrationConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationConfig
     */
    omit?: IntegrationConfigOmit<ExtArgs> | null
    /**
     * Filter which IntegrationConfig to delete.
     */
    where: IntegrationConfigWhereUniqueInput
  }

  /**
   * IntegrationConfig deleteMany
   */
  export type IntegrationConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IntegrationConfigs to delete
     */
    where?: IntegrationConfigWhereInput
    /**
     * Limit how many IntegrationConfigs to delete.
     */
    limit?: number
  }

  /**
   * IntegrationConfig without action
   */
  export type IntegrationConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IntegrationConfig
     */
    select?: IntegrationConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IntegrationConfig
     */
    omit?: IntegrationConfigOmit<ExtArgs> | null
  }


  /**
   * Model WebhookEvent
   */

  export type AggregateWebhookEvent = {
    _count: WebhookEventCountAggregateOutputType | null
    _avg: WebhookEventAvgAggregateOutputType | null
    _sum: WebhookEventSumAggregateOutputType | null
    _min: WebhookEventMinAggregateOutputType | null
    _max: WebhookEventMaxAggregateOutputType | null
  }

  export type WebhookEventAvgAggregateOutputType = {
    httpStatus: number | null
  }

  export type WebhookEventSumAggregateOutputType = {
    httpStatus: number | null
  }

  export type WebhookEventMinAggregateOutputType = {
    id: string | null
    organizationId: string | null
    direction: string | null
    platform: string | null
    eventType: string | null
    payload: string | null
    status: string | null
    httpStatus: number | null
    error: string | null
    createdAt: Date | null
  }

  export type WebhookEventMaxAggregateOutputType = {
    id: string | null
    organizationId: string | null
    direction: string | null
    platform: string | null
    eventType: string | null
    payload: string | null
    status: string | null
    httpStatus: number | null
    error: string | null
    createdAt: Date | null
  }

  export type WebhookEventCountAggregateOutputType = {
    id: number
    organizationId: number
    direction: number
    platform: number
    eventType: number
    payload: number
    status: number
    httpStatus: number
    error: number
    createdAt: number
    _all: number
  }


  export type WebhookEventAvgAggregateInputType = {
    httpStatus?: true
  }

  export type WebhookEventSumAggregateInputType = {
    httpStatus?: true
  }

  export type WebhookEventMinAggregateInputType = {
    id?: true
    organizationId?: true
    direction?: true
    platform?: true
    eventType?: true
    payload?: true
    status?: true
    httpStatus?: true
    error?: true
    createdAt?: true
  }

  export type WebhookEventMaxAggregateInputType = {
    id?: true
    organizationId?: true
    direction?: true
    platform?: true
    eventType?: true
    payload?: true
    status?: true
    httpStatus?: true
    error?: true
    createdAt?: true
  }

  export type WebhookEventCountAggregateInputType = {
    id?: true
    organizationId?: true
    direction?: true
    platform?: true
    eventType?: true
    payload?: true
    status?: true
    httpStatus?: true
    error?: true
    createdAt?: true
    _all?: true
  }

  export type WebhookEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WebhookEvent to aggregate.
     */
    where?: WebhookEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebhookEvents to fetch.
     */
    orderBy?: WebhookEventOrderByWithRelationInput | WebhookEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WebhookEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebhookEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebhookEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WebhookEvents
    **/
    _count?: true | WebhookEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WebhookEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WebhookEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WebhookEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WebhookEventMaxAggregateInputType
  }

  export type GetWebhookEventAggregateType<T extends WebhookEventAggregateArgs> = {
        [P in keyof T & keyof AggregateWebhookEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWebhookEvent[P]>
      : GetScalarType<T[P], AggregateWebhookEvent[P]>
  }




  export type WebhookEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WebhookEventWhereInput
    orderBy?: WebhookEventOrderByWithAggregationInput | WebhookEventOrderByWithAggregationInput[]
    by: WebhookEventScalarFieldEnum[] | WebhookEventScalarFieldEnum
    having?: WebhookEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WebhookEventCountAggregateInputType | true
    _avg?: WebhookEventAvgAggregateInputType
    _sum?: WebhookEventSumAggregateInputType
    _min?: WebhookEventMinAggregateInputType
    _max?: WebhookEventMaxAggregateInputType
  }

  export type WebhookEventGroupByOutputType = {
    id: string
    organizationId: string | null
    direction: string
    platform: string
    eventType: string
    payload: string
    status: string
    httpStatus: number | null
    error: string | null
    createdAt: Date
    _count: WebhookEventCountAggregateOutputType | null
    _avg: WebhookEventAvgAggregateOutputType | null
    _sum: WebhookEventSumAggregateOutputType | null
    _min: WebhookEventMinAggregateOutputType | null
    _max: WebhookEventMaxAggregateOutputType | null
  }

  type GetWebhookEventGroupByPayload<T extends WebhookEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WebhookEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WebhookEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WebhookEventGroupByOutputType[P]>
            : GetScalarType<T[P], WebhookEventGroupByOutputType[P]>
        }
      >
    >


  export type WebhookEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    direction?: boolean
    platform?: boolean
    eventType?: boolean
    payload?: boolean
    status?: boolean
    httpStatus?: boolean
    error?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["webhookEvent"]>

  export type WebhookEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    direction?: boolean
    platform?: boolean
    eventType?: boolean
    payload?: boolean
    status?: boolean
    httpStatus?: boolean
    error?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["webhookEvent"]>

  export type WebhookEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    direction?: boolean
    platform?: boolean
    eventType?: boolean
    payload?: boolean
    status?: boolean
    httpStatus?: boolean
    error?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["webhookEvent"]>

  export type WebhookEventSelectScalar = {
    id?: boolean
    organizationId?: boolean
    direction?: boolean
    platform?: boolean
    eventType?: boolean
    payload?: boolean
    status?: boolean
    httpStatus?: boolean
    error?: boolean
    createdAt?: boolean
  }

  export type WebhookEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "organizationId" | "direction" | "platform" | "eventType" | "payload" | "status" | "httpStatus" | "error" | "createdAt", ExtArgs["result"]["webhookEvent"]>

  export type $WebhookEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WebhookEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      organizationId: string | null
      direction: string
      platform: string
      eventType: string
      payload: string
      status: string
      httpStatus: number | null
      error: string | null
      createdAt: Date
    }, ExtArgs["result"]["webhookEvent"]>
    composites: {}
  }

  type WebhookEventGetPayload<S extends boolean | null | undefined | WebhookEventDefaultArgs> = $Result.GetResult<Prisma.$WebhookEventPayload, S>

  type WebhookEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WebhookEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WebhookEventCountAggregateInputType | true
    }

  export interface WebhookEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WebhookEvent'], meta: { name: 'WebhookEvent' } }
    /**
     * Find zero or one WebhookEvent that matches the filter.
     * @param {WebhookEventFindUniqueArgs} args - Arguments to find a WebhookEvent
     * @example
     * // Get one WebhookEvent
     * const webhookEvent = await prisma.webhookEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WebhookEventFindUniqueArgs>(args: SelectSubset<T, WebhookEventFindUniqueArgs<ExtArgs>>): Prisma__WebhookEventClient<$Result.GetResult<Prisma.$WebhookEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WebhookEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WebhookEventFindUniqueOrThrowArgs} args - Arguments to find a WebhookEvent
     * @example
     * // Get one WebhookEvent
     * const webhookEvent = await prisma.webhookEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WebhookEventFindUniqueOrThrowArgs>(args: SelectSubset<T, WebhookEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WebhookEventClient<$Result.GetResult<Prisma.$WebhookEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WebhookEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookEventFindFirstArgs} args - Arguments to find a WebhookEvent
     * @example
     * // Get one WebhookEvent
     * const webhookEvent = await prisma.webhookEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WebhookEventFindFirstArgs>(args?: SelectSubset<T, WebhookEventFindFirstArgs<ExtArgs>>): Prisma__WebhookEventClient<$Result.GetResult<Prisma.$WebhookEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WebhookEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookEventFindFirstOrThrowArgs} args - Arguments to find a WebhookEvent
     * @example
     * // Get one WebhookEvent
     * const webhookEvent = await prisma.webhookEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WebhookEventFindFirstOrThrowArgs>(args?: SelectSubset<T, WebhookEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__WebhookEventClient<$Result.GetResult<Prisma.$WebhookEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WebhookEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WebhookEvents
     * const webhookEvents = await prisma.webhookEvent.findMany()
     * 
     * // Get first 10 WebhookEvents
     * const webhookEvents = await prisma.webhookEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const webhookEventWithIdOnly = await prisma.webhookEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WebhookEventFindManyArgs>(args?: SelectSubset<T, WebhookEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebhookEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WebhookEvent.
     * @param {WebhookEventCreateArgs} args - Arguments to create a WebhookEvent.
     * @example
     * // Create one WebhookEvent
     * const WebhookEvent = await prisma.webhookEvent.create({
     *   data: {
     *     // ... data to create a WebhookEvent
     *   }
     * })
     * 
     */
    create<T extends WebhookEventCreateArgs>(args: SelectSubset<T, WebhookEventCreateArgs<ExtArgs>>): Prisma__WebhookEventClient<$Result.GetResult<Prisma.$WebhookEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WebhookEvents.
     * @param {WebhookEventCreateManyArgs} args - Arguments to create many WebhookEvents.
     * @example
     * // Create many WebhookEvents
     * const webhookEvent = await prisma.webhookEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WebhookEventCreateManyArgs>(args?: SelectSubset<T, WebhookEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WebhookEvents and returns the data saved in the database.
     * @param {WebhookEventCreateManyAndReturnArgs} args - Arguments to create many WebhookEvents.
     * @example
     * // Create many WebhookEvents
     * const webhookEvent = await prisma.webhookEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WebhookEvents and only return the `id`
     * const webhookEventWithIdOnly = await prisma.webhookEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WebhookEventCreateManyAndReturnArgs>(args?: SelectSubset<T, WebhookEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebhookEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WebhookEvent.
     * @param {WebhookEventDeleteArgs} args - Arguments to delete one WebhookEvent.
     * @example
     * // Delete one WebhookEvent
     * const WebhookEvent = await prisma.webhookEvent.delete({
     *   where: {
     *     // ... filter to delete one WebhookEvent
     *   }
     * })
     * 
     */
    delete<T extends WebhookEventDeleteArgs>(args: SelectSubset<T, WebhookEventDeleteArgs<ExtArgs>>): Prisma__WebhookEventClient<$Result.GetResult<Prisma.$WebhookEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WebhookEvent.
     * @param {WebhookEventUpdateArgs} args - Arguments to update one WebhookEvent.
     * @example
     * // Update one WebhookEvent
     * const webhookEvent = await prisma.webhookEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WebhookEventUpdateArgs>(args: SelectSubset<T, WebhookEventUpdateArgs<ExtArgs>>): Prisma__WebhookEventClient<$Result.GetResult<Prisma.$WebhookEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WebhookEvents.
     * @param {WebhookEventDeleteManyArgs} args - Arguments to filter WebhookEvents to delete.
     * @example
     * // Delete a few WebhookEvents
     * const { count } = await prisma.webhookEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WebhookEventDeleteManyArgs>(args?: SelectSubset<T, WebhookEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WebhookEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WebhookEvents
     * const webhookEvent = await prisma.webhookEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WebhookEventUpdateManyArgs>(args: SelectSubset<T, WebhookEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WebhookEvents and returns the data updated in the database.
     * @param {WebhookEventUpdateManyAndReturnArgs} args - Arguments to update many WebhookEvents.
     * @example
     * // Update many WebhookEvents
     * const webhookEvent = await prisma.webhookEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WebhookEvents and only return the `id`
     * const webhookEventWithIdOnly = await prisma.webhookEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WebhookEventUpdateManyAndReturnArgs>(args: SelectSubset<T, WebhookEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebhookEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WebhookEvent.
     * @param {WebhookEventUpsertArgs} args - Arguments to update or create a WebhookEvent.
     * @example
     * // Update or create a WebhookEvent
     * const webhookEvent = await prisma.webhookEvent.upsert({
     *   create: {
     *     // ... data to create a WebhookEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WebhookEvent we want to update
     *   }
     * })
     */
    upsert<T extends WebhookEventUpsertArgs>(args: SelectSubset<T, WebhookEventUpsertArgs<ExtArgs>>): Prisma__WebhookEventClient<$Result.GetResult<Prisma.$WebhookEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WebhookEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookEventCountArgs} args - Arguments to filter WebhookEvents to count.
     * @example
     * // Count the number of WebhookEvents
     * const count = await prisma.webhookEvent.count({
     *   where: {
     *     // ... the filter for the WebhookEvents we want to count
     *   }
     * })
    **/
    count<T extends WebhookEventCountArgs>(
      args?: Subset<T, WebhookEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WebhookEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WebhookEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WebhookEventAggregateArgs>(args: Subset<T, WebhookEventAggregateArgs>): Prisma.PrismaPromise<GetWebhookEventAggregateType<T>>

    /**
     * Group by WebhookEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WebhookEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WebhookEventGroupByArgs['orderBy'] }
        : { orderBy?: WebhookEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WebhookEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWebhookEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WebhookEvent model
   */
  readonly fields: WebhookEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WebhookEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WebhookEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WebhookEvent model
   */
  interface WebhookEventFieldRefs {
    readonly id: FieldRef<"WebhookEvent", 'String'>
    readonly organizationId: FieldRef<"WebhookEvent", 'String'>
    readonly direction: FieldRef<"WebhookEvent", 'String'>
    readonly platform: FieldRef<"WebhookEvent", 'String'>
    readonly eventType: FieldRef<"WebhookEvent", 'String'>
    readonly payload: FieldRef<"WebhookEvent", 'String'>
    readonly status: FieldRef<"WebhookEvent", 'String'>
    readonly httpStatus: FieldRef<"WebhookEvent", 'Int'>
    readonly error: FieldRef<"WebhookEvent", 'String'>
    readonly createdAt: FieldRef<"WebhookEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WebhookEvent findUnique
   */
  export type WebhookEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookEvent
     */
    select?: WebhookEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookEvent
     */
    omit?: WebhookEventOmit<ExtArgs> | null
    /**
     * Filter, which WebhookEvent to fetch.
     */
    where: WebhookEventWhereUniqueInput
  }

  /**
   * WebhookEvent findUniqueOrThrow
   */
  export type WebhookEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookEvent
     */
    select?: WebhookEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookEvent
     */
    omit?: WebhookEventOmit<ExtArgs> | null
    /**
     * Filter, which WebhookEvent to fetch.
     */
    where: WebhookEventWhereUniqueInput
  }

  /**
   * WebhookEvent findFirst
   */
  export type WebhookEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookEvent
     */
    select?: WebhookEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookEvent
     */
    omit?: WebhookEventOmit<ExtArgs> | null
    /**
     * Filter, which WebhookEvent to fetch.
     */
    where?: WebhookEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebhookEvents to fetch.
     */
    orderBy?: WebhookEventOrderByWithRelationInput | WebhookEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WebhookEvents.
     */
    cursor?: WebhookEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebhookEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebhookEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WebhookEvents.
     */
    distinct?: WebhookEventScalarFieldEnum | WebhookEventScalarFieldEnum[]
  }

  /**
   * WebhookEvent findFirstOrThrow
   */
  export type WebhookEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookEvent
     */
    select?: WebhookEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookEvent
     */
    omit?: WebhookEventOmit<ExtArgs> | null
    /**
     * Filter, which WebhookEvent to fetch.
     */
    where?: WebhookEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebhookEvents to fetch.
     */
    orderBy?: WebhookEventOrderByWithRelationInput | WebhookEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WebhookEvents.
     */
    cursor?: WebhookEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebhookEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebhookEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WebhookEvents.
     */
    distinct?: WebhookEventScalarFieldEnum | WebhookEventScalarFieldEnum[]
  }

  /**
   * WebhookEvent findMany
   */
  export type WebhookEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookEvent
     */
    select?: WebhookEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookEvent
     */
    omit?: WebhookEventOmit<ExtArgs> | null
    /**
     * Filter, which WebhookEvents to fetch.
     */
    where?: WebhookEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebhookEvents to fetch.
     */
    orderBy?: WebhookEventOrderByWithRelationInput | WebhookEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WebhookEvents.
     */
    cursor?: WebhookEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebhookEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebhookEvents.
     */
    skip?: number
    distinct?: WebhookEventScalarFieldEnum | WebhookEventScalarFieldEnum[]
  }

  /**
   * WebhookEvent create
   */
  export type WebhookEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookEvent
     */
    select?: WebhookEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookEvent
     */
    omit?: WebhookEventOmit<ExtArgs> | null
    /**
     * The data needed to create a WebhookEvent.
     */
    data: XOR<WebhookEventCreateInput, WebhookEventUncheckedCreateInput>
  }

  /**
   * WebhookEvent createMany
   */
  export type WebhookEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WebhookEvents.
     */
    data: WebhookEventCreateManyInput | WebhookEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WebhookEvent createManyAndReturn
   */
  export type WebhookEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookEvent
     */
    select?: WebhookEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookEvent
     */
    omit?: WebhookEventOmit<ExtArgs> | null
    /**
     * The data used to create many WebhookEvents.
     */
    data: WebhookEventCreateManyInput | WebhookEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WebhookEvent update
   */
  export type WebhookEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookEvent
     */
    select?: WebhookEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookEvent
     */
    omit?: WebhookEventOmit<ExtArgs> | null
    /**
     * The data needed to update a WebhookEvent.
     */
    data: XOR<WebhookEventUpdateInput, WebhookEventUncheckedUpdateInput>
    /**
     * Choose, which WebhookEvent to update.
     */
    where: WebhookEventWhereUniqueInput
  }

  /**
   * WebhookEvent updateMany
   */
  export type WebhookEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WebhookEvents.
     */
    data: XOR<WebhookEventUpdateManyMutationInput, WebhookEventUncheckedUpdateManyInput>
    /**
     * Filter which WebhookEvents to update
     */
    where?: WebhookEventWhereInput
    /**
     * Limit how many WebhookEvents to update.
     */
    limit?: number
  }

  /**
   * WebhookEvent updateManyAndReturn
   */
  export type WebhookEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookEvent
     */
    select?: WebhookEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookEvent
     */
    omit?: WebhookEventOmit<ExtArgs> | null
    /**
     * The data used to update WebhookEvents.
     */
    data: XOR<WebhookEventUpdateManyMutationInput, WebhookEventUncheckedUpdateManyInput>
    /**
     * Filter which WebhookEvents to update
     */
    where?: WebhookEventWhereInput
    /**
     * Limit how many WebhookEvents to update.
     */
    limit?: number
  }

  /**
   * WebhookEvent upsert
   */
  export type WebhookEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookEvent
     */
    select?: WebhookEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookEvent
     */
    omit?: WebhookEventOmit<ExtArgs> | null
    /**
     * The filter to search for the WebhookEvent to update in case it exists.
     */
    where: WebhookEventWhereUniqueInput
    /**
     * In case the WebhookEvent found by the `where` argument doesn't exist, create a new WebhookEvent with this data.
     */
    create: XOR<WebhookEventCreateInput, WebhookEventUncheckedCreateInput>
    /**
     * In case the WebhookEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WebhookEventUpdateInput, WebhookEventUncheckedUpdateInput>
  }

  /**
   * WebhookEvent delete
   */
  export type WebhookEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookEvent
     */
    select?: WebhookEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookEvent
     */
    omit?: WebhookEventOmit<ExtArgs> | null
    /**
     * Filter which WebhookEvent to delete.
     */
    where: WebhookEventWhereUniqueInput
  }

  /**
   * WebhookEvent deleteMany
   */
  export type WebhookEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WebhookEvents to delete
     */
    where?: WebhookEventWhereInput
    /**
     * Limit how many WebhookEvents to delete.
     */
    limit?: number
  }

  /**
   * WebhookEvent without action
   */
  export type WebhookEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookEvent
     */
    select?: WebhookEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookEvent
     */
    omit?: WebhookEventOmit<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    passwordHash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    passwordHash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    passwordHash: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    passwordHash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    passwordHash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    passwordHash?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string
    passwordHash: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    memberships?: boolean | User$membershipsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "passwordHash" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    memberships?: boolean | User$membershipsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      memberships: Prisma.$MembershipPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string
      passwordHash: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    memberships<T extends User$membershipsArgs<ExtArgs> = {}>(args?: Subset<T, User$membershipsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.memberships
   */
  export type User$membershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    where?: MembershipWhereInput
    orderBy?: MembershipOrderByWithRelationInput | MembershipOrderByWithRelationInput[]
    cursor?: MembershipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MembershipScalarFieldEnum | MembershipScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    tokenHash: string | null
    activeOrgId: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    tokenHash: string | null
    activeOrgId: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    userId: number
    tokenHash: number
    activeOrgId: number
    expiresAt: number
    createdAt: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    userId?: true
    tokenHash?: true
    activeOrgId?: true
    expiresAt?: true
    createdAt?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    userId?: true
    tokenHash?: true
    activeOrgId?: true
    expiresAt?: true
    createdAt?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    userId?: true
    tokenHash?: true
    activeOrgId?: true
    expiresAt?: true
    createdAt?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    userId: string
    tokenHash: string
    activeOrgId: string | null
    expiresAt: Date
    createdAt: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    activeOrgId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    activeOrgId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    activeOrgId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    activeOrgId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "tokenHash" | "activeOrgId" | "expiresAt" | "createdAt", ExtArgs["result"]["session"]>

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      tokenHash: string
      activeOrgId: string | null
      expiresAt: Date
      createdAt: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly tokenHash: FieldRef<"Session", 'String'>
    readonly activeOrgId: FieldRef<"Session", 'String'>
    readonly expiresAt: FieldRef<"Session", 'DateTime'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
  }


  /**
   * Model Organization
   */

  export type AggregateOrganization = {
    _count: OrganizationCountAggregateOutputType | null
    _min: OrganizationMinAggregateOutputType | null
    _max: OrganizationMaxAggregateOutputType | null
  }

  export type OrganizationMinAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrganizationMaxAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrganizationCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OrganizationMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrganizationMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrganizationCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OrganizationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Organization to aggregate.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Organizations
    **/
    _count?: true | OrganizationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrganizationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrganizationMaxAggregateInputType
  }

  export type GetOrganizationAggregateType<T extends OrganizationAggregateArgs> = {
        [P in keyof T & keyof AggregateOrganization]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrganization[P]>
      : GetScalarType<T[P], AggregateOrganization[P]>
  }




  export type OrganizationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrganizationWhereInput
    orderBy?: OrganizationOrderByWithAggregationInput | OrganizationOrderByWithAggregationInput[]
    by: OrganizationScalarFieldEnum[] | OrganizationScalarFieldEnum
    having?: OrganizationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrganizationCountAggregateInputType | true
    _min?: OrganizationMinAggregateInputType
    _max?: OrganizationMaxAggregateInputType
  }

  export type OrganizationGroupByOutputType = {
    id: string
    name: string
    slug: string
    createdAt: Date
    updatedAt: Date
    _count: OrganizationCountAggregateOutputType | null
    _min: OrganizationMinAggregateOutputType | null
    _max: OrganizationMaxAggregateOutputType | null
  }

  type GetOrganizationGroupByPayload<T extends OrganizationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrganizationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrganizationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrganizationGroupByOutputType[P]>
            : GetScalarType<T[P], OrganizationGroupByOutputType[P]>
        }
      >
    >


  export type OrganizationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    memberships?: boolean | Organization$membershipsArgs<ExtArgs>
    _count?: boolean | OrganizationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["organization"]>

  export type OrganizationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["organization"]>

  export type OrganizationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["organization"]>

  export type OrganizationSelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OrganizationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "createdAt" | "updatedAt", ExtArgs["result"]["organization"]>
  export type OrganizationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    memberships?: boolean | Organization$membershipsArgs<ExtArgs>
    _count?: boolean | OrganizationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OrganizationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type OrganizationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $OrganizationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Organization"
    objects: {
      memberships: Prisma.$MembershipPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      slug: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["organization"]>
    composites: {}
  }

  type OrganizationGetPayload<S extends boolean | null | undefined | OrganizationDefaultArgs> = $Result.GetResult<Prisma.$OrganizationPayload, S>

  type OrganizationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrganizationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrganizationCountAggregateInputType | true
    }

  export interface OrganizationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Organization'], meta: { name: 'Organization' } }
    /**
     * Find zero or one Organization that matches the filter.
     * @param {OrganizationFindUniqueArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrganizationFindUniqueArgs>(args: SelectSubset<T, OrganizationFindUniqueArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Organization that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrganizationFindUniqueOrThrowArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrganizationFindUniqueOrThrowArgs>(args: SelectSubset<T, OrganizationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Organization that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationFindFirstArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrganizationFindFirstArgs>(args?: SelectSubset<T, OrganizationFindFirstArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Organization that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationFindFirstOrThrowArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrganizationFindFirstOrThrowArgs>(args?: SelectSubset<T, OrganizationFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Organizations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Organizations
     * const organizations = await prisma.organization.findMany()
     * 
     * // Get first 10 Organizations
     * const organizations = await prisma.organization.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const organizationWithIdOnly = await prisma.organization.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrganizationFindManyArgs>(args?: SelectSubset<T, OrganizationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Organization.
     * @param {OrganizationCreateArgs} args - Arguments to create a Organization.
     * @example
     * // Create one Organization
     * const Organization = await prisma.organization.create({
     *   data: {
     *     // ... data to create a Organization
     *   }
     * })
     * 
     */
    create<T extends OrganizationCreateArgs>(args: SelectSubset<T, OrganizationCreateArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Organizations.
     * @param {OrganizationCreateManyArgs} args - Arguments to create many Organizations.
     * @example
     * // Create many Organizations
     * const organization = await prisma.organization.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrganizationCreateManyArgs>(args?: SelectSubset<T, OrganizationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Organizations and returns the data saved in the database.
     * @param {OrganizationCreateManyAndReturnArgs} args - Arguments to create many Organizations.
     * @example
     * // Create many Organizations
     * const organization = await prisma.organization.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Organizations and only return the `id`
     * const organizationWithIdOnly = await prisma.organization.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrganizationCreateManyAndReturnArgs>(args?: SelectSubset<T, OrganizationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Organization.
     * @param {OrganizationDeleteArgs} args - Arguments to delete one Organization.
     * @example
     * // Delete one Organization
     * const Organization = await prisma.organization.delete({
     *   where: {
     *     // ... filter to delete one Organization
     *   }
     * })
     * 
     */
    delete<T extends OrganizationDeleteArgs>(args: SelectSubset<T, OrganizationDeleteArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Organization.
     * @param {OrganizationUpdateArgs} args - Arguments to update one Organization.
     * @example
     * // Update one Organization
     * const organization = await prisma.organization.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrganizationUpdateArgs>(args: SelectSubset<T, OrganizationUpdateArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Organizations.
     * @param {OrganizationDeleteManyArgs} args - Arguments to filter Organizations to delete.
     * @example
     * // Delete a few Organizations
     * const { count } = await prisma.organization.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrganizationDeleteManyArgs>(args?: SelectSubset<T, OrganizationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Organizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Organizations
     * const organization = await prisma.organization.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrganizationUpdateManyArgs>(args: SelectSubset<T, OrganizationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Organizations and returns the data updated in the database.
     * @param {OrganizationUpdateManyAndReturnArgs} args - Arguments to update many Organizations.
     * @example
     * // Update many Organizations
     * const organization = await prisma.organization.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Organizations and only return the `id`
     * const organizationWithIdOnly = await prisma.organization.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrganizationUpdateManyAndReturnArgs>(args: SelectSubset<T, OrganizationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Organization.
     * @param {OrganizationUpsertArgs} args - Arguments to update or create a Organization.
     * @example
     * // Update or create a Organization
     * const organization = await prisma.organization.upsert({
     *   create: {
     *     // ... data to create a Organization
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Organization we want to update
     *   }
     * })
     */
    upsert<T extends OrganizationUpsertArgs>(args: SelectSubset<T, OrganizationUpsertArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Organizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationCountArgs} args - Arguments to filter Organizations to count.
     * @example
     * // Count the number of Organizations
     * const count = await prisma.organization.count({
     *   where: {
     *     // ... the filter for the Organizations we want to count
     *   }
     * })
    **/
    count<T extends OrganizationCountArgs>(
      args?: Subset<T, OrganizationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrganizationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Organization.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrganizationAggregateArgs>(args: Subset<T, OrganizationAggregateArgs>): Prisma.PrismaPromise<GetOrganizationAggregateType<T>>

    /**
     * Group by Organization.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrganizationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrganizationGroupByArgs['orderBy'] }
        : { orderBy?: OrganizationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrganizationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrganizationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Organization model
   */
  readonly fields: OrganizationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Organization.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrganizationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    memberships<T extends Organization$membershipsArgs<ExtArgs> = {}>(args?: Subset<T, Organization$membershipsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Organization model
   */
  interface OrganizationFieldRefs {
    readonly id: FieldRef<"Organization", 'String'>
    readonly name: FieldRef<"Organization", 'String'>
    readonly slug: FieldRef<"Organization", 'String'>
    readonly createdAt: FieldRef<"Organization", 'DateTime'>
    readonly updatedAt: FieldRef<"Organization", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Organization findUnique
   */
  export type OrganizationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization findUniqueOrThrow
   */
  export type OrganizationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization findFirst
   */
  export type OrganizationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Organizations.
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Organizations.
     */
    distinct?: OrganizationScalarFieldEnum | OrganizationScalarFieldEnum[]
  }

  /**
   * Organization findFirstOrThrow
   */
  export type OrganizationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Organizations.
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Organizations.
     */
    distinct?: OrganizationScalarFieldEnum | OrganizationScalarFieldEnum[]
  }

  /**
   * Organization findMany
   */
  export type OrganizationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organizations to fetch.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Organizations.
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    distinct?: OrganizationScalarFieldEnum | OrganizationScalarFieldEnum[]
  }

  /**
   * Organization create
   */
  export type OrganizationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * The data needed to create a Organization.
     */
    data: XOR<OrganizationCreateInput, OrganizationUncheckedCreateInput>
  }

  /**
   * Organization createMany
   */
  export type OrganizationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Organizations.
     */
    data: OrganizationCreateManyInput | OrganizationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Organization createManyAndReturn
   */
  export type OrganizationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * The data used to create many Organizations.
     */
    data: OrganizationCreateManyInput | OrganizationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Organization update
   */
  export type OrganizationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * The data needed to update a Organization.
     */
    data: XOR<OrganizationUpdateInput, OrganizationUncheckedUpdateInput>
    /**
     * Choose, which Organization to update.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization updateMany
   */
  export type OrganizationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Organizations.
     */
    data: XOR<OrganizationUpdateManyMutationInput, OrganizationUncheckedUpdateManyInput>
    /**
     * Filter which Organizations to update
     */
    where?: OrganizationWhereInput
    /**
     * Limit how many Organizations to update.
     */
    limit?: number
  }

  /**
   * Organization updateManyAndReturn
   */
  export type OrganizationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * The data used to update Organizations.
     */
    data: XOR<OrganizationUpdateManyMutationInput, OrganizationUncheckedUpdateManyInput>
    /**
     * Filter which Organizations to update
     */
    where?: OrganizationWhereInput
    /**
     * Limit how many Organizations to update.
     */
    limit?: number
  }

  /**
   * Organization upsert
   */
  export type OrganizationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * The filter to search for the Organization to update in case it exists.
     */
    where: OrganizationWhereUniqueInput
    /**
     * In case the Organization found by the `where` argument doesn't exist, create a new Organization with this data.
     */
    create: XOR<OrganizationCreateInput, OrganizationUncheckedCreateInput>
    /**
     * In case the Organization was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrganizationUpdateInput, OrganizationUncheckedUpdateInput>
  }

  /**
   * Organization delete
   */
  export type OrganizationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter which Organization to delete.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization deleteMany
   */
  export type OrganizationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Organizations to delete
     */
    where?: OrganizationWhereInput
    /**
     * Limit how many Organizations to delete.
     */
    limit?: number
  }

  /**
   * Organization.memberships
   */
  export type Organization$membershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    where?: MembershipWhereInput
    orderBy?: MembershipOrderByWithRelationInput | MembershipOrderByWithRelationInput[]
    cursor?: MembershipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MembershipScalarFieldEnum | MembershipScalarFieldEnum[]
  }

  /**
   * Organization without action
   */
  export type OrganizationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
  }


  /**
   * Model Membership
   */

  export type AggregateMembership = {
    _count: MembershipCountAggregateOutputType | null
    _min: MembershipMinAggregateOutputType | null
    _max: MembershipMaxAggregateOutputType | null
  }

  export type MembershipMinAggregateOutputType = {
    id: string | null
    userId: string | null
    orgId: string | null
    role: string | null
    createdAt: Date | null
  }

  export type MembershipMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    orgId: string | null
    role: string | null
    createdAt: Date | null
  }

  export type MembershipCountAggregateOutputType = {
    id: number
    userId: number
    orgId: number
    role: number
    createdAt: number
    _all: number
  }


  export type MembershipMinAggregateInputType = {
    id?: true
    userId?: true
    orgId?: true
    role?: true
    createdAt?: true
  }

  export type MembershipMaxAggregateInputType = {
    id?: true
    userId?: true
    orgId?: true
    role?: true
    createdAt?: true
  }

  export type MembershipCountAggregateInputType = {
    id?: true
    userId?: true
    orgId?: true
    role?: true
    createdAt?: true
    _all?: true
  }

  export type MembershipAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Membership to aggregate.
     */
    where?: MembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Memberships to fetch.
     */
    orderBy?: MembershipOrderByWithRelationInput | MembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Memberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Memberships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Memberships
    **/
    _count?: true | MembershipCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MembershipMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MembershipMaxAggregateInputType
  }

  export type GetMembershipAggregateType<T extends MembershipAggregateArgs> = {
        [P in keyof T & keyof AggregateMembership]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMembership[P]>
      : GetScalarType<T[P], AggregateMembership[P]>
  }




  export type MembershipGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MembershipWhereInput
    orderBy?: MembershipOrderByWithAggregationInput | MembershipOrderByWithAggregationInput[]
    by: MembershipScalarFieldEnum[] | MembershipScalarFieldEnum
    having?: MembershipScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MembershipCountAggregateInputType | true
    _min?: MembershipMinAggregateInputType
    _max?: MembershipMaxAggregateInputType
  }

  export type MembershipGroupByOutputType = {
    id: string
    userId: string
    orgId: string
    role: string
    createdAt: Date
    _count: MembershipCountAggregateOutputType | null
    _min: MembershipMinAggregateOutputType | null
    _max: MembershipMaxAggregateOutputType | null
  }

  type GetMembershipGroupByPayload<T extends MembershipGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MembershipGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MembershipGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MembershipGroupByOutputType[P]>
            : GetScalarType<T[P], MembershipGroupByOutputType[P]>
        }
      >
    >


  export type MembershipSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    orgId?: boolean
    role?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    org?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["membership"]>

  export type MembershipSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    orgId?: boolean
    role?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    org?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["membership"]>

  export type MembershipSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    orgId?: boolean
    role?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    org?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["membership"]>

  export type MembershipSelectScalar = {
    id?: boolean
    userId?: boolean
    orgId?: boolean
    role?: boolean
    createdAt?: boolean
  }

  export type MembershipOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "orgId" | "role" | "createdAt", ExtArgs["result"]["membership"]>
  export type MembershipInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    org?: boolean | OrganizationDefaultArgs<ExtArgs>
  }
  export type MembershipIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    org?: boolean | OrganizationDefaultArgs<ExtArgs>
  }
  export type MembershipIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    org?: boolean | OrganizationDefaultArgs<ExtArgs>
  }

  export type $MembershipPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Membership"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      org: Prisma.$OrganizationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      orgId: string
      role: string
      createdAt: Date
    }, ExtArgs["result"]["membership"]>
    composites: {}
  }

  type MembershipGetPayload<S extends boolean | null | undefined | MembershipDefaultArgs> = $Result.GetResult<Prisma.$MembershipPayload, S>

  type MembershipCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MembershipFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MembershipCountAggregateInputType | true
    }

  export interface MembershipDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Membership'], meta: { name: 'Membership' } }
    /**
     * Find zero or one Membership that matches the filter.
     * @param {MembershipFindUniqueArgs} args - Arguments to find a Membership
     * @example
     * // Get one Membership
     * const membership = await prisma.membership.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MembershipFindUniqueArgs>(args: SelectSubset<T, MembershipFindUniqueArgs<ExtArgs>>): Prisma__MembershipClient<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Membership that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MembershipFindUniqueOrThrowArgs} args - Arguments to find a Membership
     * @example
     * // Get one Membership
     * const membership = await prisma.membership.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MembershipFindUniqueOrThrowArgs>(args: SelectSubset<T, MembershipFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MembershipClient<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Membership that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembershipFindFirstArgs} args - Arguments to find a Membership
     * @example
     * // Get one Membership
     * const membership = await prisma.membership.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MembershipFindFirstArgs>(args?: SelectSubset<T, MembershipFindFirstArgs<ExtArgs>>): Prisma__MembershipClient<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Membership that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembershipFindFirstOrThrowArgs} args - Arguments to find a Membership
     * @example
     * // Get one Membership
     * const membership = await prisma.membership.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MembershipFindFirstOrThrowArgs>(args?: SelectSubset<T, MembershipFindFirstOrThrowArgs<ExtArgs>>): Prisma__MembershipClient<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Memberships that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembershipFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Memberships
     * const memberships = await prisma.membership.findMany()
     * 
     * // Get first 10 Memberships
     * const memberships = await prisma.membership.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const membershipWithIdOnly = await prisma.membership.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MembershipFindManyArgs>(args?: SelectSubset<T, MembershipFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Membership.
     * @param {MembershipCreateArgs} args - Arguments to create a Membership.
     * @example
     * // Create one Membership
     * const Membership = await prisma.membership.create({
     *   data: {
     *     // ... data to create a Membership
     *   }
     * })
     * 
     */
    create<T extends MembershipCreateArgs>(args: SelectSubset<T, MembershipCreateArgs<ExtArgs>>): Prisma__MembershipClient<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Memberships.
     * @param {MembershipCreateManyArgs} args - Arguments to create many Memberships.
     * @example
     * // Create many Memberships
     * const membership = await prisma.membership.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MembershipCreateManyArgs>(args?: SelectSubset<T, MembershipCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Memberships and returns the data saved in the database.
     * @param {MembershipCreateManyAndReturnArgs} args - Arguments to create many Memberships.
     * @example
     * // Create many Memberships
     * const membership = await prisma.membership.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Memberships and only return the `id`
     * const membershipWithIdOnly = await prisma.membership.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MembershipCreateManyAndReturnArgs>(args?: SelectSubset<T, MembershipCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Membership.
     * @param {MembershipDeleteArgs} args - Arguments to delete one Membership.
     * @example
     * // Delete one Membership
     * const Membership = await prisma.membership.delete({
     *   where: {
     *     // ... filter to delete one Membership
     *   }
     * })
     * 
     */
    delete<T extends MembershipDeleteArgs>(args: SelectSubset<T, MembershipDeleteArgs<ExtArgs>>): Prisma__MembershipClient<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Membership.
     * @param {MembershipUpdateArgs} args - Arguments to update one Membership.
     * @example
     * // Update one Membership
     * const membership = await prisma.membership.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MembershipUpdateArgs>(args: SelectSubset<T, MembershipUpdateArgs<ExtArgs>>): Prisma__MembershipClient<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Memberships.
     * @param {MembershipDeleteManyArgs} args - Arguments to filter Memberships to delete.
     * @example
     * // Delete a few Memberships
     * const { count } = await prisma.membership.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MembershipDeleteManyArgs>(args?: SelectSubset<T, MembershipDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Memberships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembershipUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Memberships
     * const membership = await prisma.membership.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MembershipUpdateManyArgs>(args: SelectSubset<T, MembershipUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Memberships and returns the data updated in the database.
     * @param {MembershipUpdateManyAndReturnArgs} args - Arguments to update many Memberships.
     * @example
     * // Update many Memberships
     * const membership = await prisma.membership.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Memberships and only return the `id`
     * const membershipWithIdOnly = await prisma.membership.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MembershipUpdateManyAndReturnArgs>(args: SelectSubset<T, MembershipUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Membership.
     * @param {MembershipUpsertArgs} args - Arguments to update or create a Membership.
     * @example
     * // Update or create a Membership
     * const membership = await prisma.membership.upsert({
     *   create: {
     *     // ... data to create a Membership
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Membership we want to update
     *   }
     * })
     */
    upsert<T extends MembershipUpsertArgs>(args: SelectSubset<T, MembershipUpsertArgs<ExtArgs>>): Prisma__MembershipClient<$Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Memberships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembershipCountArgs} args - Arguments to filter Memberships to count.
     * @example
     * // Count the number of Memberships
     * const count = await prisma.membership.count({
     *   where: {
     *     // ... the filter for the Memberships we want to count
     *   }
     * })
    **/
    count<T extends MembershipCountArgs>(
      args?: Subset<T, MembershipCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MembershipCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Membership.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembershipAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MembershipAggregateArgs>(args: Subset<T, MembershipAggregateArgs>): Prisma.PrismaPromise<GetMembershipAggregateType<T>>

    /**
     * Group by Membership.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembershipGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MembershipGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MembershipGroupByArgs['orderBy'] }
        : { orderBy?: MembershipGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MembershipGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMembershipGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Membership model
   */
  readonly fields: MembershipFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Membership.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MembershipClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    org<T extends OrganizationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationDefaultArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Membership model
   */
  interface MembershipFieldRefs {
    readonly id: FieldRef<"Membership", 'String'>
    readonly userId: FieldRef<"Membership", 'String'>
    readonly orgId: FieldRef<"Membership", 'String'>
    readonly role: FieldRef<"Membership", 'String'>
    readonly createdAt: FieldRef<"Membership", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Membership findUnique
   */
  export type MembershipFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * Filter, which Membership to fetch.
     */
    where: MembershipWhereUniqueInput
  }

  /**
   * Membership findUniqueOrThrow
   */
  export type MembershipFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * Filter, which Membership to fetch.
     */
    where: MembershipWhereUniqueInput
  }

  /**
   * Membership findFirst
   */
  export type MembershipFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * Filter, which Membership to fetch.
     */
    where?: MembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Memberships to fetch.
     */
    orderBy?: MembershipOrderByWithRelationInput | MembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Memberships.
     */
    cursor?: MembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Memberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Memberships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Memberships.
     */
    distinct?: MembershipScalarFieldEnum | MembershipScalarFieldEnum[]
  }

  /**
   * Membership findFirstOrThrow
   */
  export type MembershipFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * Filter, which Membership to fetch.
     */
    where?: MembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Memberships to fetch.
     */
    orderBy?: MembershipOrderByWithRelationInput | MembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Memberships.
     */
    cursor?: MembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Memberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Memberships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Memberships.
     */
    distinct?: MembershipScalarFieldEnum | MembershipScalarFieldEnum[]
  }

  /**
   * Membership findMany
   */
  export type MembershipFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * Filter, which Memberships to fetch.
     */
    where?: MembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Memberships to fetch.
     */
    orderBy?: MembershipOrderByWithRelationInput | MembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Memberships.
     */
    cursor?: MembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Memberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Memberships.
     */
    skip?: number
    distinct?: MembershipScalarFieldEnum | MembershipScalarFieldEnum[]
  }

  /**
   * Membership create
   */
  export type MembershipCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * The data needed to create a Membership.
     */
    data: XOR<MembershipCreateInput, MembershipUncheckedCreateInput>
  }

  /**
   * Membership createMany
   */
  export type MembershipCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Memberships.
     */
    data: MembershipCreateManyInput | MembershipCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Membership createManyAndReturn
   */
  export type MembershipCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * The data used to create many Memberships.
     */
    data: MembershipCreateManyInput | MembershipCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Membership update
   */
  export type MembershipUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * The data needed to update a Membership.
     */
    data: XOR<MembershipUpdateInput, MembershipUncheckedUpdateInput>
    /**
     * Choose, which Membership to update.
     */
    where: MembershipWhereUniqueInput
  }

  /**
   * Membership updateMany
   */
  export type MembershipUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Memberships.
     */
    data: XOR<MembershipUpdateManyMutationInput, MembershipUncheckedUpdateManyInput>
    /**
     * Filter which Memberships to update
     */
    where?: MembershipWhereInput
    /**
     * Limit how many Memberships to update.
     */
    limit?: number
  }

  /**
   * Membership updateManyAndReturn
   */
  export type MembershipUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * The data used to update Memberships.
     */
    data: XOR<MembershipUpdateManyMutationInput, MembershipUncheckedUpdateManyInput>
    /**
     * Filter which Memberships to update
     */
    where?: MembershipWhereInput
    /**
     * Limit how many Memberships to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Membership upsert
   */
  export type MembershipUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * The filter to search for the Membership to update in case it exists.
     */
    where: MembershipWhereUniqueInput
    /**
     * In case the Membership found by the `where` argument doesn't exist, create a new Membership with this data.
     */
    create: XOR<MembershipCreateInput, MembershipUncheckedCreateInput>
    /**
     * In case the Membership was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MembershipUpdateInput, MembershipUncheckedUpdateInput>
  }

  /**
   * Membership delete
   */
  export type MembershipDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
    /**
     * Filter which Membership to delete.
     */
    where: MembershipWhereUniqueInput
  }

  /**
   * Membership deleteMany
   */
  export type MembershipDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Memberships to delete
     */
    where?: MembershipWhereInput
    /**
     * Limit how many Memberships to delete.
     */
    limit?: number
  }

  /**
   * Membership without action
   */
  export type MembershipDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Membership
     */
    select?: MembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Membership
     */
    omit?: MembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembershipInclude<ExtArgs> | null
  }


  /**
   * Model BillingSubscription
   */

  export type AggregateBillingSubscription = {
    _count: BillingSubscriptionCountAggregateOutputType | null
    _min: BillingSubscriptionMinAggregateOutputType | null
    _max: BillingSubscriptionMaxAggregateOutputType | null
  }

  export type BillingSubscriptionMinAggregateOutputType = {
    id: string | null
    organizationId: string | null
    plan: string | null
    status: string | null
    provider: string | null
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    currentPeriodEnd: Date | null
    cancelAtPeriodEnd: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BillingSubscriptionMaxAggregateOutputType = {
    id: string | null
    organizationId: string | null
    plan: string | null
    status: string | null
    provider: string | null
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    currentPeriodEnd: Date | null
    cancelAtPeriodEnd: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BillingSubscriptionCountAggregateOutputType = {
    id: number
    organizationId: number
    plan: number
    status: number
    provider: number
    stripeCustomerId: number
    stripeSubscriptionId: number
    currentPeriodEnd: number
    cancelAtPeriodEnd: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BillingSubscriptionMinAggregateInputType = {
    id?: true
    organizationId?: true
    plan?: true
    status?: true
    provider?: true
    stripeCustomerId?: true
    stripeSubscriptionId?: true
    currentPeriodEnd?: true
    cancelAtPeriodEnd?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BillingSubscriptionMaxAggregateInputType = {
    id?: true
    organizationId?: true
    plan?: true
    status?: true
    provider?: true
    stripeCustomerId?: true
    stripeSubscriptionId?: true
    currentPeriodEnd?: true
    cancelAtPeriodEnd?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BillingSubscriptionCountAggregateInputType = {
    id?: true
    organizationId?: true
    plan?: true
    status?: true
    provider?: true
    stripeCustomerId?: true
    stripeSubscriptionId?: true
    currentPeriodEnd?: true
    cancelAtPeriodEnd?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BillingSubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingSubscription to aggregate.
     */
    where?: BillingSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingSubscriptions to fetch.
     */
    orderBy?: BillingSubscriptionOrderByWithRelationInput | BillingSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BillingSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BillingSubscriptions
    **/
    _count?: true | BillingSubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BillingSubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BillingSubscriptionMaxAggregateInputType
  }

  export type GetBillingSubscriptionAggregateType<T extends BillingSubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateBillingSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBillingSubscription[P]>
      : GetScalarType<T[P], AggregateBillingSubscription[P]>
  }




  export type BillingSubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingSubscriptionWhereInput
    orderBy?: BillingSubscriptionOrderByWithAggregationInput | BillingSubscriptionOrderByWithAggregationInput[]
    by: BillingSubscriptionScalarFieldEnum[] | BillingSubscriptionScalarFieldEnum
    having?: BillingSubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BillingSubscriptionCountAggregateInputType | true
    _min?: BillingSubscriptionMinAggregateInputType
    _max?: BillingSubscriptionMaxAggregateInputType
  }

  export type BillingSubscriptionGroupByOutputType = {
    id: string
    organizationId: string
    plan: string
    status: string
    provider: string
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    currentPeriodEnd: Date | null
    cancelAtPeriodEnd: boolean
    createdAt: Date
    updatedAt: Date
    _count: BillingSubscriptionCountAggregateOutputType | null
    _min: BillingSubscriptionMinAggregateOutputType | null
    _max: BillingSubscriptionMaxAggregateOutputType | null
  }

  type GetBillingSubscriptionGroupByPayload<T extends BillingSubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BillingSubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BillingSubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BillingSubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], BillingSubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type BillingSubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    plan?: boolean
    status?: boolean
    provider?: boolean
    stripeCustomerId?: boolean
    stripeSubscriptionId?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["billingSubscription"]>

  export type BillingSubscriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    plan?: boolean
    status?: boolean
    provider?: boolean
    stripeCustomerId?: boolean
    stripeSubscriptionId?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["billingSubscription"]>

  export type BillingSubscriptionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    plan?: boolean
    status?: boolean
    provider?: boolean
    stripeCustomerId?: boolean
    stripeSubscriptionId?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["billingSubscription"]>

  export type BillingSubscriptionSelectScalar = {
    id?: boolean
    organizationId?: boolean
    plan?: boolean
    status?: boolean
    provider?: boolean
    stripeCustomerId?: boolean
    stripeSubscriptionId?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriodEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BillingSubscriptionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "organizationId" | "plan" | "status" | "provider" | "stripeCustomerId" | "stripeSubscriptionId" | "currentPeriodEnd" | "cancelAtPeriodEnd" | "createdAt" | "updatedAt", ExtArgs["result"]["billingSubscription"]>

  export type $BillingSubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BillingSubscription"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      organizationId: string
      plan: string
      status: string
      provider: string
      stripeCustomerId: string | null
      stripeSubscriptionId: string | null
      currentPeriodEnd: Date | null
      cancelAtPeriodEnd: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["billingSubscription"]>
    composites: {}
  }

  type BillingSubscriptionGetPayload<S extends boolean | null | undefined | BillingSubscriptionDefaultArgs> = $Result.GetResult<Prisma.$BillingSubscriptionPayload, S>

  type BillingSubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BillingSubscriptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BillingSubscriptionCountAggregateInputType | true
    }

  export interface BillingSubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BillingSubscription'], meta: { name: 'BillingSubscription' } }
    /**
     * Find zero or one BillingSubscription that matches the filter.
     * @param {BillingSubscriptionFindUniqueArgs} args - Arguments to find a BillingSubscription
     * @example
     * // Get one BillingSubscription
     * const billingSubscription = await prisma.billingSubscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BillingSubscriptionFindUniqueArgs>(args: SelectSubset<T, BillingSubscriptionFindUniqueArgs<ExtArgs>>): Prisma__BillingSubscriptionClient<$Result.GetResult<Prisma.$BillingSubscriptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BillingSubscription that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BillingSubscriptionFindUniqueOrThrowArgs} args - Arguments to find a BillingSubscription
     * @example
     * // Get one BillingSubscription
     * const billingSubscription = await prisma.billingSubscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BillingSubscriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, BillingSubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BillingSubscriptionClient<$Result.GetResult<Prisma.$BillingSubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BillingSubscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingSubscriptionFindFirstArgs} args - Arguments to find a BillingSubscription
     * @example
     * // Get one BillingSubscription
     * const billingSubscription = await prisma.billingSubscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BillingSubscriptionFindFirstArgs>(args?: SelectSubset<T, BillingSubscriptionFindFirstArgs<ExtArgs>>): Prisma__BillingSubscriptionClient<$Result.GetResult<Prisma.$BillingSubscriptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BillingSubscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingSubscriptionFindFirstOrThrowArgs} args - Arguments to find a BillingSubscription
     * @example
     * // Get one BillingSubscription
     * const billingSubscription = await prisma.billingSubscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BillingSubscriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, BillingSubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__BillingSubscriptionClient<$Result.GetResult<Prisma.$BillingSubscriptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BillingSubscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingSubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BillingSubscriptions
     * const billingSubscriptions = await prisma.billingSubscription.findMany()
     * 
     * // Get first 10 BillingSubscriptions
     * const billingSubscriptions = await prisma.billingSubscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const billingSubscriptionWithIdOnly = await prisma.billingSubscription.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BillingSubscriptionFindManyArgs>(args?: SelectSubset<T, BillingSubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingSubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BillingSubscription.
     * @param {BillingSubscriptionCreateArgs} args - Arguments to create a BillingSubscription.
     * @example
     * // Create one BillingSubscription
     * const BillingSubscription = await prisma.billingSubscription.create({
     *   data: {
     *     // ... data to create a BillingSubscription
     *   }
     * })
     * 
     */
    create<T extends BillingSubscriptionCreateArgs>(args: SelectSubset<T, BillingSubscriptionCreateArgs<ExtArgs>>): Prisma__BillingSubscriptionClient<$Result.GetResult<Prisma.$BillingSubscriptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BillingSubscriptions.
     * @param {BillingSubscriptionCreateManyArgs} args - Arguments to create many BillingSubscriptions.
     * @example
     * // Create many BillingSubscriptions
     * const billingSubscription = await prisma.billingSubscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BillingSubscriptionCreateManyArgs>(args?: SelectSubset<T, BillingSubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BillingSubscriptions and returns the data saved in the database.
     * @param {BillingSubscriptionCreateManyAndReturnArgs} args - Arguments to create many BillingSubscriptions.
     * @example
     * // Create many BillingSubscriptions
     * const billingSubscription = await prisma.billingSubscription.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BillingSubscriptions and only return the `id`
     * const billingSubscriptionWithIdOnly = await prisma.billingSubscription.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BillingSubscriptionCreateManyAndReturnArgs>(args?: SelectSubset<T, BillingSubscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingSubscriptionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BillingSubscription.
     * @param {BillingSubscriptionDeleteArgs} args - Arguments to delete one BillingSubscription.
     * @example
     * // Delete one BillingSubscription
     * const BillingSubscription = await prisma.billingSubscription.delete({
     *   where: {
     *     // ... filter to delete one BillingSubscription
     *   }
     * })
     * 
     */
    delete<T extends BillingSubscriptionDeleteArgs>(args: SelectSubset<T, BillingSubscriptionDeleteArgs<ExtArgs>>): Prisma__BillingSubscriptionClient<$Result.GetResult<Prisma.$BillingSubscriptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BillingSubscription.
     * @param {BillingSubscriptionUpdateArgs} args - Arguments to update one BillingSubscription.
     * @example
     * // Update one BillingSubscription
     * const billingSubscription = await prisma.billingSubscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BillingSubscriptionUpdateArgs>(args: SelectSubset<T, BillingSubscriptionUpdateArgs<ExtArgs>>): Prisma__BillingSubscriptionClient<$Result.GetResult<Prisma.$BillingSubscriptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BillingSubscriptions.
     * @param {BillingSubscriptionDeleteManyArgs} args - Arguments to filter BillingSubscriptions to delete.
     * @example
     * // Delete a few BillingSubscriptions
     * const { count } = await prisma.billingSubscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BillingSubscriptionDeleteManyArgs>(args?: SelectSubset<T, BillingSubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BillingSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingSubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BillingSubscriptions
     * const billingSubscription = await prisma.billingSubscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BillingSubscriptionUpdateManyArgs>(args: SelectSubset<T, BillingSubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BillingSubscriptions and returns the data updated in the database.
     * @param {BillingSubscriptionUpdateManyAndReturnArgs} args - Arguments to update many BillingSubscriptions.
     * @example
     * // Update many BillingSubscriptions
     * const billingSubscription = await prisma.billingSubscription.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BillingSubscriptions and only return the `id`
     * const billingSubscriptionWithIdOnly = await prisma.billingSubscription.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BillingSubscriptionUpdateManyAndReturnArgs>(args: SelectSubset<T, BillingSubscriptionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingSubscriptionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BillingSubscription.
     * @param {BillingSubscriptionUpsertArgs} args - Arguments to update or create a BillingSubscription.
     * @example
     * // Update or create a BillingSubscription
     * const billingSubscription = await prisma.billingSubscription.upsert({
     *   create: {
     *     // ... data to create a BillingSubscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BillingSubscription we want to update
     *   }
     * })
     */
    upsert<T extends BillingSubscriptionUpsertArgs>(args: SelectSubset<T, BillingSubscriptionUpsertArgs<ExtArgs>>): Prisma__BillingSubscriptionClient<$Result.GetResult<Prisma.$BillingSubscriptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BillingSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingSubscriptionCountArgs} args - Arguments to filter BillingSubscriptions to count.
     * @example
     * // Count the number of BillingSubscriptions
     * const count = await prisma.billingSubscription.count({
     *   where: {
     *     // ... the filter for the BillingSubscriptions we want to count
     *   }
     * })
    **/
    count<T extends BillingSubscriptionCountArgs>(
      args?: Subset<T, BillingSubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BillingSubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BillingSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingSubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BillingSubscriptionAggregateArgs>(args: Subset<T, BillingSubscriptionAggregateArgs>): Prisma.PrismaPromise<GetBillingSubscriptionAggregateType<T>>

    /**
     * Group by BillingSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingSubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BillingSubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BillingSubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: BillingSubscriptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BillingSubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBillingSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BillingSubscription model
   */
  readonly fields: BillingSubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BillingSubscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BillingSubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BillingSubscription model
   */
  interface BillingSubscriptionFieldRefs {
    readonly id: FieldRef<"BillingSubscription", 'String'>
    readonly organizationId: FieldRef<"BillingSubscription", 'String'>
    readonly plan: FieldRef<"BillingSubscription", 'String'>
    readonly status: FieldRef<"BillingSubscription", 'String'>
    readonly provider: FieldRef<"BillingSubscription", 'String'>
    readonly stripeCustomerId: FieldRef<"BillingSubscription", 'String'>
    readonly stripeSubscriptionId: FieldRef<"BillingSubscription", 'String'>
    readonly currentPeriodEnd: FieldRef<"BillingSubscription", 'DateTime'>
    readonly cancelAtPeriodEnd: FieldRef<"BillingSubscription", 'Boolean'>
    readonly createdAt: FieldRef<"BillingSubscription", 'DateTime'>
    readonly updatedAt: FieldRef<"BillingSubscription", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BillingSubscription findUnique
   */
  export type BillingSubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingSubscription
     */
    omit?: BillingSubscriptionOmit<ExtArgs> | null
    /**
     * Filter, which BillingSubscription to fetch.
     */
    where: BillingSubscriptionWhereUniqueInput
  }

  /**
   * BillingSubscription findUniqueOrThrow
   */
  export type BillingSubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingSubscription
     */
    omit?: BillingSubscriptionOmit<ExtArgs> | null
    /**
     * Filter, which BillingSubscription to fetch.
     */
    where: BillingSubscriptionWhereUniqueInput
  }

  /**
   * BillingSubscription findFirst
   */
  export type BillingSubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingSubscription
     */
    omit?: BillingSubscriptionOmit<ExtArgs> | null
    /**
     * Filter, which BillingSubscription to fetch.
     */
    where?: BillingSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingSubscriptions to fetch.
     */
    orderBy?: BillingSubscriptionOrderByWithRelationInput | BillingSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingSubscriptions.
     */
    cursor?: BillingSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingSubscriptions.
     */
    distinct?: BillingSubscriptionScalarFieldEnum | BillingSubscriptionScalarFieldEnum[]
  }

  /**
   * BillingSubscription findFirstOrThrow
   */
  export type BillingSubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingSubscription
     */
    omit?: BillingSubscriptionOmit<ExtArgs> | null
    /**
     * Filter, which BillingSubscription to fetch.
     */
    where?: BillingSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingSubscriptions to fetch.
     */
    orderBy?: BillingSubscriptionOrderByWithRelationInput | BillingSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingSubscriptions.
     */
    cursor?: BillingSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingSubscriptions.
     */
    distinct?: BillingSubscriptionScalarFieldEnum | BillingSubscriptionScalarFieldEnum[]
  }

  /**
   * BillingSubscription findMany
   */
  export type BillingSubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingSubscription
     */
    omit?: BillingSubscriptionOmit<ExtArgs> | null
    /**
     * Filter, which BillingSubscriptions to fetch.
     */
    where?: BillingSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingSubscriptions to fetch.
     */
    orderBy?: BillingSubscriptionOrderByWithRelationInput | BillingSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BillingSubscriptions.
     */
    cursor?: BillingSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingSubscriptions.
     */
    skip?: number
    distinct?: BillingSubscriptionScalarFieldEnum | BillingSubscriptionScalarFieldEnum[]
  }

  /**
   * BillingSubscription create
   */
  export type BillingSubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingSubscription
     */
    omit?: BillingSubscriptionOmit<ExtArgs> | null
    /**
     * The data needed to create a BillingSubscription.
     */
    data: XOR<BillingSubscriptionCreateInput, BillingSubscriptionUncheckedCreateInput>
  }

  /**
   * BillingSubscription createMany
   */
  export type BillingSubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BillingSubscriptions.
     */
    data: BillingSubscriptionCreateManyInput | BillingSubscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BillingSubscription createManyAndReturn
   */
  export type BillingSubscriptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BillingSubscription
     */
    omit?: BillingSubscriptionOmit<ExtArgs> | null
    /**
     * The data used to create many BillingSubscriptions.
     */
    data: BillingSubscriptionCreateManyInput | BillingSubscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BillingSubscription update
   */
  export type BillingSubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingSubscription
     */
    omit?: BillingSubscriptionOmit<ExtArgs> | null
    /**
     * The data needed to update a BillingSubscription.
     */
    data: XOR<BillingSubscriptionUpdateInput, BillingSubscriptionUncheckedUpdateInput>
    /**
     * Choose, which BillingSubscription to update.
     */
    where: BillingSubscriptionWhereUniqueInput
  }

  /**
   * BillingSubscription updateMany
   */
  export type BillingSubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BillingSubscriptions.
     */
    data: XOR<BillingSubscriptionUpdateManyMutationInput, BillingSubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which BillingSubscriptions to update
     */
    where?: BillingSubscriptionWhereInput
    /**
     * Limit how many BillingSubscriptions to update.
     */
    limit?: number
  }

  /**
   * BillingSubscription updateManyAndReturn
   */
  export type BillingSubscriptionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BillingSubscription
     */
    omit?: BillingSubscriptionOmit<ExtArgs> | null
    /**
     * The data used to update BillingSubscriptions.
     */
    data: XOR<BillingSubscriptionUpdateManyMutationInput, BillingSubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which BillingSubscriptions to update
     */
    where?: BillingSubscriptionWhereInput
    /**
     * Limit how many BillingSubscriptions to update.
     */
    limit?: number
  }

  /**
   * BillingSubscription upsert
   */
  export type BillingSubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingSubscription
     */
    omit?: BillingSubscriptionOmit<ExtArgs> | null
    /**
     * The filter to search for the BillingSubscription to update in case it exists.
     */
    where: BillingSubscriptionWhereUniqueInput
    /**
     * In case the BillingSubscription found by the `where` argument doesn't exist, create a new BillingSubscription with this data.
     */
    create: XOR<BillingSubscriptionCreateInput, BillingSubscriptionUncheckedCreateInput>
    /**
     * In case the BillingSubscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BillingSubscriptionUpdateInput, BillingSubscriptionUncheckedUpdateInput>
  }

  /**
   * BillingSubscription delete
   */
  export type BillingSubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingSubscription
     */
    omit?: BillingSubscriptionOmit<ExtArgs> | null
    /**
     * Filter which BillingSubscription to delete.
     */
    where: BillingSubscriptionWhereUniqueInput
  }

  /**
   * BillingSubscription deleteMany
   */
  export type BillingSubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingSubscriptions to delete
     */
    where?: BillingSubscriptionWhereInput
    /**
     * Limit how many BillingSubscriptions to delete.
     */
    limit?: number
  }

  /**
   * BillingSubscription without action
   */
  export type BillingSubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingSubscription
     */
    omit?: BillingSubscriptionOmit<ExtArgs> | null
  }


  /**
   * Model BillingInvoice
   */

  export type AggregateBillingInvoice = {
    _count: BillingInvoiceCountAggregateOutputType | null
    _avg: BillingInvoiceAvgAggregateOutputType | null
    _sum: BillingInvoiceSumAggregateOutputType | null
    _min: BillingInvoiceMinAggregateOutputType | null
    _max: BillingInvoiceMaxAggregateOutputType | null
  }

  export type BillingInvoiceAvgAggregateOutputType = {
    amountCents: number | null
    attempts: number | null
  }

  export type BillingInvoiceSumAggregateOutputType = {
    amountCents: number | null
    attempts: number | null
  }

  export type BillingInvoiceMinAggregateOutputType = {
    id: string | null
    organizationId: string | null
    number: string | null
    plan: string | null
    amountCents: number | null
    currency: string | null
    status: string | null
    attempts: number | null
    periodStart: Date | null
    periodEnd: Date | null
    dueAt: Date | null
    paidAt: Date | null
    lastError: string | null
    provider: string | null
    stripeInvoiceId: string | null
    createdAt: Date | null
  }

  export type BillingInvoiceMaxAggregateOutputType = {
    id: string | null
    organizationId: string | null
    number: string | null
    plan: string | null
    amountCents: number | null
    currency: string | null
    status: string | null
    attempts: number | null
    periodStart: Date | null
    periodEnd: Date | null
    dueAt: Date | null
    paidAt: Date | null
    lastError: string | null
    provider: string | null
    stripeInvoiceId: string | null
    createdAt: Date | null
  }

  export type BillingInvoiceCountAggregateOutputType = {
    id: number
    organizationId: number
    number: number
    plan: number
    amountCents: number
    currency: number
    status: number
    attempts: number
    periodStart: number
    periodEnd: number
    dueAt: number
    paidAt: number
    lastError: number
    provider: number
    stripeInvoiceId: number
    createdAt: number
    _all: number
  }


  export type BillingInvoiceAvgAggregateInputType = {
    amountCents?: true
    attempts?: true
  }

  export type BillingInvoiceSumAggregateInputType = {
    amountCents?: true
    attempts?: true
  }

  export type BillingInvoiceMinAggregateInputType = {
    id?: true
    organizationId?: true
    number?: true
    plan?: true
    amountCents?: true
    currency?: true
    status?: true
    attempts?: true
    periodStart?: true
    periodEnd?: true
    dueAt?: true
    paidAt?: true
    lastError?: true
    provider?: true
    stripeInvoiceId?: true
    createdAt?: true
  }

  export type BillingInvoiceMaxAggregateInputType = {
    id?: true
    organizationId?: true
    number?: true
    plan?: true
    amountCents?: true
    currency?: true
    status?: true
    attempts?: true
    periodStart?: true
    periodEnd?: true
    dueAt?: true
    paidAt?: true
    lastError?: true
    provider?: true
    stripeInvoiceId?: true
    createdAt?: true
  }

  export type BillingInvoiceCountAggregateInputType = {
    id?: true
    organizationId?: true
    number?: true
    plan?: true
    amountCents?: true
    currency?: true
    status?: true
    attempts?: true
    periodStart?: true
    periodEnd?: true
    dueAt?: true
    paidAt?: true
    lastError?: true
    provider?: true
    stripeInvoiceId?: true
    createdAt?: true
    _all?: true
  }

  export type BillingInvoiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingInvoice to aggregate.
     */
    where?: BillingInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingInvoices to fetch.
     */
    orderBy?: BillingInvoiceOrderByWithRelationInput | BillingInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BillingInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BillingInvoices
    **/
    _count?: true | BillingInvoiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BillingInvoiceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BillingInvoiceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BillingInvoiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BillingInvoiceMaxAggregateInputType
  }

  export type GetBillingInvoiceAggregateType<T extends BillingInvoiceAggregateArgs> = {
        [P in keyof T & keyof AggregateBillingInvoice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBillingInvoice[P]>
      : GetScalarType<T[P], AggregateBillingInvoice[P]>
  }




  export type BillingInvoiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingInvoiceWhereInput
    orderBy?: BillingInvoiceOrderByWithAggregationInput | BillingInvoiceOrderByWithAggregationInput[]
    by: BillingInvoiceScalarFieldEnum[] | BillingInvoiceScalarFieldEnum
    having?: BillingInvoiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BillingInvoiceCountAggregateInputType | true
    _avg?: BillingInvoiceAvgAggregateInputType
    _sum?: BillingInvoiceSumAggregateInputType
    _min?: BillingInvoiceMinAggregateInputType
    _max?: BillingInvoiceMaxAggregateInputType
  }

  export type BillingInvoiceGroupByOutputType = {
    id: string
    organizationId: string
    number: string
    plan: string
    amountCents: number
    currency: string
    status: string
    attempts: number
    periodStart: Date
    periodEnd: Date
    dueAt: Date
    paidAt: Date | null
    lastError: string | null
    provider: string
    stripeInvoiceId: string | null
    createdAt: Date
    _count: BillingInvoiceCountAggregateOutputType | null
    _avg: BillingInvoiceAvgAggregateOutputType | null
    _sum: BillingInvoiceSumAggregateOutputType | null
    _min: BillingInvoiceMinAggregateOutputType | null
    _max: BillingInvoiceMaxAggregateOutputType | null
  }

  type GetBillingInvoiceGroupByPayload<T extends BillingInvoiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BillingInvoiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BillingInvoiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BillingInvoiceGroupByOutputType[P]>
            : GetScalarType<T[P], BillingInvoiceGroupByOutputType[P]>
        }
      >
    >


  export type BillingInvoiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    number?: boolean
    plan?: boolean
    amountCents?: boolean
    currency?: boolean
    status?: boolean
    attempts?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    dueAt?: boolean
    paidAt?: boolean
    lastError?: boolean
    provider?: boolean
    stripeInvoiceId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["billingInvoice"]>

  export type BillingInvoiceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    number?: boolean
    plan?: boolean
    amountCents?: boolean
    currency?: boolean
    status?: boolean
    attempts?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    dueAt?: boolean
    paidAt?: boolean
    lastError?: boolean
    provider?: boolean
    stripeInvoiceId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["billingInvoice"]>

  export type BillingInvoiceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    number?: boolean
    plan?: boolean
    amountCents?: boolean
    currency?: boolean
    status?: boolean
    attempts?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    dueAt?: boolean
    paidAt?: boolean
    lastError?: boolean
    provider?: boolean
    stripeInvoiceId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["billingInvoice"]>

  export type BillingInvoiceSelectScalar = {
    id?: boolean
    organizationId?: boolean
    number?: boolean
    plan?: boolean
    amountCents?: boolean
    currency?: boolean
    status?: boolean
    attempts?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    dueAt?: boolean
    paidAt?: boolean
    lastError?: boolean
    provider?: boolean
    stripeInvoiceId?: boolean
    createdAt?: boolean
  }

  export type BillingInvoiceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "organizationId" | "number" | "plan" | "amountCents" | "currency" | "status" | "attempts" | "periodStart" | "periodEnd" | "dueAt" | "paidAt" | "lastError" | "provider" | "stripeInvoiceId" | "createdAt", ExtArgs["result"]["billingInvoice"]>

  export type $BillingInvoicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BillingInvoice"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      organizationId: string
      number: string
      plan: string
      amountCents: number
      currency: string
      status: string
      attempts: number
      periodStart: Date
      periodEnd: Date
      dueAt: Date
      paidAt: Date | null
      lastError: string | null
      provider: string
      stripeInvoiceId: string | null
      createdAt: Date
    }, ExtArgs["result"]["billingInvoice"]>
    composites: {}
  }

  type BillingInvoiceGetPayload<S extends boolean | null | undefined | BillingInvoiceDefaultArgs> = $Result.GetResult<Prisma.$BillingInvoicePayload, S>

  type BillingInvoiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BillingInvoiceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BillingInvoiceCountAggregateInputType | true
    }

  export interface BillingInvoiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BillingInvoice'], meta: { name: 'BillingInvoice' } }
    /**
     * Find zero or one BillingInvoice that matches the filter.
     * @param {BillingInvoiceFindUniqueArgs} args - Arguments to find a BillingInvoice
     * @example
     * // Get one BillingInvoice
     * const billingInvoice = await prisma.billingInvoice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BillingInvoiceFindUniqueArgs>(args: SelectSubset<T, BillingInvoiceFindUniqueArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BillingInvoice that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BillingInvoiceFindUniqueOrThrowArgs} args - Arguments to find a BillingInvoice
     * @example
     * // Get one BillingInvoice
     * const billingInvoice = await prisma.billingInvoice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BillingInvoiceFindUniqueOrThrowArgs>(args: SelectSubset<T, BillingInvoiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BillingInvoice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceFindFirstArgs} args - Arguments to find a BillingInvoice
     * @example
     * // Get one BillingInvoice
     * const billingInvoice = await prisma.billingInvoice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BillingInvoiceFindFirstArgs>(args?: SelectSubset<T, BillingInvoiceFindFirstArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BillingInvoice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceFindFirstOrThrowArgs} args - Arguments to find a BillingInvoice
     * @example
     * // Get one BillingInvoice
     * const billingInvoice = await prisma.billingInvoice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BillingInvoiceFindFirstOrThrowArgs>(args?: SelectSubset<T, BillingInvoiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BillingInvoices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BillingInvoices
     * const billingInvoices = await prisma.billingInvoice.findMany()
     * 
     * // Get first 10 BillingInvoices
     * const billingInvoices = await prisma.billingInvoice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const billingInvoiceWithIdOnly = await prisma.billingInvoice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BillingInvoiceFindManyArgs>(args?: SelectSubset<T, BillingInvoiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BillingInvoice.
     * @param {BillingInvoiceCreateArgs} args - Arguments to create a BillingInvoice.
     * @example
     * // Create one BillingInvoice
     * const BillingInvoice = await prisma.billingInvoice.create({
     *   data: {
     *     // ... data to create a BillingInvoice
     *   }
     * })
     * 
     */
    create<T extends BillingInvoiceCreateArgs>(args: SelectSubset<T, BillingInvoiceCreateArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BillingInvoices.
     * @param {BillingInvoiceCreateManyArgs} args - Arguments to create many BillingInvoices.
     * @example
     * // Create many BillingInvoices
     * const billingInvoice = await prisma.billingInvoice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BillingInvoiceCreateManyArgs>(args?: SelectSubset<T, BillingInvoiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BillingInvoices and returns the data saved in the database.
     * @param {BillingInvoiceCreateManyAndReturnArgs} args - Arguments to create many BillingInvoices.
     * @example
     * // Create many BillingInvoices
     * const billingInvoice = await prisma.billingInvoice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BillingInvoices and only return the `id`
     * const billingInvoiceWithIdOnly = await prisma.billingInvoice.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BillingInvoiceCreateManyAndReturnArgs>(args?: SelectSubset<T, BillingInvoiceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BillingInvoice.
     * @param {BillingInvoiceDeleteArgs} args - Arguments to delete one BillingInvoice.
     * @example
     * // Delete one BillingInvoice
     * const BillingInvoice = await prisma.billingInvoice.delete({
     *   where: {
     *     // ... filter to delete one BillingInvoice
     *   }
     * })
     * 
     */
    delete<T extends BillingInvoiceDeleteArgs>(args: SelectSubset<T, BillingInvoiceDeleteArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BillingInvoice.
     * @param {BillingInvoiceUpdateArgs} args - Arguments to update one BillingInvoice.
     * @example
     * // Update one BillingInvoice
     * const billingInvoice = await prisma.billingInvoice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BillingInvoiceUpdateArgs>(args: SelectSubset<T, BillingInvoiceUpdateArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BillingInvoices.
     * @param {BillingInvoiceDeleteManyArgs} args - Arguments to filter BillingInvoices to delete.
     * @example
     * // Delete a few BillingInvoices
     * const { count } = await prisma.billingInvoice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BillingInvoiceDeleteManyArgs>(args?: SelectSubset<T, BillingInvoiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BillingInvoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BillingInvoices
     * const billingInvoice = await prisma.billingInvoice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BillingInvoiceUpdateManyArgs>(args: SelectSubset<T, BillingInvoiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BillingInvoices and returns the data updated in the database.
     * @param {BillingInvoiceUpdateManyAndReturnArgs} args - Arguments to update many BillingInvoices.
     * @example
     * // Update many BillingInvoices
     * const billingInvoice = await prisma.billingInvoice.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BillingInvoices and only return the `id`
     * const billingInvoiceWithIdOnly = await prisma.billingInvoice.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BillingInvoiceUpdateManyAndReturnArgs>(args: SelectSubset<T, BillingInvoiceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BillingInvoice.
     * @param {BillingInvoiceUpsertArgs} args - Arguments to update or create a BillingInvoice.
     * @example
     * // Update or create a BillingInvoice
     * const billingInvoice = await prisma.billingInvoice.upsert({
     *   create: {
     *     // ... data to create a BillingInvoice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BillingInvoice we want to update
     *   }
     * })
     */
    upsert<T extends BillingInvoiceUpsertArgs>(args: SelectSubset<T, BillingInvoiceUpsertArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BillingInvoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceCountArgs} args - Arguments to filter BillingInvoices to count.
     * @example
     * // Count the number of BillingInvoices
     * const count = await prisma.billingInvoice.count({
     *   where: {
     *     // ... the filter for the BillingInvoices we want to count
     *   }
     * })
    **/
    count<T extends BillingInvoiceCountArgs>(
      args?: Subset<T, BillingInvoiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BillingInvoiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BillingInvoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BillingInvoiceAggregateArgs>(args: Subset<T, BillingInvoiceAggregateArgs>): Prisma.PrismaPromise<GetBillingInvoiceAggregateType<T>>

    /**
     * Group by BillingInvoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BillingInvoiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BillingInvoiceGroupByArgs['orderBy'] }
        : { orderBy?: BillingInvoiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BillingInvoiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBillingInvoiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BillingInvoice model
   */
  readonly fields: BillingInvoiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BillingInvoice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BillingInvoiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BillingInvoice model
   */
  interface BillingInvoiceFieldRefs {
    readonly id: FieldRef<"BillingInvoice", 'String'>
    readonly organizationId: FieldRef<"BillingInvoice", 'String'>
    readonly number: FieldRef<"BillingInvoice", 'String'>
    readonly plan: FieldRef<"BillingInvoice", 'String'>
    readonly amountCents: FieldRef<"BillingInvoice", 'Int'>
    readonly currency: FieldRef<"BillingInvoice", 'String'>
    readonly status: FieldRef<"BillingInvoice", 'String'>
    readonly attempts: FieldRef<"BillingInvoice", 'Int'>
    readonly periodStart: FieldRef<"BillingInvoice", 'DateTime'>
    readonly periodEnd: FieldRef<"BillingInvoice", 'DateTime'>
    readonly dueAt: FieldRef<"BillingInvoice", 'DateTime'>
    readonly paidAt: FieldRef<"BillingInvoice", 'DateTime'>
    readonly lastError: FieldRef<"BillingInvoice", 'String'>
    readonly provider: FieldRef<"BillingInvoice", 'String'>
    readonly stripeInvoiceId: FieldRef<"BillingInvoice", 'String'>
    readonly createdAt: FieldRef<"BillingInvoice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BillingInvoice findUnique
   */
  export type BillingInvoiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Filter, which BillingInvoice to fetch.
     */
    where: BillingInvoiceWhereUniqueInput
  }

  /**
   * BillingInvoice findUniqueOrThrow
   */
  export type BillingInvoiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Filter, which BillingInvoice to fetch.
     */
    where: BillingInvoiceWhereUniqueInput
  }

  /**
   * BillingInvoice findFirst
   */
  export type BillingInvoiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Filter, which BillingInvoice to fetch.
     */
    where?: BillingInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingInvoices to fetch.
     */
    orderBy?: BillingInvoiceOrderByWithRelationInput | BillingInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingInvoices.
     */
    cursor?: BillingInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingInvoices.
     */
    distinct?: BillingInvoiceScalarFieldEnum | BillingInvoiceScalarFieldEnum[]
  }

  /**
   * BillingInvoice findFirstOrThrow
   */
  export type BillingInvoiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Filter, which BillingInvoice to fetch.
     */
    where?: BillingInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingInvoices to fetch.
     */
    orderBy?: BillingInvoiceOrderByWithRelationInput | BillingInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingInvoices.
     */
    cursor?: BillingInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingInvoices.
     */
    distinct?: BillingInvoiceScalarFieldEnum | BillingInvoiceScalarFieldEnum[]
  }

  /**
   * BillingInvoice findMany
   */
  export type BillingInvoiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Filter, which BillingInvoices to fetch.
     */
    where?: BillingInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingInvoices to fetch.
     */
    orderBy?: BillingInvoiceOrderByWithRelationInput | BillingInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BillingInvoices.
     */
    cursor?: BillingInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingInvoices.
     */
    skip?: number
    distinct?: BillingInvoiceScalarFieldEnum | BillingInvoiceScalarFieldEnum[]
  }

  /**
   * BillingInvoice create
   */
  export type BillingInvoiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * The data needed to create a BillingInvoice.
     */
    data: XOR<BillingInvoiceCreateInput, BillingInvoiceUncheckedCreateInput>
  }

  /**
   * BillingInvoice createMany
   */
  export type BillingInvoiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BillingInvoices.
     */
    data: BillingInvoiceCreateManyInput | BillingInvoiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BillingInvoice createManyAndReturn
   */
  export type BillingInvoiceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * The data used to create many BillingInvoices.
     */
    data: BillingInvoiceCreateManyInput | BillingInvoiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BillingInvoice update
   */
  export type BillingInvoiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * The data needed to update a BillingInvoice.
     */
    data: XOR<BillingInvoiceUpdateInput, BillingInvoiceUncheckedUpdateInput>
    /**
     * Choose, which BillingInvoice to update.
     */
    where: BillingInvoiceWhereUniqueInput
  }

  /**
   * BillingInvoice updateMany
   */
  export type BillingInvoiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BillingInvoices.
     */
    data: XOR<BillingInvoiceUpdateManyMutationInput, BillingInvoiceUncheckedUpdateManyInput>
    /**
     * Filter which BillingInvoices to update
     */
    where?: BillingInvoiceWhereInput
    /**
     * Limit how many BillingInvoices to update.
     */
    limit?: number
  }

  /**
   * BillingInvoice updateManyAndReturn
   */
  export type BillingInvoiceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * The data used to update BillingInvoices.
     */
    data: XOR<BillingInvoiceUpdateManyMutationInput, BillingInvoiceUncheckedUpdateManyInput>
    /**
     * Filter which BillingInvoices to update
     */
    where?: BillingInvoiceWhereInput
    /**
     * Limit how many BillingInvoices to update.
     */
    limit?: number
  }

  /**
   * BillingInvoice upsert
   */
  export type BillingInvoiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * The filter to search for the BillingInvoice to update in case it exists.
     */
    where: BillingInvoiceWhereUniqueInput
    /**
     * In case the BillingInvoice found by the `where` argument doesn't exist, create a new BillingInvoice with this data.
     */
    create: XOR<BillingInvoiceCreateInput, BillingInvoiceUncheckedCreateInput>
    /**
     * In case the BillingInvoice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BillingInvoiceUpdateInput, BillingInvoiceUncheckedUpdateInput>
  }

  /**
   * BillingInvoice delete
   */
  export type BillingInvoiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Filter which BillingInvoice to delete.
     */
    where: BillingInvoiceWhereUniqueInput
  }

  /**
   * BillingInvoice deleteMany
   */
  export type BillingInvoiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingInvoices to delete
     */
    where?: BillingInvoiceWhereInput
    /**
     * Limit how many BillingInvoices to delete.
     */
    limit?: number
  }

  /**
   * BillingInvoice without action
   */
  export type BillingInvoiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
  }


  /**
   * Model BillingEvent
   */

  export type AggregateBillingEvent = {
    _count: BillingEventCountAggregateOutputType | null
    _min: BillingEventMinAggregateOutputType | null
    _max: BillingEventMaxAggregateOutputType | null
  }

  export type BillingEventMinAggregateOutputType = {
    id: string | null
    organizationId: string | null
    type: string | null
    detail: string | null
    createdAt: Date | null
  }

  export type BillingEventMaxAggregateOutputType = {
    id: string | null
    organizationId: string | null
    type: string | null
    detail: string | null
    createdAt: Date | null
  }

  export type BillingEventCountAggregateOutputType = {
    id: number
    organizationId: number
    type: number
    detail: number
    createdAt: number
    _all: number
  }


  export type BillingEventMinAggregateInputType = {
    id?: true
    organizationId?: true
    type?: true
    detail?: true
    createdAt?: true
  }

  export type BillingEventMaxAggregateInputType = {
    id?: true
    organizationId?: true
    type?: true
    detail?: true
    createdAt?: true
  }

  export type BillingEventCountAggregateInputType = {
    id?: true
    organizationId?: true
    type?: true
    detail?: true
    createdAt?: true
    _all?: true
  }

  export type BillingEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingEvent to aggregate.
     */
    where?: BillingEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingEvents to fetch.
     */
    orderBy?: BillingEventOrderByWithRelationInput | BillingEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BillingEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BillingEvents
    **/
    _count?: true | BillingEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BillingEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BillingEventMaxAggregateInputType
  }

  export type GetBillingEventAggregateType<T extends BillingEventAggregateArgs> = {
        [P in keyof T & keyof AggregateBillingEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBillingEvent[P]>
      : GetScalarType<T[P], AggregateBillingEvent[P]>
  }




  export type BillingEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingEventWhereInput
    orderBy?: BillingEventOrderByWithAggregationInput | BillingEventOrderByWithAggregationInput[]
    by: BillingEventScalarFieldEnum[] | BillingEventScalarFieldEnum
    having?: BillingEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BillingEventCountAggregateInputType | true
    _min?: BillingEventMinAggregateInputType
    _max?: BillingEventMaxAggregateInputType
  }

  export type BillingEventGroupByOutputType = {
    id: string
    organizationId: string
    type: string
    detail: string
    createdAt: Date
    _count: BillingEventCountAggregateOutputType | null
    _min: BillingEventMinAggregateOutputType | null
    _max: BillingEventMaxAggregateOutputType | null
  }

  type GetBillingEventGroupByPayload<T extends BillingEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BillingEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BillingEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BillingEventGroupByOutputType[P]>
            : GetScalarType<T[P], BillingEventGroupByOutputType[P]>
        }
      >
    >


  export type BillingEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    type?: boolean
    detail?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["billingEvent"]>

  export type BillingEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    type?: boolean
    detail?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["billingEvent"]>

  export type BillingEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    type?: boolean
    detail?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["billingEvent"]>

  export type BillingEventSelectScalar = {
    id?: boolean
    organizationId?: boolean
    type?: boolean
    detail?: boolean
    createdAt?: boolean
  }

  export type BillingEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "organizationId" | "type" | "detail" | "createdAt", ExtArgs["result"]["billingEvent"]>

  export type $BillingEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BillingEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      organizationId: string
      type: string
      detail: string
      createdAt: Date
    }, ExtArgs["result"]["billingEvent"]>
    composites: {}
  }

  type BillingEventGetPayload<S extends boolean | null | undefined | BillingEventDefaultArgs> = $Result.GetResult<Prisma.$BillingEventPayload, S>

  type BillingEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BillingEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BillingEventCountAggregateInputType | true
    }

  export interface BillingEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BillingEvent'], meta: { name: 'BillingEvent' } }
    /**
     * Find zero or one BillingEvent that matches the filter.
     * @param {BillingEventFindUniqueArgs} args - Arguments to find a BillingEvent
     * @example
     * // Get one BillingEvent
     * const billingEvent = await prisma.billingEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BillingEventFindUniqueArgs>(args: SelectSubset<T, BillingEventFindUniqueArgs<ExtArgs>>): Prisma__BillingEventClient<$Result.GetResult<Prisma.$BillingEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BillingEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BillingEventFindUniqueOrThrowArgs} args - Arguments to find a BillingEvent
     * @example
     * // Get one BillingEvent
     * const billingEvent = await prisma.billingEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BillingEventFindUniqueOrThrowArgs>(args: SelectSubset<T, BillingEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BillingEventClient<$Result.GetResult<Prisma.$BillingEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BillingEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingEventFindFirstArgs} args - Arguments to find a BillingEvent
     * @example
     * // Get one BillingEvent
     * const billingEvent = await prisma.billingEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BillingEventFindFirstArgs>(args?: SelectSubset<T, BillingEventFindFirstArgs<ExtArgs>>): Prisma__BillingEventClient<$Result.GetResult<Prisma.$BillingEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BillingEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingEventFindFirstOrThrowArgs} args - Arguments to find a BillingEvent
     * @example
     * // Get one BillingEvent
     * const billingEvent = await prisma.billingEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BillingEventFindFirstOrThrowArgs>(args?: SelectSubset<T, BillingEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__BillingEventClient<$Result.GetResult<Prisma.$BillingEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BillingEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BillingEvents
     * const billingEvents = await prisma.billingEvent.findMany()
     * 
     * // Get first 10 BillingEvents
     * const billingEvents = await prisma.billingEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const billingEventWithIdOnly = await prisma.billingEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BillingEventFindManyArgs>(args?: SelectSubset<T, BillingEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BillingEvent.
     * @param {BillingEventCreateArgs} args - Arguments to create a BillingEvent.
     * @example
     * // Create one BillingEvent
     * const BillingEvent = await prisma.billingEvent.create({
     *   data: {
     *     // ... data to create a BillingEvent
     *   }
     * })
     * 
     */
    create<T extends BillingEventCreateArgs>(args: SelectSubset<T, BillingEventCreateArgs<ExtArgs>>): Prisma__BillingEventClient<$Result.GetResult<Prisma.$BillingEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BillingEvents.
     * @param {BillingEventCreateManyArgs} args - Arguments to create many BillingEvents.
     * @example
     * // Create many BillingEvents
     * const billingEvent = await prisma.billingEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BillingEventCreateManyArgs>(args?: SelectSubset<T, BillingEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BillingEvents and returns the data saved in the database.
     * @param {BillingEventCreateManyAndReturnArgs} args - Arguments to create many BillingEvents.
     * @example
     * // Create many BillingEvents
     * const billingEvent = await prisma.billingEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BillingEvents and only return the `id`
     * const billingEventWithIdOnly = await prisma.billingEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BillingEventCreateManyAndReturnArgs>(args?: SelectSubset<T, BillingEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BillingEvent.
     * @param {BillingEventDeleteArgs} args - Arguments to delete one BillingEvent.
     * @example
     * // Delete one BillingEvent
     * const BillingEvent = await prisma.billingEvent.delete({
     *   where: {
     *     // ... filter to delete one BillingEvent
     *   }
     * })
     * 
     */
    delete<T extends BillingEventDeleteArgs>(args: SelectSubset<T, BillingEventDeleteArgs<ExtArgs>>): Prisma__BillingEventClient<$Result.GetResult<Prisma.$BillingEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BillingEvent.
     * @param {BillingEventUpdateArgs} args - Arguments to update one BillingEvent.
     * @example
     * // Update one BillingEvent
     * const billingEvent = await prisma.billingEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BillingEventUpdateArgs>(args: SelectSubset<T, BillingEventUpdateArgs<ExtArgs>>): Prisma__BillingEventClient<$Result.GetResult<Prisma.$BillingEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BillingEvents.
     * @param {BillingEventDeleteManyArgs} args - Arguments to filter BillingEvents to delete.
     * @example
     * // Delete a few BillingEvents
     * const { count } = await prisma.billingEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BillingEventDeleteManyArgs>(args?: SelectSubset<T, BillingEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BillingEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BillingEvents
     * const billingEvent = await prisma.billingEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BillingEventUpdateManyArgs>(args: SelectSubset<T, BillingEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BillingEvents and returns the data updated in the database.
     * @param {BillingEventUpdateManyAndReturnArgs} args - Arguments to update many BillingEvents.
     * @example
     * // Update many BillingEvents
     * const billingEvent = await prisma.billingEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BillingEvents and only return the `id`
     * const billingEventWithIdOnly = await prisma.billingEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BillingEventUpdateManyAndReturnArgs>(args: SelectSubset<T, BillingEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BillingEvent.
     * @param {BillingEventUpsertArgs} args - Arguments to update or create a BillingEvent.
     * @example
     * // Update or create a BillingEvent
     * const billingEvent = await prisma.billingEvent.upsert({
     *   create: {
     *     // ... data to create a BillingEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BillingEvent we want to update
     *   }
     * })
     */
    upsert<T extends BillingEventUpsertArgs>(args: SelectSubset<T, BillingEventUpsertArgs<ExtArgs>>): Prisma__BillingEventClient<$Result.GetResult<Prisma.$BillingEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BillingEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingEventCountArgs} args - Arguments to filter BillingEvents to count.
     * @example
     * // Count the number of BillingEvents
     * const count = await prisma.billingEvent.count({
     *   where: {
     *     // ... the filter for the BillingEvents we want to count
     *   }
     * })
    **/
    count<T extends BillingEventCountArgs>(
      args?: Subset<T, BillingEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BillingEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BillingEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BillingEventAggregateArgs>(args: Subset<T, BillingEventAggregateArgs>): Prisma.PrismaPromise<GetBillingEventAggregateType<T>>

    /**
     * Group by BillingEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BillingEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BillingEventGroupByArgs['orderBy'] }
        : { orderBy?: BillingEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BillingEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBillingEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BillingEvent model
   */
  readonly fields: BillingEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BillingEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BillingEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BillingEvent model
   */
  interface BillingEventFieldRefs {
    readonly id: FieldRef<"BillingEvent", 'String'>
    readonly organizationId: FieldRef<"BillingEvent", 'String'>
    readonly type: FieldRef<"BillingEvent", 'String'>
    readonly detail: FieldRef<"BillingEvent", 'String'>
    readonly createdAt: FieldRef<"BillingEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BillingEvent findUnique
   */
  export type BillingEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingEvent
     */
    select?: BillingEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingEvent
     */
    omit?: BillingEventOmit<ExtArgs> | null
    /**
     * Filter, which BillingEvent to fetch.
     */
    where: BillingEventWhereUniqueInput
  }

  /**
   * BillingEvent findUniqueOrThrow
   */
  export type BillingEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingEvent
     */
    select?: BillingEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingEvent
     */
    omit?: BillingEventOmit<ExtArgs> | null
    /**
     * Filter, which BillingEvent to fetch.
     */
    where: BillingEventWhereUniqueInput
  }

  /**
   * BillingEvent findFirst
   */
  export type BillingEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingEvent
     */
    select?: BillingEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingEvent
     */
    omit?: BillingEventOmit<ExtArgs> | null
    /**
     * Filter, which BillingEvent to fetch.
     */
    where?: BillingEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingEvents to fetch.
     */
    orderBy?: BillingEventOrderByWithRelationInput | BillingEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingEvents.
     */
    cursor?: BillingEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingEvents.
     */
    distinct?: BillingEventScalarFieldEnum | BillingEventScalarFieldEnum[]
  }

  /**
   * BillingEvent findFirstOrThrow
   */
  export type BillingEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingEvent
     */
    select?: BillingEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingEvent
     */
    omit?: BillingEventOmit<ExtArgs> | null
    /**
     * Filter, which BillingEvent to fetch.
     */
    where?: BillingEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingEvents to fetch.
     */
    orderBy?: BillingEventOrderByWithRelationInput | BillingEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingEvents.
     */
    cursor?: BillingEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingEvents.
     */
    distinct?: BillingEventScalarFieldEnum | BillingEventScalarFieldEnum[]
  }

  /**
   * BillingEvent findMany
   */
  export type BillingEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingEvent
     */
    select?: BillingEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingEvent
     */
    omit?: BillingEventOmit<ExtArgs> | null
    /**
     * Filter, which BillingEvents to fetch.
     */
    where?: BillingEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingEvents to fetch.
     */
    orderBy?: BillingEventOrderByWithRelationInput | BillingEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BillingEvents.
     */
    cursor?: BillingEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingEvents.
     */
    skip?: number
    distinct?: BillingEventScalarFieldEnum | BillingEventScalarFieldEnum[]
  }

  /**
   * BillingEvent create
   */
  export type BillingEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingEvent
     */
    select?: BillingEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingEvent
     */
    omit?: BillingEventOmit<ExtArgs> | null
    /**
     * The data needed to create a BillingEvent.
     */
    data: XOR<BillingEventCreateInput, BillingEventUncheckedCreateInput>
  }

  /**
   * BillingEvent createMany
   */
  export type BillingEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BillingEvents.
     */
    data: BillingEventCreateManyInput | BillingEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BillingEvent createManyAndReturn
   */
  export type BillingEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingEvent
     */
    select?: BillingEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BillingEvent
     */
    omit?: BillingEventOmit<ExtArgs> | null
    /**
     * The data used to create many BillingEvents.
     */
    data: BillingEventCreateManyInput | BillingEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BillingEvent update
   */
  export type BillingEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingEvent
     */
    select?: BillingEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingEvent
     */
    omit?: BillingEventOmit<ExtArgs> | null
    /**
     * The data needed to update a BillingEvent.
     */
    data: XOR<BillingEventUpdateInput, BillingEventUncheckedUpdateInput>
    /**
     * Choose, which BillingEvent to update.
     */
    where: BillingEventWhereUniqueInput
  }

  /**
   * BillingEvent updateMany
   */
  export type BillingEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BillingEvents.
     */
    data: XOR<BillingEventUpdateManyMutationInput, BillingEventUncheckedUpdateManyInput>
    /**
     * Filter which BillingEvents to update
     */
    where?: BillingEventWhereInput
    /**
     * Limit how many BillingEvents to update.
     */
    limit?: number
  }

  /**
   * BillingEvent updateManyAndReturn
   */
  export type BillingEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingEvent
     */
    select?: BillingEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BillingEvent
     */
    omit?: BillingEventOmit<ExtArgs> | null
    /**
     * The data used to update BillingEvents.
     */
    data: XOR<BillingEventUpdateManyMutationInput, BillingEventUncheckedUpdateManyInput>
    /**
     * Filter which BillingEvents to update
     */
    where?: BillingEventWhereInput
    /**
     * Limit how many BillingEvents to update.
     */
    limit?: number
  }

  /**
   * BillingEvent upsert
   */
  export type BillingEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingEvent
     */
    select?: BillingEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingEvent
     */
    omit?: BillingEventOmit<ExtArgs> | null
    /**
     * The filter to search for the BillingEvent to update in case it exists.
     */
    where: BillingEventWhereUniqueInput
    /**
     * In case the BillingEvent found by the `where` argument doesn't exist, create a new BillingEvent with this data.
     */
    create: XOR<BillingEventCreateInput, BillingEventUncheckedCreateInput>
    /**
     * In case the BillingEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BillingEventUpdateInput, BillingEventUncheckedUpdateInput>
  }

  /**
   * BillingEvent delete
   */
  export type BillingEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingEvent
     */
    select?: BillingEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingEvent
     */
    omit?: BillingEventOmit<ExtArgs> | null
    /**
     * Filter which BillingEvent to delete.
     */
    where: BillingEventWhereUniqueInput
  }

  /**
   * BillingEvent deleteMany
   */
  export type BillingEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingEvents to delete
     */
    where?: BillingEventWhereInput
    /**
     * Limit how many BillingEvents to delete.
     */
    limit?: number
  }

  /**
   * BillingEvent without action
   */
  export type BillingEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingEvent
     */
    select?: BillingEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingEvent
     */
    omit?: BillingEventOmit<ExtArgs> | null
  }


  /**
   * Model MetricSample
   */

  export type AggregateMetricSample = {
    _count: MetricSampleCountAggregateOutputType | null
    _avg: MetricSampleAvgAggregateOutputType | null
    _sum: MetricSampleSumAggregateOutputType | null
    _min: MetricSampleMinAggregateOutputType | null
    _max: MetricSampleMaxAggregateOutputType | null
  }

  export type MetricSampleAvgAggregateOutputType = {
    status: number | null
    durationMs: number | null
  }

  export type MetricSampleSumAggregateOutputType = {
    status: number | null
    durationMs: number | null
  }

  export type MetricSampleMinAggregateOutputType = {
    id: string | null
    type: string | null
    route: string | null
    method: string | null
    status: number | null
    durationMs: number | null
    error: string | null
    requestId: string | null
    createdAt: Date | null
  }

  export type MetricSampleMaxAggregateOutputType = {
    id: string | null
    type: string | null
    route: string | null
    method: string | null
    status: number | null
    durationMs: number | null
    error: string | null
    requestId: string | null
    createdAt: Date | null
  }

  export type MetricSampleCountAggregateOutputType = {
    id: number
    type: number
    route: number
    method: number
    status: number
    durationMs: number
    error: number
    requestId: number
    createdAt: number
    _all: number
  }


  export type MetricSampleAvgAggregateInputType = {
    status?: true
    durationMs?: true
  }

  export type MetricSampleSumAggregateInputType = {
    status?: true
    durationMs?: true
  }

  export type MetricSampleMinAggregateInputType = {
    id?: true
    type?: true
    route?: true
    method?: true
    status?: true
    durationMs?: true
    error?: true
    requestId?: true
    createdAt?: true
  }

  export type MetricSampleMaxAggregateInputType = {
    id?: true
    type?: true
    route?: true
    method?: true
    status?: true
    durationMs?: true
    error?: true
    requestId?: true
    createdAt?: true
  }

  export type MetricSampleCountAggregateInputType = {
    id?: true
    type?: true
    route?: true
    method?: true
    status?: true
    durationMs?: true
    error?: true
    requestId?: true
    createdAt?: true
    _all?: true
  }

  export type MetricSampleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MetricSample to aggregate.
     */
    where?: MetricSampleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MetricSamples to fetch.
     */
    orderBy?: MetricSampleOrderByWithRelationInput | MetricSampleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MetricSampleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MetricSamples from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MetricSamples.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MetricSamples
    **/
    _count?: true | MetricSampleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MetricSampleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MetricSampleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MetricSampleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MetricSampleMaxAggregateInputType
  }

  export type GetMetricSampleAggregateType<T extends MetricSampleAggregateArgs> = {
        [P in keyof T & keyof AggregateMetricSample]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMetricSample[P]>
      : GetScalarType<T[P], AggregateMetricSample[P]>
  }




  export type MetricSampleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MetricSampleWhereInput
    orderBy?: MetricSampleOrderByWithAggregationInput | MetricSampleOrderByWithAggregationInput[]
    by: MetricSampleScalarFieldEnum[] | MetricSampleScalarFieldEnum
    having?: MetricSampleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MetricSampleCountAggregateInputType | true
    _avg?: MetricSampleAvgAggregateInputType
    _sum?: MetricSampleSumAggregateInputType
    _min?: MetricSampleMinAggregateInputType
    _max?: MetricSampleMaxAggregateInputType
  }

  export type MetricSampleGroupByOutputType = {
    id: string
    type: string
    route: string
    method: string | null
    status: number | null
    durationMs: number | null
    error: string | null
    requestId: string | null
    createdAt: Date
    _count: MetricSampleCountAggregateOutputType | null
    _avg: MetricSampleAvgAggregateOutputType | null
    _sum: MetricSampleSumAggregateOutputType | null
    _min: MetricSampleMinAggregateOutputType | null
    _max: MetricSampleMaxAggregateOutputType | null
  }

  type GetMetricSampleGroupByPayload<T extends MetricSampleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MetricSampleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MetricSampleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MetricSampleGroupByOutputType[P]>
            : GetScalarType<T[P], MetricSampleGroupByOutputType[P]>
        }
      >
    >


  export type MetricSampleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    route?: boolean
    method?: boolean
    status?: boolean
    durationMs?: boolean
    error?: boolean
    requestId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["metricSample"]>

  export type MetricSampleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    route?: boolean
    method?: boolean
    status?: boolean
    durationMs?: boolean
    error?: boolean
    requestId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["metricSample"]>

  export type MetricSampleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    route?: boolean
    method?: boolean
    status?: boolean
    durationMs?: boolean
    error?: boolean
    requestId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["metricSample"]>

  export type MetricSampleSelectScalar = {
    id?: boolean
    type?: boolean
    route?: boolean
    method?: boolean
    status?: boolean
    durationMs?: boolean
    error?: boolean
    requestId?: boolean
    createdAt?: boolean
  }

  export type MetricSampleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "route" | "method" | "status" | "durationMs" | "error" | "requestId" | "createdAt", ExtArgs["result"]["metricSample"]>

  export type $MetricSamplePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MetricSample"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: string
      route: string
      method: string | null
      status: number | null
      durationMs: number | null
      error: string | null
      requestId: string | null
      createdAt: Date
    }, ExtArgs["result"]["metricSample"]>
    composites: {}
  }

  type MetricSampleGetPayload<S extends boolean | null | undefined | MetricSampleDefaultArgs> = $Result.GetResult<Prisma.$MetricSamplePayload, S>

  type MetricSampleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MetricSampleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MetricSampleCountAggregateInputType | true
    }

  export interface MetricSampleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MetricSample'], meta: { name: 'MetricSample' } }
    /**
     * Find zero or one MetricSample that matches the filter.
     * @param {MetricSampleFindUniqueArgs} args - Arguments to find a MetricSample
     * @example
     * // Get one MetricSample
     * const metricSample = await prisma.metricSample.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MetricSampleFindUniqueArgs>(args: SelectSubset<T, MetricSampleFindUniqueArgs<ExtArgs>>): Prisma__MetricSampleClient<$Result.GetResult<Prisma.$MetricSamplePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MetricSample that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MetricSampleFindUniqueOrThrowArgs} args - Arguments to find a MetricSample
     * @example
     * // Get one MetricSample
     * const metricSample = await prisma.metricSample.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MetricSampleFindUniqueOrThrowArgs>(args: SelectSubset<T, MetricSampleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MetricSampleClient<$Result.GetResult<Prisma.$MetricSamplePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MetricSample that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricSampleFindFirstArgs} args - Arguments to find a MetricSample
     * @example
     * // Get one MetricSample
     * const metricSample = await prisma.metricSample.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MetricSampleFindFirstArgs>(args?: SelectSubset<T, MetricSampleFindFirstArgs<ExtArgs>>): Prisma__MetricSampleClient<$Result.GetResult<Prisma.$MetricSamplePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MetricSample that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricSampleFindFirstOrThrowArgs} args - Arguments to find a MetricSample
     * @example
     * // Get one MetricSample
     * const metricSample = await prisma.metricSample.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MetricSampleFindFirstOrThrowArgs>(args?: SelectSubset<T, MetricSampleFindFirstOrThrowArgs<ExtArgs>>): Prisma__MetricSampleClient<$Result.GetResult<Prisma.$MetricSamplePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MetricSamples that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricSampleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MetricSamples
     * const metricSamples = await prisma.metricSample.findMany()
     * 
     * // Get first 10 MetricSamples
     * const metricSamples = await prisma.metricSample.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const metricSampleWithIdOnly = await prisma.metricSample.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MetricSampleFindManyArgs>(args?: SelectSubset<T, MetricSampleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MetricSamplePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MetricSample.
     * @param {MetricSampleCreateArgs} args - Arguments to create a MetricSample.
     * @example
     * // Create one MetricSample
     * const MetricSample = await prisma.metricSample.create({
     *   data: {
     *     // ... data to create a MetricSample
     *   }
     * })
     * 
     */
    create<T extends MetricSampleCreateArgs>(args: SelectSubset<T, MetricSampleCreateArgs<ExtArgs>>): Prisma__MetricSampleClient<$Result.GetResult<Prisma.$MetricSamplePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MetricSamples.
     * @param {MetricSampleCreateManyArgs} args - Arguments to create many MetricSamples.
     * @example
     * // Create many MetricSamples
     * const metricSample = await prisma.metricSample.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MetricSampleCreateManyArgs>(args?: SelectSubset<T, MetricSampleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MetricSamples and returns the data saved in the database.
     * @param {MetricSampleCreateManyAndReturnArgs} args - Arguments to create many MetricSamples.
     * @example
     * // Create many MetricSamples
     * const metricSample = await prisma.metricSample.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MetricSamples and only return the `id`
     * const metricSampleWithIdOnly = await prisma.metricSample.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MetricSampleCreateManyAndReturnArgs>(args?: SelectSubset<T, MetricSampleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MetricSamplePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MetricSample.
     * @param {MetricSampleDeleteArgs} args - Arguments to delete one MetricSample.
     * @example
     * // Delete one MetricSample
     * const MetricSample = await prisma.metricSample.delete({
     *   where: {
     *     // ... filter to delete one MetricSample
     *   }
     * })
     * 
     */
    delete<T extends MetricSampleDeleteArgs>(args: SelectSubset<T, MetricSampleDeleteArgs<ExtArgs>>): Prisma__MetricSampleClient<$Result.GetResult<Prisma.$MetricSamplePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MetricSample.
     * @param {MetricSampleUpdateArgs} args - Arguments to update one MetricSample.
     * @example
     * // Update one MetricSample
     * const metricSample = await prisma.metricSample.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MetricSampleUpdateArgs>(args: SelectSubset<T, MetricSampleUpdateArgs<ExtArgs>>): Prisma__MetricSampleClient<$Result.GetResult<Prisma.$MetricSamplePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MetricSamples.
     * @param {MetricSampleDeleteManyArgs} args - Arguments to filter MetricSamples to delete.
     * @example
     * // Delete a few MetricSamples
     * const { count } = await prisma.metricSample.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MetricSampleDeleteManyArgs>(args?: SelectSubset<T, MetricSampleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MetricSamples.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricSampleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MetricSamples
     * const metricSample = await prisma.metricSample.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MetricSampleUpdateManyArgs>(args: SelectSubset<T, MetricSampleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MetricSamples and returns the data updated in the database.
     * @param {MetricSampleUpdateManyAndReturnArgs} args - Arguments to update many MetricSamples.
     * @example
     * // Update many MetricSamples
     * const metricSample = await prisma.metricSample.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MetricSamples and only return the `id`
     * const metricSampleWithIdOnly = await prisma.metricSample.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MetricSampleUpdateManyAndReturnArgs>(args: SelectSubset<T, MetricSampleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MetricSamplePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MetricSample.
     * @param {MetricSampleUpsertArgs} args - Arguments to update or create a MetricSample.
     * @example
     * // Update or create a MetricSample
     * const metricSample = await prisma.metricSample.upsert({
     *   create: {
     *     // ... data to create a MetricSample
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MetricSample we want to update
     *   }
     * })
     */
    upsert<T extends MetricSampleUpsertArgs>(args: SelectSubset<T, MetricSampleUpsertArgs<ExtArgs>>): Prisma__MetricSampleClient<$Result.GetResult<Prisma.$MetricSamplePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MetricSamples.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricSampleCountArgs} args - Arguments to filter MetricSamples to count.
     * @example
     * // Count the number of MetricSamples
     * const count = await prisma.metricSample.count({
     *   where: {
     *     // ... the filter for the MetricSamples we want to count
     *   }
     * })
    **/
    count<T extends MetricSampleCountArgs>(
      args?: Subset<T, MetricSampleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MetricSampleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MetricSample.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricSampleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MetricSampleAggregateArgs>(args: Subset<T, MetricSampleAggregateArgs>): Prisma.PrismaPromise<GetMetricSampleAggregateType<T>>

    /**
     * Group by MetricSample.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricSampleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MetricSampleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MetricSampleGroupByArgs['orderBy'] }
        : { orderBy?: MetricSampleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MetricSampleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMetricSampleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MetricSample model
   */
  readonly fields: MetricSampleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MetricSample.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MetricSampleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MetricSample model
   */
  interface MetricSampleFieldRefs {
    readonly id: FieldRef<"MetricSample", 'String'>
    readonly type: FieldRef<"MetricSample", 'String'>
    readonly route: FieldRef<"MetricSample", 'String'>
    readonly method: FieldRef<"MetricSample", 'String'>
    readonly status: FieldRef<"MetricSample", 'Int'>
    readonly durationMs: FieldRef<"MetricSample", 'Int'>
    readonly error: FieldRef<"MetricSample", 'String'>
    readonly requestId: FieldRef<"MetricSample", 'String'>
    readonly createdAt: FieldRef<"MetricSample", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MetricSample findUnique
   */
  export type MetricSampleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetricSample
     */
    select?: MetricSampleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetricSample
     */
    omit?: MetricSampleOmit<ExtArgs> | null
    /**
     * Filter, which MetricSample to fetch.
     */
    where: MetricSampleWhereUniqueInput
  }

  /**
   * MetricSample findUniqueOrThrow
   */
  export type MetricSampleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetricSample
     */
    select?: MetricSampleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetricSample
     */
    omit?: MetricSampleOmit<ExtArgs> | null
    /**
     * Filter, which MetricSample to fetch.
     */
    where: MetricSampleWhereUniqueInput
  }

  /**
   * MetricSample findFirst
   */
  export type MetricSampleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetricSample
     */
    select?: MetricSampleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetricSample
     */
    omit?: MetricSampleOmit<ExtArgs> | null
    /**
     * Filter, which MetricSample to fetch.
     */
    where?: MetricSampleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MetricSamples to fetch.
     */
    orderBy?: MetricSampleOrderByWithRelationInput | MetricSampleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MetricSamples.
     */
    cursor?: MetricSampleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MetricSamples from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MetricSamples.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MetricSamples.
     */
    distinct?: MetricSampleScalarFieldEnum | MetricSampleScalarFieldEnum[]
  }

  /**
   * MetricSample findFirstOrThrow
   */
  export type MetricSampleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetricSample
     */
    select?: MetricSampleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetricSample
     */
    omit?: MetricSampleOmit<ExtArgs> | null
    /**
     * Filter, which MetricSample to fetch.
     */
    where?: MetricSampleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MetricSamples to fetch.
     */
    orderBy?: MetricSampleOrderByWithRelationInput | MetricSampleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MetricSamples.
     */
    cursor?: MetricSampleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MetricSamples from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MetricSamples.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MetricSamples.
     */
    distinct?: MetricSampleScalarFieldEnum | MetricSampleScalarFieldEnum[]
  }

  /**
   * MetricSample findMany
   */
  export type MetricSampleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetricSample
     */
    select?: MetricSampleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetricSample
     */
    omit?: MetricSampleOmit<ExtArgs> | null
    /**
     * Filter, which MetricSamples to fetch.
     */
    where?: MetricSampleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MetricSamples to fetch.
     */
    orderBy?: MetricSampleOrderByWithRelationInput | MetricSampleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MetricSamples.
     */
    cursor?: MetricSampleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MetricSamples from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MetricSamples.
     */
    skip?: number
    distinct?: MetricSampleScalarFieldEnum | MetricSampleScalarFieldEnum[]
  }

  /**
   * MetricSample create
   */
  export type MetricSampleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetricSample
     */
    select?: MetricSampleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetricSample
     */
    omit?: MetricSampleOmit<ExtArgs> | null
    /**
     * The data needed to create a MetricSample.
     */
    data: XOR<MetricSampleCreateInput, MetricSampleUncheckedCreateInput>
  }

  /**
   * MetricSample createMany
   */
  export type MetricSampleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MetricSamples.
     */
    data: MetricSampleCreateManyInput | MetricSampleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MetricSample createManyAndReturn
   */
  export type MetricSampleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetricSample
     */
    select?: MetricSampleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MetricSample
     */
    omit?: MetricSampleOmit<ExtArgs> | null
    /**
     * The data used to create many MetricSamples.
     */
    data: MetricSampleCreateManyInput | MetricSampleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MetricSample update
   */
  export type MetricSampleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetricSample
     */
    select?: MetricSampleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetricSample
     */
    omit?: MetricSampleOmit<ExtArgs> | null
    /**
     * The data needed to update a MetricSample.
     */
    data: XOR<MetricSampleUpdateInput, MetricSampleUncheckedUpdateInput>
    /**
     * Choose, which MetricSample to update.
     */
    where: MetricSampleWhereUniqueInput
  }

  /**
   * MetricSample updateMany
   */
  export type MetricSampleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MetricSamples.
     */
    data: XOR<MetricSampleUpdateManyMutationInput, MetricSampleUncheckedUpdateManyInput>
    /**
     * Filter which MetricSamples to update
     */
    where?: MetricSampleWhereInput
    /**
     * Limit how many MetricSamples to update.
     */
    limit?: number
  }

  /**
   * MetricSample updateManyAndReturn
   */
  export type MetricSampleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetricSample
     */
    select?: MetricSampleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MetricSample
     */
    omit?: MetricSampleOmit<ExtArgs> | null
    /**
     * The data used to update MetricSamples.
     */
    data: XOR<MetricSampleUpdateManyMutationInput, MetricSampleUncheckedUpdateManyInput>
    /**
     * Filter which MetricSamples to update
     */
    where?: MetricSampleWhereInput
    /**
     * Limit how many MetricSamples to update.
     */
    limit?: number
  }

  /**
   * MetricSample upsert
   */
  export type MetricSampleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetricSample
     */
    select?: MetricSampleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetricSample
     */
    omit?: MetricSampleOmit<ExtArgs> | null
    /**
     * The filter to search for the MetricSample to update in case it exists.
     */
    where: MetricSampleWhereUniqueInput
    /**
     * In case the MetricSample found by the `where` argument doesn't exist, create a new MetricSample with this data.
     */
    create: XOR<MetricSampleCreateInput, MetricSampleUncheckedCreateInput>
    /**
     * In case the MetricSample was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MetricSampleUpdateInput, MetricSampleUncheckedUpdateInput>
  }

  /**
   * MetricSample delete
   */
  export type MetricSampleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetricSample
     */
    select?: MetricSampleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetricSample
     */
    omit?: MetricSampleOmit<ExtArgs> | null
    /**
     * Filter which MetricSample to delete.
     */
    where: MetricSampleWhereUniqueInput
  }

  /**
   * MetricSample deleteMany
   */
  export type MetricSampleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MetricSamples to delete
     */
    where?: MetricSampleWhereInput
    /**
     * Limit how many MetricSamples to delete.
     */
    limit?: number
  }

  /**
   * MetricSample without action
   */
  export type MetricSampleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetricSample
     */
    select?: MetricSampleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetricSample
     */
    omit?: MetricSampleOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AuditRunScalarFieldEnum: {
    id: 'id',
    organizationId: 'organizationId',
    source: 'source',
    drug: 'drug',
    verdict: 'verdict',
    nLabelled: 'nLabelled',
    summary: 'summary',
    input: 'input',
    results: 'results',
    createdAt: 'createdAt'
  };

  export type AuditRunScalarFieldEnum = (typeof AuditRunScalarFieldEnum)[keyof typeof AuditRunScalarFieldEnum]


  export const PredictRunScalarFieldEnum: {
    id: 'id',
    organizationId: 'organizationId',
    drug: 'drug',
    isolate: 'isolate',
    modelType: 'modelType',
    m0Call: 'm0Call',
    pR: 'pR',
    call: 'call',
    conformalSet: 'conformalSet',
    input: 'input',
    output: 'output',
    createdAt: 'createdAt'
  };

  export type PredictRunScalarFieldEnum = (typeof PredictRunScalarFieldEnum)[keyof typeof PredictRunScalarFieldEnum]


  export const ValidateRunScalarFieldEnum: {
    id: 'id',
    organizationId: 'organizationId',
    drug: 'drug',
    problems: 'problems',
    verdict: 'verdict',
    results: 'results',
    createdAt: 'createdAt'
  };

  export type ValidateRunScalarFieldEnum = (typeof ValidateRunScalarFieldEnum)[keyof typeof ValidateRunScalarFieldEnum]


  export const ServiceRequestScalarFieldEnum: {
    id: 'id',
    organizationId: 'organizationId',
    sku: 'sku',
    name: 'name',
    email: 'email',
    org: 'org',
    isolates: 'isolates',
    message: 'message',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type ServiceRequestScalarFieldEnum = (typeof ServiceRequestScalarFieldEnum)[keyof typeof ServiceRequestScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    seq: 'seq',
    id: 'id',
    actor: 'actor',
    action: 'action',
    detail: 'detail',
    hash: 'hash',
    prevHash: 'prevHash',
    createdAt: 'createdAt'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const ApiKeyScalarFieldEnum: {
    id: 'id',
    organizationId: 'organizationId',
    label: 'label',
    keyPrefix: 'keyPrefix',
    keyHash: 'keyHash',
    scope: 'scope',
    credits: 'credits',
    lastUsedAt: 'lastUsedAt',
    revokedAt: 'revokedAt',
    createdAt: 'createdAt'
  };

  export type ApiKeyScalarFieldEnum = (typeof ApiKeyScalarFieldEnum)[keyof typeof ApiKeyScalarFieldEnum]


  export const BatchJobScalarFieldEnum: {
    id: 'id',
    organizationId: 'organizationId',
    label: 'label',
    drug: 'drug',
    modelType: 'modelType',
    n: 'n',
    done: 'done',
    status: 'status',
    isolates: 'isolates',
    results: 'results',
    summary: 'summary',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BatchJobScalarFieldEnum = (typeof BatchJobScalarFieldEnum)[keyof typeof BatchJobScalarFieldEnum]


  export const IntegrationConfigScalarFieldEnum: {
    id: 'id',
    organizationId: 'organizationId',
    platform: 'platform',
    endpointUrl: 'endpointUrl',
    hmacSecret: 'hmacSecret',
    events: 'events',
    active: 'active',
    lastTestedAt: 'lastTestedAt',
    lastTestStatus: 'lastTestStatus',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type IntegrationConfigScalarFieldEnum = (typeof IntegrationConfigScalarFieldEnum)[keyof typeof IntegrationConfigScalarFieldEnum]


  export const WebhookEventScalarFieldEnum: {
    id: 'id',
    organizationId: 'organizationId',
    direction: 'direction',
    platform: 'platform',
    eventType: 'eventType',
    payload: 'payload',
    status: 'status',
    httpStatus: 'httpStatus',
    error: 'error',
    createdAt: 'createdAt'
  };

  export type WebhookEventScalarFieldEnum = (typeof WebhookEventScalarFieldEnum)[keyof typeof WebhookEventScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    passwordHash: 'passwordHash',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    tokenHash: 'tokenHash',
    activeOrgId: 'activeOrgId',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const OrganizationScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OrganizationScalarFieldEnum = (typeof OrganizationScalarFieldEnum)[keyof typeof OrganizationScalarFieldEnum]


  export const MembershipScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    orgId: 'orgId',
    role: 'role',
    createdAt: 'createdAt'
  };

  export type MembershipScalarFieldEnum = (typeof MembershipScalarFieldEnum)[keyof typeof MembershipScalarFieldEnum]


  export const BillingSubscriptionScalarFieldEnum: {
    id: 'id',
    organizationId: 'organizationId',
    plan: 'plan',
    status: 'status',
    provider: 'provider',
    stripeCustomerId: 'stripeCustomerId',
    stripeSubscriptionId: 'stripeSubscriptionId',
    currentPeriodEnd: 'currentPeriodEnd',
    cancelAtPeriodEnd: 'cancelAtPeriodEnd',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BillingSubscriptionScalarFieldEnum = (typeof BillingSubscriptionScalarFieldEnum)[keyof typeof BillingSubscriptionScalarFieldEnum]


  export const BillingInvoiceScalarFieldEnum: {
    id: 'id',
    organizationId: 'organizationId',
    number: 'number',
    plan: 'plan',
    amountCents: 'amountCents',
    currency: 'currency',
    status: 'status',
    attempts: 'attempts',
    periodStart: 'periodStart',
    periodEnd: 'periodEnd',
    dueAt: 'dueAt',
    paidAt: 'paidAt',
    lastError: 'lastError',
    provider: 'provider',
    stripeInvoiceId: 'stripeInvoiceId',
    createdAt: 'createdAt'
  };

  export type BillingInvoiceScalarFieldEnum = (typeof BillingInvoiceScalarFieldEnum)[keyof typeof BillingInvoiceScalarFieldEnum]


  export const BillingEventScalarFieldEnum: {
    id: 'id',
    organizationId: 'organizationId',
    type: 'type',
    detail: 'detail',
    createdAt: 'createdAt'
  };

  export type BillingEventScalarFieldEnum = (typeof BillingEventScalarFieldEnum)[keyof typeof BillingEventScalarFieldEnum]


  export const MetricSampleScalarFieldEnum: {
    id: 'id',
    type: 'type',
    route: 'route',
    method: 'method',
    status: 'status',
    durationMs: 'durationMs',
    error: 'error',
    requestId: 'requestId',
    createdAt: 'createdAt'
  };

  export type MetricSampleScalarFieldEnum = (typeof MetricSampleScalarFieldEnum)[keyof typeof MetricSampleScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type AuditRunWhereInput = {
    AND?: AuditRunWhereInput | AuditRunWhereInput[]
    OR?: AuditRunWhereInput[]
    NOT?: AuditRunWhereInput | AuditRunWhereInput[]
    id?: StringFilter<"AuditRun"> | string
    organizationId?: StringNullableFilter<"AuditRun"> | string | null
    source?: StringFilter<"AuditRun"> | string
    drug?: StringFilter<"AuditRun"> | string
    verdict?: StringFilter<"AuditRun"> | string
    nLabelled?: IntFilter<"AuditRun"> | number
    summary?: StringFilter<"AuditRun"> | string
    input?: StringFilter<"AuditRun"> | string
    results?: StringFilter<"AuditRun"> | string
    createdAt?: DateTimeFilter<"AuditRun"> | Date | string
  }

  export type AuditRunOrderByWithRelationInput = {
    id?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    source?: SortOrder
    drug?: SortOrder
    verdict?: SortOrder
    nLabelled?: SortOrder
    summary?: SortOrder
    input?: SortOrder
    results?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditRunWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditRunWhereInput | AuditRunWhereInput[]
    OR?: AuditRunWhereInput[]
    NOT?: AuditRunWhereInput | AuditRunWhereInput[]
    organizationId?: StringNullableFilter<"AuditRun"> | string | null
    source?: StringFilter<"AuditRun"> | string
    drug?: StringFilter<"AuditRun"> | string
    verdict?: StringFilter<"AuditRun"> | string
    nLabelled?: IntFilter<"AuditRun"> | number
    summary?: StringFilter<"AuditRun"> | string
    input?: StringFilter<"AuditRun"> | string
    results?: StringFilter<"AuditRun"> | string
    createdAt?: DateTimeFilter<"AuditRun"> | Date | string
  }, "id">

  export type AuditRunOrderByWithAggregationInput = {
    id?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    source?: SortOrder
    drug?: SortOrder
    verdict?: SortOrder
    nLabelled?: SortOrder
    summary?: SortOrder
    input?: SortOrder
    results?: SortOrder
    createdAt?: SortOrder
    _count?: AuditRunCountOrderByAggregateInput
    _avg?: AuditRunAvgOrderByAggregateInput
    _max?: AuditRunMaxOrderByAggregateInput
    _min?: AuditRunMinOrderByAggregateInput
    _sum?: AuditRunSumOrderByAggregateInput
  }

  export type AuditRunScalarWhereWithAggregatesInput = {
    AND?: AuditRunScalarWhereWithAggregatesInput | AuditRunScalarWhereWithAggregatesInput[]
    OR?: AuditRunScalarWhereWithAggregatesInput[]
    NOT?: AuditRunScalarWhereWithAggregatesInput | AuditRunScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditRun"> | string
    organizationId?: StringNullableWithAggregatesFilter<"AuditRun"> | string | null
    source?: StringWithAggregatesFilter<"AuditRun"> | string
    drug?: StringWithAggregatesFilter<"AuditRun"> | string
    verdict?: StringWithAggregatesFilter<"AuditRun"> | string
    nLabelled?: IntWithAggregatesFilter<"AuditRun"> | number
    summary?: StringWithAggregatesFilter<"AuditRun"> | string
    input?: StringWithAggregatesFilter<"AuditRun"> | string
    results?: StringWithAggregatesFilter<"AuditRun"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AuditRun"> | Date | string
  }

  export type PredictRunWhereInput = {
    AND?: PredictRunWhereInput | PredictRunWhereInput[]
    OR?: PredictRunWhereInput[]
    NOT?: PredictRunWhereInput | PredictRunWhereInput[]
    id?: StringFilter<"PredictRun"> | string
    organizationId?: StringNullableFilter<"PredictRun"> | string | null
    drug?: StringFilter<"PredictRun"> | string
    isolate?: StringNullableFilter<"PredictRun"> | string | null
    modelType?: StringFilter<"PredictRun"> | string
    m0Call?: StringNullableFilter<"PredictRun"> | string | null
    pR?: FloatNullableFilter<"PredictRun"> | number | null
    call?: StringNullableFilter<"PredictRun"> | string | null
    conformalSet?: StringNullableFilter<"PredictRun"> | string | null
    input?: StringFilter<"PredictRun"> | string
    output?: StringFilter<"PredictRun"> | string
    createdAt?: DateTimeFilter<"PredictRun"> | Date | string
  }

  export type PredictRunOrderByWithRelationInput = {
    id?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    drug?: SortOrder
    isolate?: SortOrderInput | SortOrder
    modelType?: SortOrder
    m0Call?: SortOrderInput | SortOrder
    pR?: SortOrderInput | SortOrder
    call?: SortOrderInput | SortOrder
    conformalSet?: SortOrderInput | SortOrder
    input?: SortOrder
    output?: SortOrder
    createdAt?: SortOrder
  }

  export type PredictRunWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PredictRunWhereInput | PredictRunWhereInput[]
    OR?: PredictRunWhereInput[]
    NOT?: PredictRunWhereInput | PredictRunWhereInput[]
    organizationId?: StringNullableFilter<"PredictRun"> | string | null
    drug?: StringFilter<"PredictRun"> | string
    isolate?: StringNullableFilter<"PredictRun"> | string | null
    modelType?: StringFilter<"PredictRun"> | string
    m0Call?: StringNullableFilter<"PredictRun"> | string | null
    pR?: FloatNullableFilter<"PredictRun"> | number | null
    call?: StringNullableFilter<"PredictRun"> | string | null
    conformalSet?: StringNullableFilter<"PredictRun"> | string | null
    input?: StringFilter<"PredictRun"> | string
    output?: StringFilter<"PredictRun"> | string
    createdAt?: DateTimeFilter<"PredictRun"> | Date | string
  }, "id">

  export type PredictRunOrderByWithAggregationInput = {
    id?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    drug?: SortOrder
    isolate?: SortOrderInput | SortOrder
    modelType?: SortOrder
    m0Call?: SortOrderInput | SortOrder
    pR?: SortOrderInput | SortOrder
    call?: SortOrderInput | SortOrder
    conformalSet?: SortOrderInput | SortOrder
    input?: SortOrder
    output?: SortOrder
    createdAt?: SortOrder
    _count?: PredictRunCountOrderByAggregateInput
    _avg?: PredictRunAvgOrderByAggregateInput
    _max?: PredictRunMaxOrderByAggregateInput
    _min?: PredictRunMinOrderByAggregateInput
    _sum?: PredictRunSumOrderByAggregateInput
  }

  export type PredictRunScalarWhereWithAggregatesInput = {
    AND?: PredictRunScalarWhereWithAggregatesInput | PredictRunScalarWhereWithAggregatesInput[]
    OR?: PredictRunScalarWhereWithAggregatesInput[]
    NOT?: PredictRunScalarWhereWithAggregatesInput | PredictRunScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PredictRun"> | string
    organizationId?: StringNullableWithAggregatesFilter<"PredictRun"> | string | null
    drug?: StringWithAggregatesFilter<"PredictRun"> | string
    isolate?: StringNullableWithAggregatesFilter<"PredictRun"> | string | null
    modelType?: StringWithAggregatesFilter<"PredictRun"> | string
    m0Call?: StringNullableWithAggregatesFilter<"PredictRun"> | string | null
    pR?: FloatNullableWithAggregatesFilter<"PredictRun"> | number | null
    call?: StringNullableWithAggregatesFilter<"PredictRun"> | string | null
    conformalSet?: StringNullableWithAggregatesFilter<"PredictRun"> | string | null
    input?: StringWithAggregatesFilter<"PredictRun"> | string
    output?: StringWithAggregatesFilter<"PredictRun"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PredictRun"> | Date | string
  }

  export type ValidateRunWhereInput = {
    AND?: ValidateRunWhereInput | ValidateRunWhereInput[]
    OR?: ValidateRunWhereInput[]
    NOT?: ValidateRunWhereInput | ValidateRunWhereInput[]
    id?: StringFilter<"ValidateRun"> | string
    organizationId?: StringNullableFilter<"ValidateRun"> | string | null
    drug?: StringFilter<"ValidateRun"> | string
    problems?: IntFilter<"ValidateRun"> | number
    verdict?: StringFilter<"ValidateRun"> | string
    results?: StringFilter<"ValidateRun"> | string
    createdAt?: DateTimeFilter<"ValidateRun"> | Date | string
  }

  export type ValidateRunOrderByWithRelationInput = {
    id?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    drug?: SortOrder
    problems?: SortOrder
    verdict?: SortOrder
    results?: SortOrder
    createdAt?: SortOrder
  }

  export type ValidateRunWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ValidateRunWhereInput | ValidateRunWhereInput[]
    OR?: ValidateRunWhereInput[]
    NOT?: ValidateRunWhereInput | ValidateRunWhereInput[]
    organizationId?: StringNullableFilter<"ValidateRun"> | string | null
    drug?: StringFilter<"ValidateRun"> | string
    problems?: IntFilter<"ValidateRun"> | number
    verdict?: StringFilter<"ValidateRun"> | string
    results?: StringFilter<"ValidateRun"> | string
    createdAt?: DateTimeFilter<"ValidateRun"> | Date | string
  }, "id">

  export type ValidateRunOrderByWithAggregationInput = {
    id?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    drug?: SortOrder
    problems?: SortOrder
    verdict?: SortOrder
    results?: SortOrder
    createdAt?: SortOrder
    _count?: ValidateRunCountOrderByAggregateInput
    _avg?: ValidateRunAvgOrderByAggregateInput
    _max?: ValidateRunMaxOrderByAggregateInput
    _min?: ValidateRunMinOrderByAggregateInput
    _sum?: ValidateRunSumOrderByAggregateInput
  }

  export type ValidateRunScalarWhereWithAggregatesInput = {
    AND?: ValidateRunScalarWhereWithAggregatesInput | ValidateRunScalarWhereWithAggregatesInput[]
    OR?: ValidateRunScalarWhereWithAggregatesInput[]
    NOT?: ValidateRunScalarWhereWithAggregatesInput | ValidateRunScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ValidateRun"> | string
    organizationId?: StringNullableWithAggregatesFilter<"ValidateRun"> | string | null
    drug?: StringWithAggregatesFilter<"ValidateRun"> | string
    problems?: IntWithAggregatesFilter<"ValidateRun"> | number
    verdict?: StringWithAggregatesFilter<"ValidateRun"> | string
    results?: StringWithAggregatesFilter<"ValidateRun"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ValidateRun"> | Date | string
  }

  export type ServiceRequestWhereInput = {
    AND?: ServiceRequestWhereInput | ServiceRequestWhereInput[]
    OR?: ServiceRequestWhereInput[]
    NOT?: ServiceRequestWhereInput | ServiceRequestWhereInput[]
    id?: StringFilter<"ServiceRequest"> | string
    organizationId?: StringNullableFilter<"ServiceRequest"> | string | null
    sku?: StringFilter<"ServiceRequest"> | string
    name?: StringFilter<"ServiceRequest"> | string
    email?: StringFilter<"ServiceRequest"> | string
    org?: StringNullableFilter<"ServiceRequest"> | string | null
    isolates?: IntNullableFilter<"ServiceRequest"> | number | null
    message?: StringNullableFilter<"ServiceRequest"> | string | null
    status?: StringFilter<"ServiceRequest"> | string
    createdAt?: DateTimeFilter<"ServiceRequest"> | Date | string
  }

  export type ServiceRequestOrderByWithRelationInput = {
    id?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    sku?: SortOrder
    name?: SortOrder
    email?: SortOrder
    org?: SortOrderInput | SortOrder
    isolates?: SortOrderInput | SortOrder
    message?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type ServiceRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ServiceRequestWhereInput | ServiceRequestWhereInput[]
    OR?: ServiceRequestWhereInput[]
    NOT?: ServiceRequestWhereInput | ServiceRequestWhereInput[]
    organizationId?: StringNullableFilter<"ServiceRequest"> | string | null
    sku?: StringFilter<"ServiceRequest"> | string
    name?: StringFilter<"ServiceRequest"> | string
    email?: StringFilter<"ServiceRequest"> | string
    org?: StringNullableFilter<"ServiceRequest"> | string | null
    isolates?: IntNullableFilter<"ServiceRequest"> | number | null
    message?: StringNullableFilter<"ServiceRequest"> | string | null
    status?: StringFilter<"ServiceRequest"> | string
    createdAt?: DateTimeFilter<"ServiceRequest"> | Date | string
  }, "id">

  export type ServiceRequestOrderByWithAggregationInput = {
    id?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    sku?: SortOrder
    name?: SortOrder
    email?: SortOrder
    org?: SortOrderInput | SortOrder
    isolates?: SortOrderInput | SortOrder
    message?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: ServiceRequestCountOrderByAggregateInput
    _avg?: ServiceRequestAvgOrderByAggregateInput
    _max?: ServiceRequestMaxOrderByAggregateInput
    _min?: ServiceRequestMinOrderByAggregateInput
    _sum?: ServiceRequestSumOrderByAggregateInput
  }

  export type ServiceRequestScalarWhereWithAggregatesInput = {
    AND?: ServiceRequestScalarWhereWithAggregatesInput | ServiceRequestScalarWhereWithAggregatesInput[]
    OR?: ServiceRequestScalarWhereWithAggregatesInput[]
    NOT?: ServiceRequestScalarWhereWithAggregatesInput | ServiceRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ServiceRequest"> | string
    organizationId?: StringNullableWithAggregatesFilter<"ServiceRequest"> | string | null
    sku?: StringWithAggregatesFilter<"ServiceRequest"> | string
    name?: StringWithAggregatesFilter<"ServiceRequest"> | string
    email?: StringWithAggregatesFilter<"ServiceRequest"> | string
    org?: StringNullableWithAggregatesFilter<"ServiceRequest"> | string | null
    isolates?: IntNullableWithAggregatesFilter<"ServiceRequest"> | number | null
    message?: StringNullableWithAggregatesFilter<"ServiceRequest"> | string | null
    status?: StringWithAggregatesFilter<"ServiceRequest"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ServiceRequest"> | Date | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    seq?: IntFilter<"AuditLog"> | number
    id?: StringFilter<"AuditLog"> | string
    actor?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    detail?: StringFilter<"AuditLog"> | string
    hash?: StringFilter<"AuditLog"> | string
    prevHash?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }

  export type AuditLogOrderByWithRelationInput = {
    seq?: SortOrder
    id?: SortOrder
    actor?: SortOrder
    action?: SortOrder
    detail?: SortOrder
    hash?: SortOrder
    prevHash?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    seq?: number
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    actor?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    detail?: StringFilter<"AuditLog"> | string
    hash?: StringFilter<"AuditLog"> | string
    prevHash?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }, "seq" | "id">

  export type AuditLogOrderByWithAggregationInput = {
    seq?: SortOrder
    id?: SortOrder
    actor?: SortOrder
    action?: SortOrder
    detail?: SortOrder
    hash?: SortOrder
    prevHash?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _avg?: AuditLogAvgOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
    _sum?: AuditLogSumOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    seq?: IntWithAggregatesFilter<"AuditLog"> | number
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    actor?: StringWithAggregatesFilter<"AuditLog"> | string
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    detail?: StringWithAggregatesFilter<"AuditLog"> | string
    hash?: StringWithAggregatesFilter<"AuditLog"> | string
    prevHash?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type ApiKeyWhereInput = {
    AND?: ApiKeyWhereInput | ApiKeyWhereInput[]
    OR?: ApiKeyWhereInput[]
    NOT?: ApiKeyWhereInput | ApiKeyWhereInput[]
    id?: StringFilter<"ApiKey"> | string
    organizationId?: StringNullableFilter<"ApiKey"> | string | null
    label?: StringFilter<"ApiKey"> | string
    keyPrefix?: StringFilter<"ApiKey"> | string
    keyHash?: StringFilter<"ApiKey"> | string
    scope?: StringFilter<"ApiKey"> | string
    credits?: IntFilter<"ApiKey"> | number
    lastUsedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null
    revokedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null
    createdAt?: DateTimeFilter<"ApiKey"> | Date | string
  }

  export type ApiKeyOrderByWithRelationInput = {
    id?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    label?: SortOrder
    keyPrefix?: SortOrder
    keyHash?: SortOrder
    scope?: SortOrder
    credits?: SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    revokedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type ApiKeyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ApiKeyWhereInput | ApiKeyWhereInput[]
    OR?: ApiKeyWhereInput[]
    NOT?: ApiKeyWhereInput | ApiKeyWhereInput[]
    organizationId?: StringNullableFilter<"ApiKey"> | string | null
    label?: StringFilter<"ApiKey"> | string
    keyPrefix?: StringFilter<"ApiKey"> | string
    keyHash?: StringFilter<"ApiKey"> | string
    scope?: StringFilter<"ApiKey"> | string
    credits?: IntFilter<"ApiKey"> | number
    lastUsedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null
    revokedAt?: DateTimeNullableFilter<"ApiKey"> | Date | string | null
    createdAt?: DateTimeFilter<"ApiKey"> | Date | string
  }, "id">

  export type ApiKeyOrderByWithAggregationInput = {
    id?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    label?: SortOrder
    keyPrefix?: SortOrder
    keyHash?: SortOrder
    scope?: SortOrder
    credits?: SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    revokedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ApiKeyCountOrderByAggregateInput
    _avg?: ApiKeyAvgOrderByAggregateInput
    _max?: ApiKeyMaxOrderByAggregateInput
    _min?: ApiKeyMinOrderByAggregateInput
    _sum?: ApiKeySumOrderByAggregateInput
  }

  export type ApiKeyScalarWhereWithAggregatesInput = {
    AND?: ApiKeyScalarWhereWithAggregatesInput | ApiKeyScalarWhereWithAggregatesInput[]
    OR?: ApiKeyScalarWhereWithAggregatesInput[]
    NOT?: ApiKeyScalarWhereWithAggregatesInput | ApiKeyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ApiKey"> | string
    organizationId?: StringNullableWithAggregatesFilter<"ApiKey"> | string | null
    label?: StringWithAggregatesFilter<"ApiKey"> | string
    keyPrefix?: StringWithAggregatesFilter<"ApiKey"> | string
    keyHash?: StringWithAggregatesFilter<"ApiKey"> | string
    scope?: StringWithAggregatesFilter<"ApiKey"> | string
    credits?: IntWithAggregatesFilter<"ApiKey"> | number
    lastUsedAt?: DateTimeNullableWithAggregatesFilter<"ApiKey"> | Date | string | null
    revokedAt?: DateTimeNullableWithAggregatesFilter<"ApiKey"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ApiKey"> | Date | string
  }

  export type BatchJobWhereInput = {
    AND?: BatchJobWhereInput | BatchJobWhereInput[]
    OR?: BatchJobWhereInput[]
    NOT?: BatchJobWhereInput | BatchJobWhereInput[]
    id?: StringFilter<"BatchJob"> | string
    organizationId?: StringNullableFilter<"BatchJob"> | string | null
    label?: StringFilter<"BatchJob"> | string
    drug?: StringFilter<"BatchJob"> | string
    modelType?: StringFilter<"BatchJob"> | string
    n?: IntFilter<"BatchJob"> | number
    done?: IntFilter<"BatchJob"> | number
    status?: StringFilter<"BatchJob"> | string
    isolates?: StringFilter<"BatchJob"> | string
    results?: StringFilter<"BatchJob"> | string
    summary?: StringNullableFilter<"BatchJob"> | string | null
    createdAt?: DateTimeFilter<"BatchJob"> | Date | string
    updatedAt?: DateTimeFilter<"BatchJob"> | Date | string
  }

  export type BatchJobOrderByWithRelationInput = {
    id?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    label?: SortOrder
    drug?: SortOrder
    modelType?: SortOrder
    n?: SortOrder
    done?: SortOrder
    status?: SortOrder
    isolates?: SortOrder
    results?: SortOrder
    summary?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BatchJobWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BatchJobWhereInput | BatchJobWhereInput[]
    OR?: BatchJobWhereInput[]
    NOT?: BatchJobWhereInput | BatchJobWhereInput[]
    organizationId?: StringNullableFilter<"BatchJob"> | string | null
    label?: StringFilter<"BatchJob"> | string
    drug?: StringFilter<"BatchJob"> | string
    modelType?: StringFilter<"BatchJob"> | string
    n?: IntFilter<"BatchJob"> | number
    done?: IntFilter<"BatchJob"> | number
    status?: StringFilter<"BatchJob"> | string
    isolates?: StringFilter<"BatchJob"> | string
    results?: StringFilter<"BatchJob"> | string
    summary?: StringNullableFilter<"BatchJob"> | string | null
    createdAt?: DateTimeFilter<"BatchJob"> | Date | string
    updatedAt?: DateTimeFilter<"BatchJob"> | Date | string
  }, "id">

  export type BatchJobOrderByWithAggregationInput = {
    id?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    label?: SortOrder
    drug?: SortOrder
    modelType?: SortOrder
    n?: SortOrder
    done?: SortOrder
    status?: SortOrder
    isolates?: SortOrder
    results?: SortOrder
    summary?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BatchJobCountOrderByAggregateInput
    _avg?: BatchJobAvgOrderByAggregateInput
    _max?: BatchJobMaxOrderByAggregateInput
    _min?: BatchJobMinOrderByAggregateInput
    _sum?: BatchJobSumOrderByAggregateInput
  }

  export type BatchJobScalarWhereWithAggregatesInput = {
    AND?: BatchJobScalarWhereWithAggregatesInput | BatchJobScalarWhereWithAggregatesInput[]
    OR?: BatchJobScalarWhereWithAggregatesInput[]
    NOT?: BatchJobScalarWhereWithAggregatesInput | BatchJobScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BatchJob"> | string
    organizationId?: StringNullableWithAggregatesFilter<"BatchJob"> | string | null
    label?: StringWithAggregatesFilter<"BatchJob"> | string
    drug?: StringWithAggregatesFilter<"BatchJob"> | string
    modelType?: StringWithAggregatesFilter<"BatchJob"> | string
    n?: IntWithAggregatesFilter<"BatchJob"> | number
    done?: IntWithAggregatesFilter<"BatchJob"> | number
    status?: StringWithAggregatesFilter<"BatchJob"> | string
    isolates?: StringWithAggregatesFilter<"BatchJob"> | string
    results?: StringWithAggregatesFilter<"BatchJob"> | string
    summary?: StringNullableWithAggregatesFilter<"BatchJob"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"BatchJob"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BatchJob"> | Date | string
  }

  export type IntegrationConfigWhereInput = {
    AND?: IntegrationConfigWhereInput | IntegrationConfigWhereInput[]
    OR?: IntegrationConfigWhereInput[]
    NOT?: IntegrationConfigWhereInput | IntegrationConfigWhereInput[]
    id?: StringFilter<"IntegrationConfig"> | string
    organizationId?: StringNullableFilter<"IntegrationConfig"> | string | null
    platform?: StringFilter<"IntegrationConfig"> | string
    endpointUrl?: StringNullableFilter<"IntegrationConfig"> | string | null
    hmacSecret?: StringFilter<"IntegrationConfig"> | string
    events?: StringFilter<"IntegrationConfig"> | string
    active?: BoolFilter<"IntegrationConfig"> | boolean
    lastTestedAt?: DateTimeNullableFilter<"IntegrationConfig"> | Date | string | null
    lastTestStatus?: StringNullableFilter<"IntegrationConfig"> | string | null
    createdAt?: DateTimeFilter<"IntegrationConfig"> | Date | string
    updatedAt?: DateTimeFilter<"IntegrationConfig"> | Date | string
  }

  export type IntegrationConfigOrderByWithRelationInput = {
    id?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    platform?: SortOrder
    endpointUrl?: SortOrderInput | SortOrder
    hmacSecret?: SortOrder
    events?: SortOrder
    active?: SortOrder
    lastTestedAt?: SortOrderInput | SortOrder
    lastTestStatus?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntegrationConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: IntegrationConfigWhereInput | IntegrationConfigWhereInput[]
    OR?: IntegrationConfigWhereInput[]
    NOT?: IntegrationConfigWhereInput | IntegrationConfigWhereInput[]
    organizationId?: StringNullableFilter<"IntegrationConfig"> | string | null
    platform?: StringFilter<"IntegrationConfig"> | string
    endpointUrl?: StringNullableFilter<"IntegrationConfig"> | string | null
    hmacSecret?: StringFilter<"IntegrationConfig"> | string
    events?: StringFilter<"IntegrationConfig"> | string
    active?: BoolFilter<"IntegrationConfig"> | boolean
    lastTestedAt?: DateTimeNullableFilter<"IntegrationConfig"> | Date | string | null
    lastTestStatus?: StringNullableFilter<"IntegrationConfig"> | string | null
    createdAt?: DateTimeFilter<"IntegrationConfig"> | Date | string
    updatedAt?: DateTimeFilter<"IntegrationConfig"> | Date | string
  }, "id">

  export type IntegrationConfigOrderByWithAggregationInput = {
    id?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    platform?: SortOrder
    endpointUrl?: SortOrderInput | SortOrder
    hmacSecret?: SortOrder
    events?: SortOrder
    active?: SortOrder
    lastTestedAt?: SortOrderInput | SortOrder
    lastTestStatus?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: IntegrationConfigCountOrderByAggregateInput
    _max?: IntegrationConfigMaxOrderByAggregateInput
    _min?: IntegrationConfigMinOrderByAggregateInput
  }

  export type IntegrationConfigScalarWhereWithAggregatesInput = {
    AND?: IntegrationConfigScalarWhereWithAggregatesInput | IntegrationConfigScalarWhereWithAggregatesInput[]
    OR?: IntegrationConfigScalarWhereWithAggregatesInput[]
    NOT?: IntegrationConfigScalarWhereWithAggregatesInput | IntegrationConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"IntegrationConfig"> | string
    organizationId?: StringNullableWithAggregatesFilter<"IntegrationConfig"> | string | null
    platform?: StringWithAggregatesFilter<"IntegrationConfig"> | string
    endpointUrl?: StringNullableWithAggregatesFilter<"IntegrationConfig"> | string | null
    hmacSecret?: StringWithAggregatesFilter<"IntegrationConfig"> | string
    events?: StringWithAggregatesFilter<"IntegrationConfig"> | string
    active?: BoolWithAggregatesFilter<"IntegrationConfig"> | boolean
    lastTestedAt?: DateTimeNullableWithAggregatesFilter<"IntegrationConfig"> | Date | string | null
    lastTestStatus?: StringNullableWithAggregatesFilter<"IntegrationConfig"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"IntegrationConfig"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"IntegrationConfig"> | Date | string
  }

  export type WebhookEventWhereInput = {
    AND?: WebhookEventWhereInput | WebhookEventWhereInput[]
    OR?: WebhookEventWhereInput[]
    NOT?: WebhookEventWhereInput | WebhookEventWhereInput[]
    id?: StringFilter<"WebhookEvent"> | string
    organizationId?: StringNullableFilter<"WebhookEvent"> | string | null
    direction?: StringFilter<"WebhookEvent"> | string
    platform?: StringFilter<"WebhookEvent"> | string
    eventType?: StringFilter<"WebhookEvent"> | string
    payload?: StringFilter<"WebhookEvent"> | string
    status?: StringFilter<"WebhookEvent"> | string
    httpStatus?: IntNullableFilter<"WebhookEvent"> | number | null
    error?: StringNullableFilter<"WebhookEvent"> | string | null
    createdAt?: DateTimeFilter<"WebhookEvent"> | Date | string
  }

  export type WebhookEventOrderByWithRelationInput = {
    id?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    direction?: SortOrder
    platform?: SortOrder
    eventType?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    httpStatus?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type WebhookEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WebhookEventWhereInput | WebhookEventWhereInput[]
    OR?: WebhookEventWhereInput[]
    NOT?: WebhookEventWhereInput | WebhookEventWhereInput[]
    organizationId?: StringNullableFilter<"WebhookEvent"> | string | null
    direction?: StringFilter<"WebhookEvent"> | string
    platform?: StringFilter<"WebhookEvent"> | string
    eventType?: StringFilter<"WebhookEvent"> | string
    payload?: StringFilter<"WebhookEvent"> | string
    status?: StringFilter<"WebhookEvent"> | string
    httpStatus?: IntNullableFilter<"WebhookEvent"> | number | null
    error?: StringNullableFilter<"WebhookEvent"> | string | null
    createdAt?: DateTimeFilter<"WebhookEvent"> | Date | string
  }, "id">

  export type WebhookEventOrderByWithAggregationInput = {
    id?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    direction?: SortOrder
    platform?: SortOrder
    eventType?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    httpStatus?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: WebhookEventCountOrderByAggregateInput
    _avg?: WebhookEventAvgOrderByAggregateInput
    _max?: WebhookEventMaxOrderByAggregateInput
    _min?: WebhookEventMinOrderByAggregateInput
    _sum?: WebhookEventSumOrderByAggregateInput
  }

  export type WebhookEventScalarWhereWithAggregatesInput = {
    AND?: WebhookEventScalarWhereWithAggregatesInput | WebhookEventScalarWhereWithAggregatesInput[]
    OR?: WebhookEventScalarWhereWithAggregatesInput[]
    NOT?: WebhookEventScalarWhereWithAggregatesInput | WebhookEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WebhookEvent"> | string
    organizationId?: StringNullableWithAggregatesFilter<"WebhookEvent"> | string | null
    direction?: StringWithAggregatesFilter<"WebhookEvent"> | string
    platform?: StringWithAggregatesFilter<"WebhookEvent"> | string
    eventType?: StringWithAggregatesFilter<"WebhookEvent"> | string
    payload?: StringWithAggregatesFilter<"WebhookEvent"> | string
    status?: StringWithAggregatesFilter<"WebhookEvent"> | string
    httpStatus?: IntNullableWithAggregatesFilter<"WebhookEvent"> | number | null
    error?: StringNullableWithAggregatesFilter<"WebhookEvent"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"WebhookEvent"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    memberships?: MembershipListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    memberships?: MembershipOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    memberships?: MembershipListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    tokenHash?: StringFilter<"Session"> | string
    activeOrgId?: StringNullableFilter<"Session"> | string | null
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    activeOrgId?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tokenHash?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: StringFilter<"Session"> | string
    activeOrgId?: StringNullableFilter<"Session"> | string | null
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
  }, "id" | "tokenHash">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    activeOrgId?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    userId?: StringWithAggregatesFilter<"Session"> | string
    tokenHash?: StringWithAggregatesFilter<"Session"> | string
    activeOrgId?: StringNullableWithAggregatesFilter<"Session"> | string | null
    expiresAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type OrganizationWhereInput = {
    AND?: OrganizationWhereInput | OrganizationWhereInput[]
    OR?: OrganizationWhereInput[]
    NOT?: OrganizationWhereInput | OrganizationWhereInput[]
    id?: StringFilter<"Organization"> | string
    name?: StringFilter<"Organization"> | string
    slug?: StringFilter<"Organization"> | string
    createdAt?: DateTimeFilter<"Organization"> | Date | string
    updatedAt?: DateTimeFilter<"Organization"> | Date | string
    memberships?: MembershipListRelationFilter
  }

  export type OrganizationOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    memberships?: MembershipOrderByRelationAggregateInput
  }

  export type OrganizationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: OrganizationWhereInput | OrganizationWhereInput[]
    OR?: OrganizationWhereInput[]
    NOT?: OrganizationWhereInput | OrganizationWhereInput[]
    name?: StringFilter<"Organization"> | string
    createdAt?: DateTimeFilter<"Organization"> | Date | string
    updatedAt?: DateTimeFilter<"Organization"> | Date | string
    memberships?: MembershipListRelationFilter
  }, "id" | "slug">

  export type OrganizationOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OrganizationCountOrderByAggregateInput
    _max?: OrganizationMaxOrderByAggregateInput
    _min?: OrganizationMinOrderByAggregateInput
  }

  export type OrganizationScalarWhereWithAggregatesInput = {
    AND?: OrganizationScalarWhereWithAggregatesInput | OrganizationScalarWhereWithAggregatesInput[]
    OR?: OrganizationScalarWhereWithAggregatesInput[]
    NOT?: OrganizationScalarWhereWithAggregatesInput | OrganizationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Organization"> | string
    name?: StringWithAggregatesFilter<"Organization"> | string
    slug?: StringWithAggregatesFilter<"Organization"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Organization"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Organization"> | Date | string
  }

  export type MembershipWhereInput = {
    AND?: MembershipWhereInput | MembershipWhereInput[]
    OR?: MembershipWhereInput[]
    NOT?: MembershipWhereInput | MembershipWhereInput[]
    id?: StringFilter<"Membership"> | string
    userId?: StringFilter<"Membership"> | string
    orgId?: StringFilter<"Membership"> | string
    role?: StringFilter<"Membership"> | string
    createdAt?: DateTimeFilter<"Membership"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    org?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
  }

  export type MembershipOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    orgId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    org?: OrganizationOrderByWithRelationInput
  }

  export type MembershipWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_orgId?: MembershipUserIdOrgIdCompoundUniqueInput
    AND?: MembershipWhereInput | MembershipWhereInput[]
    OR?: MembershipWhereInput[]
    NOT?: MembershipWhereInput | MembershipWhereInput[]
    userId?: StringFilter<"Membership"> | string
    orgId?: StringFilter<"Membership"> | string
    role?: StringFilter<"Membership"> | string
    createdAt?: DateTimeFilter<"Membership"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    org?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
  }, "id" | "userId_orgId">

  export type MembershipOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    orgId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    _count?: MembershipCountOrderByAggregateInput
    _max?: MembershipMaxOrderByAggregateInput
    _min?: MembershipMinOrderByAggregateInput
  }

  export type MembershipScalarWhereWithAggregatesInput = {
    AND?: MembershipScalarWhereWithAggregatesInput | MembershipScalarWhereWithAggregatesInput[]
    OR?: MembershipScalarWhereWithAggregatesInput[]
    NOT?: MembershipScalarWhereWithAggregatesInput | MembershipScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Membership"> | string
    userId?: StringWithAggregatesFilter<"Membership"> | string
    orgId?: StringWithAggregatesFilter<"Membership"> | string
    role?: StringWithAggregatesFilter<"Membership"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Membership"> | Date | string
  }

  export type BillingSubscriptionWhereInput = {
    AND?: BillingSubscriptionWhereInput | BillingSubscriptionWhereInput[]
    OR?: BillingSubscriptionWhereInput[]
    NOT?: BillingSubscriptionWhereInput | BillingSubscriptionWhereInput[]
    id?: StringFilter<"BillingSubscription"> | string
    organizationId?: StringFilter<"BillingSubscription"> | string
    plan?: StringFilter<"BillingSubscription"> | string
    status?: StringFilter<"BillingSubscription"> | string
    provider?: StringFilter<"BillingSubscription"> | string
    stripeCustomerId?: StringNullableFilter<"BillingSubscription"> | string | null
    stripeSubscriptionId?: StringNullableFilter<"BillingSubscription"> | string | null
    currentPeriodEnd?: DateTimeNullableFilter<"BillingSubscription"> | Date | string | null
    cancelAtPeriodEnd?: BoolFilter<"BillingSubscription"> | boolean
    createdAt?: DateTimeFilter<"BillingSubscription"> | Date | string
    updatedAt?: DateTimeFilter<"BillingSubscription"> | Date | string
  }

  export type BillingSubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    organizationId?: SortOrder
    plan?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    stripeSubscriptionId?: SortOrderInput | SortOrder
    currentPeriodEnd?: SortOrderInput | SortOrder
    cancelAtPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BillingSubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    organizationId?: string
    AND?: BillingSubscriptionWhereInput | BillingSubscriptionWhereInput[]
    OR?: BillingSubscriptionWhereInput[]
    NOT?: BillingSubscriptionWhereInput | BillingSubscriptionWhereInput[]
    plan?: StringFilter<"BillingSubscription"> | string
    status?: StringFilter<"BillingSubscription"> | string
    provider?: StringFilter<"BillingSubscription"> | string
    stripeCustomerId?: StringNullableFilter<"BillingSubscription"> | string | null
    stripeSubscriptionId?: StringNullableFilter<"BillingSubscription"> | string | null
    currentPeriodEnd?: DateTimeNullableFilter<"BillingSubscription"> | Date | string | null
    cancelAtPeriodEnd?: BoolFilter<"BillingSubscription"> | boolean
    createdAt?: DateTimeFilter<"BillingSubscription"> | Date | string
    updatedAt?: DateTimeFilter<"BillingSubscription"> | Date | string
  }, "id" | "organizationId">

  export type BillingSubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    organizationId?: SortOrder
    plan?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    stripeSubscriptionId?: SortOrderInput | SortOrder
    currentPeriodEnd?: SortOrderInput | SortOrder
    cancelAtPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BillingSubscriptionCountOrderByAggregateInput
    _max?: BillingSubscriptionMaxOrderByAggregateInput
    _min?: BillingSubscriptionMinOrderByAggregateInput
  }

  export type BillingSubscriptionScalarWhereWithAggregatesInput = {
    AND?: BillingSubscriptionScalarWhereWithAggregatesInput | BillingSubscriptionScalarWhereWithAggregatesInput[]
    OR?: BillingSubscriptionScalarWhereWithAggregatesInput[]
    NOT?: BillingSubscriptionScalarWhereWithAggregatesInput | BillingSubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BillingSubscription"> | string
    organizationId?: StringWithAggregatesFilter<"BillingSubscription"> | string
    plan?: StringWithAggregatesFilter<"BillingSubscription"> | string
    status?: StringWithAggregatesFilter<"BillingSubscription"> | string
    provider?: StringWithAggregatesFilter<"BillingSubscription"> | string
    stripeCustomerId?: StringNullableWithAggregatesFilter<"BillingSubscription"> | string | null
    stripeSubscriptionId?: StringNullableWithAggregatesFilter<"BillingSubscription"> | string | null
    currentPeriodEnd?: DateTimeNullableWithAggregatesFilter<"BillingSubscription"> | Date | string | null
    cancelAtPeriodEnd?: BoolWithAggregatesFilter<"BillingSubscription"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"BillingSubscription"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BillingSubscription"> | Date | string
  }

  export type BillingInvoiceWhereInput = {
    AND?: BillingInvoiceWhereInput | BillingInvoiceWhereInput[]
    OR?: BillingInvoiceWhereInput[]
    NOT?: BillingInvoiceWhereInput | BillingInvoiceWhereInput[]
    id?: StringFilter<"BillingInvoice"> | string
    organizationId?: StringFilter<"BillingInvoice"> | string
    number?: StringFilter<"BillingInvoice"> | string
    plan?: StringFilter<"BillingInvoice"> | string
    amountCents?: IntFilter<"BillingInvoice"> | number
    currency?: StringFilter<"BillingInvoice"> | string
    status?: StringFilter<"BillingInvoice"> | string
    attempts?: IntFilter<"BillingInvoice"> | number
    periodStart?: DateTimeFilter<"BillingInvoice"> | Date | string
    periodEnd?: DateTimeFilter<"BillingInvoice"> | Date | string
    dueAt?: DateTimeFilter<"BillingInvoice"> | Date | string
    paidAt?: DateTimeNullableFilter<"BillingInvoice"> | Date | string | null
    lastError?: StringNullableFilter<"BillingInvoice"> | string | null
    provider?: StringFilter<"BillingInvoice"> | string
    stripeInvoiceId?: StringNullableFilter<"BillingInvoice"> | string | null
    createdAt?: DateTimeFilter<"BillingInvoice"> | Date | string
  }

  export type BillingInvoiceOrderByWithRelationInput = {
    id?: SortOrder
    organizationId?: SortOrder
    number?: SortOrder
    plan?: SortOrder
    amountCents?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    dueAt?: SortOrder
    paidAt?: SortOrderInput | SortOrder
    lastError?: SortOrderInput | SortOrder
    provider?: SortOrder
    stripeInvoiceId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type BillingInvoiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BillingInvoiceWhereInput | BillingInvoiceWhereInput[]
    OR?: BillingInvoiceWhereInput[]
    NOT?: BillingInvoiceWhereInput | BillingInvoiceWhereInput[]
    organizationId?: StringFilter<"BillingInvoice"> | string
    number?: StringFilter<"BillingInvoice"> | string
    plan?: StringFilter<"BillingInvoice"> | string
    amountCents?: IntFilter<"BillingInvoice"> | number
    currency?: StringFilter<"BillingInvoice"> | string
    status?: StringFilter<"BillingInvoice"> | string
    attempts?: IntFilter<"BillingInvoice"> | number
    periodStart?: DateTimeFilter<"BillingInvoice"> | Date | string
    periodEnd?: DateTimeFilter<"BillingInvoice"> | Date | string
    dueAt?: DateTimeFilter<"BillingInvoice"> | Date | string
    paidAt?: DateTimeNullableFilter<"BillingInvoice"> | Date | string | null
    lastError?: StringNullableFilter<"BillingInvoice"> | string | null
    provider?: StringFilter<"BillingInvoice"> | string
    stripeInvoiceId?: StringNullableFilter<"BillingInvoice"> | string | null
    createdAt?: DateTimeFilter<"BillingInvoice"> | Date | string
  }, "id">

  export type BillingInvoiceOrderByWithAggregationInput = {
    id?: SortOrder
    organizationId?: SortOrder
    number?: SortOrder
    plan?: SortOrder
    amountCents?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    dueAt?: SortOrder
    paidAt?: SortOrderInput | SortOrder
    lastError?: SortOrderInput | SortOrder
    provider?: SortOrder
    stripeInvoiceId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: BillingInvoiceCountOrderByAggregateInput
    _avg?: BillingInvoiceAvgOrderByAggregateInput
    _max?: BillingInvoiceMaxOrderByAggregateInput
    _min?: BillingInvoiceMinOrderByAggregateInput
    _sum?: BillingInvoiceSumOrderByAggregateInput
  }

  export type BillingInvoiceScalarWhereWithAggregatesInput = {
    AND?: BillingInvoiceScalarWhereWithAggregatesInput | BillingInvoiceScalarWhereWithAggregatesInput[]
    OR?: BillingInvoiceScalarWhereWithAggregatesInput[]
    NOT?: BillingInvoiceScalarWhereWithAggregatesInput | BillingInvoiceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BillingInvoice"> | string
    organizationId?: StringWithAggregatesFilter<"BillingInvoice"> | string
    number?: StringWithAggregatesFilter<"BillingInvoice"> | string
    plan?: StringWithAggregatesFilter<"BillingInvoice"> | string
    amountCents?: IntWithAggregatesFilter<"BillingInvoice"> | number
    currency?: StringWithAggregatesFilter<"BillingInvoice"> | string
    status?: StringWithAggregatesFilter<"BillingInvoice"> | string
    attempts?: IntWithAggregatesFilter<"BillingInvoice"> | number
    periodStart?: DateTimeWithAggregatesFilter<"BillingInvoice"> | Date | string
    periodEnd?: DateTimeWithAggregatesFilter<"BillingInvoice"> | Date | string
    dueAt?: DateTimeWithAggregatesFilter<"BillingInvoice"> | Date | string
    paidAt?: DateTimeNullableWithAggregatesFilter<"BillingInvoice"> | Date | string | null
    lastError?: StringNullableWithAggregatesFilter<"BillingInvoice"> | string | null
    provider?: StringWithAggregatesFilter<"BillingInvoice"> | string
    stripeInvoiceId?: StringNullableWithAggregatesFilter<"BillingInvoice"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"BillingInvoice"> | Date | string
  }

  export type BillingEventWhereInput = {
    AND?: BillingEventWhereInput | BillingEventWhereInput[]
    OR?: BillingEventWhereInput[]
    NOT?: BillingEventWhereInput | BillingEventWhereInput[]
    id?: StringFilter<"BillingEvent"> | string
    organizationId?: StringFilter<"BillingEvent"> | string
    type?: StringFilter<"BillingEvent"> | string
    detail?: StringFilter<"BillingEvent"> | string
    createdAt?: DateTimeFilter<"BillingEvent"> | Date | string
  }

  export type BillingEventOrderByWithRelationInput = {
    id?: SortOrder
    organizationId?: SortOrder
    type?: SortOrder
    detail?: SortOrder
    createdAt?: SortOrder
  }

  export type BillingEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BillingEventWhereInput | BillingEventWhereInput[]
    OR?: BillingEventWhereInput[]
    NOT?: BillingEventWhereInput | BillingEventWhereInput[]
    organizationId?: StringFilter<"BillingEvent"> | string
    type?: StringFilter<"BillingEvent"> | string
    detail?: StringFilter<"BillingEvent"> | string
    createdAt?: DateTimeFilter<"BillingEvent"> | Date | string
  }, "id">

  export type BillingEventOrderByWithAggregationInput = {
    id?: SortOrder
    organizationId?: SortOrder
    type?: SortOrder
    detail?: SortOrder
    createdAt?: SortOrder
    _count?: BillingEventCountOrderByAggregateInput
    _max?: BillingEventMaxOrderByAggregateInput
    _min?: BillingEventMinOrderByAggregateInput
  }

  export type BillingEventScalarWhereWithAggregatesInput = {
    AND?: BillingEventScalarWhereWithAggregatesInput | BillingEventScalarWhereWithAggregatesInput[]
    OR?: BillingEventScalarWhereWithAggregatesInput[]
    NOT?: BillingEventScalarWhereWithAggregatesInput | BillingEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BillingEvent"> | string
    organizationId?: StringWithAggregatesFilter<"BillingEvent"> | string
    type?: StringWithAggregatesFilter<"BillingEvent"> | string
    detail?: StringWithAggregatesFilter<"BillingEvent"> | string
    createdAt?: DateTimeWithAggregatesFilter<"BillingEvent"> | Date | string
  }

  export type MetricSampleWhereInput = {
    AND?: MetricSampleWhereInput | MetricSampleWhereInput[]
    OR?: MetricSampleWhereInput[]
    NOT?: MetricSampleWhereInput | MetricSampleWhereInput[]
    id?: StringFilter<"MetricSample"> | string
    type?: StringFilter<"MetricSample"> | string
    route?: StringFilter<"MetricSample"> | string
    method?: StringNullableFilter<"MetricSample"> | string | null
    status?: IntNullableFilter<"MetricSample"> | number | null
    durationMs?: IntNullableFilter<"MetricSample"> | number | null
    error?: StringNullableFilter<"MetricSample"> | string | null
    requestId?: StringNullableFilter<"MetricSample"> | string | null
    createdAt?: DateTimeFilter<"MetricSample"> | Date | string
  }

  export type MetricSampleOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    route?: SortOrder
    method?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    durationMs?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    requestId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type MetricSampleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MetricSampleWhereInput | MetricSampleWhereInput[]
    OR?: MetricSampleWhereInput[]
    NOT?: MetricSampleWhereInput | MetricSampleWhereInput[]
    type?: StringFilter<"MetricSample"> | string
    route?: StringFilter<"MetricSample"> | string
    method?: StringNullableFilter<"MetricSample"> | string | null
    status?: IntNullableFilter<"MetricSample"> | number | null
    durationMs?: IntNullableFilter<"MetricSample"> | number | null
    error?: StringNullableFilter<"MetricSample"> | string | null
    requestId?: StringNullableFilter<"MetricSample"> | string | null
    createdAt?: DateTimeFilter<"MetricSample"> | Date | string
  }, "id">

  export type MetricSampleOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    route?: SortOrder
    method?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    durationMs?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    requestId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: MetricSampleCountOrderByAggregateInput
    _avg?: MetricSampleAvgOrderByAggregateInput
    _max?: MetricSampleMaxOrderByAggregateInput
    _min?: MetricSampleMinOrderByAggregateInput
    _sum?: MetricSampleSumOrderByAggregateInput
  }

  export type MetricSampleScalarWhereWithAggregatesInput = {
    AND?: MetricSampleScalarWhereWithAggregatesInput | MetricSampleScalarWhereWithAggregatesInput[]
    OR?: MetricSampleScalarWhereWithAggregatesInput[]
    NOT?: MetricSampleScalarWhereWithAggregatesInput | MetricSampleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MetricSample"> | string
    type?: StringWithAggregatesFilter<"MetricSample"> | string
    route?: StringWithAggregatesFilter<"MetricSample"> | string
    method?: StringNullableWithAggregatesFilter<"MetricSample"> | string | null
    status?: IntNullableWithAggregatesFilter<"MetricSample"> | number | null
    durationMs?: IntNullableWithAggregatesFilter<"MetricSample"> | number | null
    error?: StringNullableWithAggregatesFilter<"MetricSample"> | string | null
    requestId?: StringNullableWithAggregatesFilter<"MetricSample"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"MetricSample"> | Date | string
  }

  export type AuditRunCreateInput = {
    id?: string
    organizationId?: string | null
    source: string
    drug: string
    verdict: string
    nLabelled: number
    summary: string
    input: string
    results: string
    createdAt?: Date | string
  }

  export type AuditRunUncheckedCreateInput = {
    id?: string
    organizationId?: string | null
    source: string
    drug: string
    verdict: string
    nLabelled: number
    summary: string
    input: string
    results: string
    createdAt?: Date | string
  }

  export type AuditRunUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    drug?: StringFieldUpdateOperationsInput | string
    verdict?: StringFieldUpdateOperationsInput | string
    nLabelled?: IntFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    input?: StringFieldUpdateOperationsInput | string
    results?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditRunUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    drug?: StringFieldUpdateOperationsInput | string
    verdict?: StringFieldUpdateOperationsInput | string
    nLabelled?: IntFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    input?: StringFieldUpdateOperationsInput | string
    results?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditRunCreateManyInput = {
    id?: string
    organizationId?: string | null
    source: string
    drug: string
    verdict: string
    nLabelled: number
    summary: string
    input: string
    results: string
    createdAt?: Date | string
  }

  export type AuditRunUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    drug?: StringFieldUpdateOperationsInput | string
    verdict?: StringFieldUpdateOperationsInput | string
    nLabelled?: IntFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    input?: StringFieldUpdateOperationsInput | string
    results?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditRunUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    drug?: StringFieldUpdateOperationsInput | string
    verdict?: StringFieldUpdateOperationsInput | string
    nLabelled?: IntFieldUpdateOperationsInput | number
    summary?: StringFieldUpdateOperationsInput | string
    input?: StringFieldUpdateOperationsInput | string
    results?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PredictRunCreateInput = {
    id?: string
    organizationId?: string | null
    drug: string
    isolate?: string | null
    modelType: string
    m0Call?: string | null
    pR?: number | null
    call?: string | null
    conformalSet?: string | null
    input: string
    output: string
    createdAt?: Date | string
  }

  export type PredictRunUncheckedCreateInput = {
    id?: string
    organizationId?: string | null
    drug: string
    isolate?: string | null
    modelType: string
    m0Call?: string | null
    pR?: number | null
    call?: string | null
    conformalSet?: string | null
    input: string
    output: string
    createdAt?: Date | string
  }

  export type PredictRunUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    drug?: StringFieldUpdateOperationsInput | string
    isolate?: NullableStringFieldUpdateOperationsInput | string | null
    modelType?: StringFieldUpdateOperationsInput | string
    m0Call?: NullableStringFieldUpdateOperationsInput | string | null
    pR?: NullableFloatFieldUpdateOperationsInput | number | null
    call?: NullableStringFieldUpdateOperationsInput | string | null
    conformalSet?: NullableStringFieldUpdateOperationsInput | string | null
    input?: StringFieldUpdateOperationsInput | string
    output?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PredictRunUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    drug?: StringFieldUpdateOperationsInput | string
    isolate?: NullableStringFieldUpdateOperationsInput | string | null
    modelType?: StringFieldUpdateOperationsInput | string
    m0Call?: NullableStringFieldUpdateOperationsInput | string | null
    pR?: NullableFloatFieldUpdateOperationsInput | number | null
    call?: NullableStringFieldUpdateOperationsInput | string | null
    conformalSet?: NullableStringFieldUpdateOperationsInput | string | null
    input?: StringFieldUpdateOperationsInput | string
    output?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PredictRunCreateManyInput = {
    id?: string
    organizationId?: string | null
    drug: string
    isolate?: string | null
    modelType: string
    m0Call?: string | null
    pR?: number | null
    call?: string | null
    conformalSet?: string | null
    input: string
    output: string
    createdAt?: Date | string
  }

  export type PredictRunUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    drug?: StringFieldUpdateOperationsInput | string
    isolate?: NullableStringFieldUpdateOperationsInput | string | null
    modelType?: StringFieldUpdateOperationsInput | string
    m0Call?: NullableStringFieldUpdateOperationsInput | string | null
    pR?: NullableFloatFieldUpdateOperationsInput | number | null
    call?: NullableStringFieldUpdateOperationsInput | string | null
    conformalSet?: NullableStringFieldUpdateOperationsInput | string | null
    input?: StringFieldUpdateOperationsInput | string
    output?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PredictRunUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    drug?: StringFieldUpdateOperationsInput | string
    isolate?: NullableStringFieldUpdateOperationsInput | string | null
    modelType?: StringFieldUpdateOperationsInput | string
    m0Call?: NullableStringFieldUpdateOperationsInput | string | null
    pR?: NullableFloatFieldUpdateOperationsInput | number | null
    call?: NullableStringFieldUpdateOperationsInput | string | null
    conformalSet?: NullableStringFieldUpdateOperationsInput | string | null
    input?: StringFieldUpdateOperationsInput | string
    output?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ValidateRunCreateInput = {
    id?: string
    organizationId?: string | null
    drug: string
    problems: number
    verdict: string
    results: string
    createdAt?: Date | string
  }

  export type ValidateRunUncheckedCreateInput = {
    id?: string
    organizationId?: string | null
    drug: string
    problems: number
    verdict: string
    results: string
    createdAt?: Date | string
  }

  export type ValidateRunUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    drug?: StringFieldUpdateOperationsInput | string
    problems?: IntFieldUpdateOperationsInput | number
    verdict?: StringFieldUpdateOperationsInput | string
    results?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ValidateRunUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    drug?: StringFieldUpdateOperationsInput | string
    problems?: IntFieldUpdateOperationsInput | number
    verdict?: StringFieldUpdateOperationsInput | string
    results?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ValidateRunCreateManyInput = {
    id?: string
    organizationId?: string | null
    drug: string
    problems: number
    verdict: string
    results: string
    createdAt?: Date | string
  }

  export type ValidateRunUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    drug?: StringFieldUpdateOperationsInput | string
    problems?: IntFieldUpdateOperationsInput | number
    verdict?: StringFieldUpdateOperationsInput | string
    results?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ValidateRunUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    drug?: StringFieldUpdateOperationsInput | string
    problems?: IntFieldUpdateOperationsInput | number
    verdict?: StringFieldUpdateOperationsInput | string
    results?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceRequestCreateInput = {
    id?: string
    organizationId?: string | null
    sku: string
    name: string
    email: string
    org?: string | null
    isolates?: number | null
    message?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type ServiceRequestUncheckedCreateInput = {
    id?: string
    organizationId?: string | null
    sku: string
    name: string
    email: string
    org?: string | null
    isolates?: number | null
    message?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type ServiceRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    org?: NullableStringFieldUpdateOperationsInput | string | null
    isolates?: NullableIntFieldUpdateOperationsInput | number | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    org?: NullableStringFieldUpdateOperationsInput | string | null
    isolates?: NullableIntFieldUpdateOperationsInput | number | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceRequestCreateManyInput = {
    id?: string
    organizationId?: string | null
    sku: string
    name: string
    email: string
    org?: string | null
    isolates?: number | null
    message?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type ServiceRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    org?: NullableStringFieldUpdateOperationsInput | string | null
    isolates?: NullableIntFieldUpdateOperationsInput | number | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    org?: NullableStringFieldUpdateOperationsInput | string | null
    isolates?: NullableIntFieldUpdateOperationsInput | number | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateInput = {
    id?: string
    actor: string
    action: string
    detail: string
    hash: string
    prevHash?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUncheckedCreateInput = {
    seq?: number
    id?: string
    actor: string
    action: string
    detail: string
    hash: string
    prevHash?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    detail?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    prevHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateInput = {
    seq?: IntFieldUpdateOperationsInput | number
    id?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    detail?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    prevHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    seq?: number
    id?: string
    actor: string
    action: string
    detail: string
    hash: string
    prevHash?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    detail?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    prevHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    seq?: IntFieldUpdateOperationsInput | number
    id?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    detail?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    prevHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiKeyCreateInput = {
    id?: string
    organizationId?: string | null
    label: string
    keyPrefix: string
    keyHash: string
    scope?: string
    credits?: number
    lastUsedAt?: Date | string | null
    revokedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ApiKeyUncheckedCreateInput = {
    id?: string
    organizationId?: string | null
    label: string
    keyPrefix: string
    keyHash: string
    scope?: string
    credits?: number
    lastUsedAt?: Date | string | null
    revokedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ApiKeyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    label?: StringFieldUpdateOperationsInput | string
    keyPrefix?: StringFieldUpdateOperationsInput | string
    keyHash?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiKeyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    label?: StringFieldUpdateOperationsInput | string
    keyPrefix?: StringFieldUpdateOperationsInput | string
    keyHash?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiKeyCreateManyInput = {
    id?: string
    organizationId?: string | null
    label: string
    keyPrefix: string
    keyHash: string
    scope?: string
    credits?: number
    lastUsedAt?: Date | string | null
    revokedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ApiKeyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    label?: StringFieldUpdateOperationsInput | string
    keyPrefix?: StringFieldUpdateOperationsInput | string
    keyHash?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiKeyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    label?: StringFieldUpdateOperationsInput | string
    keyPrefix?: StringFieldUpdateOperationsInput | string
    keyHash?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BatchJobCreateInput = {
    id?: string
    organizationId?: string | null
    label: string
    drug: string
    modelType?: string
    n: number
    done?: number
    status?: string
    isolates: string
    results?: string
    summary?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BatchJobUncheckedCreateInput = {
    id?: string
    organizationId?: string | null
    label: string
    drug: string
    modelType?: string
    n: number
    done?: number
    status?: string
    isolates: string
    results?: string
    summary?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BatchJobUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    label?: StringFieldUpdateOperationsInput | string
    drug?: StringFieldUpdateOperationsInput | string
    modelType?: StringFieldUpdateOperationsInput | string
    n?: IntFieldUpdateOperationsInput | number
    done?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    isolates?: StringFieldUpdateOperationsInput | string
    results?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BatchJobUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    label?: StringFieldUpdateOperationsInput | string
    drug?: StringFieldUpdateOperationsInput | string
    modelType?: StringFieldUpdateOperationsInput | string
    n?: IntFieldUpdateOperationsInput | number
    done?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    isolates?: StringFieldUpdateOperationsInput | string
    results?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BatchJobCreateManyInput = {
    id?: string
    organizationId?: string | null
    label: string
    drug: string
    modelType?: string
    n: number
    done?: number
    status?: string
    isolates: string
    results?: string
    summary?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BatchJobUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    label?: StringFieldUpdateOperationsInput | string
    drug?: StringFieldUpdateOperationsInput | string
    modelType?: StringFieldUpdateOperationsInput | string
    n?: IntFieldUpdateOperationsInput | number
    done?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    isolates?: StringFieldUpdateOperationsInput | string
    results?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BatchJobUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    label?: StringFieldUpdateOperationsInput | string
    drug?: StringFieldUpdateOperationsInput | string
    modelType?: StringFieldUpdateOperationsInput | string
    n?: IntFieldUpdateOperationsInput | number
    done?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    isolates?: StringFieldUpdateOperationsInput | string
    results?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntegrationConfigCreateInput = {
    id?: string
    organizationId?: string | null
    platform?: string
    endpointUrl?: string | null
    hmacSecret: string
    events?: string
    active?: boolean
    lastTestedAt?: Date | string | null
    lastTestStatus?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IntegrationConfigUncheckedCreateInput = {
    id?: string
    organizationId?: string | null
    platform?: string
    endpointUrl?: string | null
    hmacSecret: string
    events?: string
    active?: boolean
    lastTestedAt?: Date | string | null
    lastTestStatus?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IntegrationConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: StringFieldUpdateOperationsInput | string
    endpointUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hmacSecret?: StringFieldUpdateOperationsInput | string
    events?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    lastTestedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastTestStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntegrationConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: StringFieldUpdateOperationsInput | string
    endpointUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hmacSecret?: StringFieldUpdateOperationsInput | string
    events?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    lastTestedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastTestStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntegrationConfigCreateManyInput = {
    id?: string
    organizationId?: string | null
    platform?: string
    endpointUrl?: string | null
    hmacSecret: string
    events?: string
    active?: boolean
    lastTestedAt?: Date | string | null
    lastTestStatus?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IntegrationConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: StringFieldUpdateOperationsInput | string
    endpointUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hmacSecret?: StringFieldUpdateOperationsInput | string
    events?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    lastTestedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastTestStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntegrationConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: StringFieldUpdateOperationsInput | string
    endpointUrl?: NullableStringFieldUpdateOperationsInput | string | null
    hmacSecret?: StringFieldUpdateOperationsInput | string
    events?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    lastTestedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastTestStatus?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebhookEventCreateInput = {
    id?: string
    organizationId?: string | null
    direction: string
    platform?: string
    eventType: string
    payload: string
    status: string
    httpStatus?: number | null
    error?: string | null
    createdAt?: Date | string
  }

  export type WebhookEventUncheckedCreateInput = {
    id?: string
    organizationId?: string | null
    direction: string
    platform?: string
    eventType: string
    payload: string
    status: string
    httpStatus?: number | null
    error?: string | null
    createdAt?: Date | string
  }

  export type WebhookEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    direction?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    httpStatus?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebhookEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    direction?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    httpStatus?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebhookEventCreateManyInput = {
    id?: string
    organizationId?: string | null
    direction: string
    platform?: string
    eventType: string
    payload: string
    status: string
    httpStatus?: number | null
    error?: string | null
    createdAt?: Date | string
  }

  export type WebhookEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    direction?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    httpStatus?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebhookEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    direction?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    httpStatus?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    memberships?: MembershipCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    memberships?: MembershipUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    id?: string
    userId: string
    tokenHash: string
    activeOrgId?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    userId: string
    tokenHash: string
    activeOrgId?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    activeOrgId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    activeOrgId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    userId: string
    tokenHash: string
    activeOrgId?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    activeOrgId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    activeOrgId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganizationCreateInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    memberships?: MembershipCreateNestedManyWithoutOrgInput
  }

  export type OrganizationUncheckedCreateInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    memberships?: MembershipUncheckedCreateNestedManyWithoutOrgInput
  }

  export type OrganizationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUpdateManyWithoutOrgNestedInput
  }

  export type OrganizationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: MembershipUncheckedUpdateManyWithoutOrgNestedInput
  }

  export type OrganizationCreateManyInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrganizationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganizationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MembershipCreateInput = {
    id?: string
    role?: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutMembershipsInput
    org: OrganizationCreateNestedOneWithoutMembershipsInput
  }

  export type MembershipUncheckedCreateInput = {
    id?: string
    userId: string
    orgId: string
    role?: string
    createdAt?: Date | string
  }

  export type MembershipUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMembershipsNestedInput
    org?: OrganizationUpdateOneRequiredWithoutMembershipsNestedInput
  }

  export type MembershipUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MembershipCreateManyInput = {
    id?: string
    userId: string
    orgId: string
    role?: string
    createdAt?: Date | string
  }

  export type MembershipUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MembershipUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingSubscriptionCreateInput = {
    id?: string
    organizationId: string
    plan: string
    status: string
    provider?: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    currentPeriodEnd?: Date | string | null
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingSubscriptionUncheckedCreateInput = {
    id?: string
    organizationId: string
    plan: string
    status: string
    provider?: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    currentPeriodEnd?: Date | string | null
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingSubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingSubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingSubscriptionCreateManyInput = {
    id?: string
    organizationId: string
    plan: string
    status: string
    provider?: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    currentPeriodEnd?: Date | string | null
    cancelAtPeriodEnd?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingSubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingSubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingInvoiceCreateInput = {
    id?: string
    organizationId: string
    number: string
    plan: string
    amountCents: number
    currency?: string
    status: string
    attempts?: number
    periodStart: Date | string
    periodEnd: Date | string
    dueAt: Date | string
    paidAt?: Date | string | null
    lastError?: string | null
    provider?: string
    stripeInvoiceId?: string | null
    createdAt?: Date | string
  }

  export type BillingInvoiceUncheckedCreateInput = {
    id?: string
    organizationId: string
    number: string
    plan: string
    amountCents: number
    currency?: string
    status: string
    attempts?: number
    periodStart: Date | string
    periodEnd: Date | string
    dueAt: Date | string
    paidAt?: Date | string | null
    lastError?: string | null
    provider?: string
    stripeInvoiceId?: string | null
    createdAt?: Date | string
  }

  export type BillingInvoiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    amountCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    dueAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    stripeInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingInvoiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    amountCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    dueAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    stripeInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingInvoiceCreateManyInput = {
    id?: string
    organizationId: string
    number: string
    plan: string
    amountCents: number
    currency?: string
    status: string
    attempts?: number
    periodStart: Date | string
    periodEnd: Date | string
    dueAt: Date | string
    paidAt?: Date | string | null
    lastError?: string | null
    provider?: string
    stripeInvoiceId?: string | null
    createdAt?: Date | string
  }

  export type BillingInvoiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    amountCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    dueAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    stripeInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingInvoiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    number?: StringFieldUpdateOperationsInput | string
    plan?: StringFieldUpdateOperationsInput | string
    amountCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    dueAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    stripeInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingEventCreateInput = {
    id?: string
    organizationId: string
    type: string
    detail: string
    createdAt?: Date | string
  }

  export type BillingEventUncheckedCreateInput = {
    id?: string
    organizationId: string
    type: string
    detail: string
    createdAt?: Date | string
  }

  export type BillingEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    detail?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    detail?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingEventCreateManyInput = {
    id?: string
    organizationId: string
    type: string
    detail: string
    createdAt?: Date | string
  }

  export type BillingEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    detail?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    detail?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MetricSampleCreateInput = {
    id?: string
    type: string
    route: string
    method?: string | null
    status?: number | null
    durationMs?: number | null
    error?: string | null
    requestId?: string | null
    createdAt?: Date | string
  }

  export type MetricSampleUncheckedCreateInput = {
    id?: string
    type: string
    route: string
    method?: string | null
    status?: number | null
    durationMs?: number | null
    error?: string | null
    requestId?: string | null
    createdAt?: Date | string
  }

  export type MetricSampleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    route?: StringFieldUpdateOperationsInput | string
    method?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableIntFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MetricSampleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    route?: StringFieldUpdateOperationsInput | string
    method?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableIntFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MetricSampleCreateManyInput = {
    id?: string
    type: string
    route: string
    method?: string | null
    status?: number | null
    durationMs?: number | null
    error?: string | null
    requestId?: string | null
    createdAt?: Date | string
  }

  export type MetricSampleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    route?: StringFieldUpdateOperationsInput | string
    method?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableIntFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MetricSampleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    route?: StringFieldUpdateOperationsInput | string
    method?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableIntFieldUpdateOperationsInput | number | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AuditRunCountOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    source?: SortOrder
    drug?: SortOrder
    verdict?: SortOrder
    nLabelled?: SortOrder
    summary?: SortOrder
    input?: SortOrder
    results?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditRunAvgOrderByAggregateInput = {
    nLabelled?: SortOrder
  }

  export type AuditRunMaxOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    source?: SortOrder
    drug?: SortOrder
    verdict?: SortOrder
    nLabelled?: SortOrder
    summary?: SortOrder
    input?: SortOrder
    results?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditRunMinOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    source?: SortOrder
    drug?: SortOrder
    verdict?: SortOrder
    nLabelled?: SortOrder
    summary?: SortOrder
    input?: SortOrder
    results?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditRunSumOrderByAggregateInput = {
    nLabelled?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type PredictRunCountOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    drug?: SortOrder
    isolate?: SortOrder
    modelType?: SortOrder
    m0Call?: SortOrder
    pR?: SortOrder
    call?: SortOrder
    conformalSet?: SortOrder
    input?: SortOrder
    output?: SortOrder
    createdAt?: SortOrder
  }

  export type PredictRunAvgOrderByAggregateInput = {
    pR?: SortOrder
  }

  export type PredictRunMaxOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    drug?: SortOrder
    isolate?: SortOrder
    modelType?: SortOrder
    m0Call?: SortOrder
    pR?: SortOrder
    call?: SortOrder
    conformalSet?: SortOrder
    input?: SortOrder
    output?: SortOrder
    createdAt?: SortOrder
  }

  export type PredictRunMinOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    drug?: SortOrder
    isolate?: SortOrder
    modelType?: SortOrder
    m0Call?: SortOrder
    pR?: SortOrder
    call?: SortOrder
    conformalSet?: SortOrder
    input?: SortOrder
    output?: SortOrder
    createdAt?: SortOrder
  }

  export type PredictRunSumOrderByAggregateInput = {
    pR?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type ValidateRunCountOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    drug?: SortOrder
    problems?: SortOrder
    verdict?: SortOrder
    results?: SortOrder
    createdAt?: SortOrder
  }

  export type ValidateRunAvgOrderByAggregateInput = {
    problems?: SortOrder
  }

  export type ValidateRunMaxOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    drug?: SortOrder
    problems?: SortOrder
    verdict?: SortOrder
    results?: SortOrder
    createdAt?: SortOrder
  }

  export type ValidateRunMinOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    drug?: SortOrder
    problems?: SortOrder
    verdict?: SortOrder
    results?: SortOrder
    createdAt?: SortOrder
  }

  export type ValidateRunSumOrderByAggregateInput = {
    problems?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type ServiceRequestCountOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    sku?: SortOrder
    name?: SortOrder
    email?: SortOrder
    org?: SortOrder
    isolates?: SortOrder
    message?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type ServiceRequestAvgOrderByAggregateInput = {
    isolates?: SortOrder
  }

  export type ServiceRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    sku?: SortOrder
    name?: SortOrder
    email?: SortOrder
    org?: SortOrder
    isolates?: SortOrder
    message?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type ServiceRequestMinOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    sku?: SortOrder
    name?: SortOrder
    email?: SortOrder
    org?: SortOrder
    isolates?: SortOrder
    message?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type ServiceRequestSumOrderByAggregateInput = {
    isolates?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type AuditLogCountOrderByAggregateInput = {
    seq?: SortOrder
    id?: SortOrder
    actor?: SortOrder
    action?: SortOrder
    detail?: SortOrder
    hash?: SortOrder
    prevHash?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogAvgOrderByAggregateInput = {
    seq?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    seq?: SortOrder
    id?: SortOrder
    actor?: SortOrder
    action?: SortOrder
    detail?: SortOrder
    hash?: SortOrder
    prevHash?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    seq?: SortOrder
    id?: SortOrder
    actor?: SortOrder
    action?: SortOrder
    detail?: SortOrder
    hash?: SortOrder
    prevHash?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogSumOrderByAggregateInput = {
    seq?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ApiKeyCountOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    label?: SortOrder
    keyPrefix?: SortOrder
    keyHash?: SortOrder
    scope?: SortOrder
    credits?: SortOrder
    lastUsedAt?: SortOrder
    revokedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type ApiKeyAvgOrderByAggregateInput = {
    credits?: SortOrder
  }

  export type ApiKeyMaxOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    label?: SortOrder
    keyPrefix?: SortOrder
    keyHash?: SortOrder
    scope?: SortOrder
    credits?: SortOrder
    lastUsedAt?: SortOrder
    revokedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type ApiKeyMinOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    label?: SortOrder
    keyPrefix?: SortOrder
    keyHash?: SortOrder
    scope?: SortOrder
    credits?: SortOrder
    lastUsedAt?: SortOrder
    revokedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type ApiKeySumOrderByAggregateInput = {
    credits?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BatchJobCountOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    label?: SortOrder
    drug?: SortOrder
    modelType?: SortOrder
    n?: SortOrder
    done?: SortOrder
    status?: SortOrder
    isolates?: SortOrder
    results?: SortOrder
    summary?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BatchJobAvgOrderByAggregateInput = {
    n?: SortOrder
    done?: SortOrder
  }

  export type BatchJobMaxOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    label?: SortOrder
    drug?: SortOrder
    modelType?: SortOrder
    n?: SortOrder
    done?: SortOrder
    status?: SortOrder
    isolates?: SortOrder
    results?: SortOrder
    summary?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BatchJobMinOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    label?: SortOrder
    drug?: SortOrder
    modelType?: SortOrder
    n?: SortOrder
    done?: SortOrder
    status?: SortOrder
    isolates?: SortOrder
    results?: SortOrder
    summary?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BatchJobSumOrderByAggregateInput = {
    n?: SortOrder
    done?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type IntegrationConfigCountOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    platform?: SortOrder
    endpointUrl?: SortOrder
    hmacSecret?: SortOrder
    events?: SortOrder
    active?: SortOrder
    lastTestedAt?: SortOrder
    lastTestStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntegrationConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    platform?: SortOrder
    endpointUrl?: SortOrder
    hmacSecret?: SortOrder
    events?: SortOrder
    active?: SortOrder
    lastTestedAt?: SortOrder
    lastTestStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntegrationConfigMinOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    platform?: SortOrder
    endpointUrl?: SortOrder
    hmacSecret?: SortOrder
    events?: SortOrder
    active?: SortOrder
    lastTestedAt?: SortOrder
    lastTestStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type WebhookEventCountOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    direction?: SortOrder
    platform?: SortOrder
    eventType?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    httpStatus?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type WebhookEventAvgOrderByAggregateInput = {
    httpStatus?: SortOrder
  }

  export type WebhookEventMaxOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    direction?: SortOrder
    platform?: SortOrder
    eventType?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    httpStatus?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type WebhookEventMinOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    direction?: SortOrder
    platform?: SortOrder
    eventType?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    httpStatus?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type WebhookEventSumOrderByAggregateInput = {
    httpStatus?: SortOrder
  }

  export type MembershipListRelationFilter = {
    every?: MembershipWhereInput
    some?: MembershipWhereInput
    none?: MembershipWhereInput
  }

  export type MembershipOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    activeOrgId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    activeOrgId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    activeOrgId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type OrganizationCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrganizationMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrganizationMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type OrganizationScalarRelationFilter = {
    is?: OrganizationWhereInput
    isNot?: OrganizationWhereInput
  }

  export type MembershipUserIdOrgIdCompoundUniqueInput = {
    userId: string
    orgId: string
  }

  export type MembershipCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    orgId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type MembershipMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    orgId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type MembershipMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    orgId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type BillingSubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    plan?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubscriptionId?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BillingSubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    plan?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubscriptionId?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BillingSubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    plan?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubscriptionId?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BillingInvoiceCountOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    number?: SortOrder
    plan?: SortOrder
    amountCents?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    dueAt?: SortOrder
    paidAt?: SortOrder
    lastError?: SortOrder
    provider?: SortOrder
    stripeInvoiceId?: SortOrder
    createdAt?: SortOrder
  }

  export type BillingInvoiceAvgOrderByAggregateInput = {
    amountCents?: SortOrder
    attempts?: SortOrder
  }

  export type BillingInvoiceMaxOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    number?: SortOrder
    plan?: SortOrder
    amountCents?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    dueAt?: SortOrder
    paidAt?: SortOrder
    lastError?: SortOrder
    provider?: SortOrder
    stripeInvoiceId?: SortOrder
    createdAt?: SortOrder
  }

  export type BillingInvoiceMinOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    number?: SortOrder
    plan?: SortOrder
    amountCents?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    dueAt?: SortOrder
    paidAt?: SortOrder
    lastError?: SortOrder
    provider?: SortOrder
    stripeInvoiceId?: SortOrder
    createdAt?: SortOrder
  }

  export type BillingInvoiceSumOrderByAggregateInput = {
    amountCents?: SortOrder
    attempts?: SortOrder
  }

  export type BillingEventCountOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    type?: SortOrder
    detail?: SortOrder
    createdAt?: SortOrder
  }

  export type BillingEventMaxOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    type?: SortOrder
    detail?: SortOrder
    createdAt?: SortOrder
  }

  export type BillingEventMinOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    type?: SortOrder
    detail?: SortOrder
    createdAt?: SortOrder
  }

  export type MetricSampleCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    route?: SortOrder
    method?: SortOrder
    status?: SortOrder
    durationMs?: SortOrder
    error?: SortOrder
    requestId?: SortOrder
    createdAt?: SortOrder
  }

  export type MetricSampleAvgOrderByAggregateInput = {
    status?: SortOrder
    durationMs?: SortOrder
  }

  export type MetricSampleMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    route?: SortOrder
    method?: SortOrder
    status?: SortOrder
    durationMs?: SortOrder
    error?: SortOrder
    requestId?: SortOrder
    createdAt?: SortOrder
  }

  export type MetricSampleMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    route?: SortOrder
    method?: SortOrder
    status?: SortOrder
    durationMs?: SortOrder
    error?: SortOrder
    requestId?: SortOrder
    createdAt?: SortOrder
  }

  export type MetricSampleSumOrderByAggregateInput = {
    status?: SortOrder
    durationMs?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type MembershipCreateNestedManyWithoutUserInput = {
    create?: XOR<MembershipCreateWithoutUserInput, MembershipUncheckedCreateWithoutUserInput> | MembershipCreateWithoutUserInput[] | MembershipUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MembershipCreateOrConnectWithoutUserInput | MembershipCreateOrConnectWithoutUserInput[]
    createMany?: MembershipCreateManyUserInputEnvelope
    connect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
  }

  export type MembershipUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<MembershipCreateWithoutUserInput, MembershipUncheckedCreateWithoutUserInput> | MembershipCreateWithoutUserInput[] | MembershipUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MembershipCreateOrConnectWithoutUserInput | MembershipCreateOrConnectWithoutUserInput[]
    createMany?: MembershipCreateManyUserInputEnvelope
    connect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
  }

  export type MembershipUpdateManyWithoutUserNestedInput = {
    create?: XOR<MembershipCreateWithoutUserInput, MembershipUncheckedCreateWithoutUserInput> | MembershipCreateWithoutUserInput[] | MembershipUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MembershipCreateOrConnectWithoutUserInput | MembershipCreateOrConnectWithoutUserInput[]
    upsert?: MembershipUpsertWithWhereUniqueWithoutUserInput | MembershipUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MembershipCreateManyUserInputEnvelope
    set?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    disconnect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    delete?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    connect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    update?: MembershipUpdateWithWhereUniqueWithoutUserInput | MembershipUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MembershipUpdateManyWithWhereWithoutUserInput | MembershipUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MembershipScalarWhereInput | MembershipScalarWhereInput[]
  }

  export type MembershipUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<MembershipCreateWithoutUserInput, MembershipUncheckedCreateWithoutUserInput> | MembershipCreateWithoutUserInput[] | MembershipUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MembershipCreateOrConnectWithoutUserInput | MembershipCreateOrConnectWithoutUserInput[]
    upsert?: MembershipUpsertWithWhereUniqueWithoutUserInput | MembershipUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MembershipCreateManyUserInputEnvelope
    set?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    disconnect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    delete?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    connect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    update?: MembershipUpdateWithWhereUniqueWithoutUserInput | MembershipUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MembershipUpdateManyWithWhereWithoutUserInput | MembershipUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MembershipScalarWhereInput | MembershipScalarWhereInput[]
  }

  export type MembershipCreateNestedManyWithoutOrgInput = {
    create?: XOR<MembershipCreateWithoutOrgInput, MembershipUncheckedCreateWithoutOrgInput> | MembershipCreateWithoutOrgInput[] | MembershipUncheckedCreateWithoutOrgInput[]
    connectOrCreate?: MembershipCreateOrConnectWithoutOrgInput | MembershipCreateOrConnectWithoutOrgInput[]
    createMany?: MembershipCreateManyOrgInputEnvelope
    connect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
  }

  export type MembershipUncheckedCreateNestedManyWithoutOrgInput = {
    create?: XOR<MembershipCreateWithoutOrgInput, MembershipUncheckedCreateWithoutOrgInput> | MembershipCreateWithoutOrgInput[] | MembershipUncheckedCreateWithoutOrgInput[]
    connectOrCreate?: MembershipCreateOrConnectWithoutOrgInput | MembershipCreateOrConnectWithoutOrgInput[]
    createMany?: MembershipCreateManyOrgInputEnvelope
    connect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
  }

  export type MembershipUpdateManyWithoutOrgNestedInput = {
    create?: XOR<MembershipCreateWithoutOrgInput, MembershipUncheckedCreateWithoutOrgInput> | MembershipCreateWithoutOrgInput[] | MembershipUncheckedCreateWithoutOrgInput[]
    connectOrCreate?: MembershipCreateOrConnectWithoutOrgInput | MembershipCreateOrConnectWithoutOrgInput[]
    upsert?: MembershipUpsertWithWhereUniqueWithoutOrgInput | MembershipUpsertWithWhereUniqueWithoutOrgInput[]
    createMany?: MembershipCreateManyOrgInputEnvelope
    set?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    disconnect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    delete?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    connect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    update?: MembershipUpdateWithWhereUniqueWithoutOrgInput | MembershipUpdateWithWhereUniqueWithoutOrgInput[]
    updateMany?: MembershipUpdateManyWithWhereWithoutOrgInput | MembershipUpdateManyWithWhereWithoutOrgInput[]
    deleteMany?: MembershipScalarWhereInput | MembershipScalarWhereInput[]
  }

  export type MembershipUncheckedUpdateManyWithoutOrgNestedInput = {
    create?: XOR<MembershipCreateWithoutOrgInput, MembershipUncheckedCreateWithoutOrgInput> | MembershipCreateWithoutOrgInput[] | MembershipUncheckedCreateWithoutOrgInput[]
    connectOrCreate?: MembershipCreateOrConnectWithoutOrgInput | MembershipCreateOrConnectWithoutOrgInput[]
    upsert?: MembershipUpsertWithWhereUniqueWithoutOrgInput | MembershipUpsertWithWhereUniqueWithoutOrgInput[]
    createMany?: MembershipCreateManyOrgInputEnvelope
    set?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    disconnect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    delete?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    connect?: MembershipWhereUniqueInput | MembershipWhereUniqueInput[]
    update?: MembershipUpdateWithWhereUniqueWithoutOrgInput | MembershipUpdateWithWhereUniqueWithoutOrgInput[]
    updateMany?: MembershipUpdateManyWithWhereWithoutOrgInput | MembershipUpdateManyWithWhereWithoutOrgInput[]
    deleteMany?: MembershipScalarWhereInput | MembershipScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutMembershipsInput = {
    create?: XOR<UserCreateWithoutMembershipsInput, UserUncheckedCreateWithoutMembershipsInput>
    connectOrCreate?: UserCreateOrConnectWithoutMembershipsInput
    connect?: UserWhereUniqueInput
  }

  export type OrganizationCreateNestedOneWithoutMembershipsInput = {
    create?: XOR<OrganizationCreateWithoutMembershipsInput, OrganizationUncheckedCreateWithoutMembershipsInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutMembershipsInput
    connect?: OrganizationWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutMembershipsNestedInput = {
    create?: XOR<UserCreateWithoutMembershipsInput, UserUncheckedCreateWithoutMembershipsInput>
    connectOrCreate?: UserCreateOrConnectWithoutMembershipsInput
    upsert?: UserUpsertWithoutMembershipsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMembershipsInput, UserUpdateWithoutMembershipsInput>, UserUncheckedUpdateWithoutMembershipsInput>
  }

  export type OrganizationUpdateOneRequiredWithoutMembershipsNestedInput = {
    create?: XOR<OrganizationCreateWithoutMembershipsInput, OrganizationUncheckedCreateWithoutMembershipsInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutMembershipsInput
    upsert?: OrganizationUpsertWithoutMembershipsInput
    connect?: OrganizationWhereUniqueInput
    update?: XOR<XOR<OrganizationUpdateToOneWithWhereWithoutMembershipsInput, OrganizationUpdateWithoutMembershipsInput>, OrganizationUncheckedUpdateWithoutMembershipsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type MembershipCreateWithoutUserInput = {
    id?: string
    role?: string
    createdAt?: Date | string
    org: OrganizationCreateNestedOneWithoutMembershipsInput
  }

  export type MembershipUncheckedCreateWithoutUserInput = {
    id?: string
    orgId: string
    role?: string
    createdAt?: Date | string
  }

  export type MembershipCreateOrConnectWithoutUserInput = {
    where: MembershipWhereUniqueInput
    create: XOR<MembershipCreateWithoutUserInput, MembershipUncheckedCreateWithoutUserInput>
  }

  export type MembershipCreateManyUserInputEnvelope = {
    data: MembershipCreateManyUserInput | MembershipCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type MembershipUpsertWithWhereUniqueWithoutUserInput = {
    where: MembershipWhereUniqueInput
    update: XOR<MembershipUpdateWithoutUserInput, MembershipUncheckedUpdateWithoutUserInput>
    create: XOR<MembershipCreateWithoutUserInput, MembershipUncheckedCreateWithoutUserInput>
  }

  export type MembershipUpdateWithWhereUniqueWithoutUserInput = {
    where: MembershipWhereUniqueInput
    data: XOR<MembershipUpdateWithoutUserInput, MembershipUncheckedUpdateWithoutUserInput>
  }

  export type MembershipUpdateManyWithWhereWithoutUserInput = {
    where: MembershipScalarWhereInput
    data: XOR<MembershipUpdateManyMutationInput, MembershipUncheckedUpdateManyWithoutUserInput>
  }

  export type MembershipScalarWhereInput = {
    AND?: MembershipScalarWhereInput | MembershipScalarWhereInput[]
    OR?: MembershipScalarWhereInput[]
    NOT?: MembershipScalarWhereInput | MembershipScalarWhereInput[]
    id?: StringFilter<"Membership"> | string
    userId?: StringFilter<"Membership"> | string
    orgId?: StringFilter<"Membership"> | string
    role?: StringFilter<"Membership"> | string
    createdAt?: DateTimeFilter<"Membership"> | Date | string
  }

  export type MembershipCreateWithoutOrgInput = {
    id?: string
    role?: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutMembershipsInput
  }

  export type MembershipUncheckedCreateWithoutOrgInput = {
    id?: string
    userId: string
    role?: string
    createdAt?: Date | string
  }

  export type MembershipCreateOrConnectWithoutOrgInput = {
    where: MembershipWhereUniqueInput
    create: XOR<MembershipCreateWithoutOrgInput, MembershipUncheckedCreateWithoutOrgInput>
  }

  export type MembershipCreateManyOrgInputEnvelope = {
    data: MembershipCreateManyOrgInput | MembershipCreateManyOrgInput[]
    skipDuplicates?: boolean
  }

  export type MembershipUpsertWithWhereUniqueWithoutOrgInput = {
    where: MembershipWhereUniqueInput
    update: XOR<MembershipUpdateWithoutOrgInput, MembershipUncheckedUpdateWithoutOrgInput>
    create: XOR<MembershipCreateWithoutOrgInput, MembershipUncheckedCreateWithoutOrgInput>
  }

  export type MembershipUpdateWithWhereUniqueWithoutOrgInput = {
    where: MembershipWhereUniqueInput
    data: XOR<MembershipUpdateWithoutOrgInput, MembershipUncheckedUpdateWithoutOrgInput>
  }

  export type MembershipUpdateManyWithWhereWithoutOrgInput = {
    where: MembershipScalarWhereInput
    data: XOR<MembershipUpdateManyMutationInput, MembershipUncheckedUpdateManyWithoutOrgInput>
  }

  export type UserCreateWithoutMembershipsInput = {
    id?: string
    email: string
    name: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateWithoutMembershipsInput = {
    id?: string
    email: string
    name: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateOrConnectWithoutMembershipsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMembershipsInput, UserUncheckedCreateWithoutMembershipsInput>
  }

  export type OrganizationCreateWithoutMembershipsInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrganizationUncheckedCreateWithoutMembershipsInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrganizationCreateOrConnectWithoutMembershipsInput = {
    where: OrganizationWhereUniqueInput
    create: XOR<OrganizationCreateWithoutMembershipsInput, OrganizationUncheckedCreateWithoutMembershipsInput>
  }

  export type UserUpsertWithoutMembershipsInput = {
    update: XOR<UserUpdateWithoutMembershipsInput, UserUncheckedUpdateWithoutMembershipsInput>
    create: XOR<UserCreateWithoutMembershipsInput, UserUncheckedCreateWithoutMembershipsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMembershipsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMembershipsInput, UserUncheckedUpdateWithoutMembershipsInput>
  }

  export type UserUpdateWithoutMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganizationUpsertWithoutMembershipsInput = {
    update: XOR<OrganizationUpdateWithoutMembershipsInput, OrganizationUncheckedUpdateWithoutMembershipsInput>
    create: XOR<OrganizationCreateWithoutMembershipsInput, OrganizationUncheckedCreateWithoutMembershipsInput>
    where?: OrganizationWhereInput
  }

  export type OrganizationUpdateToOneWithWhereWithoutMembershipsInput = {
    where?: OrganizationWhereInput
    data: XOR<OrganizationUpdateWithoutMembershipsInput, OrganizationUncheckedUpdateWithoutMembershipsInput>
  }

  export type OrganizationUpdateWithoutMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganizationUncheckedUpdateWithoutMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MembershipCreateManyUserInput = {
    id?: string
    orgId: string
    role?: string
    createdAt?: Date | string
  }

  export type MembershipUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    org?: OrganizationUpdateOneRequiredWithoutMembershipsNestedInput
  }

  export type MembershipUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MembershipUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MembershipCreateManyOrgInput = {
    id?: string
    userId: string
    role?: string
    createdAt?: Date | string
  }

  export type MembershipUpdateWithoutOrgInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMembershipsNestedInput
  }

  export type MembershipUncheckedUpdateWithoutOrgInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MembershipUncheckedUpdateManyWithoutOrgInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}