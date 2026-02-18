# Bike Rental System - Frontend Technical Documentation

## 1. Feature Overview
The Bike Rental System is a high-fidelity, campus-focused web application designed to facilitate seamless bicycle rentals for students (Riders) and efficient fleet management for administrators (Admins). The application provides a premium, responsive interface featuring real-time bike availability, interactive rental tracking, and a comprehensive administrative command center.

## 2. Business Objective
The primary goal of this platform is to:
- **Promote Sustainability**: Encourage eco-friendly transportation within campus environments.
- **Operational Efficiency**: Centralize fleet management to reduce maintenance overhead and lost assets.
- **Enhanced Student Experience**: Provide a modern, frictionless way for students to commute, utilizing a "mobile-first" design philosophy.

## 3. Technical Stack
- **Core Library**: [React 18](https://reactjs.org/) (Functional Components, Hooks)
- **Build Tool**: [Vite](https://vitejs.dev/) (Optimized for development speed and production bundling)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Utility-first CSS for glassmorphism and custom styles)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Lightweight, central state management)
- **Routing**: [React Router Dom v6](https://reactrouter.com/) (Declarative routing and navigation guards)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & CSS Keyframes (Fluid transitions and micro-interactions)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/) (Polished UX feedback)

## 4. File Structure
The project follows a modular, atomic structure within the `src/` directory:
```text
frontend/src/
├── components/
│   ├── UI/             # Atomic UI Library (Button, Input, Card, StatusBadge)
│   ├── Bikes/          # Domain-specific components (BikeCard, FilterBar)
│   ├── Auth/           # Auth-gating logic (ProtectedRoute, PermissionAgreement)
│   └── Layout/         # Structural wrappers (Navbar, Footer)
├── store/              # Zustand global state definitions
├── pages/              # Composite page views
│   ├── Auth/           # Login, Register, Permissions flow
│   ├── HomePage/       # Modularized landing sections
│   ├── User/           # Rider-specific dashboards and fleet views
│   └── Admin/          # Administrative oversight tools
├── assets/             # Static images and global styles
└── App.jsx             # Root component with routing configuration
```

## 5. Component Architecture
We employ an **Atomic Design** approach:
- **Atoms**: Reusable UI primitives isolated in `components/UI/` (e.g., `Button.jsx`).
- **Molecules**: Context-aware components like `BikeCard.jsx` which compose multiple atoms.
- **Organisms**: High-level assemblies like `PermissionAgreement.jsx` that manage internal state and complex interactions.
- **Pages**: Top-level containers that orchestrate components and fetch data from stores.

## 6. API Integration
The application interacts with a Java Spring Boot backend. 
- **Request Layer**: Centralized API calls using `fetch` or `axios` (facilitated through Zustand stores).
- **Error Handling**: Standardized via a global `showToast` utility to ensure consistent user feedback during network failure or validation errors.
- **Mocking**: A comprehensive mock-data layer facilitates frontend development and testing independent of backend state.

## 7. State Management
Global state is handled via **Zustand**, categorized by domain:
- `useAuthStore`: Manages user authentication status, session tokens, and mandatory permission agreements (`hasAgreedToTerms`).
- `useBikeStore`: Manages the global fleet list, real-time status updates (Available/Rented/Maintenance), and client-side filtering logic.

## 8. UI/UX Behavior
- **Glassmorphism**: The interface utilizes `backdrop-blur` and translucent borders for a state-of-the-art aesthetic.
- **Loading States**: Skeleton screens and animated spinners (integrated into `Button.jsx`) provide immediate visual feedback.
- **Validation**: Forms feature real-time validation via atomic `Input.jsx` components.
- **Responsiveness**: Grids utilize CSS Grid and Flexbox to adapt from desktop wide-screens to mobile portrait modes seamlessly.

## 9. Performance Considerations
- **Modular Imports**: Code splitting is encouraged by the modular component architecture.
- **Optimized Rendering**: Shared UI atoms minimize re-renders by remaining pure and stateless where possible.
- **Tailwind JIT**: The Just-In-Time compiler ensures the production CSS bundle remains minimal.

## 10. Security Considerations
- **Auth Guards**: `ProtectedRoute.jsx` wraps sensitive pages, redirecting unauthenticated users to `/login`.
- **Permission Gates**: A mandatory gateway ensures users grant Location tracking and agree to Terms before accessing the dashboard.
- **Sanitation**: Standardized `Input` components prevent common injection vulnerabilities by enforcing controlled inputs.

## 11. How to Use / How to Test
### Local Development
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

### Local Testing
- **Auth Flow**: Register a new account -> Complete Permissions -> Verify Dashboard Access.
- **Filtering**: Navigate to "Browse Bikes" -> Use `BikeFilterBar` to toggle categories.
- **Admin**: Log in as an admin to view the `AdminDashboard` fleet table.

## 12. Future Improvements
- **Real-Time Map**: Integration of Google Maps or Leaflet for live bike tracking.
- **PWA Integration**: Enabling offline access and native push notifications.
- **Dark/Light Mode Toggle**: Dynamic theme switching based on user preference.
- **Analytics Dashboard**: Granular revenue and usage tracking for administrators.

## 13. Project Refactor Walkthrough

This section outlines the comprehensive refactoring of the Bike Rental System's frontend, focusing on reusability, modularity, and a premium user experience.

### Key Achievements

#### 1. Robust UI Component Library
We established a core library of reusable atoms in `src/components/UI/` that enforce global design tokens:
- [Button.jsx](file:///Users/leng/Documents/GitHub/Bike-Rental-System/frontend/src/components/UI/Button.jsx): Supports multiple variants, loading states, and icons.
- [Input.jsx](file:///Users/leng/Documents/GitHub/Bike-Rental-System/frontend/src/components/UI/Input.jsx): Standardized form fields with validation support.
- [Card.jsx](file:///Users/leng/Documents/GitHub/Bike-Rental-System/frontend/src/components/UI/Card.jsx): Glassmorphism container with consistent spacing and hover effects.
- [Section.jsx](file:///Users/leng/Documents/GitHub/Bike-Rental-System/frontend/src/components/UI/Section.jsx): Layout utility for semantic spacing.
- [PremiumToast.jsx](file:///Users/leng/Documents/GitHub/Bike-Rental-System/frontend/src/components/UI/PremiumToast.jsx): Custom, high-fidelity notification system.
- [StatusBadge.jsx](file:///Users/leng/Documents/GitHub/Bike-Rental-System/frontend/src/components/UI/StatusBadge.jsx): Unified state visualization for bikes and rentals.

#### 2. Standardized Domain Components
Modularized domain-specific logic in `src/components/Bikes/` and `src/components/Auth/`:
- [BikeCard.jsx](file:///Users/leng/Documents/GitHub/Bike-Rental-System/frontend/src/components/Bikes/BikeCard.jsx): Reusable bike display used in both Rider and Admin views.
- [BikeFilterBar.jsx](file:///Users/leng/Documents/GitHub/Bike-Rental-System/frontend/src/components/Bikes/BikeFilterBar.jsx): Common category filtering UI.
- [PermissionAgreement.jsx](file:///Users/leng/Documents/GitHub/Bike-Rental-System/frontend/src/components/Auth/PermissionAgreement.jsx): Encapsulated legal consent flow.

#### 3. Page Deconstruction
Major monolithic pages were reassembled using the new modular architecture:
- [HomePage.jsx](file:///Users/leng/Documents/GitHub/Bike-Rental-System/frontend/src/pages/HomePage.jsx): Now a clean assembly of `Hero`, `Stats`, `Features`, and `HowItWorks` components.
- [BikesPage.jsx](file:///Users/leng/Documents/GitHub/Bike-Rental-System/frontend/src/pages/User/BikesPage.jsx): Simplified using the shared `BikeCard` and `BikeFilterBar`.
- [AdminDashboard.jsx](file:///Users/leng/Documents/GitHub/Bike-Rental-System/frontend/src/pages/Admin/AdminDashboard.jsx): High-fidelity administrative table with standardized status badges.
- [Login.jsx](file:///Users/leng/Documents/GitHub/Bike-Rental-System/frontend/src/pages/Auth/Login.jsx) & [Register.jsx](file:///Users/leng/Documents/GitHub/Bike-Rental-System/frontend/src/pages/Auth/Register.jsx): Lightweight auth pages built entirely from UI atoms.

### Component Comparison: Before & After

````carousel
```javascript
// Monolithic Register.jsx (Partial)
<form onSubmit={handleSubmit} className="space-y-5">
    <div>
        <label className="...">Full Name</label>
        <input className="..." placeholder="John Doe" />
    </div>
    <button className="...">Sign Up</button>
</form>
```
<!-- slide -->
```javascript
// Modular Register.jsx (Refactored)
<form onSubmit={handleSubmit} className="space-y-6">
    <Input label="Full Name" placeholder="John Doe" {...props} />
    <Button type="submit" loading={loading}>Get Started</Button>
</form>
```
````

### Refactor Results
- **Visual Consistency**: All pages now share the same glassmorphism tokens, rounding (`2.5rem`), and typography.
- **Code Maintainability**: Monolithic files (like `HomePage`) reduced from 200+ lines to ~50 lines of clean configuration.
- **Stability**: Automated checks verified all imports and fixed duplicated exports in `Register.jsx` and `BikesPage.jsx`.

> [!NOTE]
> The application now has a solid foundation for scaling. Adding new features like "Electric Bike Details" or "Rental History" will be significantly faster using the established atoms.
