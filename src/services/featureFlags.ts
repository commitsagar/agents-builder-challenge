/**
 * OmniCommerce Feature Flags Configuration
 * Controls gradual rollout and A/B test toggles for new discovery & basket features.
 */

export interface FeatureFlags {
  enableFrequentlyBoughtTogether: boolean;
  enableMissionBaskets: boolean;
  enableConsumptionReorder: boolean;
  enableUnmetDemandTracking: boolean;
  rankingAlgorithm: 'incremental_uplift' | 'popularity';
  explorationShare: number; // e.g. 0.10 (10% exploration slots)
  minSupportThreshold: number; // e.g. 0.005 (or 50 co-orders)
  minLiftThreshold: number; // e.g. 1.5
}

const STORAGE_KEY = 'omnicommerce_feature_flags';

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  enableFrequentlyBoughtTogether: true,
  enableMissionBaskets: true,
  enableConsumptionReorder: true,
  enableUnmetDemandTracking: true,
  rankingAlgorithm: 'incremental_uplift',
  explorationShare: 0.10,
  minSupportThreshold: 0.0025,
  minLiftThreshold: 1.5
};

export class FeatureFlagService {
  private static instance: FeatureFlagService;
  private flags: FeatureFlags;

  private constructor() {
    this.flags = this.loadFlags();
  }

  public static getInstance(): FeatureFlagService {
    if (!FeatureFlagService.instance) {
      FeatureFlagService.instance = new FeatureFlagService();
    }
    return FeatureFlagService.instance;
  }

  private loadFlags(): FeatureFlags {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return { ...DEFAULT_FEATURE_FLAGS, ...JSON.parse(stored) };
        }
      }
    } catch (e) {
      console.warn('Could not read feature flags from storage', e);
    }
    return { ...DEFAULT_FEATURE_FLAGS };
  }

  public getFlags(): FeatureFlags {
    return { ...this.flags };
  }

  public setFlags(updated: Partial<FeatureFlags>): void {
    this.flags = { ...this.flags, ...updated };
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.flags));
        window.dispatchEvent(new CustomEvent('omnicommerce_flags_updated', { detail: this.flags }));
      }
    } catch (e) {
      console.warn('Could not save feature flags', e);
    }
  }

  public resetDefaults(): void {
    this.flags = { ...DEFAULT_FEATURE_FLAGS };
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(STORAGE_KEY);
        window.dispatchEvent(new CustomEvent('omnicommerce_flags_updated', { detail: this.flags }));
      }
    } catch (e) {
      console.warn('Could not reset feature flags', e);
    }
  }
}

export const featureFlagService = FeatureFlagService.getInstance();
