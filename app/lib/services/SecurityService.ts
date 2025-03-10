import { api } from '../api';
import * as crypto from 'crypto-js';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface MFAConfig {
  enabled: boolean;
  type: 'sms' | 'email' | 'authenticator';
  verified: boolean;
}

export interface BackupConfig {
  frequency: 'daily' | 'weekly';
  retention: number; // days
  encryptionEnabled: boolean;
}

export interface IPWhitelistEntry {
  id: string;
  ipAddress: string;
  description: string;
  createdAt: string;
  expiresAt?: string;
}

export interface RateLimitPolicy {
  enabled: boolean;
  maxAttempts: number;
  timeWindow: number; // minutes
  blockDuration: number; // minutes
}

export interface NetworkPolicy {
  ipWhitelisting: {
    enabled: boolean;
    allowDefaultAccess: boolean; // if false, only whitelisted IPs can access
    entries: IPWhitelistEntry[];
  };
  rateLimiting: {
    login: RateLimitPolicy;
    api: RateLimitPolicy;
    mfa: RateLimitPolicy;
  };
  geofencing: {
    enabled: boolean;
    allowedCountries: string[];
    blockTorNodes: boolean;
    blockVPNs: boolean;
  };
}

export interface SecurityPolicy {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxAge: number; // days
    preventReuse: number; // number of previous passwords to check
  };
  sessionPolicy: {
    maxDuration: number; // minutes
    inactivityTimeout: number; // minutes
    maxConcurrentSessions: number;
  };
  mfaPolicy: {
    required: boolean;
    allowedTypes: MFAConfig['type'][];
    rememberDevice: boolean;
    rememberDuration: number; // days
  };
  backupPolicy: {
    minFrequency: BackupConfig['frequency'];
    minRetention: number; // days
    requireEncryption: boolean;
  };
  networkPolicy: NetworkPolicy;
  dataRetentionPolicy: {
    auditLogs: number; // days
    backups: number; // days
    userSessions: number; // days
    activityLogs: number; // days
  };
  incidentResponse: {
    automaticLockout: boolean;
    notifyAdmins: boolean;
    lockoutThreshold: number;
    automaticRecoveryAfter: number; // minutes
  };
}

export interface SessionInfo {
  id: string;
  userId: string;
  deviceInfo: string;
  lastActivity: string;
  expiresAt: string;
  mfaVerified: boolean;
}

export interface SecurityMetrics extends BaseSecurityMetrics {
  networkMetrics: {
    blockedIPs: number;
    rateLimitBreaches: number;
    geoblocked: number;
    uniqueCountries: number;
  };
  complianceMetrics: {
    gdprCompliance: number; // percentage
    hipaaCompliance: number;
    soxCompliance: number;
    openFindings: number;
  };
  vulnerabilityMetrics: {
    criticalVulnerabilities: number;
    highVulnerabilities: number;
    mediumVulnerabilities: number;
    averageTimeToFix: number; // hours
  };
}

// WAF Configuration
export interface WAFRule {
  id: string;
  name: string;
  type: 'custom' | 'owasp' | 'rate-limit' | 'geo' | 'ip';
  action: 'block' | 'challenge' | 'log' | 'bypass';
  priority: number;
  conditions: Array<{
    field: string;
    operator: string;
    value: string;
  }>;
  enabled: boolean;
}

export interface WAFConfig {
  enabled: boolean;
  mode: 'detection' | 'prevention';
  rules: WAFRule[];
  customRules: WAFRule[];
  sensitiveDataTypes: string[];
  rulesets: {
    owasp: boolean;
    emerging: boolean;
    custom: boolean;
  };
}

// DDoS Protection
export interface DDoSConfig {
  enabled: boolean;
  autoScale: boolean;
  thresholds: {
    requestRate: number; // requests per second
    burstSize: number;
    connectionRate: number;
  };
  mitigation: {
    autoBlacklist: boolean;
    challengePage: boolean;
    rateLimit: boolean;
    geoBlocking: boolean;
  };
  protectedResources: Array<{
    type: 'endpoint' | 'domain' | 'ip';
    value: string;
    customRules: any[];
  }>;
}

// SSL/TLS Management
export interface CertificateInfo {
  id: string;
  domain: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  status: 'active' | 'expired' | 'revoked';
  autoRenew: boolean;
  lastRenewal?: string;
}

export interface TLSConfig {
  minVersion: 'TLS1.2' | 'TLS1.3';
  preferredCiphers: string[];
  certificates: CertificateInfo[];
  hsts: {
    enabled: boolean;
    maxAge: number;
    includeSubdomains: boolean;
    preload: boolean;
  };
}

// Security Headers
export interface SecurityHeaders {
  csp: {
    enabled: boolean;
    directives: Record<string, string[]>;
    reportOnly: boolean;
    reportUri?: string;
  };
  xFrameOptions: 'DENY' | 'SAMEORIGIN' | string;
  xContentTypeOptions: 'nosniff';
  referrerPolicy: string;
  permissionsPolicy: Record<string, string[]>;
  customHeaders: Record<string, string>;
}

// Enhanced Threat Intelligence
export interface MLThreatDetection {
  enabled: boolean;
  models: Array<{
    id: string;
    type: 'anomaly' | 'classification' | 'pattern';
    target: 'traffic' | 'logs' | 'behavior';
    confidence: number;
    lastTraining: string;
    performance: {
      accuracy: number;
      falsePositives: number;
      falseNegatives: number;
    };
  }>;
  autoResponse: {
    enabled: boolean;
    actions: Array<{
      trigger: string;
      condition: string;
      action: string;
      priority: number;
    }>;
  };
}

// Additional Compliance Frameworks
export interface ComplianceFramework {
  id: string;
  name: string;
  version: string;
  controls: Array<{
    id: string;
    category: string;
    requirement: string;
    status: 'compliant' | 'non-compliant' | 'partial' | 'not-applicable';
    evidence: string[];
    lastAssessment: string;
    remediationPlan?: string;
  }>;
  assessments: Array<{
    id: string;
    date: string;
    type: 'internal' | 'external';
    findings: Array<{
      controlId: string;
      severity: string;
      description: string;
      remediation: string;
    }>;
  }>;
}

// API Security
export interface APISecurityConfig {
  authentication: {
    type: 'jwt' | 'oauth2' | 'apikey';
    settings: Record<string, any>;
  };
  rateLimit: {
    enabled: boolean;
    requestsPerMinute: number;
    burstSize: number;
  };
  endpoints: Array<{
    path: string;
    methods: string[];
    security: {
      authentication: boolean;
      rateLimit?: number;
      roles: string[];
    };
  }>;
  monitoring: {
    enabled: boolean;
    metrics: string[];
    alerts: Array<{
      metric: string;
      threshold: number;
      action: string;
    }>;
  };
}

// Mobile Device Management
export interface MDMConfig {
  required: boolean;
  policies: {
    screenLock: boolean;
    minimumOSVersion: Record<string, string>;
    encryptionRequired: boolean;
    allowedApps: string[];
    vpnRequired: boolean;
  };
  compliance: {
    checkFrequency: number;
    actionOnNonCompliance: 'block' | 'warn' | 'report';
  };
}

// Cloud Security
export interface CloudSecurityConfig {
  providers: Array<{
    name: 'aws' | 'azure' | 'gcp';
    enabled: boolean;
    monitoring: {
      enabled: boolean;
      metrics: string[];
      alerts: any[];
    };
    compliance: {
      frameworks: string[];
      automatedChecks: boolean;
    };
    backup: {
      enabled: boolean;
      frequency: string;
      retention: number;
    };
  }>;
  policies: {
    encryption: {
      atRest: boolean;
      inTransit: boolean;
      keyRotation: number;
    };
    access: {
      reviewFrequency: number;
      requireMFA: boolean;
      maxPermissions: string;
    };
  };
}

// Data Classification
export interface DataClassification {
  levels: Array<{
    id: string;
    name: string;
    description: string;
    handling: string[];
    retention: number;
    encryption: boolean;
  }>;
  rules: Array<{
    pattern: string;
    level: string;
    action: string;
  }>;
  scanning: {
    frequency: string;
    locations: string[];
    automated: boolean;
  };
}

export class SecurityService {
  private static readonly ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-fallback-key';
  private static readonly TOKEN_KEY = '@auth_token';
  private static readonly MFA_KEY = '@mfa_status';
  private static readonly SESSION_KEY = '@session_info';
  private static readonly DEVICE_ID_KEY = '@device_id';
  private static readonly SECURITY_POLICY_KEY = '@security_policy';

  // Authentication
  static async login(email: string, password: string): Promise<{ token: string; requiresMFA: boolean }> {
    const response = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem(this.TOKEN_KEY, response.data.token);
    return response.data;
  }

  static async verifyMFA(code: string): Promise<boolean> {
    const response = await api.post('/auth/mfa/verify', { code });
    if (response.data.verified) {
      await AsyncStorage.setItem(this.MFA_KEY, 'verified');
    }
    return response.data.verified;
  }

  static async setupMFA(type: MFAConfig['type']): Promise<{ secret?: string; qrCode?: string }> {
    const response = await api.post('/auth/mfa/setup', { type });
    return response.data;
  }

  // Authorization
  static async getUserRole(userId: string): Promise<UserRole> {
    const response = await api.get(`/users/${userId}/role`);
    return response.data;
  }

  static async hasPermission(userId: string, resource: string, action: string): Promise<boolean> {
    const response = await api.get('/auth/check-permission', {
      params: { userId, resource, action },
    });
    return response.data.hasPermission;
  }

  // Data Encryption
  static encryptData(data: string): string {
    return crypto.AES.encrypt(data, this.ENCRYPTION_KEY).toString();
  }

  static decryptData(encryptedData: string): string {
    const bytes = crypto.AES.decrypt(encryptedData, this.ENCRYPTION_KEY);
    return bytes.toString(crypto.enc.Utf8);
  }

  static async encryptFile(fileData: ArrayBuffer): Promise<ArrayBuffer> {
    const wordArray = crypto.lib.WordArray.create(fileData);
    const encrypted = crypto.AES.encrypt(wordArray, this.ENCRYPTION_KEY);
    return Buffer.from(encrypted.toString());
  }

  // Backup Management
  static async configureBackups(config: BackupConfig): Promise<void> {
    await api.post('/system/backups/configure', config);
  }

  static async initiateBackup(): Promise<{ backupId: string }> {
    const response = await api.post('/system/backups/create');
    return response.data;
  }

  static async restoreFromBackup(backupId: string): Promise<{ status: string }> {
    const response = await api.post(`/system/backups/${backupId}/restore`);
    return response.data;
  }

  static async getBackupsList(): Promise<Array<{
    id: string;
    timestamp: string;
    size: number;
    status: 'completed' | 'failed';
  }>> {
    const response = await api.get('/system/backups');
    return response.data;
  }

  // Security Utilities
  static async validatePassword(password: string): Promise<{
    isValid: boolean;
    requirements: string[];
  }> {
    const requirements = [
      password.length >= 12,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];

    return {
      isValid: requirements.every(Boolean),
      requirements: [
        'Minimum 12 characters',
        'At least one uppercase letter',
        'At least one lowercase letter',
        'At least one number',
        'At least one special character',
      ].filter((_, index) => !requirements[index]),
    };
  }

  static async rotateEncryptionKeys(): Promise<void> {
    await api.post('/system/security/rotate-keys');
  }

  static async getSecurityAuditLog(): Promise<Array<{
    timestamp: string;
    action: string;
    userId: string;
    resource: string;
    status: 'success' | 'failure';
  }>> {
    const response = await api.get('/system/security/audit-log');
    return response.data;
  }

  // Session Management
  static async startSession(userId: string): Promise<SessionInfo> {
    const deviceId = await this.getOrCreateDeviceId();
    const deviceInfo = `${Platform.OS} ${Platform.Version}`;
    
    const response = await api.post('/auth/sessions/start', {
      userId,
      deviceId,
      deviceInfo,
    });
    
    const session = response.data;
    await AsyncStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    return session;
  }

  static async validateSession(): Promise<boolean> {
    try {
      const sessionJson = await AsyncStorage.getItem(this.SESSION_KEY);
      if (!sessionJson) return false;

      const session: SessionInfo = JSON.parse(sessionJson);
      if (new Date(session.expiresAt) < new Date()) {
        await this.endSession(session.id);
        return false;
      }

      await this.updateSessionActivity(session.id);
      return true;
    } catch {
      return false;
    }
  }

  static async updateSessionActivity(sessionId: string): Promise<void> {
    await api.post(`/auth/sessions/${sessionId}/activity`);
  }

  static async endSession(sessionId: string): Promise<void> {
    await api.post(`/auth/sessions/${sessionId}/end`);
    await AsyncStorage.removeItem(this.SESSION_KEY);
  }

  static async endAllOtherSessions(): Promise<void> {
    const sessionJson = await AsyncStorage.getItem(this.SESSION_KEY);
    if (!sessionJson) return;

    const currentSession: SessionInfo = JSON.parse(sessionJson);
    await api.post('/auth/sessions/end-others', { currentSessionId: currentSession.id });
  }

  // Security Policies
  static async getSecurityPolicy(): Promise<SecurityPolicy> {
    const response = await api.get('/system/security/policy');
    await AsyncStorage.setItem(this.SECURITY_POLICY_KEY, JSON.stringify(response.data));
    return response.data;
  }

  static async updateSecurityPolicy(policy: Partial<SecurityPolicy>): Promise<SecurityPolicy> {
    const response = await api.patch('/system/security/policy', policy);
    await AsyncStorage.setItem(this.SECURITY_POLICY_KEY, JSON.stringify(response.data));
    return response.data;
  }

  // Enhanced Password Management
  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const validation = await this.validatePassword(newPassword);
    if (!validation.isValid) {
      throw new Error(`Password does not meet requirements: ${validation.requirements.join(', ')}`);
    }

    await api.post('/auth/change-password', {
      currentPassword: this.encryptData(currentPassword),
      newPassword: this.encryptData(newPassword),
    });
  }

  static async initiatePasswordReset(email: string): Promise<void> {
    await api.post('/auth/reset-password/initiate', { email });
  }

  static async completePasswordReset(token: string, newPassword: string): Promise<void> {
    const validation = await this.validatePassword(newPassword);
    if (!validation.isValid) {
      throw new Error(`Password does not meet requirements: ${validation.requirements.join(', ')}`);
    }

    await api.post('/auth/reset-password/complete', {
      token,
      newPassword: this.encryptData(newPassword),
    });
  }

  // Device Management
  private static async getOrCreateDeviceId(): Promise<string> {
    let deviceId = await AsyncStorage.getItem(this.DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = crypto.lib.WordArray.random(16).toString();
      await AsyncStorage.setItem(this.DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
  }

  static async getTrustedDevices(): Promise<Array<{
    id: string;
    deviceInfo: string;
    lastActivity: string;
    isCurrent: boolean;
  }>> {
    const response = await api.get('/auth/devices/trusted');
    return response.data;
  }

  static async removeTrustedDevice(deviceId: string): Promise<void> {
    await api.delete(`/auth/devices/trusted/${deviceId}`);
  }

  // Compliance and Reporting
  static async generateComplianceReport(type: 'gdpr' | 'hipaa' | 'sox'): Promise<{
    url: string;
    expiresAt: string;
  }> {
    const response = await api.post('/system/compliance/report', { type });
    return response.data;
  }

  static async getSecurityMetrics(): Promise<{
    failedLoginAttempts: number;
    mfaAdoption: number;
    averagePasswordStrength: number;
    activeSessionsCount: number;
    incidentCount: number;
  }> {
    const response = await api.get('/system/security/metrics');
    return response.data;
  }

  // IP Whitelisting
  static async getIPWhitelist(): Promise<IPWhitelistEntry[]> {
    const response = await api.get('/system/security/ip-whitelist');
    return response.data;
  }

  static async addIPToWhitelist(entry: Omit<IPWhitelistEntry, 'id' | 'createdAt'>): Promise<IPWhitelistEntry> {
    const response = await api.post('/system/security/ip-whitelist', entry);
    return response.data;
  }

  static async removeIPFromWhitelist(id: string): Promise<void> {
    await api.delete(`/system/security/ip-whitelist/${id}`);
  }

  // Rate Limiting
  static async getRateLimitStatus(type: keyof NetworkPolicy['rateLimiting']): Promise<{
    remaining: number;
    resetAt: string;
    isBlocked: boolean;
  }> {
    const response = await api.get(`/system/security/rate-limit/${type}`);
    return response.data;
  }

  static async unblockIP(ip: string): Promise<void> {
    await api.post('/system/security/unblock-ip', { ip });
  }

  // Enhanced Security Metrics
  static async getDetailedSecurityMetrics(): Promise<SecurityMetrics> {
    const response = await api.get('/system/security/detailed-metrics');
    return response.data;
  }

  static async getVulnerabilityScan(): Promise<{
    lastScan: string;
    findings: Array<{
      id: string;
      severity: 'critical' | 'high' | 'medium' | 'low';
      description: string;
      affectedComponent: string;
      remediation: string;
    }>;
  }> {
    const response = await api.get('/system/security/vulnerability-scan');
    return response.data;
  }

  // Enhanced Compliance Reporting
  static async getComplianceStatus(): Promise<{
    gdpr: {
      compliant: boolean;
      findings: string[];
      lastAssessment: string;
      nextAssessment: string;
    };
    hipaa: {
      compliant: boolean;
      findings: string[];
      lastAssessment: string;
      nextAssessment: string;
    };
    sox: {
      compliant: boolean;
      findings: string[];
      lastAssessment: string;
      nextAssessment: string;
    };
  }> {
    const response = await api.get('/system/compliance/status');
    return response.data;
  }

  static async scheduleComplianceAssessment(type: 'gdpr' | 'hipaa' | 'sox'): Promise<{
    scheduledDate: string;
    estimatedDuration: string;
  }> {
    const response = await api.post('/system/compliance/schedule-assessment', { type });
    return response.data;
  }

  // Incident Response
  static async getSecurityIncidents(
    severity?: 'critical' | 'high' | 'medium' | 'low',
    status?: 'open' | 'investigating' | 'resolved'
  ): Promise<Array<{
    id: string;
    timestamp: string;
    type: string;
    severity: string;
    description: string;
    status: string;
    affectedUsers: number;
    resolution?: string;
  }>> {
    const response = await api.get('/system/security/incidents', {
      params: { severity, status },
    });
    return response.data;
  }

  static async updateIncidentStatus(
    incidentId: string,
    status: 'investigating' | 'resolved',
    resolution?: string
  ): Promise<void> {
    await api.patch(`/system/security/incidents/${incidentId}`, {
      status,
      resolution,
    });
  }

  // Threat Intelligence
  static async getThreatIntelligence(): Promise<{
    knownThreats: Array<{
      type: string;
      indicator: string;
      confidence: number;
      lastSeen: string;
    }>;
    activeBlocks: Array<{
      ip: string;
      reason: string;
      blockedSince: string;
    }>;
    recentAttacks: Array<{
      timestamp: string;
      type: string;
      source: string;
      target: string;
    }>;
  }> {
    const response = await api.get('/system/security/threat-intelligence');
    return response.data;
  }

  // WAF Management
  static async getWAFConfig(): Promise<WAFConfig> {
    const response = await api.get('/system/security/waf/config');
    return response.data;
  }

  static async updateWAFRule(rule: WAFRule): Promise<WAFRule> {
    const response = await api.put(`/system/security/waf/rules/${rule.id}`, rule);
    return response.data;
  }

  static async getWAFEvents(timeRange: { start: string; end: string }): Promise<Array<{
    timestamp: string;
    rule: string;
    action: string;
    request: any;
    details: any;
  }>> {
    const response = await api.get('/system/security/waf/events', { params: timeRange });
    return response.data;
  }

  // DDoS Protection
  static async getDDoSConfig(): Promise<DDoSConfig> {
    const response = await api.get('/system/security/ddos/config');
    return response.data;
  }

  static async updateDDoSConfig(config: Partial<DDoSConfig>): Promise<DDoSConfig> {
    const response = await api.patch('/system/security/ddos/config', config);
    return response.data;
  }

  static async getDDoSMetrics(): Promise<{
    currentRate: number;
    blockedRequests: number;
    mitigationActions: any[];
  }> {
    const response = await api.get('/system/security/ddos/metrics');
    return response.data;
  }

  // SSL/TLS Management
  static async getCertificates(): Promise<CertificateInfo[]> {
    const response = await api.get('/system/security/certificates');
    return response.data;
  }

  static async uploadCertificate(cert: {
    domain: string;
    certificate: string;
    privateKey: string;
  }): Promise<CertificateInfo> {
    const response = await api.post('/system/security/certificates', cert);
    return response.data;
  }

  static async renewCertificate(id: string): Promise<CertificateInfo> {
    const response = await api.post(`/system/security/certificates/${id}/renew`);
    return response.data;
  }

  // Security Headers
  static async getSecurityHeaders(): Promise<SecurityHeaders> {
    const response = await api.get('/system/security/headers');
    return response.data;
  }

  static async updateSecurityHeaders(headers: Partial<SecurityHeaders>): Promise<SecurityHeaders> {
    const response = await api.patch('/system/security/headers', headers);
    return response.data;
  }

  // Enhanced Threat Intelligence
  static async getMLDetectionConfig(): Promise<MLThreatDetection> {
    const response = await api.get('/system/security/ml-detection');
    return response.data;
  }

  static async trainMLModel(modelId: string): Promise<{
    status: string;
    estimatedCompletion: string;
  }> {
    const response = await api.post(`/system/security/ml-detection/${modelId}/train`);
    return response.data;
  }

  static async getThreatsCorrelation(timeRange: { start: string; end: string }): Promise<{
    clusters: Array<{
      id: string;
      threats: string[];
      confidence: number;
      impact: number;
      relatedIncidents: string[];
    }>;
    timeline: Array<{
      timestamp: string;
      events: any[];
    }>;
  }> {
    const response = await api.get('/system/security/threats/correlation', {
      params: timeRange,
    });
    return response.data;
  }

  // Compliance Management
  static async getComplianceFramework(
    framework: 'pci-dss' | 'iso-27001' | 'nist' | string
  ): Promise<ComplianceFramework> {
    const response = await api.get(`/system/compliance/frameworks/${framework}`);
    return response.data;
  }

  static async scheduleComplianceAssessment(
    framework: string,
    type: 'internal' | 'external'
  ): Promise<{
    id: string;
    scheduledDate: string;
    estimatedDuration: string;
  }> {
    const response = await api.post('/system/compliance/assessments', {
      framework,
      type,
    });
    return response.data;
  }

  // API Security
  static async getAPISecurityConfig(): Promise<APISecurityConfig> {
    const response = await api.get('/system/security/api');
    return response.data;
  }

  static async updateAPISecurityConfig(config: Partial<APISecurityConfig>): Promise<APISecurityConfig> {
    const response = await api.patch('/system/security/api', config);
    return response.data;
  }

  // Mobile Device Management
  static async getMDMConfig(): Promise<MDMConfig> {
    const response = await api.get('/system/security/mdm');
    return response.data;
  }

  static async updateMDMConfig(config: Partial<MDMConfig>): Promise<MDMConfig> {
    const response = await api.patch('/system/security/mdm', config);
    return response.data;
  }

  // Cloud Security
  static async getCloudSecurityConfig(): Promise<CloudSecurityConfig> {
    const response = await api.get('/system/security/cloud');
    return response.data;
  }

  static async updateCloudSecurityConfig(
    config: Partial<CloudSecurityConfig>
  ): Promise<CloudSecurityConfig> {
    const response = await api.patch('/system/security/cloud', config);
    return response.data;
  }

  // Data Classification
  static async getDataClassification(): Promise<DataClassification> {
    const response = await api.get('/system/security/data-classification');
    return response.data;
  }

  static async updateDataClassification(
    config: Partial<DataClassification>
  ): Promise<DataClassification> {
    const response = await api.patch('/system/security/data-classification', config);
    return response.data;
  }

  static async scanForSensitiveData(location: string): Promise<{
    findings: Array<{
      location: string;
      classification: string;
      confidence: number;
      context: string;
    }>;
    summary: {
      totalFiles: number;
      classifiedFiles: number;
      byLevel: Record<string, number>;
    };
  }> {
    const response = await api.post('/system/security/data-classification/scan', {
      location,
    });
    return response.data;
  }
} 