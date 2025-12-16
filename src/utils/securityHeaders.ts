/**
 * Configuration des Headers de Sécurité et CSP
 * Protection XSS et sécurité des contenus
 */

// Configuration CSP (Content Security Policy) stricte
export const CSP_CONFIG = {
  // Directive par défaut : deny everything
  defaultSrc: ["'self'"],
  
  // Scripts : seulement depuis notre origine et les sources autorisées
  scriptSrc: [
    "'self'",
    "'unsafe-inline'", // Pour React en développement
    "'unsafe-eval'", // Pour React en développement
    "https://cdn.jsdelivr.net",
    "https://unpkg.com"
  ],
  
  // Styles : seulement depuis notre origine
  styleSrc: [
    "'self'",
    "'unsafe-inline'", // Pour Tailwind CSS
    "https://fonts.googleapis.com"
  ],
  
  // Images : depuis notre origine et sources de données
  imgSrc: [
    "'self'",
    "data:",
    "blob:",
    "https:",
    "http:"
  ],
  
  // Fonts : depuis Google Fonts
  fontSrc: [
    "'self'",
    "https://fonts.gstatic.com",
    "data:"
  ],
  
  // Connexions : APIs autorisées
  connectSrc: [
    "'self'",
    "https://api.kbv-lyon.fr",
    "wss:",
    "https:",
    "http:"
  ],
  
  // Frames : interdits sauf nos propres domaines
  frameSrc: ["'none'"],
  
  // Objects : complètement interdits
  objectSrc: ["'none'"],
  
  // Media : audio/vidéo
  mediaSrc: [
    "'self'",
    "blob:",
    "data:"
  ],
  
  // Worker : seulement nos workers
  workerSrc: [
    "'self'",
    "blob:"
  ],
  
  // Manifests
  manifestSrc: ["'self'"],
  
  // Base URI
  baseUri: ["'self'"],
  
  // Form action
  formAction: ["'self'"],
  
  // Frame ancestors
  frameAncestors: ["'none'"]
};

// Fonction pour générer la directive CSP
function generateCSPDirective(): string {
  const directives: string[] = [];
  
  for (const [key, value] of Object.entries(CSP_CONFIG)) {
    const directiveName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    
    if (Array.isArray(value) && value.length > 0) {
      directives.push(`${directiveName} ${value.join(' ')}`);
    } else if (typeof value === 'string') {
      directives.push(`${directiveName} ${value}`);
    }
  }
  
  return directives.join('; ');
}

// Headers de sécurité complets
export const SECURITY_HEADERS = {
  // Content Security Policy
  'Content-Security-Policy': generateCSPDirective(),
  
  // Protection XSS
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  
  // Protection MIME sniffing
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy
  'Permissions-Policy': [
    'accelerometer=()',
    'camera=()',
    'geolocation=()',
    'gyroscope=()',
    'magnetometer=()',
    'microphone=()',
    'payment=()',
    'usb=()'
  ].join(', '),
  
  // Cross-Origin Policies
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin'
};

// Fonction pour appliquer les headers côté client (pour les requêtes fetch)
export function applySecurityHeadersToRequest(request: Request): Request {
  const headers = new Headers(request.headers);
  
  // Ajouter des headers de sécurité pour les requêtes sortantes
  headers.set('X-Requested-With', 'XMLHttpRequest');
  headers.set('X-Content-Type-Options', 'nosniff');
  
  return new Request(request.url, {
    method: request.method,
    headers,
    body: request.body,
    mode: request.mode,
    credentials: request.credentials,
    cache: request.cache,
    redirect: request.redirect,
    referrer: request.referrer,
    referrerPolicy: request.referrerPolicy,
    integrity: request.integrity,
    keepalive: request.keepalive,
    signal: request.signal
  });
}

// Middleware pour les réponses sécurisées
export function createSecureResponse(data: any, options: {
  status?: number;
  headers?: Record<string, string>;
  contentType?: string;
} = {}): Response {
  const {
    status = 200,
    headers = {},
    contentType = 'application/json'
  } = options;
  
  const responseHeaders = new Headers(headers);
  
  // Appliquer les headers de sécurité
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    responseHeaders.set(name, value);
  }
  
  // Headers spécifiques pour les réponses API
  responseHeaders.set('Content-Type', contentType);
  responseHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  responseHeaders.set('Pragma', 'no-cache');
  responseHeaders.set('Expires', '0');
  
  return new Response(
    typeof data === 'string' ? data : JSON.stringify(data),
    {
      status,
      headers: responseHeaders
    }
  );
}

// Validation des entrées utilisateur pour XSS
export function validateAndSanitizeInput(input: string, options: {
  allowHtml?: boolean;
  maxLength?: number;
  allowedTags?: string[];
} = {}): string {
  const {
    allowHtml = false,
    maxLength = 1000,
    allowedTags = []
  } = options;
  
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  
  // Tronquer la longueur maximale
  let sanitized = input.slice(0, maxLength);
  
  if (!allowHtml) {
    // Supprimer toutes les balises HTML et les caractères dangereux
    sanitized = sanitized
      .replace(/<[^>]*>/g, '') // Supprimer les balises HTML
      .replace(/javascript:/gi, '') // Supprimer les protocoles JavaScript
      .replace(/on\w+=/gi, '') // Supprimer les event handlers
      .replace(/data:/gi, '') // Supprimer les data URIs
      .replace(/vbscript:/gi, '') // Supprimer les protocoles VBScript
      .replace(/file:/gi, ''); // Supprimer les protocoles file
  } else {
    // HTML allowed - validation stricte des balises autorisées
    const tagPattern = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/gi;
    sanitized = sanitized.replace(tagPattern, (match, tagName) => {
      if (allowedTags.includes(tagName.toLowerCase())) {
        // Pour les balises autorisées, supprimer les attributs dangereux
        return match.replace(/\son\w+="[^"]*"/gi, '').replace(/\son\w+='[^']*'/gi, '');
      }
      return '';
    });
  }
  
  return sanitized.trim();
}

// Validation des URLs pour éviter les redirections malveillantes
export function validateSecureUrl(url: string, allowedDomains: string[] = []): boolean {
  try {
    const urlObj = new URL(url);
    
    // Vérifier le protocole
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Vérifier les domaines autorisés si spécifiés
    if (allowedDomains.length > 0) {
      const isAllowed = allowedDomains.some(domain => 
        urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
      );
      if (!isAllowed) {
        return false;
      }
    }
    
    // Vérifier les caractères dangereux dans l'URL
    const dangerousChars = /[<>"'{}|\\^`[\]]/;
    if (dangerousChars.test(url)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

// Validation des fichiers uploadés
export function validateUploadedFile(file: File, options: {
  maxSize?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
} = {}): { valid: boolean; error?: string } {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB par défaut
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
  } = options;
  
  // Vérifier la taille
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB`
    };
  }
  
  // Vérifier le type MIME
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`
    };
  }
  
  // Vérifier l'extension
  const fileName = file.name.toLowerCase();
  const hasAllowedExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
  if (!hasAllowedExtension) {
    return {
      valid: false,
      error: `File extension is not allowed`
    };
  }
  
  return { valid: true };
}

// Configuration pour l'environnement de développement
export const DEV_SECURITY_CONFIG = {
  ...CSP_CONFIG,
  scriptSrc: [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "http://localhost:*",
    "http://127.0.0.1:*",
    "https://cdn.jsdelivr.net",
    "https://unpkg.com"
  ]
};

// Export des configurations
export default {
  CSP_CONFIG,
  SECURITY_HEADERS,
  generateCSPDirective,
  applySecurityHeadersToRequest,
  createSecureResponse,
  validateAndSanitizeInput,
  validateSecureUrl,
  validateUploadedFile,
  DEV_SECURITY_CONFIG
};
