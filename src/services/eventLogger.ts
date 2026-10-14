/**
 * OmniCommerce Privacy-Safe Event Logger
 * Implements recommendation telemetry, holdout experiment assignment, and unmet demand tracking.
 */

export interface ExperimentAssignment {
  experimentId: string;
  variant: 'treatment' | 'holdout';
  userId: string;
}

export interface RecommendationTelemetryEvent {
  eventType: 'impression' | 'click' | 'add_to_cart' | 'remove_from_cart' | 'purchase';
  sku: string;
  anchorSku?: string;
  surface: 'pdp_bundle' | 'cart_bundle' | 'mission_builder' | 'b2b_reorder';
  experimentId: string;
  variant: 'treatment' | 'holdout';
  rankingMode: 'incremental_uplift' | 'popularity';
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface UnmetDemandRecord {
  id: string;
  queryOrSku: string;
  accountId?: string;
  accountName?: string;
  type: 'zero_result_search' | 'product_request' | 'b2b_custom_sku';
  notes?: string;
  requestedAt: string;
}

const TELEMETRY_STORAGE_KEY = 'omnicommerce_telemetry_events';
const UNMET_DEMAND_STORAGE_KEY = 'omnicommerce_unmet_demand';

export class EventLogger {
  private static instance: EventLogger;

  public static getInstance(): EventLogger {
    if (!EventLogger.instance) {
      EventLogger.instance = new EventLogger();
    }
    return EventLogger.instance;
  }

  /**
   * Deterministic A/B Holdout Assignment
   * Returns consistent variant based on user/session hash (default 80% treatment, 20% holdout).
   */
  public getExperimentAssignment(userId: string, experimentId = 'EXP_BASKET_DISCOVERY_V1'): ExperimentAssignment {
    let hash = 0;
    const combined = `${userId}_${experimentId}`;
    for (let i = 0; i < combined.length; i++) {
      hash = (hash << 5) - hash + combined.charCodeAt(i);
      hash |= 0;
    }
    const bucket = Math.abs(hash) % 100;
    const variant: 'treatment' | 'holdout' = bucket < 20 ? 'holdout' : 'treatment';
    return { experimentId, variant, userId };
  }

  public logEvent(event: Omit<RecommendationTelemetryEvent, 'timestamp'>): void {
    const fullEvent: RecommendationTelemetryEvent = {
      ...event,
      timestamp: new Date().toISOString()
    };
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const existing: RecommendationTelemetryEvent[] = JSON.parse(
          localStorage.getItem(TELEMETRY_STORAGE_KEY) || '[]'
        );
        // Keep last 1,000 events
        existing.unshift(fullEvent);
        if (existing.length > 1000) existing.pop();
        localStorage.setItem(TELEMETRY_STORAGE_KEY, JSON.stringify(existing));
      }
    } catch (e) {
      console.warn('Could not record telemetry event', e);
    }
  }

  public logUnmetDemand(record: Omit<UnmetDemandRecord, 'id' | 'requestedAt'>): UnmetDemandRecord {
    const fullRecord: UnmetDemandRecord = {
      ...record,
      id: `DEMAND-${Math.floor(1000 + Math.random() * 9000)}`,
      requestedAt: new Date().toISOString()
    };
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const existing: UnmetDemandRecord[] = JSON.parse(
          localStorage.getItem(UNMET_DEMAND_STORAGE_KEY) || '[]'
        );
        existing.unshift(fullRecord);
        localStorage.setItem(UNMET_DEMAND_STORAGE_KEY, JSON.stringify(existing));
      }
    } catch (e) {
      console.warn('Could not record unmet demand', e);
    }
    return fullRecord;
  }

  public getUnmetDemandRecords(): UnmetDemandRecord[] {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return JSON.parse(localStorage.getItem(UNMET_DEMAND_STORAGE_KEY) || '[]');
      }
    } catch (e) {
      console.warn('Could not fetch unmet demand records', e);
    }
    return [];
  }

  public getTelemetryMetrics() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const events: RecommendationTelemetryEvent[] = JSON.parse(
          localStorage.getItem(TELEMETRY_STORAGE_KEY) || '[]'
        );
        const impressions = events.filter(e => e.eventType === 'impression').length;
        const clicks = events.filter(e => e.eventType === 'click').length;
        const adds = events.filter(e => e.eventType === 'add_to_cart').length;
        const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
        const attachRate = impressions > 0 ? (adds / impressions) * 100 : 0;
        return { impressions, clicks, adds, ctr, attachRate };
      }
    } catch (e) {
      console.warn('Could not calculate metrics', e);
    }
    return { impressions: 0, clicks: 0, adds: 0, ctr: 0, attachRate: 0 };
  }
}

export const eventLogger = EventLogger.getInstance();
