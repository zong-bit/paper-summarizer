export const DOMAIN_PROMPTS: Record<string, string> = {
  cs:
    'Focus on: Algorithm efficiency, Architecture design, Novelty, Experimental results.',
  biology:
    'Focus on: Experimental methodology, Biological mechanisms, Statistical significance.',
  medicine:
    'Focus on: Clinical outcomes, Safety, Dosage, Medical terminology.',
  general:
    'Provide a clear, concise summary suitable for general academic audience.',
}

export function getDomainPrompt(domain: string): string {
  return DOMAIN_PROMPTS[domain.toLowerCase()] || DOMAIN_PROMPTS.general
}
