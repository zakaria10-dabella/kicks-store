export const categories = ['All', 'Running', 'Lifestyle', 'Basketball', 'Skate']

export const lines = {
  Running: { name: 'Run Lab', blurb: 'Daily trainers and race shoes, tested on the Corniche.' },
  Lifestyle: { name: 'Heritage', blurb: 'Suede, leather and archive runners for the city.' },
  Basketball: { name: 'Court', blurb: 'Hoops silhouettes, worn on and off the derb court.' },
  Skate: { name: 'Board', blurb: 'Grippy, vulcanised and made to be scuffed at Anfa Park.' },
}

// Each product has one real photograph in /public/photos/<id>.jpg (see credits.json).
// w/h are the intrinsic pixel sizes (used for aspect boxes), pos is the focal point for square crops,
// tone tells the UI whether the photo's own background is light or dark.
export const products = [
  { id: 'atlas-runner', name: 'Atlas Runner', line: 'Run Lab', category: 'Running', price: 1290, tag: 'New', rating: 4.8, reviews: 214,
    colorway: 'Midnight / Lime', w: 1280, h: 1098, pos: '50% 55%', tone: 'light',
    description: 'A featherweight daily trainer with a responsive foam midsole, tuned for long runs along the Corniche. Knit upper, reflective heel tab.', sizes: [39, 40, 41, 42, 43, 44, 45] },
  { id: 'medina-low', name: 'Medina Low', line: 'Heritage', category: 'Lifestyle', price: 990, tag: 'Bestseller', rating: 4.9, reviews: 532,
    colorway: 'Fog / Grey', w: 1280, h: 746, pos: '45% 50%', tone: 'light',
    description: 'A suede-and-mesh archive runner in soft greys, inspired by the leather workshops of Fès. Goes with everything, gets better with every wear.', sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46] },
  { id: 'kasbah-hi', name: 'Kasbah Hi', line: 'Court', category: 'Basketball', price: 1490, tag: 'Limited', rating: 4.7, reviews: 98,
    colorway: 'Triple White', w: 1280, h: 960, pos: '58% 50%', tone: 'dark',
    description: 'Full-grain white leather, a cupsole with pivot circle and herringbone traction. Built for the court, kept clean for the street.', sizes: [40, 41, 42, 43, 44, 45, 46] },
  { id: 'corniche-sk8', name: 'Corniche SK8', line: 'Board', category: 'Skate', price: 790, rating: 4.6, reviews: 173,
    colorway: 'White / Bordeaux', w: 1280, h: 930, pos: '50% 50%', tone: 'dark',
    description: 'Leather skate shoe with a reinforced ollie zone and a rippled, grippy outsole. Made for Anfa Park sessions.', sizes: [38, 39, 40, 41, 42, 43, 44] },
  { id: 'sahara-trail', name: 'Sahara Trail', line: 'Run Lab', category: 'Running', price: 1590, tag: 'New', rating: 4.8, reviews: 61,
    colorway: 'Moss / Graphite', w: 1280, h: 926, pos: '50% 45%', tone: 'dark',
    description: 'Aggressive lugs, a rock plate and a sand-resistant collar. Built for the dunes of Merzouga and the trails of Imlil.', sizes: [39, 40, 41, 42, 43, 44, 45, 46] },
  { id: 'anfa-court', name: 'Anfa Court', line: 'Heritage', category: 'Lifestyle', price: 1090, rating: 4.7, reviews: 302,
    colorway: 'Sand / White', w: 1111, h: 1280, pos: '50% 50%', tone: 'light',
    description: 'A clean, tennis-inspired leather low in sand and white. The sneaker you will reach for every morning.', sizes: [37, 38, 39, 40, 41, 42, 43, 44, 45] },
  { id: 'derb-dunk', name: 'Derb Dunk', line: 'Court', category: 'Basketball', price: 1390, tag: 'Bestseller', rating: 4.8, reviews: 411,
    colorway: 'Chalk', w: 1280, h: 960, pos: '50% 45%', tone: 'light',
    description: 'A low hoops shoe with full-length cushioning and perforated toe box, delivered box-fresh to any derb court in the city.', sizes: [40, 41, 42, 43, 44, 45, 46] },
  { id: 'souk-slip', name: 'Souk Slip-On', line: 'Board', category: 'Skate', price: 690, rating: 4.5, reviews: 88,
    colorway: 'Mauve / Bone', w: 1233, h: 1280, pos: '55% 55%', tone: 'light',
    description: 'An elasticated tongue means the laces stay tied: slide in, roll out. Pigskin suede, padded collar and a soft, chunky sole for long afternoons in the souk.', sizes: [38, 39, 40, 41, 42, 43, 44, 45] },
  { id: 'tempo-x', name: 'Tempo X', line: 'Run Lab', category: 'Running', price: 1790, tag: 'Limited', rating: 4.9, reviews: 47,
    colorway: 'Black / Signal Red', w: 1280, h: 1037, pos: '45% 55%', tone: 'dark',
    description: 'Our fastest shoe: a waterproof upper, race-day foam and a firm heel counter for personal bests at the Casablanca Marathon.', sizes: [39, 40, 41, 42, 43, 44] },
  { id: 'rabat-retro', name: 'Rabat Retro', line: 'Heritage', category: 'Lifestyle', price: 1190, rating: 4.6, reviews: 156,
    colorway: 'Silver / Black', w: 1280, h: 785, pos: '50% 50%', tone: 'light',
    description: 'A 2000s runner silhouette brought back with metallic overlays, black accents and a chunky, comfortable midsole.', sizes: [38, 39, 40, 41, 42, 43, 44, 45] },
]

export const photo = (id) => `/photos/${id}.jpg`
export const formatMAD = (n) => `${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} MAD`
