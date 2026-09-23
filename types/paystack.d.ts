export {};

interface PaystackCustomField {
  display_name: string;
  variable_name: string;
  value: string;
}

interface PaystackMetadata {
  signature?: string;
  custom_fields: PaystackCustomField[];
}

interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  metadata?: PaystackMetadata;
  callback: () => void;
  onClose: () => void;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => {
        openIframe: () => void;
      };
    };
  }
}
