// quizzes.js — trip quiz data. Add a new object to QUIZZES to add a new trip.
// pinIcon can be an emoji (placeholder) or swapped for an <img> path later
// by changing pinImage to a real file path, e.g. "assets/pins/singapore.png".
// Set comingSoon: true to show a teaser card that links to a "coming soon"
// page instead of the live quiz. Flip it to false (and fill in questions)
// when you're ready to launch.

const QUIZZES = [
  {
    id: "singapore-2026",
    title: "Singapore",
    location: "EDITION 01",
    pinName: "Singapore Pin",
    pinIcon: "\u{1F1F8}\u{1F1EC}",
    pinImage: null, // swap in your real pin image path when ready, e.g. "assets/pins/singapore.png"
    comingSoon: true,
    teaserCopy: "Coming Soon",
    questions: [
      // Add real questions here once you're ready to launch, e.g.:
      // {
      //   q: "Question text?",
      //   options: ["Option A", "Option B", "Option C", "Option D"],
      //   correct: 0,
      // },
    ],
  },

  // Add the next trip here, e.g.:
  // {
  //   id: "japan-2025",
  //   title: "Japan, Spring 2025",
  //   location: "Tokyo \u2192 Kyoto \u2192 Osaka",
  //   pinName: "Sakura Pin",
  //   pinIcon: "\u{1F338}",
  //   pinImage: null,
  //   comingSoon: false,
  //   questions: [ ... ],
  // },
];