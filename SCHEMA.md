# Nur Al-Quran — Project Schema

> **How to render this file**
> - **VSCode**: install the extension *Markdown Preview Mermaid Support* → open preview (`Ctrl+Shift+V`)
> - **GitHub**: diagrams render automatically in the browser

---

## 1. Data Models

```mermaid
classDiagram
    direction TB

    class User {
        +string id
        +string name
        +string email
        +string password
        +Role   role
        +string specialty?
    }

    class Student {
        +string   id
        +string   name
        +number   age
        +Level    level
        +string   parentId
        +Session[] sessions
        +string   photo?
    }

    class Session {
        +string     id
        +string     date
        +boolean    present
        +Discipline discipline
        +string     memorization
        +string     comment
        +string     professorId
    }

    class TopEntry {
        +1|2|3 rank
        +string studentId
    }

    class Role {
        <<enumeration>>
        professor
        parent
    }

    class Level {
        <<enumeration>>
        Débutant
        Intermédiaire
        Avancé
        Hifz
    }

    class Discipline {
        <<enumeration>>
        excellent
        bon
        passable
        insuffisant
    }

    User        -->  Role       : role
    Student     -->  Level      : level
    Session     -->  Discipline : discipline

    User        "1 (parent)"    -->  "0..*" Student   : parentId
    User        "1 (professor)" -->  "0..*" Session   : professorId
    Student     "1"             *--  "0..*" Session   : sessions
    Student     "1"             ..>  "0..1" TopEntry  : may appear in
```

---

## 2. Roles & Permissions

### Summary table

| Action | Professor | Parent |
|---|:---:|:---:|
| View own dashboard | ✅ | ✅ |
| View all students | ✅ | ❌ |
| View own children only | ❌ | ✅ |
| Add a student | ✅ | ❌ |
| Edit a student | ✅ | ❌ |
| Delete a student | ✅ | ❌ |
| Upload student photo | ✅ | ❌ |
| Add a session | ✅ | ❌ |
| View session history | ✅ | ✅ (children only) |
| Add a professor | ✅ | ❌ |
| Delete a professor | ✅ (not self) | ❌ |
| Pick Top 3 students | ✅ | ❌ |
| See Top 3 badge | ❌ | ✅ (if child is in top 3) |
| Toggle language (AR/FR) | ✅ | ✅ |

### Permission flowchart

```mermaid
flowchart LR
    subgraph PROFESSOR ["👨‍🏫 Professor"]
        P1[Manage Students\nadd · edit · delete · photo]
        P2[Record Sessions\ndate · presence · discipline\nmemorization · comment]
        P3[Manage Professors\nadd · delete]
        P4[Pick Top 3\nof the week]
    end

    subgraph PARENT ["👨‍👩‍👧 Parent"]
        R1[View children\nread-only]
        R2[View session history\nread-only]
        R3[See Top 3 badge\nif child selected]
    end

    PROFESSOR -- "can do all of" --> P1
    PROFESSOR -- "can do all of" --> P2
    PROFESSOR -- "can do all of" --> P3
    PROFESSOR -- "can do all of" --> P4

    PARENT -- "limited to" --> R1
    PARENT -- "limited to" --> R2
    PARENT -- "limited to" --> R3
```

---

## 3. Application Navigation

```mermaid
flowchart TD
    HOME["🏠 Home  /"]
    LOGIN["📋 Role selection  /login"]
    PLOGIN["👨‍🏫 Professor login  /login/professor"]
    RLOGIN["👨‍👩‍👧 Parent login  /login/parent"]
    PDASH["📊 Professor dashboard  /dashboard/professor"]
    RDASH["👁️ Parent dashboard  /dashboard/parent"]

    HOME  --> LOGIN
    LOGIN --> PLOGIN
    LOGIN --> RLOGIN
    PLOGIN --> PDASH
    RLOGIN --> RDASH

    subgraph PDASH_TABS ["Professor dashboard — tabs"]
        T1["🎓 Students\nadd · edit · delete\nphoto · search · paginate"]
        T2["👤 Professors\nadd · delete"]
        T3["🏆 Top 3\npick 1st · 2nd · 3rd"]
    end

    subgraph RDASH_TABS ["Parent dashboard — content"]
        T4["Child card\nattendance % · last discipline\ntop-3 badge if selected"]
        T5["Session history\ndate · presence · discipline\nmemorization · professor comment"]
    end

    PDASH --> PDASH_TABS
    RDASH --> RDASH_TABS
```

---

## 4. Authentication Flow

```mermaid
sequenceDiagram
    actor U as User
    participant UI as Login page
    participant Store as store.ts (localStorage)
    participant Auth as AuthContext (sessionStorage)
    participant Dash as Dashboard

    U->>UI: Enter email + password
    UI->>Store: findUser(email, password)
    Store-->>UI: User | null

    alt Valid credentials & correct role
        UI->>Auth: login(user)
        Auth->>Auth: save to sessionStorage (nur_session)
        UI->>Dash: router.push("/dashboard/…")
        Dash->>Auth: useAuth() → read user
    else Invalid
        UI-->>U: Show error message
    end

    Note over Auth,Dash: Session clears when the tab is closed
```

---

## 5. Data persistence (localStorage)

| Key | Type | Description |
|---|---|---|
| `nur_users` | `User[]` | All users (professors + parents). Seeded on first load. |
| `nur_students` | `Student[]` | All students with embedded sessions. Seeded on first load. |
| `nur_top` | `TopEntry[]` | Top 3 students of the week (0–3 entries). |
| `nur_session` *(sessionStorage)* | `User` | Currently logged-in user. Cleared on tab close. |

### Seed accounts (loaded once on first visit)

| Email | Password | Role |
|---|---|---|
| `prof@nur.com` | `prof123` | professor |
| `parent@nur.com` | `parent123` | parent |

---

## 6. File structure (key files)

```
src/
├── app/
│   ├── page.tsx                      ← Home / landing page
│   ├── login/
│   │   ├── page.tsx                  ← Role selection (professor / parent)
│   │   ├── professor/page.tsx        ← Professor login form
│   │   └── parent/page.tsx           ← Parent login form
│   └── dashboard/
│       ├── professor/page.tsx        ← Professor dashboard (students · professors · top3)
│       └── parent/page.tsx           ← Parent dashboard (children · sessions)
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Facilities.tsx
│   ├── Professors.tsx
│   └── TopStudents.tsx
├── context/
│   ├── AuthContext.tsx                ← useAuth() → user · login · logout
│   └── LanguageContext.tsx           ← useLanguage() → lang · dir · setLang
└── lib/
    ├── types.ts                      ← TypeScript interfaces & enums
    └── store.ts                      ← localStorage CRUD (users · students · top3)
```
