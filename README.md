# E-commerce Product Discovery App

A modern, high-performance e-commerce product listing page built with Next.js 15, TypeScript, and Tailwind CSS. This application features advanced filtering, real-time search, and intelligent product recommendations based on purchase history.

## 🚀 Setup and Running

1.  **Prerequisites**: Ensure you have Node.js (v18+) installed.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

4.  **Run Tests**:
    ```bash
    npm run test
    # or
    npx jest
    ```

## 🏗️ Approach and Architecture

### Tech Stack
-   **Framework**: Next.js 15 (App Router) for server-side API routes and optimized client-side rendering.
-   **Language**: TypeScript for type safety and developer experience.
-   **Styling**: Tailwind CSS for a utility-first, responsive, and "premium" design system.
-   **Testing**: Jest and React Testing Library for unit and component testing.

### Architecture Highlights
-   **URL-Driven State**: All filter, sort, and pagination states are synchronized with the URL query parameters. This makes the application shareable and bookmarkable.
-   **Serverless API Routes**: Data processing (filtering, sorting, aggregation) happens on the server side (API routes), keeping the client bundle small and performant.
-   **Component Abstraction**: Reusable components like `FilterSection`, `ProductCard`, and `SearchBar` promote code maintainability and consistency.
-   **Performance Optimization**:
    -   **In-Memory Caching**: The API route caches parsed JSON data to avoid repeated file system reads on every request.
    -   **Debounced Search**: The search input is debounced (800ms) to minimize unnecessary API calls.
    -   **Optimized Images**: Uses `next/image` for automatic image optimization.

## 📊 Logic Explanation

### Popularity Calculation
Popularity is determined by the total quantity of a product sold across all orders.
1.  Iterate through all orders in `orders.json`.
2.  Sum the `quantity` for each `productId`.
3.  Store this count in the product object.
4.  The "Popular" sort option orders products by this count in descending order.

### Co-Purchase Recommendations ("Frequently Bought Together")
This feature suggests products that are often purchased in the same order as the currently viewed product.
1.  **Identify Orders**: Find all orders that contain the target `productId`.
2.  **Count Co-occurrences**: For each of these orders, iterate through the *other* items in the cart.
3.  **Aggregate**: Maintain a count of how many times each other product appears.
4.  **Rank**: Sort these co-occurring products by frequency (descending).
5.  **Recommend**: Return the top N products.

## ⚖️ Assumptions and Tradeoffs

-   **Data Source**: Assumed `products.json` and `orders.json` are static and fit in memory. In a real app, this would be a database.
-   **Caching**: Implemented a simple in-memory cache variable.
    -   *Tradeoff*: This works well for a single server instance but wouldn't share state across multiple serverless functions/containers. A robust solution would use Redis.
-   **Client-Side vs. Server-Side Rendering**: The main product grid uses client-side fetching (`useEffect`) to allow for dynamic, fast filtering updates without full page reloads.
    -   *Tradeoff*: Initial content load depends on JS execution. For better SEO, we could implement Server Components with streaming, but client-side fetching offers a snappier "app-like" feel for heavy filtering interactions.

## 🔮 With More Time

1.  **Database Integration**: Migrate from JSON files to a proper database (PostgreSQL/MongoDB) for scalability.
2.  **Advanced Caching**: Implement Redis for distributed caching.
3.  **E2E Testing**: Add Cypress or Playwright tests to cover full user flows (filtering -> clicking product -> seeing recommendations).
4.  **Accessibility (a11y)**: Conduct a full audit to ensure WCAG compliance (keyboard navigation, ARIA labels).
5.  **Server Components**: Refactor the main page to use React Server Components for the initial render to improve LCP (Largest Contentful Paint) and SEO.

## 🎁 Bonus Features Implemented

-   **"Frequently Bought Together"**: Intelligent recommendations based on order history.
-   **URL Synchronization**: Full state persistence in the URL.
-   **Responsive "Premium" Design**: Polished UI with smooth transitions, hover effects, and mobile-responsive sidebar.
-   **Unit Tests**: Comprehensive testing for core logic (`productUtils`, `recommendationUtils`) and UI components (`SearchBar`).
-   **Performance**: In-memory API caching and debounced search.

## 🐛 Known Limitations

-   **Horizontal Scrolling**: Long tag lists in the sidebar are truncated or wrapped; extremely long lists might need a "Show More" virtualization if the dataset grows significantly (though currently handled with a scrollable area).
-   **Image Placeholders**: If a product image fails to load, a fallback placeholder is shown.

