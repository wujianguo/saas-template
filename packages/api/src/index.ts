// ─── Existing hello types ────────────────────────────────────────────────────

export interface HelloResponse {
  message: string
}

export const HELLO_MESSAGE = "Hello World!"

// ─── User & Session ───────────────────────────────────────────────────────────

export interface UserResponse {
  id: string
  name: string
  email: string
  image?: string | null
  emailVerified: boolean
  createdAt: Date
}

export interface SessionResponse {
  id: string
  userId: string
  expiresAt: Date
  ipAddress?: string | null
  userAgent?: string | null
}

// ─── Organization ─────────────────────────────────────────────────────────────

export interface OrganizationResponse {
  id: string
  name: string
  slug: string
  logo?: string | null
  metadata?: Record<string, unknown> | null
  createdAt: Date
}

export interface MemberResponse {
  id: string
  userId: string
  organizationId: string
  role: string
  user?: UserResponse
}

export interface InvitationResponse {
  id: string
  email: string
  organizationId: string
  role: string
  status: string
  expiresAt?: Date | null
  createdAt: Date
}

// ─── Teams ────────────────────────────────────────────────────────────────────

export interface TeamResponse {
  id: string
  name: string
  organizationId: string
  createdAt: Date
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export interface ProjectResponse {
  id: string
  name: string
  slug: string
  description?: string | null
  organizationId: string
  createdAt: Date
  updatedAt: Date
}

// ─── API Keys ─────────────────────────────────────────────────────────────────

export interface ApiKeyResponse {
  id: string
  name?: string | null
  start?: string | null
  prefix?: string | null
  configId: string
  enabled: boolean
  permissions?: Record<string, string[]> | null
  metadata?: Record<string, unknown> | null
  expiresAt?: Date | null
  createdAt: Date
  lastRequest?: Date | null
}

/** Returned only on creation — includes the full secret key */
export interface ApiKeyCreatedResponse extends ApiKeyResponse {
  key: string
}

// ─── Generic ──────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface ErrorResponse {
  statusCode: number
  message: string | string[]
  error: string
}
