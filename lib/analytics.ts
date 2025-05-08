// Google Analytics event tracking utility
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
};

// Common event names
export const GA_EVENTS = {
  // Form interactions
  FORM_SUBMIT: 'form_submit',
  FORM_ERROR: 'form_error',
  FORM_FIELD_FOCUS: 'form_field_focus',
  
  // Configurator interactions
  CONFIGURATOR_STEP_CHANGE: 'configurator_step_change',
  CONFIGURATOR_COLOR_CHANGE: 'configurator_color_change',
  CONFIGURATOR_LOGO_UPLOAD: 'configurator_logo_upload',
  CONFIGURATOR_WEBSITE_ENTER: 'configurator_website_enter',
  
  // Navigation
  NAVIGATION_CLICK: 'navigation_click',
  SECTION_VIEW: 'section_view',
  
  // Feature interactions
  FEATURE_CLICK: 'feature_click',
  FEATURE_VIEW: 'feature_view',
  
  // Social media
  SOCIAL_LINK_CLICK: 'social_link_click',
  
  // Privacy policy
  PRIVACY_POLICY_VIEW: 'privacy_policy_view',
} as const; 