CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Location VARCHAR(255),
    Role VARCHAR(50) CHECK (Role IN ('Citizen', 'Government Official', 'Admin')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Issues (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Title VARCHAR(255) NOT NULL,
    Content TEXT NOT NULL,
    Category VARCHAR(100),
    Status VARCHAR(50) CHECK (Status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
    Image VARCHAR(255),
    Location VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL
);

CREATE TABLE Polls (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Title VARCHAR(255) NOT NULL,
    Deadline DATETIME NOT NULL,
    Location VARCHAR(255),
    Participants INT DEFAULT 0,
    Yes INT DEFAULT 0,
    No INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Votes (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Poll_Id UNIQUEIDENTIFIER NOT NULL,
    User_Id UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (Poll_Id) REFERENCES Polls(Id) ON DELETE CASCADE,
    FOREIGN KEY (User_Id) REFERENCES Users(Id) ON DELETE CASCADE
);

CREATE TABLE Documents (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    DocumentFile VARBINARY(MAX) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
