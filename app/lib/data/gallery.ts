import type { GalleryItem } from '@/lib/types';

export const GALLERY: GalleryItem[] = [
  {
    src: 'https://media.api.com/images/public/6af95e639c10712cfccdaffc/132f87024_generated_5ca68e15.png',
    alt: 'Close view of two judoka gripping gi lapel and sleeve',
    caption: 'Kumi-kata, the first lesson of the term',
    category: 'Mat work',
    year: '2026',
  },
  {
    src: 'https://media.api.com/images/public/6af95e639c10712cfccdaffc/1ea126a4b_generated_image.png',
    alt: 'Two UBa judo athletes mid-throw on the tatami',
    caption: 'Uchi-mata in Friday randori',
    category: 'Mat work',
    year: '2026',
  },
  {
    src: 'https://media.api.com/images/public/6af95e639c10712cfccdaffc/56a6dffe6_generated_image.png',
    alt: 'Two judoka bowing to each other at the edge of the mat',
    caption: 'Rei-ho before the first session',
    category: 'Community',
    year: '2026',
  },
  {
    src: 'https://media.api.com/images/public/6af95e639c10712cfccdaffc/76a22fdc0_generated_image.png',
    alt: 'Judo athletes in ne-waza groundwork on the tatami',
    caption: 'Pinning practice in the green belt block',
    category: 'Mat work',
    year: '2026',
  },
  {
    src: 'https://media.api.com/images/public/6af95e639c10712cfccdaffc/8c50b5d9d_generated_image.png',
    alt: 'A coach tying a white belt on a new athlete',
    caption: 'A first white belt, tied by Coach Ngwa',
    category: 'Community',
    year: '2026',
  },
  {
    src: 'https://media.api.com/images/public/6af95e639c10712cfccdaffc/f542e0b8e_generated_image.png',
    alt: 'University judo squad standing in gis with medals',
    caption: 'The squad that travelled to the North West championship',
    category: 'Competition',
    year: '2025',
  },
  {
    src: 'https://media.api.com/images/public/6af95e639c10712cfccdaffc/b769b68a9_generated_image.png',
    alt: 'Hands tying a judo belt into a knot',
    caption: 'Belt and gi checked before grading',
    category: 'Training',
    year: '2025',
  },
  {
    src: 'https://media.api.com/images/public/6af95e639c10712cfccdaffc/ddaa1c1ad_generated_image.png',
    alt: 'UBa Campus Amphi 100 with tatami laid out before training',
    caption: 'Amphi 100, twenty minutes before training',
    category: 'Training',
    year: '2025',
  },
];

export const GALLERY_FILTERS = ['All', 'Mat work', 'Training', 'Competition', 'Community'] as const;