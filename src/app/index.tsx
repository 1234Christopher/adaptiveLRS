import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { useState } from "react";
import { Image, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

// System badge (save the image at assets/images/tcl-badge.png)
const BADGE = require("@/assets/images/tcl-badge.png");

// Change the current user's details here
const USER = {
  name: "Your Name",
  email: "yourname@example.com",
  role: "Student",
  id: "TCL-0001",
};
const INITIALS = USER.name.split(" ").map((w) => w[0]).join("").toUpperCase();

// Project details shown on the About tab
const ABOUT = {
  name: "TCL Adaptive Learning Recommendation System",
  tagline: "Learn · Practice · Improve",
  description:
    "TCL is an adaptive learning platform that helps students find free, legal textbooks for their course, track their reading progress, and test what they have learned with weekly quizzes. Everything is tracked on one dashboard, so students can see how they are improving and what to study next.",
  features: [
    "Free open textbooks for six courses",
    "Reading progress tracking",
    "Weekly quizzes with instant scoring",
    "Personal student dashboard",
  ],
};
const PRODUCERS = ["Christopher Divine", "Tejiri", "Lawrence"];

// Footer details: edit these to update the footer shown at the bottom of every page
const FOOTER = {
  institution: "Babcock University",
  addressLines: ["Ilishan-Remo, Ogun State,", "Nigeria."],
  mapQuery: "Babcock University, Ilishan-Remo, Ogun State, Nigeria",
  phone: "09169800924",
  email: "yourname@example.com", // change to the team's real email
  website: "https://www.babcock.edu.ng",
  websiteLabel: "www.babcock.edu.ng",
  project: "Final Year Project",
  year: new Date().getFullYear(),
};

const TABS = ["Books", "Weekly Quiz", "Continue Reading", "Student Dashboard", "Admin", "About"];

// Every book has a direct "url" to a free, legal version (open textbook,
// author's own website, or open-access publication). No sign-up or payment needed.
type Book = { title: string; author: string; url: string; source: string };

const COURSES: Record<string, Book[]> = {
  "Computer Science": [
    {
      title: "Think Python",
      author: "Allen B. Downey",
      url: "https://allendowney.github.io/ThinkPython/",
      source: "Author's website",
    },
    {
      title: "Automate the Boring Stuff with Python",
      author: "Al Sweigart",
      url: "https://automatetheboringstuff.com/",
      source: "Author's website",
    },
    {
      title: "Algorithms",
      author: "Jeff Erickson",
      url: "https://jeffe.cs.illinois.edu/teaching/algorithms/",
      source: "Author's website",
    },
  ],
  Mathematics: [
    {
      title: "Book of Proof",
      author: "Richard Hammack",
      url: "https://www.people.vcu.edu/~rhammack/BookofProof/",
      source: "Author's website",
    },
    {
      title: "Calculus Volume 1",
      author: "OpenStax",
      url: "https://openstax.org/details/books/calculus-volume-1",
      source: "OpenStax",
    },
    {
      title: "Linear Algebra Done Right",
      author: "Sheldon Axler",
      url: "https://linear.axler.net/",
      source: "Open access edition",
    },
  ],
  Physics: [
    {
      title: "University Physics Volume 1",
      author: "OpenStax",
      url: "https://openstax.org/details/books/university-physics-volume-1",
      source: "OpenStax",
    },
    {
      title: "University Physics Volume 3",
      author: "OpenStax",
      url: "https://openstax.org/details/books/university-physics-volume-3",
      source: "OpenStax",
    },
    {
      title: "The Feynman Lectures on Physics",
      author: "Feynman, Leighton & Sands",
      url: "https://www.feynmanlectures.caltech.edu/",
      source: "Caltech",
    },
  ],
  Business: [
    {
      title: "Principles of Management",
      author: "OpenStax",
      url: "https://openstax.org/details/books/principles-management",
      source: "OpenStax",
    },
    {
      title: "Principles of Marketing",
      author: "OpenStax",
      url: "https://openstax.org/details/books/principles-marketing",
      source: "OpenStax",
    },
    {
      title: "Entrepreneurship",
      author: "OpenStax",
      url: "https://openstax.org/details/books/entrepreneurship",
      source: "OpenStax",
    },
  ],
  Psychology: [
    {
      title: "Psychology 2e",
      author: "OpenStax",
      url: "https://openstax.org/details/books/psychology-2e",
      source: "OpenStax",
    },
    {
      title: "Noba Introduction to Psychology",
      author: "Noba Project",
      url: "https://nobaproject.com/",
      source: "Noba Project",
    },
    {
      title: "Cognitive Psychology and Cognitive Neuroscience",
      author: "Wikibooks contributors",
      url: "https://en.wikibooks.org/wiki/Cognitive_Psychology_and_Cognitive_Neuroscience",
      source: "Wikibooks",
    },
  ],
  Economics: [
    {
      title: "Principles of Economics 3e",
      author: "OpenStax",
      url: "https://openstax.org/details/books/principles-economics-3e",
      source: "OpenStax",
    },
    {
      title: "Principles of Microeconomics 3e",
      author: "OpenStax",
      url: "https://openstax.org/details/books/principles-microeconomics-3e",
      source: "OpenStax",
    },
    {
      title: "Principles of Macroeconomics 3e",
      author: "OpenStax",
      url: "https://openstax.org/details/books/principles-macroeconomics-3e",
      source: "OpenStax",
    },
  ],
};

// Weekly quizzes, one set per course: edit these each week
// "answer" is the position of the correct option, counting from 0
const QUIZZES: Record<string, { q: string; options: string[]; answer: number }[]> = {
  "Computer Science": [
    { q: "What does CPU stand for?", options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility"], answer: 0 },
    { q: "Which data structure works first in, first out?", options: ["Stack", "Queue", "Tree"], answer: 1 },
    { q: "Which language is mainly used to style web pages?", options: ["SQL", "Python", "CSS"], answer: 2 },
  ],
  Mathematics: [
    { q: "What is the derivative of x²?", options: ["x", "2x", "x²"], answer: 1 },
    { q: "What is the determinant of a 2x2 identity matrix?", options: ["0", "2", "1"], answer: 2 },
    { q: "What do the angles of a triangle add up to?", options: ["180°", "360°", "90°"], answer: 0 },
  ],
  Physics: [
    { q: "What is the SI unit of force?", options: ["Joule", "Newton", "Watt"], answer: 1 },
    { q: "Which law is written F = ma?", options: ["Newton's first law", "Newton's third law", "Newton's second law"], answer: 2 },
    { q: "About how fast does light travel?", options: ["3 × 10⁸ m/s", "3 × 10⁵ m/s", "3 × 10³ m/s"], answer: 0 },
  ],
  Business: [
    { q: "What does ROI stand for?", options: ["Rate of Income", "Return on Investment", "Review of Inventory"], answer: 1 },
    { q: "Which of these is NOT one of the 4 Ps of marketing?", options: ["Price", "Promotion", "Profit"], answer: 2 },
    { q: "What does a balance sheet show?", options: ["Assets, liabilities and equity", "Daily sales only", "Staff schedules"], answer: 0 },
  ],
  Psychology: [
    { q: "Who is known as the father of psychoanalysis?", options: ["Sigmund Freud", "B. F. Skinner", "Carl Rogers"], answer: 0 },
    { q: "Pavlov is linked to which kind of conditioning?", options: ["Operant", "Classical", "Social"], answer: 1 },
    { q: "Which of these is a research method in psychology?", options: ["Auditing", "Compiling", "Case study"], answer: 2 },
  ],
  Economics: [
    { q: "What does GDP stand for?", options: ["Gross Domestic Product", "General Demand Price", "Global Debt Percentage"], answer: 0 },
    { q: "If demand rises and supply stays the same, price usually...", options: ["Falls", "Rises", "Stays zero"], answer: 1 },
    { q: "What is inflation?", options: ["A fall in unemployment", "A rise in exports", "A general rise in prices"], answer: 2 },
  ],
};

// Every book with its course, used to track reading progress
const ALL_BOOKS = Object.entries(COURSES).flatMap(([course, list]) =>
  list.map((b) => ({ ...b, course }))
);

// Footer shown at the bottom of every page (horizontal layout: columns side by side)
function Footer({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const openMap = () =>
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(FOOTER.mapQuery)}`).catch(() => {});
  const call = () => Linking.openURL(`tel:${FOOTER.phone}`).catch(() => {});
  const mail = () => Linking.openURL(`mailto:${FOOTER.email}`).catch(() => {});
  const web = () => Linking.openURL(FOOTER.website).catch(() => {});

  return (
    <View style={styles.footer}>
      <View style={styles.footerRow}>
        {/* Brand */}
        <View style={styles.footerCol}>
          <Image source={BADGE} style={styles.footerLogo} resizeMode="contain" />
          <Text style={styles.footerTitle}>TCL system</Text>
          <Text style={styles.footerTagline}>{ABOUT.tagline}</Text>
        </View>

        {/* Team */}
        <View style={styles.footerCol}>
          <Text style={styles.footerHeading}>Our team</Text>
          {PRODUCERS.map((name) => (
            <Text key={name} style={styles.footerText}>
              {name}
            </Text>
          ))}
        </View>

        {/* Address */}
        <View style={styles.footerCol}>
          <Text style={styles.footerHeading}>Address</Text>
          <Pressable onPress={openMap}>
            <Text style={styles.footerText}>{FOOTER.institution}</Text>
            {FOOTER.addressLines.map((line) => (
              <Text key={line} style={styles.footerText}>
                {line}
              </Text>
            ))}
            <Text style={styles.footerLink}>Open in maps</Text>
          </Pressable>
        </View>

        {/* Contact */}
        <View style={styles.footerCol}>
          <Text style={styles.footerHeading}>Contact</Text>
          <Pressable onPress={call}>
            <Text style={styles.footerLink}>{FOOTER.phone}</Text>
          </Pressable>
          <Pressable onPress={mail}>
            <Text style={styles.footerLink}>{FOOTER.email}</Text>
          </Pressable>
          <Pressable onPress={web}>
            <Text style={styles.footerLink}>{FOOTER.websiteLabel}</Text>
          </Pressable>
        </View>

        {/* Quick links */}
        <View style={styles.footerCol}>
          <Text style={styles.footerHeading}>Quick links</Text>
          {["Books", "Weekly Quiz", "Student Dashboard", "About"].map((name) => (
            <Pressable key={name} onPress={() => onNavigate(name)}>
              <Text style={styles.footerLink}>{name}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.footerDivider} />
      <Text style={styles.footerSmall}>{FOOTER.project} · {FOOTER.institution}</Text>
      <Text style={styles.footerSmall}>
        © {FOOTER.year} TCL Adaptive Learning Recommendation System. All rights reserved.
      </Text>
    </View>
  );
}

export default function Index() {
  const [tab, setTab] = useState("Books");
  const [course, setCourse] = useState("");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [quizCourse, setQuizCourse] = useState("");
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showProfile, setShowProfile] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});

  const questions = quizCourse ? QUIZZES[quizCourse] : [];
  const score = questions.filter((q, i) => answers[i] === q.answer).length;
  const totalQuizzes = Object.keys(QUIZZES).length;
  const quizzesTaken = Object.keys(scores).length;
  const avgQuiz =
    quizzesTaken === 0
      ? null
      : Math.round(
          (Object.entries(scores).reduce((sum, [c, v]) => sum + v / QUIZZES[c].length, 0) / quizzesTaken) * 100
        );
  const totalBooks = Object.values(COURSES).reduce((sum, list) => sum + list.length, 0);

  // Reading stats come from the books the student has actually started
  const startedBooks = ALL_BOOKS.filter((b) => progress[b.title] !== undefined);
  const finishedCount = startedBooks.filter((b) => progress[b.title] >= 100).length;
  const inProgressCount = startedBooks.length - finishedCount;
  const avgProgress =
    startedBooks.length === 0
      ? null
      : Math.round(startedBooks.reduce((sum, b) => sum + progress[b.title], 0) / startedBooks.length);

  // All books link straight to a free, legal copy
  const openBook = (b: Book) => Linking.openURL(b.url).catch(() => {});
  const startBook = (b: Book) => {
    setProgress({ ...progress, [b.title]: 0 });
    openBook(b);
  };
  const addProgress = (title: string, amount: number) =>
    setProgress({ ...progress, [title]: Math.min(100, progress[title] + amount) });
  const removeBook = (title: string) => {
    const next = { ...progress };
    delete next[title];
    setProgress(next);
  };

  const openQuiz = (name: string) => {
    setQuizCourse(name);
    setAnswers({});
    setSubmitted(false);
  };
  const submitQuiz = () => {
    setSubmitted(true);
    setScores({ ...scores, [quizCourse]: score });
  };
  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <LinearGradient colors={["#1b2a41", "#324a5f"]} style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Navbar */}
      <View style={styles.navbar}>
        <View style={styles.topRow}>
          {/* System badge + name, top left */}
          <View style={styles.brand}>
            <Image source={BADGE} style={styles.logo} resizeMode="contain" />
            <Text style={styles.logoText}>TCL system</Text>
          </View>
          <Pressable style={styles.profile} onPress={() => setShowProfile(true)}>
            <Text style={styles.profileName}>{USER.name}</Text>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{INITIALS}</Text>
            </View>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {TABS.map((name) => (
            <Pressable
              key={name}
              onPress={() => setTab(name)}
              style={[styles.tab, tab === name && styles.tabActive]}
            >
              <Text style={tab === name ? styles.tabTextActive : styles.tabText}>{name}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* BOOKS */}
        {tab === "Books" && (
          <>
            <Text style={styles.title}>What are you studying?</Text>
            <View style={styles.row}>
              {Object.keys(COURSES).map((name) => (
                <Pressable
                  key={name}
                  onPress={() => setCourse(name)}
                  style={[styles.chip, course === name && styles.chipActive]}
                >
                  <Text style={course === name ? styles.chipTextActive : styles.chipText}>{name}</Text>
                </Pressable>
              ))}
            </View>
            {course === "" ? (
              <Text style={styles.hint}>Pick a course to see free books you can read right now.</Text>
            ) : (
              COURSES[course].map((book) => {
                const p = progress[book.title];
                return (
                  <View key={book.title} style={styles.card}>
                    <Text style={styles.bookTitle}>{book.title}</Text>
                    <Text style={styles.author}>{book.author}</Text>
                    <View style={styles.freeBadge}>
                      <Text style={styles.freeBadgeText}>Free to read · {book.source}</Text>
                    </View>
                    {p === undefined ? (
                      <Pressable style={styles.smallBtn} onPress={() => startBook(book)}>
                        <Text style={styles.smallBtnText}>Start reading</Text>
                      </Pressable>
                    ) : (
                      <>
                        <View style={styles.track}>
                          <View style={[styles.fill, { width: `${p}%` }]} />
                        </View>
                        <Text style={styles.author}>{p >= 100 ? "Finished" : `${p}% read`}</Text>
                        <Pressable style={styles.smallBtn} onPress={() => openBook(book)}>
                          <Text style={styles.smallBtnText}>Open book</Text>
                        </Pressable>
                      </>
                    )}
                  </View>
                );
              })
            )}
          </>
        )}

        {/* WEEKLY QUIZ */}
        {tab === "Weekly Quiz" &&
          (quizCourse === "" ? (
            <>
              <Text style={styles.title}>Weekly Quiz</Text>
              <Text style={styles.hint}>
                {quizzesTaken} of {totalQuizzes} quizzes taken. Pick a course to start.
              </Text>
              <View style={[styles.row, { marginTop: 16 }]}>
                {Object.keys(QUIZZES).map((name) => (
                  <Pressable key={name} style={styles.tile} onPress={() => openQuiz(name)}>
                    <Text style={styles.bookTitle}>{name}</Text>
                    <Text style={styles.author}>{QUIZZES[name].length} questions</Text>
                    <Text style={styles.quizStatus}>
                      {scores[name] === undefined
                        ? "Not taken"
                        : `Score: ${scores[name]}/${QUIZZES[name].length}`}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          ) : (
            <>
              <Pressable onPress={() => setQuizCourse("")}>
                <Text style={styles.back}>‹ All quizzes</Text>
              </Pressable>
              <Text style={styles.title}>{quizCourse} Quiz</Text>
              {questions.map((item, i) => (
                <View key={item.q} style={styles.card}>
                  <Text style={styles.bookTitle}>
                    {i + 1}. {item.q}
                  </Text>
                  {item.options.map((opt, j) => (
                    <Pressable
                      key={opt}
                      disabled={submitted}
                      onPress={() => setAnswers({ ...answers, [i]: j })}
                      style={[
                        styles.option,
                        answers[i] === j && styles.optionPicked,
                        submitted && j === item.answer && styles.optionRight,
                      ]}
                    >
                      <Text style={styles.optionText}>{opt}</Text>
                    </Pressable>
                  ))}
                </View>
              ))}
              {submitted ? (
                <>
                  <Text style={styles.score}>
                    You scored {score} out of {questions.length}
                  </Text>
                  <Pressable style={styles.button} onPress={resetQuiz}>
                    <Text style={styles.buttonText}>Try again</Text>
                  </Pressable>
                </>
              ) : (
                <Pressable style={styles.button} onPress={submitQuiz}>
                  <Text style={styles.buttonText}>Submit answers</Text>
                </Pressable>
              )}
            </>
          ))}

        {/* CONTINUE READING */}
        {tab === "Continue Reading" && (
          <>
            <Text style={styles.title}>Continue Reading</Text>
            {startedBooks.length === 0 ? (
              <Text style={styles.hint}>
                You have not started any books yet. Open the Books tab and tap Start reading.
              </Text>
            ) : (
              startedBooks.map((b) => {
                const p = progress[b.title];
                return (
                  <View key={b.title} style={styles.card}>
                    <Text style={styles.bookTitle}>{b.title}</Text>
                    <Text style={styles.author}>{b.course}</Text>
                    <View style={styles.track}>
                      <View style={[styles.fill, { width: `${p}%` }]} />
                    </View>
                    <Text style={styles.author}>{p >= 100 ? "Finished" : `${p}% read`}</Text>
                    <View style={styles.btnRow}>
                      <Pressable style={styles.smallBtn} onPress={() => openBook(b)}>
                        <Text style={styles.smallBtnText}>Open book</Text>
                      </Pressable>
                      {p < 100 && (
                        <>
                          <Pressable style={styles.smallBtn} onPress={() => addProgress(b.title, 10)}>
                            <Text style={styles.smallBtnText}>+10%</Text>
                          </Pressable>
                          <Pressable style={styles.smallBtn} onPress={() => addProgress(b.title, 100)}>
                            <Text style={styles.smallBtnText}>Mark finished</Text>
                          </Pressable>
                        </>
                      )}
                      <Pressable onPress={() => removeBook(b.title)}>
                        <Text style={styles.linkText}>Remove</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })
            )}
          </>
        )}

        {/* STUDENT DASHBOARD */}
        {tab === "Student Dashboard" && (
          <>
            <Text style={styles.title}>Student Dashboard</Text>
            <Text style={[styles.hint, { marginBottom: 16 }]}>Welcome, {USER.name}</Text>
            <View style={styles.row}>
              <View style={styles.tile}>
                <Text style={styles.tileNumber}>{Object.keys(COURSES).length}</Text>
                <Text style={styles.author}>Courses available</Text>
              </View>
              <View style={styles.tile}>
                <Text style={styles.tileNumber}>{startedBooks.length}</Text>
                <Text style={styles.author}>Books started</Text>
              </View>
              <View style={styles.tile}>
                <Text style={styles.tileNumber}>{finishedCount}</Text>
                <Text style={styles.author}>Books finished</Text>
              </View>
              <View style={styles.tile}>
                <Text style={styles.tileNumber}>{avgProgress === null ? "-" : `${avgProgress}%`}</Text>
                <Text style={styles.author}>Average reading progress</Text>
              </View>
              <View style={styles.tile}>
                <Text style={styles.tileNumber}>
                  {quizzesTaken}/{totalQuizzes}
                </Text>
                <Text style={styles.author}>Quizzes taken</Text>
              </View>
              <View style={styles.tile}>
                <Text style={styles.tileNumber}>{avgQuiz === null ? "-" : `${avgQuiz}%`}</Text>
                <Text style={styles.author}>Average quiz score</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Progress by course</Text>
            {Object.keys(COURSES).map((name) => {
              const list = COURSES[name];
              const started = list.filter((b) => progress[b.title] !== undefined).length;
              const done = list.filter((b) => progress[b.title] >= 100).length;
              return (
                <View key={name} style={[styles.card, styles.adminRow]}>
                  <View>
                    <Text style={styles.bookTitle}>{name}</Text>
                    <Text style={styles.author}>
                      {started} of {list.length} started, {done} finished
                    </Text>
                  </View>
                  <Text style={styles.quizStatus}>
                    {scores[name] === undefined ? "No quiz yet" : `Quiz ${scores[name]}/${QUIZZES[name].length}`}
                  </Text>
                </View>
              );
            })}
          </>
        )}

        {/* ADMIN */}
        {tab === "Admin" && (
          <>
            <Text style={styles.title}>Admin</Text>
            <View style={styles.row}>
              <View style={styles.tile}>
                <Text style={styles.tileNumber}>{Object.keys(COURSES).length}</Text>
                <Text style={styles.author}>Courses</Text>
              </View>
              <View style={styles.tile}>
                <Text style={styles.tileNumber}>{totalBooks}</Text>
                <Text style={styles.author}>Free books</Text>
              </View>
            </View>
            {Object.entries(COURSES).map(([name, list]) => (
              <View key={name} style={[styles.card, styles.adminRow]}>
                <Text style={styles.bookTitle}>{name}</Text>
                <Text style={styles.author}>{list.length} books</Text>
              </View>
            ))}
          </>
        )}

        {/* ABOUT */}
        {tab === "About" && (
          <>
            <Text style={styles.title}>About</Text>
            <View style={styles.card}>
              <View style={styles.aboutHeader}>
                <Image source={BADGE} style={styles.aboutLogo} resizeMode="contain" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.bookTitle}>{ABOUT.name}</Text>
                  <Text style={styles.author}>{ABOUT.tagline}</Text>
                </View>
              </View>
              <Text style={styles.aboutText}>{ABOUT.description}</Text>
            </View>

            <Text style={styles.sectionTitle}>What it does</Text>
            <View style={styles.card}>
              {ABOUT.features.map((f) => (
                <Text key={f} style={styles.aboutText}>
                  • {f}
                </Text>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Produced by</Text>
            <View style={styles.card}>
              {PRODUCERS.map((name) => (
                <View key={name} style={styles.producerRow}>
                  <View style={styles.producerDot}>
                    <Text style={styles.producerInitial}>{name[0]}</Text>
                  </View>
                  <Text style={styles.bookTitle}>{name}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* FOOTER (shown on every page) */}
        <Footer
          onNavigate={(name) => {
            setTab(name);
            setQuizCourse("");
          }}
        />
      </ScrollView>

      {/* Profile details */}
      <Modal
        visible={showProfile}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProfile(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setShowProfile(false)}>
          <Pressable style={styles.profileCard} onPress={() => {}}>
            <View style={styles.bigAvatar}>
              <Text style={styles.bigAvatarText}>{INITIALS}</Text>
            </View>
            <Text style={styles.profileTitle}>{USER.name}</Text>
            <Text style={styles.author}>{USER.email}</Text>
            {[
              { label: "Role", value: USER.role },
              { label: "Student ID", value: USER.id },
              { label: "Quizzes taken", value: `${quizzesTaken}/${totalQuizzes}` },
              { label: "Books in progress", value: `${inProgressCount}` },
            ].map((d) => (
              <View key={d.label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{d.label}</Text>
                <Text style={styles.detailValue}>{d.value}</Text>
              </View>
            ))}
            <Pressable style={styles.closeBtn} onPress={() => setShowProfile(false)}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#fff", marginTop: 8, marginBottom: 12 },
  smallBtn: { backgroundColor: "#1b2a41", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 6, alignSelf: "flex-start", marginTop: 12 },
  smallBtnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  btnRow: { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" },
  linkText: { color: "#9b2c2c", textDecorationLine: "underline", marginTop: 12 },
  quizStatus: { marginTop: 8, fontWeight: "bold", color: "#2f855a" },
  back: { color: "#fff", fontSize: 15, marginBottom: 12 },
  freeBadge: { alignSelf: "flex-start", backgroundColor: "#c6f6d5", borderRadius: 10, paddingVertical: 3, paddingHorizontal: 10, marginTop: 8 },
  freeBadgeText: { color: "#22543d", fontSize: 12, fontWeight: "bold" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "flex-end", paddingTop: 80, paddingHorizontal: 20 },
  profileCard: { backgroundColor: "#fff", borderRadius: 12, padding: 20, width: 290, alignItems: "center" },
  bigAvatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#1b2a41", alignItems: "center", justifyContent: "center", marginBottom: 10 },
  bigAvatarText: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  profileTitle: { fontSize: 20, fontWeight: "bold", color: "#1b2a41" },
  detailRow: { flexDirection: "row", justifyContent: "space-between", alignSelf: "stretch", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  detailLabel: { color: "#52606d" },
  detailValue: { color: "#1b2a41", fontWeight: "bold" },
  closeBtn: { backgroundColor: "#1b2a41", paddingVertical: 12, borderRadius: 8, alignSelf: "stretch", alignItems: "center", marginTop: 16 },
  closeText: { color: "#fff", fontWeight: "bold" },

  // Footer
  footer: {
    marginTop: 32,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  footerRow: { flexDirection: "row", flexWrap: "wrap", gap: 24, justifyContent: "space-between" },
  footerCol: { flexGrow: 1, flexBasis: 140, minWidth: 140 },
  footerLogo: { width: 44, height: 44, borderRadius: 22, marginBottom: 8 },
  footerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  footerTagline: { color: "#cbd5e0", fontSize: 13, marginTop: 2 },
  footerHeading: { color: "#fff", fontSize: 14, fontWeight: "bold", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 },
  footerText: { color: "#cbd5e0", fontSize: 14, lineHeight: 21 },
  footerLink: { color: "#90cdf4", fontSize: 14, lineHeight: 24, textDecorationLine: "underline" },
  footerDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.15)", marginTop: 20, marginBottom: 12 },
  footerSmall: { color: "#a0aec0", fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: 2 },

  // Compact navbar
  navbar: {
    paddingTop: 36,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.15)",
  },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 2 },
  brand: { flexDirection: "row", alignItems: "center", gap: 8 },
  logo: { width: 34, height: 34, borderRadius: 17 },
  logoText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  profile: { flexDirection: "row", alignItems: "center", gap: 8 },
  profileName: { color: "#fff", fontSize: 13 },
  avatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#1b2a41", fontWeight: "bold", fontSize: 12 },
  tab: { paddingVertical: 6, marginRight: 18, borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabActive: { borderBottomColor: "#fff" },
  tabText: { color: "#cbd5e0", fontSize: 13 },
  tabTextActive: { color: "#fff", fontSize: 13, fontWeight: "bold" },

  container: { padding: 20, flexGrow: 1 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 16, color: "#fff" },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  chip: { borderWidth: 1.5, borderColor: "#fff", borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14 },
  chipActive: { backgroundColor: "#fff" },
  chipText: { color: "#fff" },
  chipTextActive: { color: "#1b2a41", fontWeight: "bold" },
  hint: { color: "#cbd5e0" },

  card: { backgroundColor: "#fff", padding: 16, borderRadius: 8, marginBottom: 10 },
  bookTitle: { fontSize: 17, fontWeight: "bold", color: "#1b2a41" },
  author: { color: "#52606d", marginTop: 2 },

  option: { borderWidth: 1.5, borderColor: "#cbd5e0", borderRadius: 6, padding: 10, marginTop: 8 },
  optionPicked: { borderColor: "#1b2a41", backgroundColor: "#e2e8f0" },
  optionRight: { borderColor: "#2f855a", backgroundColor: "#c6f6d5" },
  optionText: { color: "#1b2a41" },
  score: { color: "#fff", fontSize: 18, fontWeight: "bold", marginVertical: 12 },
  button: { backgroundColor: "#fff", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 4 },
  buttonText: { color: "#1b2a41", fontWeight: "bold" },

  track: { height: 8, borderRadius: 4, backgroundColor: "#e2e8f0", marginTop: 10, overflow: "hidden" },
  fill: { height: 8, backgroundColor: "#2f855a" },

  tile: { backgroundColor: "#fff", borderRadius: 8, padding: 16, width: "48%" },
  tileNumber: { fontSize: 28, fontWeight: "bold", color: "#1b2a41" },
  aboutHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 },
  aboutLogo: { width: 56, height: 56, borderRadius: 28 },
  aboutText: { color: "#52606d", fontSize: 14, lineHeight: 21, marginTop: 4 },
  producerRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 6 },
  producerDot: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#1b2a41", alignItems: "center", justifyContent: "center" },
  producerInitial: { color: "#fff", fontWeight: "bold" },
  adminRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});