export function getInitials(author: string): string {
  const names = author.trim().split(/\s+/);
  return names
    .map((name) => name.charAt(0))
    .join('')
    .toUpperCase();
}

export function getReadTime(content: string): string {
  const wordsPerMinute = 200; // Average reading speed
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export function getAvatarColor(author: string): string {
  const firstLetter = author.charAt(0).toUpperCase();

  if (['A', 'B', 'C'].includes(firstLetter)) return 'bg-amber-500';
  if (['D', 'E', 'F'].includes(firstLetter)) return 'bg-blue-500';
  if (['G', 'H', 'I'].includes(firstLetter)) return 'bg-green-500';
  if (['J', 'K', 'L'].includes(firstLetter)) return 'bg-red-500';
  if (['M', 'N', 'O'].includes(firstLetter)) return 'bg-purple-500';
  if (['P', 'Q', 'R'].includes(firstLetter)) return 'bg-pink-500';
  if (['S', 'T', 'U'].includes(firstLetter)) return 'bg-indigo-500';
  if (['V', 'W', 'X', 'Y', 'Z'].includes(firstLetter)) return 'bg-teal-500';

  return 'bg-slate-900';
}
