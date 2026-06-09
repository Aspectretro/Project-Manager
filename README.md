# Aora (Project/Collaboration Manager)
Aora is a Next.js application that allow organisers to have a rather organised orientation when approaching collaboration tasks and team projects. It have a targeted audience towards not only business audience, but also is able to be used by students from both university or lower education due to its simplicity and striaght-forward functionality. In addition, the project would also integrate an AI api to enhance project management as well as template creation by the user.

The application offers secured login, with all password being hashed on registeration, meanwhile within each project, there are also two level of authorisation (currently) to ensure that the team hiearchy won't be breached and the members within a project won't have to much power of manipulation. Roles are detailed below:
|Roles | Actions Available |
|Owner | Member management (addition and removal), project-related task management (addition and removal) |
|Member | Project-related task management (addition and removal) |

# Built with
Front End
---
- TypeScript (tsx)
- React
- Next.js
- Shadcn components

Back End
---
- Sqlite3
- Flask, Flask-ocurs, Wuerkerzeug security

# Testing Accounts
## Dev login
User: demo@email.com
Password: #password

## Demo login
User: example@email.com
Password: @1234567