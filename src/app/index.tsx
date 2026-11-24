import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { COURSES, type Book } from "@/data/courses";
import { MINIMUM_QUIZ_QUESTIONS, parseQuizQuestions, type QuizQuestion } from "@/utils/quiz";

// System badge (save the image at assets/images/tcl-badge.png)
const BADGE = require("@/assets/images/tcl-badge.png");

// Change the current user's details here
const USER = {
  name: "Christopher Divine",
  email: "divinechrstopher54@gmail.com",
  role: "Student",
  id: "TCL-0001",
};
const INITIALS = USER.name.split(" ").map((w) => w[0]).join("").toUpperCase();

// Project details shown on the About tab
const ABOUT = {
  name: "TCL Adaptive Learning Recommendation System",
  tagline: "Learn · Practice · Improve",
  description:
    "TCL is an adaptive learning platform that helps students find free, legal textbooks for their course, track their reading progress, and test what they have learned with AI-generated, book-based quizzes. Everything is tracked on one dashboard, so students can see how they are improving and what to study next.",
  features: [
    "Free open textbooks for 46 courses",
    "Reading progress tracking",
    "AI-generated quizzes with at least 20 questions per course",
    "Personal student dashboard",
  ],
};
const PRODUCERS = ["Divine", "Tejiri", "Lawrence"];

// Footer details: edit these to update the footer shown at the bottom of every page
const FOOTER = {
  institution: "Babcock University",
  addressLines: ["Ilishan-Remo, Ogun State,", "Nigeria."],
  mapQuery: "Babcock University, Ilishan-Remo, Ogun State, Nigeria",
  phone: "09169800924",
  email: "divinechristopher54@gamil.com",
  website: "https://www.babcock.edu.ng",
  websiteLabel: "www.babcock.edu.ng",
  project: "Final Year Project",
  year: new Date().getFullYear(),
};

const TABS = ["Books", "Weekly Quiz", "Continue Reading", "Student Dashboard", "Admin", "About"];
const ICONS: Record<string, SymbolViewProps["name"]> = {
  Books: { ios: "book.closed.fill", android: "menu_book", web: "menu_book" },
  "Weekly Quiz": { ios: "questionmark.circle.fill", android: "quiz", web: "quiz" },
  "Continue Reading": { ios: "book.fill", android: "auto_stories", web: "auto_stories" },
  "Student Dashboard": { ios: "chart.bar.fill", android: "dashboard", web: "dashboard" },
  Admin: { ios: "gearshape.fill", android: "settings", web: "settings" },
  About: { ios: "info.circle.fill", android: "info", web: "info" },
  author: { ios: "person.fill", android: "person", web: "person" },
  course: { ios: "graduationcap.fill", android: "school", web: "school" },
  source: { ios: "link", android: "link", web: "link" },
  openBook: { ios: "arrow.up.right.square", android: "open_in_new", web: "open_in_new" },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

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
  const [showCoursePicker, setShowCoursePicker] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [quizCourse, setQuizCourse] = useState("");
  const [quizBook, setQuizBook] = useState<Book | null>(null);
  const [quizSourceUrl, setQuizSourceUrl] = useState("");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizError, setQuizError] = useState("");
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [scores, setScores] = useState<Record<string, { score: number; total: number }>>({});
  const [showProfile, setShowProfile] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});

  const questions = quizQuestions;
  const score = questions.filter((q, i) => answers[i] === q.answer).length;
  const totalQuizzes = Object.keys(COURSES).length;
  const quizzesTaken = Object.keys(scores).length;
  const avgQuiz =
    quizzesTaken === 0
      ? null
      : Math.round(
          (Object.values(scores).reduce((sum, result) => sum + result.score / result.total, 0) /
            quizzesTaken) *
            100
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
    setQuizBook(null);
    setQuizSourceUrl("");
    setQuizQuestions([]);
    setQuizError("");
    setAnswers({});
    setSubmitted(false);
  };
  const chooseQuizBook = (book: Book) => {
    setQuizBook(book);
    setQuizSourceUrl(book.url);
    setQuizQuestions([]);
    setQuizError("");
    setAnswers({});
    setSubmitted(false);
  };
  const generateQuiz = async () => {
    if (!quizBook) {
      setQuizError("Choose a book before generating a quiz.");
      return;
    }

    setIsGeneratingQuiz(true);
    setQuizError("");
    setQuizQuestions([]);
    setAnswers({});
    setSubmitted(false);

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course: quizCourse,
          bookTitle: quizBook.title,
          sourceUrl: quizSourceUrl.trim(),
        }),
      });
      let payload: unknown;
      try {
        payload = await response.json();
      } catch {
        throw new Error("The quiz service returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(
          isRecord(payload) && typeof payload.error === "string"
            ? payload.error
            : "Unable to generate a quiz. Please try again."
        );
      }
      const generatedQuestions = isRecord(payload) ? parseQuizQuestions(payload.questions) : null;
      if (!generatedQuestions) {
        throw new Error(`The quiz service must return at least ${MINIMUM_QUIZ_QUESTIONS} valid questions.`);
      }

      setQuizQuestions(generatedQuestions);
    } catch (error) {
      setQuizError(error instanceof Error ? error.message : "Unable to generate a quiz. Please try again.");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };
  const submitQuiz = () => {
    setSubmitted(true);
    setScores({ ...scores, [quizCourse]: { score, total: questions.length } });
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

      </View>

      <View style={styles.tabBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {TABS.map((name) => (
            <Pressable
              key={name}
              onPress={() => setTab(name)}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === name }}
              style={[styles.tab, tab === name && styles.tabActive]}
            >
              <SymbolView
                name={ICONS[name]}
                size={16}
                tintColor={tab === name ? "#fff" : "#cbd5e0"}
                accessible={false}
              />
              <Text style={tab === name ? styles.tabTextActive : styles.tabText}>{name}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.container}>
        {/* BOOKS */}
        {tab === "Books" && (
          <>
            <Text style={[styles.title, styles.centeredText]}>What are you studying?</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={course ? `Selected course: ${course}` : "Choose a course"}
              accessibilityHint="Opens the list of available courses"
              onPress={() => setShowCoursePicker(true)}
              style={styles.courseDropdown}
            >
              <Text style={course ? styles.courseDropdownText : styles.courseDropdownPlaceholder}>
                {course || "Choose a course"}
              </Text>
              <Text style={styles.courseDropdownArrow}>⌄</Text>
            </Pressable>
            <Text style={[styles.hint, styles.centeredText, styles.courseHint]}>
              Please choose a course of your study.
            </Text>
            {course !== "" && (
              COURSES[course].map((book) => {
                const p = progress[book.title];
                return (
                  <View key={book.title} style={[styles.card, styles.bookResourceCard]}>
                    <View style={styles.bookCardHeader}>
                      <View style={styles.bookCardDetails}>
                        <Text style={styles.bookTitle}>{book.title}</Text>
                        <Text style={styles.author}>{book.author}</Text>
                        <View style={styles.freeBadge}>
                          <Text style={styles.freeBadgeText}>Free to read · {book.source}</Text>
                        </View>
                      </View>
                      {p === undefined && (
                        <Pressable
                          style={[styles.smallBtn, styles.startReadingButton]}
                          onPress={() => startBook(book)}
                        >
                          <Text style={styles.smallBtnText}>Start reading</Text>
                        </Pressable>
                      )}
                    </View>
                    {p !== undefined && (
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
              <Text style={[styles.title, styles.centeredText]}>Weekly Quiz</Text>
              <Text style={[styles.hint, styles.centeredText]}>
                {quizzesTaken} of {totalQuizzes} courses quizzed. Choose a course, book, and chapter.
                Every generated quiz has at least {MINIMUM_QUIZ_QUESTIONS} questions.
              </Text>
              <View style={[styles.row, { marginTop: 16 }]}>
                {Object.keys(COURSES).map((name) => (
                  <Pressable key={name} style={[styles.tile, styles.quizCard]} onPress={() => openQuiz(name)}>
                    <Text style={[styles.bookTitle, styles.producerName]}>{name}</Text>
                    <Text style={styles.author}>
                      {COURSES[name].length} books · {MINIMUM_QUIZ_QUESTIONS}+ questions
                    </Text>
                    <Text style={styles.quizStatus}>
                      {scores[name] === undefined
                        ? "Not taken"
                        : `Score: ${scores[name].score}/${scores[name].total}`}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          ) : (
            <>
              <Pressable
                onPress={() => {
                  setQuizCourse("");
                  setQuizBook(null);
                  setQuizQuestions([]);
                  setQuizError("");
                  setAnswers({});
                  setSubmitted(false);
                }}
              >
                <Text style={styles.back}>‹ All quizzes</Text>
              </Pressable>
              <Text style={styles.title}>{quizCourse} Quiz</Text>
              {quizBook === null ? (
                <>
                  <Text style={styles.hint}>Choose a book to generate a quiz from its content.</Text>
                  {COURSES[quizCourse].map((book) => (
                    <View key={book.title} style={[styles.card, styles.quizCard]}>
                      <Text style={styles.bookTitle}>{book.title}</Text>
                      <Text style={styles.author}>by {book.author}</Text>
                      <Text style={styles.author}>{book.source}</Text>
                      <Pressable style={styles.smallBtn} onPress={() => chooseQuizBook(book)}>
                        <Text style={styles.smallBtnText}>Choose this book</Text>
                      </Pressable>
                    </View>
                  ))}
                </>
              ) : (
                <>
                  <Pressable
                    onPress={() => {
                      setQuizBook(null);
                      setQuizQuestions([]);
                      setQuizError("");
                      setAnswers({});
                      setSubmitted(false);
                    }}
                  >
                    <Text style={styles.back}>‹ Choose a different book</Text>
                  </Pressable>
                  <View style={[styles.card, styles.quizCard]}>
                    <Text style={styles.bookTitle}>{quizBook.title}</Text>
                    <Text style={styles.author}>by {quizBook.author}</Text>
                    <Text style={styles.fieldLabel}>Book or chapter URL</Text>
                    <TextInput
                      accessibilityLabel="Public book or chapter URL"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="url"
                      onChangeText={setQuizSourceUrl}
                      placeholder="Paste a direct public chapter or PDF URL"
                      placeholderTextColor="#718096"
                      style={styles.urlInput}
                      value={quizSourceUrl}
                    />
                    <Text style={styles.fieldHint}>
                      Use a public chapter page or PDF for best results. The quiz is generated from this URL.
                    </Text>
                    <Pressable
                      disabled={isGeneratingQuiz || quizSourceUrl.trim().length === 0}
                      accessibilityRole="button"
                      accessibilityLabel={`Generate quiz with at least ${MINIMUM_QUIZ_QUESTIONS} questions`}
                      style={[
                        styles.button,
                        (isGeneratingQuiz || quizSourceUrl.trim().length === 0) && styles.buttonDisabled,
                      ]}
                      onPress={generateQuiz}
                    >
                      {isGeneratingQuiz ? (
                        <ActivityIndicator color="#1b2a41" />
                      ) : (
                        <Text style={styles.buttonText}>Generate Quiz</Text>
                      )}
                    </Pressable>
                    {quizError !== "" && <Text style={styles.errorText}>{quizError}</Text>}
                  </View>

                  {questions.map((item, i) => (
                    <View key={`${i}-${item.q}`} style={[styles.card, styles.quizCard]}>
                      <Text style={styles.bookTitle}>
                        {i + 1}. {item.q}
                      </Text>
                      {item.options.map((opt, j) => (
                        <Pressable
                          key={`${j}-${opt}`}
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
                      {submitted && <Text style={styles.explanation}>{item.explanation}</Text>}
                    </View>
                  ))}

                  {questions.length > 0 &&
                    (submitted ? (
                      <>
                        <Text style={styles.score}>
                          You scored {score} out of {questions.length}
                        </Text>
                        <Pressable style={styles.button} onPress={resetQuiz}>
                          <Text style={styles.buttonText}>Try again</Text>
                        </Pressable>
                      </>
                    ) : (
                      <Pressable
                        disabled={Object.keys(answers).length !== questions.length}
                        style={[
                          styles.button,
                          Object.keys(answers).length !== questions.length && styles.buttonDisabled,
                        ]}
                        onPress={submitQuiz}
                      >
                        <Text style={styles.buttonText}>Submit answers</Text>
                      </Pressable>
                    ))}
                </>
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
                  <View key={b.title} style={[styles.card, styles.readingCard]}>
                    <View style={styles.readingTitleRow}>
                      <SymbolView
                        name={ICONS["Continue Reading"]}
                        size={20}
                        tintColor="#1b2a41"
                        accessible={false}
                      />
                      <Text style={styles.bookTitle}>{b.title}</Text>
                    </View>
                    <View style={styles.readingDetailRow}>
                      <SymbolView name={ICONS.author} size={16} tintColor="#52606d" accessible={false} />
                      <Text style={styles.author}>by {b.author}</Text>
                    </View>
                    <View style={styles.readingDetailRow}>
                      <SymbolView name={ICONS.course} size={16} tintColor="#52606d" accessible={false} />
                      <Text style={styles.author}>{b.course}</Text>
                    </View>
                    <View style={styles.readingDetailRow}>
                      <SymbolView name={ICONS.source} size={16} tintColor="#52606d" accessible={false} />
                      <Text style={styles.author}>{b.source}</Text>
                    </View>
                    <View style={styles.track}>
                      <View style={[styles.fill, { width: `${p}%` }]} />
                    </View>
                    <Text style={styles.author}>{p >= 100 ? "Finished" : `${p}% read`}</Text>
                    <View style={[styles.btnRow, styles.readingActions]}>
                      <Pressable style={[styles.smallBtn, styles.iconButton]} onPress={() => openBook(b)}>
                        <SymbolView
                          name={ICONS.openBook}
                          size={16}
                          tintColor="#fff"
                          accessible={false}
                        />
                        <Text style={styles.smallBtnText}>Open book</Text>
                      </Pressable>
                      {p < 100 && (
                        <Pressable style={styles.smallBtn} onPress={() => addProgress(b.title, 100)}>
                          <Text style={styles.smallBtnText}>Mark finished</Text>
                        </Pressable>
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
                    {scores[name] === undefined
                      ? "No quiz yet"
                      : `Quiz ${scores[name].score}/${scores[name].total}`}
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
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.producersRow}
              >
                {PRODUCERS.map((name) => (
                  <View key={name} style={styles.producerRow}>
                    <View style={styles.producerDot}>
                      <Text style={styles.producerInitial}>{name[0]}</Text>
                    </View>
                    <Text style={styles.bookTitle}>{name}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </>
        )}

        {/* FOOTER (shown on every page) */}
        <Footer
          onNavigate={(name) => {
            setTab(name);
            setQuizCourse("");
            setQuizBook(null);
            setQuizQuestions([]);
          }}
        />
      </ScrollView>

      <Modal
        visible={showCoursePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCoursePicker(false)}
      >
        <Pressable style={styles.coursePickerOverlay} onPress={() => setShowCoursePicker(false)}>
          <Pressable style={styles.coursePickerCard} onPress={() => {}}>
            <View style={styles.coursePickerHeader}>
              <Text style={styles.coursePickerTitle}>Choose a course</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close course list"
                onPress={() => setShowCoursePicker(false)}
                style={styles.coursePickerClose}
              >
                <Text style={styles.coursePickerCloseText}>×</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.coursePickerList}>
              {Object.keys(COURSES).map((name) => (
                <Pressable
                  key={name}
                  accessibilityRole="button"
                  accessibilityState={{ selected: course === name }}
                  onPress={() => {
                    setCourse(name);
                    setShowCoursePicker(false);
                  }}
                  style={[styles.coursePickerOption, course === name && styles.coursePickerOptionSelected]}
                >
                  <Text style={course === name ? styles.coursePickerOptionTextSelected : styles.coursePickerOptionText}>
                    {name}
                  </Text>
                  {course === name && <Text style={styles.coursePickerCheck}>Selected</Text>}
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

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
    paddingBottom: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.15)",
  },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  content: { flex: 1 },
  tabBar: {
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.15)",
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 8 },
  logo: { width: 34, height: 34, borderRadius: 17 },
  logoText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  profile: { flexDirection: "row", alignItems: "center", gap: 8 },
  profileName: { color: "#fff", fontSize: 13 },
  avatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#1b2a41", fontWeight: "bold", fontSize: 12 },
  tabsContainer: { flexDirection: "row", flexGrow: 1, justifyContent: "center", alignItems: "center", gap: 2 },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: "#fff" },
  tabText: { color: "#cbd5e0", fontSize: 11, textAlign: "center" },
  tabTextActive: { color: "#fff", fontSize: 11, fontWeight: "bold", textAlign: "center" },

  container: { padding: 20, flexGrow: 1 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 16, color: "#fff" },
  centeredText: { textAlign: "center" },
  courseHint: { marginBottom: 14, marginTop: 8 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  courseDropdown: {
    minHeight: 50,
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  courseDropdownText: { color: "#1b2a41", fontSize: 16, fontWeight: "600", flexShrink: 1 },
  courseDropdownPlaceholder: { color: "#718096", fontSize: 16 },
  courseDropdownArrow: { color: "#1b2a41", fontSize: 22, marginLeft: 12 },
  coursePickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    padding: 20,
  },
  coursePickerCard: {
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  coursePickerHeader: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  coursePickerTitle: { color: "#1b2a41", fontSize: 18, fontWeight: "bold" },
  coursePickerClose: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  coursePickerCloseText: { color: "#52606d", fontSize: 28, lineHeight: 32 },
  coursePickerList: { flexGrow: 0, flexShrink: 1 },
  coursePickerOption: {
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#edf2f7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  coursePickerOptionSelected: { backgroundColor: "#ebf4ff" },
  coursePickerOptionText: { color: "#1b2a41", fontSize: 15, flex: 1 },
  coursePickerOptionTextSelected: { color: "#1b2a41", fontSize: 15, fontWeight: "bold", flex: 1 },
  coursePickerCheck: { color: "#2b6cb0", fontSize: 12, fontWeight: "bold", marginLeft: 8 },
  hint: { color: "#cbd5e0" },

  card: { backgroundColor: "#fff", padding: 16, borderRadius: 8, marginBottom: 10 },
  bookResourceCard: { backgroundColor: "#eaf4ff" },
  quizCard: { backgroundColor: "#f1ecff" },
  readingCard: { backgroundColor: "#e8f5e9" },
  bookTitle: { fontSize: 17, fontWeight: "bold", color: "#1b2a41" },
  author: { color: "#52606d", marginTop: 2 },
  bookCardHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  bookCardDetails: { flex: 1, minWidth: 0 },
  startReadingButton: { alignSelf: "center", marginTop: 0, flexShrink: 0 },
  readingTitleRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 4 },
  readingDetailRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 7 },
  readingActions: { marginTop: 10 },
  iconButton: { flexDirection: "row", alignItems: "center", gap: 6 },

  option: { borderWidth: 1.5, borderColor: "#cbd5e0", borderRadius: 6, padding: 10, marginTop: 8 },
  optionPicked: { borderColor: "#1b2a41", backgroundColor: "#e2e8f0" },
  optionRight: { borderColor: "#2f855a", backgroundColor: "#c6f6d5" },
  optionText: { color: "#1b2a41" },
  explanation: { color: "#52606d", marginTop: 10, lineHeight: 20 },
  score: { color: "#fff", fontSize: 18, fontWeight: "bold", marginVertical: 12 },
  button: { backgroundColor: "#fff", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 4 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#1b2a41", fontWeight: "bold" },
  fieldLabel: { color: "#1b2a41", fontWeight: "bold", marginTop: 14 },
  urlInput: { borderWidth: 1, borderColor: "#cbd5e0", borderRadius: 8, padding: 12, color: "#1b2a41", marginTop: 6 },
  fieldHint: { color: "#52606d", lineHeight: 19, marginTop: 6 },
  errorText: { color: "#9b2c2c", fontWeight: "bold", marginTop: 12 },

  track: { height: 8, borderRadius: 4, backgroundColor: "#e2e8f0", marginTop: 10, overflow: "hidden" },
  fill: { height: 8, backgroundColor: "#2f855a" },

  tile: { backgroundColor: "#fff", borderRadius: 8, padding: 16, width: "48%" },
  tileNumber: { fontSize: 28, fontWeight: "bold", color: "#1b2a41" },
  aboutHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 },
  aboutLogo: { width: 56, height: 56, borderRadius: 28 },
  aboutText: { color: "#52606d", fontSize: 14, lineHeight: 21, marginTop: 4 },
  producerRow: { flexDirection: "column", alignItems: "center", gap: 6, paddingVertical: 6 },
  producersRow: { flexGrow: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12 },
  producerName: { fontSize: 14, textAlign: "center" },
  producerDot: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#1b2a41", alignItems: "center", justifyContent: "center" },
  producerInitial: { color: "#fff", fontWeight: "bold" },
  adminRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});