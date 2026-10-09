# StudyRoom Research Prototype

## Overview

StudyRoom is a study room reservation system designed to help students find and reserve available study rooms based on date, time, duration, and capacity.

This repository contains my individual prototype for the CSCE 490 Research Milestone. The purpose of the project was to research potential technologies, learn how they work together, and build a functional application using the technologies I found most promising.

---

## Prototype

The prototype demonstrates a full-stack StudyRoom application where a React frontend communicates with a Node.js/Express backend and PostgreSQL database.

Users can:

* Search for available study rooms
* Filter by date, time, duration, and capacity
* Reserve a room
* Prevent conflicting reservations
* View reservations
* Cancel reservations

Administrators can:

* Add study rooms
* View existing rooms
* Delete study rooms

## Technologies Researched

### React

React was investigated as the frontend framework. Its component-based structure and state management make it well suited for StudyRoom's interactive forms, search results, and reservation features.

**Recommendation:** React

### Vue

Vue was considered as an alternative frontend framework. It is also component-based and would work well for the project, but I preferred React because of its ecosystem and familiarity with the JavaScript-based full-stack approach.

### Node.js + Express

Express was investigated as a backend framework for Node.js. It provides a lightweight way to create REST APIs and allows JavaScript to be used across the application.

**Recommendation:** Node.js + Express

### FastAPI

FastAPI was considered as a Python-based backend alternative. It is a strong option for API development, but Express was preferred for this prototype because it keeps the frontend and backend in the same primary language.

### PostgreSQL

PostgreSQL was selected as the database because StudyRoom contains strongly related data such as users, rooms, locations, and reservations.

Its relational structure, foreign keys, constraints, and date/time support make it a good fit for the application.

**Recommendation:** PostgreSQL

### MongoDB

MongoDB was considered as an alternative database. Its flexible document model could support StudyRoom, but PostgreSQL was a better fit because the application's data has clear relationships.

### npm

npm was used as the package manager for the JavaScript projects. It was used to install and manage project dependencies and run development scripts.

---
### What I Learned

Building the prototype gave me practical experience with:

-React state and interactive components
-REST API requests
-Express backend development
-PostgreSQL database queries
-Relational database design
-Frontend/backend communication
-Reservation conflict detection
-Debugging across multiple application layers
-Using npm to manage project dependencies
-Using Git and GitHub throughout development

One of the most important parts of the prototype was implementing reservation availability. The backend checks existing reservations and prevents overlapping bookings while allowing reservations that begin when another reservation ends.

### Research Conclusion

Building this prototype allowed me to move beyond researching technologies in theory and gain practical experience using them together.

Based on my research and implementation experience, React, Node.js/Express, and PostgreSQL are my current recommendations for the StudyRoom project. The final technology stack will be selected by the team after everyone's research is reviewed.
