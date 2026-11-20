import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import Basics from './pages/Basics'
import { FacultyList, FacultyPage } from './pages/Faculties'
import { LibraryList, MaterialPage } from './pages/Library'
import { EventsList, EventPage } from './pages/Events'
import { NewsList, NewsItem } from './pages/News'
import { About, ExpertsList, ExpertProfile, Contacts, Search, Legal, NotFound } from './pages/Info'
import { Register, Login, Recover } from './pages/auth/Auth'
import Cabinet from './pages/cabinet/Cabinet'
import Course from './pages/cabinet/Course'
import Lesson from './pages/cabinet/Lesson'
import Admin from './pages/Admin'
import MapPage from './pages/Map'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="basics" element={<Basics />} />

          <Route path="faculties" element={<FacultyList />} />
          <Route path="faculties/:id" element={<FacultyPage />} />

          <Route path="library" element={<LibraryList />} />
          <Route path="library/:id" element={<MaterialPage />} />

          <Route path="events" element={<EventsList />} />
          <Route path="events/:id" element={<EventPage />} />

          <Route path="news" element={<NewsList />} />
          <Route path="news/:id" element={<NewsItem />} />

          <Route path="about" element={<About />} />
          <Route path="experts" element={<ExpertsList />} />
          <Route path="experts/:id" element={<ExpertProfile />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="search" element={<Search />} />
          <Route path="privacy" element={<Legal kind="privacy" />} />
          <Route path="terms" element={<Legal kind="terms" />} />

          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="recover" element={<Recover />} />

          <Route path="cabinet" element={<Cabinet />} />
          <Route path="cabinet/course" element={<Course />} />
          <Route path="cabinet/lesson" element={<Lesson />} />

          <Route path="admin" element={<Admin />} />
          <Route path="map" element={<MapPage />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
