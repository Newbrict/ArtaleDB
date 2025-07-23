// Internationalization module for ArtaleDB
class I18n {
  constructor() {
    this.currentLanguage = 'ko'; // Default to Korean
    this.translations = {};
    this.fallbackLanguage = 'ko';
    this.itemMappings = null;
    
    this.init();
  }

  async init() {
    // Load item mappings from existing mapping.json
    try {
      const response = await fetch('/mapping.json');
      this.itemMappings = await response.json();
    } catch (error) {
      console.warn('Could not load item mappings:', error);
    }

    // Load translations
    await this.loadTranslations();
    
    // Set initial language from URL or localStorage
    this.setLanguageFromUrl();
    
    // Apply translations to the page
    this.applyTranslations();
  }

  async loadTranslations() {
    // Define translations for UI elements based on exact content
    this.translations = {
      ko: {
        // Meta
        'site.title': '아르테일 데이터베이스',
        'site.lang': 'ko',
        
        // Header
        'header.logo': '아르테일 데이터베이스',
        'header.language.switch': 'English',
        'header.language.url': '/en/index.html',
        
        // Hero section
        'hero.title': '아르테일 데이터베이스',
        'hero.subtitle': '아르테일에 대한 정보를 한눈에!',
        'hero.button1': '몬스터/아이템 검색',
        'hero.button2': '스킬트리/추천 사냥터',
        'hero.button3': '경험치 계산기',
        'hero.button4': '퀘스트 정보',
        'hero.button4.url': 'https://docs.google.com/spreadsheets/d/18CYTe4L__6fRjkdCqaFvKjmWcirw3N38AVe7XexnWCw/edit#gid=1500442038',
        
        // Features section
        'feature1.title': '몬스터/아이템 검색',
        'feature1.description': '몬스터의 상세 정보와, 드랍 아이템 등을 검색합니다.',
        'feature1.button': '검색하기',
        
        'feature2.title': '스킬트리/추천 사냥터',
        'feature2.description': '직업별 추천 스킬트리와 레벨별 추천 사냥터 정보를 알 수 있습니다.',
        'feature2.button': '확인하기',
        
        'feature3.title': '경험치 계산기',
        'feature3.description': '몇 시간 사냥하면 레벨업이 가능한지 알 수 있는 계산기입니다.',
        'feature3.button': '계산하기',
        
        'feature4.title': '퀘스트 정보',
        'feature4.description': '아르테일에 존재하는 퀘스트의 요구조건 및 보상을 확인할 수 있습니다.',
        'feature4.button': '확인하기',
        'feature4.url': 'https://docs.google.com/spreadsheets/d/18CYTe4L__6fRjkdCqaFvKjmWcirw3N38AVe7XexnWCw/edit#gid=1500442038',
        
        // Footer
        'footer.copyright': '&copy; 2025 아르테일 데이터베이스. All rights reserved. 이 사이트에 사용된 모든 이미지, 정보 등의 지적 자산은 해당 소유자의 자산이며, 정보 제공 목적으로 공정 사용에 따라 사용됩니다.',
        'footer.terms': '서비스 약관',
        'footer.support': '제작자 커피 한잔 사주기',
        'footer.thanks': '도움주신분들:'
      },
      
      en: {
        // Meta
        'site.title': 'Artale Database',
        'site.lang': 'en',
        
        // Header
        'header.logo': 'Artale Database',
        'header.language.switch': 'Korean',
        'header.language.url': '/',
        
        // Hero section
        'hero.title': 'Artale Database',
        'hero.subtitle': 'See at a glance information about Artale!',
        'hero.button1': 'Search Monster / Item',
        'hero.button2': 'Recommand Skill Tree/Levelling Field',
        'hero.button3': 'EXP Calculator',
        'hero.button4': 'requests / suggestions',
        'hero.button4.url': 'https://forms.gle/vSSUpEobAo9u6bx69',
        
        // Features section
        'feature1.title': 'Search Monster / Item',
        'feature1.description': 'Search for monster details, drop items, etc.',
        'feature1.button': 'Search',
        
        'feature2.title': 'Recommand Skill Tree / Levelling Field',
        'feature2.description': 'You can find out recommended skill trees by job and information on recommended hunting sites by level.',
        'feature2.button': 'Check',
        
        'feature3.title': 'EXP Calculator',
        'feature3.description': 'It\'s a calculator that can tell if you can level up after hours of hunting.',
        'feature3.button': 'computation',
        
        'feature4.title': 'Requests / Suggestions',
        'feature4.description': 'Have you noticed any errors in the database? Let us know this way!',
        'feature4.button': 'Report',
        'feature4.url': 'https://forms.gle/vSSUpEobAo9u6bx69',
        
        // Footer
        'footer.copyright': '&copy; 2025 Artale Database. All rights reserved. All intellectual property of images, information, etc. used on this site are the property of the owner and are used in accordance with fair use for informational purposes.',
        'footer.terms': 'Terms of Service',
        'footer.support': 'Buy the producer a cup of coffee',
        'footer.thanks': 'Thanks to:'
      }
    };
  }

  setLanguageFromUrl() {
    const path = window.location.pathname;
    if (path.startsWith('/en')) {
      this.currentLanguage = 'en';
    } else {
      this.currentLanguage = 'ko';
    }
    
    // Store preference
    localStorage.setItem('artaledb-language', this.currentLanguage);
  }

  switchLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('artaledb-language', lang);
    
    // Update URL without page reload for better local development
    const newPath = lang === 'en' ? '/en' : '/';
    history.pushState(null, '', newPath);
    
    // Apply translations immediately
    this.applyTranslations();
  }

  translate(key, fallback = null) {
    const translation = this.translations[this.currentLanguage]?.[key] || 
                       this.translations[this.fallbackLanguage]?.[key] || 
                       fallback || 
                       key;
    return translation;
  }

  translateItem(itemName) {
    if (!this.itemMappings) return itemName;
    
    if (this.currentLanguage === 'en') {
      // Find Korean to English mapping
      const mapping = this.itemMappings.find(item => item.name_kr === itemName);
      return mapping ? mapping.name_en : itemName;
    } else {
      // Find English to Korean mapping
      const mapping = this.itemMappings.find(item => item.name_en === itemName);
      return mapping ? mapping.name_kr : itemName;
    }
  }

  applyTranslations() {
    // Update elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.translate(key);
      
      if (element.getAttribute('data-i18n-html') !== null) {
        element.innerHTML = translation;
      } else {
        element.textContent = translation;
      }
    });

    // Update elements with data-i18n-href attributes
    document.querySelectorAll('[data-i18n-href]').forEach(element => {
      const key = element.getAttribute('data-i18n-href');
      const url = this.translate(key);
      element.href = url;
    });

    // Update page title and lang
    document.title = this.translate('site.title');
    document.documentElement.lang = this.translate('site.lang');

    // Update language switch button
    const langButton = document.querySelector('.language-switch .lang-button');
    if (langButton) {
      langButton.textContent = this.translate('header.language.switch');
      langButton.onclick = (e) => {
        e.preventDefault();
        this.switchLanguage(this.currentLanguage === 'ko' ? 'en' : 'ko');
      };
    }
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }
}

// Export for use in other modules
window.I18n = I18n;
export default I18n;
