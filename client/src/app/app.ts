import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

type BlogPost = {
  author: string;
  blogTitle: string;
  blogContent: string;
  category: string;
  readTime: string;
  publishedAt: string;
  tags: string[];
  accentClass: string;
};

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly pageTitle = 'Paper Trail';

  protected readonly stats = [
    { label: 'weekly essays', value: '12' },
    { label: 'short notes', value: '48' },
    { label: 'reading time', value: '24 min' },
  ];

  protected readonly topics = ['writing', 'product design', 'developer notes', 'bookmarks'];

  protected readonly featuredBullets = [
    'One strong idea per section, so the page stays easy to scan.',
    'Spacing, hierarchy, and contrast do the heavy lifting.',
    'No media blocks, no noise, just the writing surface.',
  ];

  protected readonly notes = [
    'Use one sharp headline and a short supporting paragraph.',
    'Keep tags short so the cards feel editorial, not noisy.',
    'Let whitespace separate the story instead of borders alone.',
  ];

  protected readonly posts: BlogPost[] = [
    {
      author: 'Ayan Ghosh',
      blogTitle: 'Writing interfaces that feel calm before they feel clever',
      blogContent:
        'A good reading layout should slow the eye down without making the page feel heavy. Start with clear hierarchy, then let whitespace and rhythm carry the rest of the experience.',
      category: 'Design System',
      readTime: '4 min read',
      publishedAt: 'Apr 13, 2026',
      tags: ['layout', 'hierarchy', 'tailwind'],
      accentClass: 'bg-amber-500',
    },
    {
      author: 'Mira Sen',
      blogTitle: 'How to structure a post when the content is the only visual',
      blogContent:
        'If there are no images to rely on, titles, meta details, and text blocks need to carry all the personality. Strong contrast and a tight reading width keep the article approachable.',
      category: 'Editorial',
      readTime: '6 min read',
      publishedAt: 'Apr 12, 2026',
      tags: ['content', 'typography', 'readability'],
      accentClass: 'bg-sky-500',
    },
    {
      author: 'Nikhil Roy',
      blogTitle: 'A practical rhythm for publishing notes every week',
      blogContent:
        'Short posts, recurring categories, and a consistent visual structure make a blog easier to maintain. The system becomes more important than a single hero post.',
      category: 'Workflow',
      readTime: '3 min read',
      publishedAt: 'Apr 10, 2026',
      tags: ['process', 'cadence', 'notes'],
      accentClass: 'bg-rose-500',
    },
  ];
}
