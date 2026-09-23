/**
 * Parses Spintax syntax like "{Olá|Oi|E aí} @{username}, {tudo bem?|como vai?}"
 * and returns a randomly resolved string.
 */
export function parseSpintax(text: string, variables: Record<string, string> = {}): string {
  let result = text;

  // Replace curly brace spintax groups recursively
  const spintaxRegex = /\{([^{}]+)\}/g;
  let iterations = 0;
  while (spintaxRegex.test(result) && iterations < 15) {
    result = result.replace(spintaxRegex, (_, group) => {
      const options = group.split('|');
      const randomIndex = Math.floor(Math.random() * options.length);
      return options[randomIndex] || '';
    });
    iterations++;
  }

  // Replace variable placeholders
  for (const [key, val] of Object.entries(variables)) {
    const keyRegex = new RegExp(`\\{${key}\\}`, 'gi');
    result = result.replace(keyRegex, val);
  }

  return result.trim();
}

/**
 * Generates N unique preview variations for testing spintax
 */
export function generateSpintaxPreviews(text: string, count = 4, variables: Record<string, string> = {}): string[] {
  const variations = new Set<string>();
  for (let i = 0; i < count * 3 && variations.size < count; i++) {
    variations.add(parseSpintax(text, variables));
  }
  return Array.from(variations);
}
