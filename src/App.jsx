import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import Layout from './components/Layout';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Societies = lazy(() => import('./pages/Societies'));
const Committee = lazy(() => import('./pages/Committee'));
const Notices = lazy(() => import('./pages/Notices'));
const Events = lazy(() => import('./pages/Events'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Services = lazy(() => import('./pages/Services'));
const RaiseIssue = lazy(() => import('./pages/RaiseIssue'));
const Membership = lazy(() => import('./pages/Membership'));
const Resources = lazy(() => import('./pages/Resources'));
const Contact = lazy(() => import('./pages/Contact'));
const Legal = lazy(() => import('./pages/Legal'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminApp = lazy(() => import('./admin/AdminApp'));

export default function App() {
  return (
    <Suspense fallback={null}>
    <Routes>
      <Route path="admin/*" element={<AdminApp />} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="societies" element={<Societies />} />
        <Route path="committee" element={<Committee />} />
        <Route path="notices" element={<Notices />} />
        <Route path="events" element={<Events />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="services" element={<Services />} />
        <Route path="raise-issue" element={<RaiseIssue />} />
        <Route path="membership" element={<Membership />} />
        <Route path="resources" element={<Resources />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<Legal kind="privacy" />} />
        <Route path="terms" element={<Legal kind="terms" />} />
        <Route path="disclaimer" element={<Legal kind="disclaimer" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </Suspense>
  );
}
