```mermaid
erDiagram

USER ||--o{ AUTH_SESSION : maintains
USER ||--o{ NOTIFICATION : receives
USER ||--o{ PARTICIPATION : includes
USER ||--o{ REWARD : sponsors (Company only)

STUDENT ||--o{ PARTICIPATION : participates
STUDENT ||--o{ OPPORTUNITY : joins (via Participation)

VOLUNTEER ||--o{ OPPORTUNITY : creates
COMPANY ||--o{ REWARD : offers

OPPORTUNITY ||--|| CATEGORY : belongs_to
OPPORTUNITY ||--o{ PARTICIPATION : has

PARTICIPATION {
  UUID id
  ParticipationStatus status
  String feedback
  String proofImageUrl
}

USER {
  UUID id
  String name
  String email
  String password
  UserType type
  String profileImageUrl
  LocalDateTime createdAt
}

STUDENT {
  String school
  String gradeLevel
  Integer points
}

VOLUNTEER {
  String[] skills
}

COMPANY {
  String companyName
}

OPPORTUNITY {
  UUID id
  String title
  String description
  String location
  LocalDateTime dateTime
  Double durationHours
  Integer availableSlots
}

CATEGORY {
  UUID id
  String name
  String iconUrl
}

REWARD {
  UUID id
  String title
  String description
  Integer pointsCost
}

AUTH_SESSION {
  UUID id
  String token
  LocalDateTime expiresAt
}

NOTIFICATION {
  UUID id
  String message
  Boolean read
  LocalDateTime createdAt
}
```