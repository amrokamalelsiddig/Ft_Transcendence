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
  - **Tournament Mode:** Offers a tournament setup that can accommodate up to 8 players in a knockout, where winners advance to the next round.

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

Security is a core consideration in **Ft_Transcendence**, ensuring both user safety and data integrity throughout the platform. Below are the key security features and custom middleware implemented to protect the platform:

- **Input Sanitization:** To defend against Cross-Site Scripting (XSS) attacks, we’ve implemented middleware (`SanitizeJsonMiddleware`) that sanitizes all incoming JSON data. Additionally, user inputs are validated on the frontend to prevent malicious content, such as HTML or JavaScript tags, from being submitted. This two-layered approach ensures comprehensive protection.

- **JWT Authentication Middleware:** This custom middleware (`JWTAuthenticationMiddleware`) handles user authentication by verifying JSON Web Tokens (JWT) attached to each request. It checks the `Authorization` header or cookies for a valid JWT token. If the token is valid, the middleware decodes it, retrieves the user, and assigns them to the request. This middleware also protects sensitive endpoints by blocking access unless the user is authenticated, ensuring only authorized users can interact with secure parts of the application. Some endpoints (like `/api/login`, `/api/register`) are excluded from authentication requirements, allowing unauthenticated users to perform basic actions.

<p align="center">
    <img src="src/backend/staticfiles/middleware.svg" alt="Middleware Diagram" width="50%">
</p>

- **Update Last Activity Middleware:** This middleware (`UpdateLastActivityMiddleware`) ensures that authenticated users' last activity timestamps are updated with every request. It helps monitor user engagement and can detect inactive users by comparing the current time to the expiration time of their JWT token. If the token is expired, the user’s account is deactivated, further enhancing session security.

- **Log Headers Middleware:** This simple middleware (`LogHeadersMiddleware`) logs all HTTP headers received with each request. It’s primarily used for debugging and monitoring purposes, but it also plays a role in security by providing insights into the structure and contents of incoming requests, making it easier to spot unusual or potentially malicious traffic patterns.

- **OAuth and Two-Factor Authentication (2FA):** We implement OAuth for secure remote authentication, allowing users to log in using third-party accounts (e.g., via 42 API). Additionally, 2FA is enabled via email, requiring users to enter a verification code sent to their registered email address during the login process, adding an extra layer of security to protect accounts from unauthorized access.

- **HTTPS Encryption:** All traffic between the client and server is encrypted using HTTPS, ensuring that sensitive information such as login credentials and user data are transmitted securely.

- **Rate Limiting:** Nginx is configured with request rate limiting to prevent brute-force attacks and denial-of-service (DoS) attacks by limiting the number of requests from a single IP address within a certain time frame.

By implementing these security measures, **Ft_Transcendence** offers a safe and reliable gaming environment for all users. Our custom middleware and other security features work together to provide robust protection for the platform.




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


## Usage

### Prerequisites

Before using Ft_Transcendence, ensure you have the following installed:

- **Docker** and **Docker Compose**

### Running the Application Locally

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/ft_transcendence.git
   cd ft_transcendence
   make
