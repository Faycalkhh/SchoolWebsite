# Nur Al-Quran — Project Schema

> **Render diagrams:** VSCode → install *Markdown Preview Mermaid Support* → `Ctrl+Shift+V`  
> GitHub / GitLab render automatically.

**Stack:** Next.js 16 App Router · TypeScript · Tailwind CSS v4 · no backend — all data in `localStorage`.  
**Roles:** `professor` (full write access) · `parent` (read-only children + exam taking).

---

## 1. Entity-Relationship Diagram

> Sessions are embedded inside `STUDENT.sessions[]`.  
> Questions and options are embedded inside `EXAM.questions[].options[]`.  
> "FK" marks the field that links documents (no SQL foreign keys exist).

```mermaid
erDiagram
    USER {
        string id         PK
        string name
        string email
        string password
        string role       "professor | parent"
        string specialty  "optional — professor only"
    }

    STUDENT {
        string id          PK
        string parentId    FK
        string name
        number age
        string level       "Débutant | Intermédiaire | Avancé | Hifz"
        string photo       "optional — base64 JPEG"
        object memorization "Record(1-114, SurahStatus) — optional"
    }

    SESSION {
        string  id          PK
        string  professorId FK
        string  date
        boolean present
        string  discipline  "excellent | bon | passable | insuffisant"
        string  memorization
        string  comment
    }

    TOP_ENTRY {
        number rank      PK "1 | 2 | 3"
        string studentId FK
    }

    ANNOUNCEMENT {
        string id
        string title
        string body
        string image  "optional — base64 JPEG"
        string date
    }

    EXAM {
        string id          PK
        string professorId FK
        string title
        string date
    }

    QCM_QUESTION {
        string id              PK
        string text
        string correctOptionId "→ QCM_OPTION.id  (a | b | c | d)"
    }

    QCM_OPTION {
        string id   PK "a | b | c | d"
        string text
    }

    EXAM_RESULT {
        string id           PK
        string examId       FK
        string studentId    FK
        object answers      "Record(questionId, optionId)"
        number score        "0 – 100"
        number correctCount
        number totalCount
        string dateTaken
    }

    USER         ||--o{ STUDENT      : "parent of (parentId)"
    USER         ||--o{ SESSION      : "records (professorId)"
    USER         ||--o{ EXAM         : "creates (professorId)"
    STUDENT      ||--o{ SESSION      : "embedded sessions[]"
    STUDENT      ||--o| TOP_ENTRY    : "may be ranked"
    STUDENT      ||--o{ EXAM_RESULT  : "achieves"
    EXAM         ||--|{ QCM_QUESTION : "embedded questions[]"
    QCM_QUESTION ||--|{ QCM_OPTION   : "embedded options[]"
    EXAM         ||--o{ EXAM_RESULT  : "generates"
```

---

## 2. Storage Keys

| Key | Type | Seeded | store.ts functions |
|---|---|:---:|---|
| `nur_users` | `User[]` | ✅ | `getUsers` · `saveUsers` · `findUser` |
| `nur_students` | `Student[]` | ✅ | `getStudents` · `saveStudents` |
| `nur_top` | `TopEntry[]` | ❌ | `getTopStudents` · `saveTopStudents` |
| `nur_announcements` | `Announcement[]` | ✅ | `getAnnouncements` · `saveAnnouncements` |
| `nur_exams` | `Exam[]` | ❌ | `getExams` · `saveExams` |
| `nur_exam_results` | `ExamResult[]` | ❌ | `getExamResults` · `saveExamResults` |
| **`nur_session`** *(sessionStorage)* | `User` | — | `login` · `logout` — via `AuthContext` |

**Seed accounts** (written once on first visit, never overwritten):

| Email | Password | Role |
|---|---|---|
| `prof@nur.com` | `prof123` | professor |
| `parent@nur.com` | `parent123` | parent |

---

## 3. Roles & Permissions

```mermaid
flowchart LR
    LOGIN{{"🔐 Authenticated"}}
    PROF(["👨‍🏫 Professor"])
    PAR(["👨‍👩‍👧 Parent"])

    LOGIN -->|role = professor| PROF
    LOGIN -->|role = parent| PAR

    PROF --> PA["🎓 Students\nadd · edit · delete\nphoto · search · paginate"]
    PROF --> PB["📋 Sessions\nrecord per student"]
    PROF --> PC["📖 Memo map\nedit — all 114 surahs"]
    PROF --> PD["👤 Professors\nadd · delete (not self)"]
    PROF --> PE["🏆 Top 3\npick weekly ranking"]
    PROF --> PF["📢 Announcements\ncreate · delete · image"]
    PROF --> PG["📝 Exams (QCM)\ncreate · delete · view all results"]

    PAR --> RA["👁️ Own children only\nread-only"]
    PAR --> RB["📋 Session history\nread-only"]
    PAR --> RC["📖 Memo map\nread-only"]
    PAR --> RD["🏅 Top 3 badge\nif child is selected"]
    PAR --> RE["📢 Announcements\nview only"]
    PAR --> RF["✏️ Take exams\nfor own children — auto-graded"]
    PAR --> RG["📊 Exam scores\nown children only"]
```

| Feature | Action | Professor | Parent |
|---|---|:---:|:---:|
| **Auth** | Login · Logout | ✅ | ✅ |
| | Toggle language AR ↔ FR | ✅ | ✅ |
| **Students** | View all | ✅ | ❌ |
| | View own children | ❌ | ✅ |
| | Add · Edit · Delete | ✅ | ❌ |
| | Upload photo | ✅ | ❌ |
| **Sessions** | Record | ✅ | ❌ |
| | View history | ✅ | ✅ own children |
| **Memo map** | Edit | ✅ | ❌ |
| | View | ✅ | ✅ own children · read-only |
| **Professors** | Add · Delete | ✅ | ❌ |
| **Top 3** | Pick | ✅ | ❌ |
| | See badge | ❌ | ✅ if child selected |
| **Announcements** | Create · Delete | ✅ | ❌ |
| | View | ✅ | ✅ |
| | Home page | — public, no login — | |
| **Exams (QCM)** | Create · Delete | ✅ | ❌ |
| | View all results | ✅ | ❌ |
| | Take exam | ❌ | ✅ |
| | View child scores | ❌ | ✅ own children |

---

## 4. Navigation Map

```mermaid
flowchart TD
    HOME["🏠 /\nHero · About · Professors\nFacilities · Top 3\nAnnouncements · Contact"]
    LOGIN["📋 /login — Role selection"]
    PLOGIN["👨‍🏫 /login/professor"]
    RLOGIN["👨‍👩‍👧 /login/parent"]
    PDASH["📊 /dashboard/professor"]
    RDASH["👁️ /dashboard/parent"]

    PT1["🎓 Students\nadd · edit · delete · photo · search\n↳ Sessions sub-tab\n↳ Memo map sub-tab"]
    PT2["👤 Professors\nadd · delete"]
    PT3["🏆 Top 3\npick 1st · 2nd · 3rd"]
    PT4["📢 Announcements\ncreate · delete · image"]
    PT5["📝 Exams\ncreate QCM · view results"]

    RC1["📊 Stats\nsessions · attendance · discipline"]
    RC2["📖 Memo map (read-only)"]
    RC3["📝 Take exams · view scores"]
    RC4["📋 Session history (read-only)"]

    HOME   --> LOGIN
    LOGIN  --> PLOGIN & RLOGIN
    PLOGIN --> PDASH
    RLOGIN --> RDASH
    PDASH  --> PT1 & PT2 & PT3 & PT4 & PT5
    RDASH  --> RC1 & RC2 & RC3 & RC4
```

---

## 5. Auth Flow

```mermaid
sequenceDiagram
    actor U as User
    participant UI as Login page
    participant LS as localStorage
    participant SS as sessionStorage (AuthContext)
    participant Dash as Dashboard

    U->>UI: email + password
    UI->>LS: findUser(email, password)
    LS-->>UI: User | null

    alt credentials valid + role matches page
        UI->>SS: save user → nur_session
        UI->>Dash: router.push("/dashboard/…")
        Dash->>SS: useAuth() reads user on every render
    else invalid or wrong role
        UI-->>U: error message
    end

    Note over SS,Dash: nur_session is sessionStorage — clears on tab close
```

---

## 6. Exam (QCM) Flow

```mermaid
sequenceDiagram
    actor Prof as Professor
    actor Par as Parent
    participant PD as /dashboard/professor
    participant LS as localStorage
    participant ParD as /dashboard/parent

    Prof->>PD: fill title · questions · options · mark correct answers
    PD->>PD: validate (title required · ≥1 question · all texts filled)
    PD->>LS: saveExams([newExam, ...existing])

    Par->>ParD: open child card
    ParD->>LS: getExams() — exclude already-taken exams
    Par->>ParD: click "Start" → answer each question
    ParD->>ParD: auto-grade: round(correct / total × 100)
    ParD->>LS: saveExamResults([newResult, ...existing])

    Prof->>PD: Exams tab → expand any exam
    PD->>LS: getExamResults() — filter by examId
    PD-->>Prof: table: student name · correct/total · score % · date
```

---

## 7. File Structure

```
nur-al-quran/
├── SCHEMA.md                              ← this file
└── src/
    ├── app/
    │   ├── page.tsx                       Home — public landing page
    │   ├── login/
    │   │   ├── page.tsx                   Role selection screen
    │   │   ├── professor/page.tsx         Professor login form
    │   │   └── parent/page.tsx            Parent login form
    │   └── dashboard/
    │       ├── professor/page.tsx         5-tab professor dashboard
    │       └── parent/page.tsx            Per-child parent dashboard
    ├── components/
    │   ├── Navbar.tsx
    │   ├── Hero.tsx
    │   ├── About.tsx
    │   ├── Professors.tsx
    │   ├── Facilities.tsx
    │   ├── TopStudents.tsx                reads nur_top
    │   ├── AnnouncementSection.tsx        client — reads nur_announcements
    │   ├── MemoMap.tsx                    editable or read-only memo map
    │   ├── Contact.tsx
    │   └── Footer.tsx
    ├── context/
    │   ├── AuthContext.tsx                useAuth() → user · login · logout
    │   └── LanguageContext.tsx            useLanguage() → lang · dir · setLang
    └── lib/
        ├── types.ts                       all TypeScript interfaces & union types
        ├── quran.ts                       114 surahs · 30 juz · SurahStatus
        └── store.ts                       localStorage CRUD — all 6 keys
```
