import { IntegrationService } from '../integrations/IntegrationService';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  isRTL: boolean;
  isEnabled: boolean;
}

export interface Translation {
  key: string;
  language: string;
  value: string;
  context?: string;
  tags?: string[];
  lastUpdated: Date;
}

export interface TranslationNamespace {
  id: string;
  name: string;
  description?: string;
  translations: Record<string, Record<string, string>>;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', isRTL: false, isEnabled: true },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', isRTL: false, isEnabled: true },
  { code: 'tw', name: 'Twi', nativeName: 'Twi', isRTL: false, isEnabled: true },
  { code: 'ft', name: 'Fante', nativeName: 'Fante', isRTL: false, isEnabled: true },
  { code: 'ga', name: 'Ga', nativeName: 'Ga', isRTL: false, isEnabled: true },
  { code: 'ee', name: 'Ewe', nativeName: 'Eʋegbe', isRTL: false, isEnabled: true },
  { code: 'dag', name: 'Dagbani', nativeName: 'Dagbani', isRTL: false, isEnabled: true },
];

export class LanguageService extends IntegrationService {
  private currentLanguage: string = 'en';
  private fallbackLanguage: string = 'en';
  private loadedNamespaces: Map<string, TranslationNamespace> = new Map();

  async initialize(): Promise<void> {
    if (!this.validateConfig()) {
      throw new Error('Invalid language service configuration');
    }
    await this.loadTranslations();
  }

  validateConfig(): boolean {
    return true;
  }

  async setLanguage(languageCode: string): Promise<void> {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode);
    if (!language) {
      throw new Error(`Language ${languageCode} is not supported`);
    }
    if (!language.isEnabled) {
      throw new Error(`Language ${languageCode} is not enabled`);
    }
    this.currentLanguage = languageCode;
    await this.loadTranslations();
  }

  getCurrentLanguage(): Language {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === this.currentLanguage)!;
  }

  getSupportedLanguages(): Language[] {
    return SUPPORTED_LANGUAGES.filter(lang => lang.isEnabled);
  }

  translate(key: string, namespace: string = 'common', variables?: Record<string, string>): string {
    const ns = this.loadedNamespaces.get(namespace);
    if (!ns) {
      console.warn(`Translation namespace ${namespace} not found`);
      return key;
    }

    const translations = ns.translations[this.currentLanguage] || ns.translations[this.fallbackLanguage];
    if (!translations) {
      console.warn(`No translations found for language ${this.currentLanguage}`);
      return key;
    }

    let value = translations[key];
    if (!value) {
      console.warn(`Translation key ${key} not found in namespace ${namespace}`);
      return key;
    }

    if (variables) {
      Object.entries(variables).forEach(([varKey, varValue]) => {
        value = value.replace(new RegExp(`{{${varKey}}}`, 'g'), varValue);
      });
    }

    return value;
  }

  async addTranslation(data: Omit<Translation, 'lastUpdated'>): Promise<Translation> {
    return this.handleRequest(
      (async () => {
        const translation: Translation = {
          ...data,
          lastUpdated: new Date(),
        };
        await this.loadTranslations(); // Reload translations
        return translation;
      })(),
      'Failed to add translation'
    );
  }

  async createNamespace(data: Omit<TranslationNamespace, 'id'>): Promise<TranslationNamespace> {
    return this.handleRequest(
      (async () => {
        const namespace: TranslationNamespace = {
          id: `ns_${Date.now()}`,
          ...data,
        };
        this.loadedNamespaces.set(namespace.name, namespace);
        return namespace;
      })(),
      'Failed to create translation namespace'
    );
  }

  private async loadTranslations(): Promise<void> {
    return this.handleRequest(
      (async () => {
        // Implementation would load translations from the database or files
        // For now, we'll use a simple example
        const commonNamespace: TranslationNamespace = {
          id: 'common',
          name: 'common',
          translations: {
            en: {
              welcome: 'Welcome',
              submit: 'Submit',
              cancel: 'Cancel',
            },
            ha: {
              welcome: 'Barka da zuwa',
              submit: 'Aika',
              cancel: 'Soke',
            },
            tw: {
              welcome: 'Akwaaba',
              submit: 'Fa ma',
              cancel: 'Gyae',
            },
          },
        };
        this.loadedNamespaces.set('common', commonNamespace);
      })(),
      'Failed to load translations'
    );
  }
} 