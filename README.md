AgriChain AI 🌱

AgriChain AI is an intelligent, full-stack Supply Chain Management (SCM) platform designed specifically for the agricultural sector. It provides end-to-end visibility and predictive analytics—tracking crops from farm planting all the way to market delivery.

By leveraging machine learning and data analytics, AgriChain AI helps farmers, distributors, and stakeholders minimize spoilage, optimize inventory, and forecast market demand with high accuracy.

🎯 Purpose and Why It Was Built
The agricultural supply chain is notoriously fragmented. Post-harvest losses due to poor inventory management, inefficient logistics, and a lack of data-driven forecasting cost the industry billions annually.

AgriChain AI was built to solve this by unifying the four core pillars of agricultural SCM into a single, cohesive dashboard:

Intelligent Planning (Crop AI): Recommending the best crops to plant based on environmental data.
Smart Storage (Inventory): Monitoring stock levels and alerting users to spoilage risks based on optimal temperature and humidity thresholds.
Distribution Tracking (Logistics): Tracing shipments from origin to destination, automatically deducting from inventory, and securely recording sales upon delivery.
Market Intelligence (Demand Forecast & Analytics): Using historical sales data and SARIMA time-series forecasting to predict future demand and display real-time KPIs (Revenue, Volume, Regional Distribution).
🚀 Key Features
AI Demand Forecasting: SARIMA-backed predictive models that project future crop demand and calculate Mean Absolute Error (MAE) accuracy.
Automated Logic Chain: Delivering a shipment automatically triggers a deduction in warehouse inventory and instantly updates the Analytics revenue dashboard.
Real-time Inventory Alerts: Automated warnings for low stock levels and critical spoilage risks.
Role-based Authentication: Secure JWT/OAuth2 login flows for different supply chain stakeholders.
Interactive Dashboards: Rich, Pandas-backed data visualizations utilizing Recharts.
💻 Technologies Used
AgriChain AI is built with a modern, high-performance tech stack:

Frontend
React & Vite: Fast, modern UI development and bundling.
Tailwind CSS: Fully responsive, utility-first styling for a clean and professional dashboard.
Recharts: Composable charting library used for the Demand Forecast and Analytics views.
React Router: For seamless, client-side routing and Protected Routes.
Lucide React: Beautiful, consistent iconography.
Backend
FastAPI (Python): High-performance backend routing and asynchronous API endpoints.
SQLAlchemy & SQLite: Robust ORM for relational database management (easily scalable to PostgreSQL).
Alembic: Automated database schema migrations.
Pandas: Powerful data manipulation for aggregating Analytics KPIs and formatting time-series data.
Statsmodels / Scikit-Learn: Machine learning libraries driving the crop recommendation and SARIMA demand forecasting engines.
OAuth2 / JWT: Secure, token-based user authentication and route protection.
🛠️ Local Setup & Installation

1. Start the Backend (FastAPI)

bash


cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head      # Run database migrations
python -m app.main        # Starts server on http://localhost:8000

2. Start the Frontend (React/Vite)

bash


cd frontend
npm install
npm run dev               # Starts frontend on http://localhost:5173
