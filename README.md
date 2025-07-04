# To-Let Globe Property Backend API

A RESTful API backend for the To-Let Globe property management system built with Node.js, Express, and MongoDB.

## 🚀 Features

- **RESTful API**: Complete CRUD operations for property management
- **Authentication**: JWT-based authentication system
- **File Upload**: Image upload functionality using Multer
- **Data Validation**: Input validation and error handling
- **Security**: Protected routes with authentication middleware
- **Database**: MongoDB integration with Mongoose ODM

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository
```bash
git clone https://github.com/narasimhayellu/to-let-property-backend.git
cd to-let-property-backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/toletglobe
JWT_SECRET=your_jwt_secret_key_here
```

4. Create uploads directory
```bash
mkdir uploads
```

5. Start the server
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## 📁 Project Structure

```
to-let-globe-property-backend/
├── controllers/
│   └── propertyControllers.js    # Property CRUD logic
├── middleware/
│   └── authMiddleware.js         # JWT authentication
├── models/
│   └── propertyModel.js          # Property schema
├── routes/
│   └── property.js               # API routes
├── uploads/                      # Image storage
├── server.js                     # Express server setup
├── package.json
└── README.md
```

## 🔗 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/properties` | Get all properties |
| GET | `/api/properties/:id` | Get single property |

### Protected Endpoints (Require Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/properties` | Create new property |
| PUT | `/api/properties/:id` | Update property |
| DELETE | `/api/properties/:id` | Delete property |
| GET | `/api/properties/user/properties` | Get user's properties |

## 📝 API Usage Examples

### Get All Properties
```bash
GET http://localhost:3000/api/properties
```

### Create Property (Protected)
```bash
POST http://localhost:3000/api/properties
Headers: 
  Authorization: Bearer <your_jwt_token>
  Content-Type: multipart/form-data

Body:
  - firstName: string
  - lastName: string
  - email: string
  - contact: string
  - address: string
  - locality: string
  - latitude: number
  - longitude: number
  - spaceType: string
  - propertyType: string
  - bhk: string
  - floor: string
  - facing: string
  - area: number
  - rent: number
  - deposit: number
  - furnishingType: string
  - amenities: array
  - photos: files[]
```

### Update Property (Protected)
```bash
PUT http://localhost:3000/api/properties/:id
Headers: 
  Authorization: Bearer <your_jwt_token>
Body: Same as create (partial updates supported)
```

### Delete Property (Protected)
```bash
DELETE http://localhost:3000/api/properties/:id
Headers: 
  Authorization: Bearer <your_jwt_token>
```

## 🗄️ Database Schema

### Property Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  contact: String,
  address: String,
  locality: String,
  latitude: Number,
  longitude: Number,
  spaceType: String,
  propertyType: String,
  bhk: String,
  floor: String,
  facing: String,
  area: Number,
  rent: Number,
  deposit: Number,
  furnishingType: String,
  buildingAmenities: [String],
  flatAmenities: [String],
  photos: [String],
  userId: ObjectId,
  views: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 🚦 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/toletglobe |
| JWT_SECRET | Secret key for JWT | Required |

## 🧪 Testing

Test the API endpoints using:
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- curl commands
- Frontend application

## 🔧 Development

### Install Dependencies
```bash
npm install
```

### Run in Development Mode
```bash
npm run dev
```

### Run in Production
```bash
npm start
```

## 📦 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **multer**: File upload handling
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Narasimha Reddy Yellu - [GitHub](https://github.com/narasimhayellu)

## 🔗 Related Repositories

- [Frontend Repository](https://github.com/narasimhayellu/to-let-property-frontend)

## 📞 Support

For support, email your-email@example.com or raise an issue in the GitHub repository.

---

**Note**: Make sure MongoDB is running before starting the server. The frontend application should be configured to point to this backend API.