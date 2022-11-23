# Project Name


# Quick Compo


## Description

This app was developed to helps people discover incoming events in Portugal. Inside the given cultural agenda, users can filter the data by categories, price, type of event, and other personal preferences. They  can also manage their attendance, comment about events and see other other user that are also part of the app internal community.

## User Stories

- **404:** As a user I get to see a 404 page with a feedback message if I try to reach a page that does not exist so that I know it’s my fault.
- **Signup:** As an anonymous user I can sign up on the platform so that I can create a profile and see the details of the internal events.
- **Login:** As a user, I can access the platform to view and edit my profile, book attendances and save events as well as view the profile of other users.
- **Logout:** As a logged-in user I can log out from the platform so no one else can use it.
- **Profile Page**: As a logged-in user I can access and edit my page, and see the events that I will attend/mark as saved.
-  **View Event Details:** As a user I can see the event details, save them, and go to the Event Community Page.
-  **View, Comment, and Attend at Community Page:**  As a user  I can add comments related to a specific event, comment, and mark attendance; as well as see other users’ attendees.

Path
Component
Permissions
Behavior
| `/login`                     | LoginPage            | anon only `<AnonRoute>`    | Login form, navigates to home page after login.           |
| `/signup`                    | SignupPage           | anon only  `<AnonRoute>`   | Signup form, navigates to home page after signup.         |
| `/`                          | HomePage             | public `<Route>`           | Home page.                                                |
| `/user-profile`         | ProfilePage          | user only `<PrivateRoute>` | User profile for the current user.             |
| `/user-profile:Id`              | ProfilePage       | user only `<PrivateRoute>` | User profile for the current user.
| `/user-profile/edit`         | EditProfilePage      | user only `<PrivateRoute>` | Edit user profile form.                                   |
| `/events`                    | EventsPage           | user only `<PrivateRoute>` | See all the Events.                                |
| `/events/event:Id`           | EventDetailsPage     | user only `<PrivateRoute>` | See the details of an event.                                         |
| `/event:Id/community`        | CommunityPage        | user only `<PrivateRoute>` | See the event details: users can also add comments mark and see attendees.

## Pages


- LoginPage
- SignupPage
- HomePage (with a mockup of events - try to pull some abstracts from the API)
- ProfilePage - user will be private (just for users)
- EditProfilePage 

- EventsPage
- EventDetails Page(id) - (with href with the website of the event) and button to:
- EventCommunity Page(id) - will allow to see the attendance (counter? made if  linked will be redirected to 
- ProfilePage(id) of each user - private, public just for users
- Community Page (Event/(id)) create - to create a comment 

## Components

EventsCard: where the user will be able to save the event, click on the event and check event detail

Navbar: 
- Home (direct to HomePage) 
- Events (if logged in will be able to go to details event if not only able to -  see the mockup (authorisations in frontend) )
  
Login/signup if not logged, logout if logged

ProfileCard: the profile is where the user will be able to add personal information that will allow the other users to see

Private: Authentications

Anon: Authentications

## Services

- **Auth Service**

  - `authService` :
    - `.login(user)`
    - `.signup(user)`
    - `.logout()`
    - `.validate()`

- **User Service**

  - `userService` :
    - `.updateCurrentUser(id, userData)`
    - `.getCurrentUser()`

- **Event Service**

  - `eventService` :
    - `.getEvents()`
    - `.getOneEvent(id)`

- **Community Service**

  - `communityService` :
    - `.getProfileDetails(id)`?

## Models

**User model**
```javascript
{
  email: {
    type: String,
    required: true,
    unique: true
    lowercase: true,
    },
  password: {
    type: String,
    required: true
    },
  profileImg: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: false },
  gender: {
    type: String,
    required: false,
    },
  location: { type: String, required: true },
  preferences: {}
  shortBio: { type: String, required: true },
}
```
**Community model**
```javascript
{
   name: { type: String, required: true },
   img: { type: String },
   attendance: [ { type: Schema.Types.ObjectId, ref:‘Profile’ } ],
   comments: []
}
```

**Event Model**
```javascript
{
  img: { type: String },
  title:  { type: String, },
  info: { type: String, },
  location: { type: String, },
  permanent: { type: Boolean, default: false }
  price: { type: String },
  startDate: { type: Number },
  details: { type: String },
  type: { type: String },
  link: {},
  where: { type: String },
  who: { type: String },

}
```

## API Endpoints (backend routes)

GET /auth/profile - saved session 200 - 404 Check if user  is logged in profile page
POST /auth/ profile - saved session - email, password

POST /auth/login - email, password - 200 - 401 - Checks if fields not empty (422), if user exists (404), and if password matches (404), then stores user in session

POST /auth/logout 204 (400), Logs out the user

GET /api/events - gets the API events
GET /api/events/:id - request body - gets the API details
POST /api/events/:id - request body: event assets - add to favourites
GET/api/events/:id/Community page - request body: events id - see the community page (attendance, user profiles that will attend, commentaries)
POST/ api/events/:idCommunity page - click on attendance

DELETE/ api/Community - request comment/user/ - delete comment

## API's

https://culturaportugal.gov.pt/umbraco/api/eventsapi/GetEvents

## Packages

- For the first part: None

### Git

[Client repository Link](https://github.com/Foglia/Project_3_C.git)
[Server repository Link](https://github.com/Foglia/Project_3_S.git)

### Slides

- For the first part: Null

### Contributors

Flavia Fogliato - <github-Foglia> - <linkedin-profile-https://www.linkedin.com/in/flaviafogliato/>>
Carlota Taveira - <github-> - <linkedin-profile-https://www.linkedin.com/in/carlotataveira/>
