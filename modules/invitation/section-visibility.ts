import type { InvitationSections } from '@/modules/templates/types';

export function isInvitationSectionVisible(
  sections: InvitationSections | undefined,
  key: keyof InvitationSections,
): boolean {
  return sections?.[key] !== false;
}
