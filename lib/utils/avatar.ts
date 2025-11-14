import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

/**
 * Genera una URL de avatar aleatorio usando DiceBear
 */
export function generateAvatarUrl(seed?: string): string {
  const avatar = createAvatar(avataaars, {
    seed: seed || Math.random().toString(36).substring(7),
    size: 128,
  });

  return avatar.toDataUri();
}

/**
 * Genera un avatar basado en el nombre del usuario (siempre el mismo para el mismo nombre)
 */
export function generateAvatarForName(name: string): string {
  return generateAvatarUrl(name);
}

