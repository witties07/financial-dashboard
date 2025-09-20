Financial Data Visualization Dashboard
This is a full-stack web application that enables users to upload an Excel file containing monthly financial data, which is then parsed, stored in a MySQL database, and displayed on a dashboard using a table and a bar chart.

Features
Excel Upload: Users can upload .xlsx files with 'Month' and 'Amount' columns.

Data Storage: The backend, built with Node.js and Express, processes the file and stores the data in a MySQL database.

Data Visualization: The frontend fetches the data and visualizes it using Chart.js.

Dynamic API: RESTful API endpoints for uploading and retrieving financial data per user and year.

Tech Stack
Frontend: HTML, Tailwind CSS, JavaScript, Chart.js

Backend: Node.js, Express.js

Database: MySQL

File Parsing: Multer, XLSX

How to Run This Project
Prerequisites
Node.js installed

MySQL server running

Git installed

1. Clone the Repository
git clone [https://github.com/YOUR_USERNAME/financial-dashboard.git](https://github.com/YOUR_USERNAME/financial-dashboard.git)
cd financial-dashboard

2. Set Up the Database
Connect to your MySQL server.

Run the SQL commands in schema.sql to create the financial_data_db database, the required tables (users, financial_records), and pre-populate the users table.

3. Configure the Backend
Open server.js.

Update the dbConfig object with your MySQL username and password.

4. Install Dependencies and Run
Install the necessary Node.js packages:

npm install

Start the backend server:

npm start

The server will be running on http://localhost:3000.

5. Use the Application
Open the index.html file in your web browser.

Select a user, enter a year, choose a properly formatted .xlsx file, and click "Upload & Visualize".