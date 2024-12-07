# MovieEra - Server Side 🎥  
The backend server for MovieEra, a dynamic movie portal application.

## Features 🚀  
- **User Authentication:** Secure user authentication using Firebase Authentication.  
- **Movie Management:**  
  - Add, update, delete, and retrieve movie data.    
- **Favorites Database:** Manage user-specific favorite movie lists.  
- **Environment Variables:** Secured Firebase and MongoDB credentials via `.env`.  
- **RESTful API:** Robust API endpoints to support client-side operations.  

## Technologies Used 🛠️  
- **Framework:** Node.js with Express.js.  
- **Database:** MongoDB for storing movie and user data.  
- **Authentication:** Firebase Authentication.  
- **Hosting:** Hosted on Vercel.  

## API Endpoints 📌  
- **Movies:**  
  - `POST /movies` - Add a new movie.  
  - `GET /movies` - Retrieve all movies.  
  - `GET /movies/:id` - Retrieve a specific movie by ID.  
  - `PUT /movies/:id` - Update movie details.  
  - `DELETE /movies/:id` - Delete a movie.  
- **Favorites:**  
  - `GET /favorites` - Retrieve user-specific favorite movies.  
  - `POST /favorites` - Add a movie to favorites.  
  - `DELETE /favorites/:id` - Remove a movie from favorites.  