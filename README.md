# Library Management System

A modern, responsive web application built with React and Material UI for managing library resources, users, and transactions.

## Features

### User Features
- **Book Catalog**: Browse and search the complete collection of books
- **User Dashboard**: Overview of borrowed books, due dates, and account activity
- **My Profile**: View and edit personal information
- **My Borrowed Books**: Manage currently borrowed books with options to renew or return
- **Transaction History**: Review past borrowing activity

### Admin Features
- **Admin Dashboard**: Overview of library statistics and key metrics
- **User Management**: Add, edit, and manage user accounts
- **Book Management**: Add, edit, and manage the book inventory
- **Reports**: Comprehensive analytics with visualizations for library activities
- **Transaction Management**: Track and manage all book lending activities

## Technology Stack

- **Frontend**: React.js, Material UI
- **State Management**: React Context API
- **Charting**: Recharts library for analytics visualizations
- **Authentication**: JWT-based authentication
- **Styling**: Material UI theming

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/username/lms-cursor.git
cd lms-cursor
```

2. Install dependencies
```
cd frontend
npm install
```

3. Start the development server
```
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### User Access
- **Regular User**:
  - Username: user@example.com
  - Password: User@123

### Admin Access
- **Admin User**:
  - Username: Admin
  - Password: Admin@12345

## Project Structure

```
lms-cursor/
├── frontend/
│   ├── public/
│   │   ├── favicon.svg           # Book icon favicon
│   │   ├── index.html            # HTML template
│   │   └── manifest.json         # Web app manifest
│   ├── src/
│   │   ├── assets/               # Static assets
│   │   ├── components/           # Reusable UI components
│   │   │   ├── layout/           # Layout components
│   │   │   └── routes/           # Route components 
│   │   ├── context/              # React context providers
│   │   ├── pages/                # Page components
│   │   │   ├── admin/            # Admin pages
│   │   │   └── ...               # User pages
│   │   ├── App.js                # Main application component
│   │   └── index.js              # Entry point
│   └── package.json              # Frontend dependencies
└── README.md                     # Project documentation
```

## Features in Detail

### Book Catalog
- Browse books with cover images, titles, authors, and availability status
- Filter books by category, author, or publication year
- Search functionality for quick access

### User Management
- User registration with email verification
- Profile management with personal details
- Role-based access control (admin/user)

### Book Management
- Add new books with detailed information
- Update book status and availability
- Track book condition and location

### Borrowing System
- Check out books with due date calculation
- Renew borrowed books
- Return processing with fine calculation (if applicable)

### Reporting
- Visual analytics for borrowing patterns
- User activity reports
- Book popularity and genre distribution statistics

## Future Enhancements

- Barcode/QR code integration for physical books
- Email notifications for due dates and reservations
- Mobile application
- Integration with external book databases
- Online reading capability for digital content

## Developer

- Piyush Mangalam Bajaj
- https://www.linkedin.com/in/piyush-mangalam-bajaj-6a995a236/

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material UI for the design components
- Recharts for data visualization
- All contributors who have helped to enhance this library management system 
