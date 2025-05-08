classDiagram

%% Herança
User <|-- Student
User <|-- Volunteer
User <|-- Company

%% Relacionamentos
Company "1" --> "many" Reward : oferece >
Volunteer "1" --> "many" Opportunity : cria >
Opportunity "many" --> "many" Student : participantes
Student "1" --> "many" Participation : participa >
Opportunity "1" --> "many" Participation
Reward "1" --> "1" Company : patrocinado por >
Opportunity "1" --> "1" Category
User "1" --> "many" Notification : recebe >
User "1" --> "many" AuthSession : mantém >

%% Classes principais
class User {
  UUID id
  String name
  String email
  String password
  UserType type
  String profileImageUrl
  LocalDateTime createdAt
}

class Student {
  String school
  String gradeLevel
  Integer points
}

class Volunteer {
  List<String> skills
}

class Company {
  String companyName
  List<Reward> rewardsOffered
}

class Opportunity {
  UUID id
  String title
  String description
  String location
  Category category
  LocalDateTime dateTime
  Double durationHours
  Integer availableSlots
  Volunteer createdBy
  List<Student> participants
}

class Category {
  UUID id
  String name
  String iconUrl
}

class Reward {
  UUID id
  String title
  String description
  Integer pointsCost
  Company sponsor
}

class Participation {
  UUID id
  Student student
  Opportunity opportunity
  ParticipationStatus status
  String feedback
  String proofImageUrl
}

class Notification {
  UUID id
  User recipient
  String message
  Boolean read
  LocalDateTime createdAt
}

class AuthSession {
  UUID id
  User user
  String token
  LocalDateTime expiresAt
}
