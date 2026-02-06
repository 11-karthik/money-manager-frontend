

⸻

✅ money-manager-frontend/README.md

# Money Manager – Frontend

This is the frontend application for the **Money Manager** project.  
It is built using **React (Vite)** and styled with **Tailwind CSS**.

## 🚀 Live URL
https://money-manager-frontend-6eu0.onrender.com

## 🛠 Tech Stack
- React (Vite)
- Tailwind CSS
- JavaScript (ES6+)
- Axios

## 📁 Project Structure

src/
├── api/            # Axios API configuration
├── components/     # Reusable components
├── context/        # Authentication context
├── pages/          # Application pages
├── styles/         # CSS files
└── main.jsx

## 🔗 Backend Integration
The frontend communicates with the backend REST APIs.

Backend Base URL used:

https://money-manager-backend-1nlc.onrender.com

## ⚙️ Environment Variables
No environment variables are required for this frontend setup.  
The backend URL is configured directly in the Axios instance.

## 🧪 Run Locally
```bash
npm install
npm run dev

🏗 Build for Production

npm run build

📌 Deployment
	•	Deployed as a Render Static Site
	•	Build Command:

npm install && npm run build

	•	Publish Directory:

dist

📝 Notes
	•	Authentication is handled using React Context
	•	Protected routes restrict access to authenticated users
	•	Axios is used for API communication

👤 Author

Karthik

