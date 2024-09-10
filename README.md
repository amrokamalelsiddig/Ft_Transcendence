# Ft_Transcendence

## Introduction

Ft_Transcendence is a dynamic gaming platform designed for both individual and multiplayer gaming experiences. This project leverages cutting-edge web technologies to provide a robust backend framework, comprehensive user management, and advanced features like remote authentication and two-factor authentication.

## Features

- **Multi-Game Management:** Users can switch between different games, each with their own history and matchmaking system.
- **Multiplayer Functionality:** Supports more than two players in the same game, enhancing group interactions.
- **Advanced User Authentication:**
  - **Standard Registration:** Allows users to register and manage their accounts using traditional username and password methods.
  - **42 API Integration:** Offers registration through the 42 API for users who do not have an account. All basic information will be pulled from your 42 profile, streamlining the registration process. Users who already have an account can also use this method for authentication.
  - **Two-Factor Authentication (2FA):** Enhances security by requiring a second form of verification.
- **User History Tracking:** Maintains comprehensive logs of user activity and game history for personalized experiences.
- **Social Features:**
  - **Friend System:** Allows users to add other players as friends, enhancing the community aspect of the platform and enabling easier matchmaking and game invites.

## Games Offered

- **Classic Pong Game:**
  - **Player Options:** Supports 2 or 3 players in a single game session.
  - **Tournament Mode:** Offers a tournament setup that can accommodate up to 8 players in a knockout, or cup system, where winners advance to the next round.

- **Tic Tac Toe:**
  - **Player Configuration:** Game designed for 2 players.
  - Both games feature user history tracking and utilize the matchmaking system for pairing competitors.

## Technology Stack

- **Backend:** Django
- **Frontend:** JavaScript, HTML, CSS
- **Authentication:** JWT, OAuth
- **Database:** PostgreSQL
- **Other Technologies:** Docker, Nginx, Bootstrap


## Security

Security is a core consideration in Ft_Transcendence, ensuring both user safety and data integrity throughout the platform. Below are the key security features and practices:

- **Input Sanitization:** To protect against Cross-Site Scripting (XSS) attacks, we have implemented middleware (`SanitizeJsonMiddleware`) that sanitizes all incoming JSON data, removing any malicious content such as HTML or JavaScript tags.
  
- **Two-Factor Authentication (2FA):** Users can enable 2FA for an additional layer of security. This requires users to enter a second form of verification during the login process, protecting accounts from unauthorized access.
  
- **JWT and OAuth:** We use JSON Web Tokens (JWT) to secure authentication tokens and ensure that user sessions are properly authenticated. OAuth is implemented for remote authentication, allowing users to securely log in using third-party accounts (e.g., via 42 API).
  
- **HTTPS Encryption:** All traffic between the client and server is encrypted using HTTPS, ensuring that sensitive information such as login credentials and user data are transmitted securely.

- **Database Security:** PostgreSQL is configured with strict access controls, ensuring that only authorized users and services can access the database. Sensitive data, such as passwords, are hashed using industry-standard algorithms to protect against data breaches.
  
- **Rate Limiting:** Nginx is configured with request rate limiting to prevent brute-force attacks and denial-of-service (DoS) attacks by limiting the number of requests from a single IP address within a certain time frame.
  
- **Error Handling:** Detailed error messages are suppressed in production environments to avoid leaking sensitive system information, with proper logging in place to trace issues while keeping the system secure.
  
- **Secure Session Management:** We use secure session management techniques, ensuring that sessions are properly handled, invalidated upon logout, and protected from session hijacking or fixation attacks.


## Sign up page 
![alt text](<src/backend/staticfiles/Screenshot from 2024-09-10 19-59-07.png>) 

## log in page 
![alt text](<src/backend/staticfiles/Screenshot from 2024-09-10 19-59-17.png>) 

## Index
![alt text](<src/backend/staticfiles/Screenshot from 2024-09-10 20-00-16.png>) 

## profile
![alt text](<src/backend/staticfiles/Screenshot from 2024-09-10 20-06-55.png>)

## 2 Player Pong
![alt text](<src/backend/staticfiles/Screencast from 2024-09-10 20-02-08(2).gif>) 

## 3 Player Pong 
![alt text](<src/backend/staticfiles/Screencast from 2024-09-10 20-03-28.gif>)

## Tic Tac Toe
![alt text](<src/backend/staticfiles/Screencast from 2024-09-10 20-05-32(1).gif>)