// Entry point for webpack
// This file is required by webpack but since this is a static site,
// we'll keep it minimal and just import any global styles or scripts

import I18n from './i18n.js';

console.log('ArtaleDB - Static site loaded');

// Initialize internationalization
let i18n;

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Initializing i18n system...');
  i18n = new I18n();
  
  // Make i18n globally available
  window.artaleI18n = i18n;
  
  console.log('i18n system initialized');
});

// Handle browser back/forward navigation
window.addEventListener('popstate', () => {
  if (i18n) {
    i18n.setLanguageFromUrl();
    i18n.applyTranslations();
  }
});
