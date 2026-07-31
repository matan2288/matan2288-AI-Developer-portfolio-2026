import { CommentItem } from '../types';

export const INITIAL_COMMENTS: Record<string, CommentItem[]> = {
  'e-commerce-telecom-buyflows': [
    {
      id: 'c1',
      postId: 'e-commerce-telecom-buyflows',
      authorName: 'David Vance',
      authorRole: 'Lead Architect @ TelcoGlobal',
      avatarUrl: 'https://picsum.photos/seed/david/150/150',
      content: 'Decoupling cart state with normalized entity stores made a huge difference in our own multi-carrier checkout! How did you handle eSIM activation timeouts during peak credit check traffic?',
      createdAt: '2 days ago',
      likes: 8,
      userLiked: false,
      parentId: null
    },
    {
      id: 'c1-r1',
      postId: 'e-commerce-telecom-buyflows',
      authorName: 'Matan Elmaliah',
      authorRole: 'Author · Fullstack Specialist',
      avatarUrl: 'https://picsum.photos/seed/matandev/200/200',
      content: 'Thanks David! We implemented optimistic UI polling with exponential backoff on the eSIM provision saga. If the carrier gateway took longer than 4.5s, we persisted a tokenized session and allowed the user to complete payment while background activation finished.',
      createdAt: '1 day ago',
      likes: 12,
      userLiked: false,
      parentId: 'c1'
    },
    {
      id: 'c2',
      postId: 'e-commerce-telecom-buyflows',
      authorName: 'Elena Rostova',
      authorRole: 'Senior Frontend Engineer',
      avatarUrl: 'https://picsum.photos/seed/elena/150/150',
      content: 'The 18% cart abandonment reduction is impressive. Great breakdown on avoiding state bloat during third-party callbacks.',
      createdAt: '3 days ago',
      likes: 5,
      userLiked: false,
      parentId: null
    }
  ],
  'gtm-datalayers-adobe-analytics': [
    {
      id: 'c3',
      postId: 'gtm-datalayers-adobe-analytics',
      authorName: 'Marcus Thorne',
      authorRole: 'Data Engineering Lead',
      avatarUrl: 'https://picsum.photos/seed/marcus/150/150',
      content: 'Strongly typed dataLayers are such a lifesaver when marketing teams keep adding new event tags. We adopted a similar TypeScript payload interface last quarter and schema error rates dropped to near zero.',
      createdAt: '4 days ago',
      likes: 9,
      userLiked: false,
      parentId: null
    }
  ],
  'navy-diving-technician-to-frontend': [
    {
      id: 'c4',
      postId: 'navy-diving-technician-to-frontend',
      authorName: 'Sarah Jenkins',
      authorRole: 'Engineering Manager',
      avatarUrl: 'https://picsum.photos/seed/sarah/150/150',
      content: 'Inspiring journey! The mindset shift from hardware safety protocols to software reliability is spot on.',
      createdAt: '1 week ago',
      likes: 14,
      userLiked: false,
      parentId: null
    }
  ]
};
