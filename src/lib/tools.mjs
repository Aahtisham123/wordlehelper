// Cards used in "More Wordle tools" sections across the site.
export const TOOLS = {
  helper: { href: "/", label: "Wordle Helper", text: "Enter your colors and see every possible answer, ranked." },
  guesser: { href: "/wordle-guesser/", label: "Wordle Guesser", text: "Find the next guess that eliminates the most words." },
  finder: { href: "/5-letter-word-finder/", label: "5 Letter Word Finder", text: "Search by known letters, starts with, ends with or contains." },
  dictionary: { href: "/wordle-dictionary/", label: "Wordle Dictionary", text: "Check whether a word is valid in Wordle." },
  list: { href: "/wordle-word-list/", label: "Wordle Word List", text: "Every likely answer and valid guess on one page." },
  unscrambler: { href: "/wordle-unscrambler/", label: "Wordle Unscrambler", text: "Turn a jumble of letters into real words." },
  unlimited: { href: "/wordle-unlimited-solver/", label: "Wordle Unlimited Solver", text: "Solve unlimited and practice games with the full dictionary." },
  three: { href: "/3-letter-wordle-solver/", label: "3 Letter Wordle Solver", text: "For three-letter Wordle variants." },
  four: { href: "/4-letter-wordle-solver/", label: "4 Letter Wordle Solver", text: "For four-letter Wordle variants." },
  six: { href: "/6-letter-wordle-solver/", label: "6 Letter Wordle Solver", text: "For six-letter Wordle variants." },
  seven: { href: "/7-letter-wordle-solver/", label: "7 Letter Wordle Solver", text: "For seven-letter Wordle variants." },
  hint: { href: "/wordle-hint-today/", label: "Today's Wordle Hint", text: "Spoiler-free clues for today's puzzle." },
  answers: { href: "/wordle-answers/", label: "Past Wordle Answers", text: "The archive of previous Wordle solutions." },
  words: { href: "/5-letter-words/", label: "5 Letter Word Lists", text: "Words starting with, ending in or containing any letter." },
  starters: { href: "/guides/best-wordle-starting-words/", label: "Best Starting Words", text: "Openers ranked by how much they reveal." },
  tips: { href: "/guides/wordle-tips-strategy/", label: "Wordle Tips & Strategy", text: "Habits that win more games in fewer guesses." },
};

export const pick = (...keys) => keys.map((k) => TOOLS[k]);
