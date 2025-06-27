# UnearthedTruths Frontend

This is the frontend for **UnearthedTruths**, a web platform that maps archaeological discoveries supporting Biblical history. Built with **Next.js**, the app features interactive maps, JWT-based authentication, and a role-based admin system.

---

## 🛠️ Tech Stack

- **Next.js**
- **React**
- **Tailwind CSS**
- **Leaflet** (for maps)
- **Axios**
- **JWT-Decode**
- **Lucide & React-Icons**
- **Lodash (debounce)**

---

## 🧭 Features

### Public Users

- View a map of archaeological findings
- Filter by **Bible era**, **region**, and **type**
- Search by keyword
- Click markers for rich popup info
- Copy GPS and launch in Google Earth

### Admin Users

- Add new discoveries via a form
- Edit or delete discoveries on map
- Role displayed as ADMIN or SUPER-ADMIN

### Super Admin Users

- Manage (create/delete) admin accounts

---

## 🌍 Pages

| Route          | Description                     |
| -------------- | ------------------------------- |
| `/`            | Landing page with intro         |
| `/map`         | Interactive map + filters       |
| `/login`       | Login portal for admins         |
| `/admin`       | Admin dashboard for submissions |
| `/super-admin` | Super admin management panel    |

---

## 🔐 Authentication

- JWT is saved to `localStorage` after login
- Decoded using `jwt-decode` to determine role
- Token is passed via `Authorization: Bearer <token>` in requests

---

## 🌎 Map Features

- Map built using `react-leaflet` + `TileLayer` (Esri)
- Custom marker styles
- Popups display:
  - Title
  - Description
  - Coordinates (Decimal + DMS)
  - Bible era, region, and type
- Buttons:
  - Source link
  - Google Earth preview
  - Edit (admin only)

---

## 🗂️ Folder Structure

```
pages/
│   index.jsx          # Landing page
│   map.jsx            # Discovery map
│   login.jsx          # Admin login
│   admin.jsx          # Admin dashboard
│   super-admin.jsx    # Super admin dashboard

components/
│   Map.jsx            # Main interactive map component
```

---

## 🧪 Environment Setup

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

---

## ▶️ Getting Started

```bash
# Install dependencies
npm install

# Run the app
npm run dev
```

---

## 🚀 Deployment

You can deploy to **Vercel** or **Netlify**. Be sure to set `NEXT_PUBLIC_API_URL` as an environment variable in the deployment dashboard.

---

## 🧩 Future Improvements

- Loading indicators
- Real-time updates via WebSocket or polling
- Mobile map pinch/zoom enhancements
- Pagination or clustering for high-density discoveries

---

## 📄 License

This frontend is open for educational and demo use only. All rights reserved.
